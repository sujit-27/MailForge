package com.mailforge.template_service.grpc;

import com.mailforge.template_service.dao.TemplateDao;
import com.mailforge.template_service.model.Template;
import com.mailforge.template_service.model.TemplateStatus;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@GrpcService
public class TemplateRenderGrpcService extends TemplateRenderServiceGrpc.TemplateRenderServiceImplBase {

    private final TemplateDao templateDao;

    private static final Logger log = LoggerFactory.getLogger(TemplateRenderGrpcService.class);

    // {{variable}} pattern
    private static final Pattern VAR_PATTERN = Pattern.compile("\\{\\{(.*?)}}");

    public TemplateRenderGrpcService(TemplateDao templateDao) {
        this.templateDao = templateDao;
    }

    @Override
    public void renderTemplate(
            RenderTemplateRequest request,
            StreamObserver<RenderTemplateResponse> responseObserver
    ) {
        log.info("Received gRPC request to render template: {}", request.getTemplateId());

        Template template = templateDao
                .findByIdAndStatus(request.getTemplateId(), TemplateStatus.ACTIVE)
                .orElseThrow(() ->
                        Status.NOT_FOUND
                                .withDescription("Template not found")
                                .asRuntimeException()
                );

        Map<String, String> vars = request.getVariablesMap();
        log.debug("Processing template '{}' with variables: {}", template.getName(), vars.keySet());

        // 1️⃣ Validate required variables
        for (String requiredVar : template.getVariables()) {
            if (!vars.containsKey(requiredVar) || vars.get(requiredVar).isBlank()) {
                log.error("Validation failed for template {}: Missing required variable '{}'", request.getTemplateId(), requiredVar);
                responseObserver.onError(
                        Status.INVALID_ARGUMENT
                                .withDescription("Missing variable: " + requiredVar)
                                .asRuntimeException()
                );
                return;
            }
        }

        // 2️⃣ Render subject & body
        String renderedSubject = render(template.getSubjectTemplate(), vars);
        String renderedBody = render(template.getBodyTemplate(), vars);

        RenderTemplateResponse response = RenderTemplateResponse.newBuilder()
                .setSubject(renderedSubject)
                .setBody(renderedBody)
                .build();

        log.info("Successfully rendered template: {}", request.getTemplateId());
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    // ----------------- HELPER -----------------

    private String render(String template, Map<String, String> vars) {
        Matcher matcher = VAR_PATTERN.matcher(template);
        StringBuffer sb = new StringBuffer();

        while (matcher.find()) {
            String varName = matcher.group(1).trim();
            String value = vars.getOrDefault(varName, "");
            matcher.appendReplacement(sb, Matcher.quoteReplacement(value));
        }

        matcher.appendTail(sb);
        return sb.toString();
    }
}
