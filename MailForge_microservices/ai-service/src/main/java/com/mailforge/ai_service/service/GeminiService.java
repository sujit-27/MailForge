package com.mailforge.ai_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GeminiService {

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    private final RestTemplate restTemplate = new RestTemplate();

    private static final Pattern VARIABLE_PATTERN =
            Pattern.compile("\\{\\{(.*?)}}");

    /**
     * Main method used by gRPC layer
     */
    public AiTemplateResult generateEmailTemplate(String prompt, String tone) {

        if (prompt == null || prompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt must not be empty");
        }

        String systemPrompt = buildStrictPrompt(prompt, tone);

        String rawText = callGemini(systemPrompt);

        ParsedTemplate parsed = parseAndValidate(rawText);

        return new AiTemplateResult(
                parsed.subject,
                parsed.body,
                extractVariables(parsed.subject, parsed.body)
        );
    }

    // ---------------- PRIVATE METHODS ----------------

    private String buildStrictPrompt(String prompt, String tone) {
        return """
        You are an email template generator.

        RULES (MANDATORY):
        - Output ONLY plain text.
        - Do NOT explain anything.
        - Do NOT add markdown.
        - Do NOT add greetings like "Here is".
        - Use placeholders ONLY in {{variable}} format.
        - Keep subject under 15 words.
        - Keep body under 60 words.

        OUTPUT FORMAT (STRICT):
        SUBJECT:
        <subject line>

        BODY:
        <email body>

        Tone: %s

        Context:
        %s
        """.formatted(tone, prompt);
    }

    private String callGemini(String prompt) {
        // 1. Structure the Request
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        // 2. Attach Key to URL
        String finalUrl = UriComponentsBuilder.fromHttpUrl(geminiApiUrl)
                .queryParam("key", geminiApiKey)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    finalUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );
            return extractText(response.getBody());
        } catch (HttpStatusCodeException ex) {
            // Log the actual error body from the API to see why it's failing
            String errorBody = ex.getResponseBodyAsString();
            throw new AiServiceException("Gemini API Error: " + errorBody, ex);
        }
    }

    private String extractText(Map body) {

        if (body == null || !body.containsKey("candidates")) {
            throw new AiServiceException("Invalid Gemini response structure");
        }

        List candidates = (List) body.get("candidates");
        if (candidates.isEmpty()) {
            throw new AiServiceException("Gemini returned no candidates");
        }

        Map candidate = (Map) candidates.get(0);
        Map content = (Map) candidate.get("content");
        List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");

        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> part : parts) {
            Object text = part.get("text");
            if (text != null) {
                sb.append(text.toString()).append("\n");
            }
        }

        String result = sb.toString().trim();

        if (result.isEmpty()) {
            throw new AiServiceException("Empty response from Gemini");
        }

        return result;
    }

    private ParsedTemplate parseAndValidate(String text) {

        String[] sections = text.split("BODY:");

        if (sections.length != 2 || !sections[0].contains("SUBJECT:")) {
            throw new AiServiceException("AI output format violation");
        }

        String subject = sections[0]
                .replace("SUBJECT:", "")
                .trim();

        String body = sections[1].trim();

        if (subject.isEmpty() || body.isEmpty()) {
            throw new AiServiceException("Generated subject/body is empty");
        }

        if (subject.length() > 120) {
            throw new AiServiceException("Generated subject too long");
        }

        return new ParsedTemplate(subject, body);
    }

    private List<String> extractVariables(String subject, String body) {

        Set<String> vars = new HashSet<>();

        Matcher matcher =
                VARIABLE_PATTERN.matcher(subject + " " + body);

        while (matcher.find()) {
            vars.add(matcher.group(1).trim());
        }

        if (vars.isEmpty()) {
            throw new AiServiceException(
                    "No variables detected in generated template"
            );
        }

        return new ArrayList<>(vars);
    }

    public String chatForgeAssistant(String userMessage) {

        if (userMessage == null || userMessage.isBlank()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        String systemPrompt = """
You are Forge AI — assistant for the MailForge email platform.

You help with:
- sending emails using API
- templates and variables
- AI template generation
- quota and plans
- debugging send errors
- integration examples (Java, JS, curl)

Rules:
- do not invent endpoints
- do not assume user data
- give step-by-step guidance
- prefer short code examples
- if unsure, say so honestly
- answer in short
- do not answer question asked to other contexts
""";

        String finalPrompt = systemPrompt + "\n\nUser question:\n" + userMessage;

        String response = callGemini(finalPrompt);
        log.info("Response returned is {}: ",response);

        return response;
    }

    // ---------------- INNER CLASSES ----------------

    private record ParsedTemplate(String subject, String body) {}

    public record AiTemplateResult(
            String subject,
            String body,
            List<String> variables
    ) {}
}
