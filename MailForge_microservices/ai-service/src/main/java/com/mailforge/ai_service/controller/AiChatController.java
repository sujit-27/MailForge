package com.mailforge.ai_service.controller;

import com.mailforge.ai_service.dto.ChatRequest;
import com.mailforge.ai_service.dto.ChatResponse;
import com.mailforge.ai_service.service.GeminiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiChatController {

    private final GeminiService geminiService;

    public AiChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String reply = geminiService.chatForgeAssistant(request.getMessage());
        return new ChatResponse(reply);
    }
}
