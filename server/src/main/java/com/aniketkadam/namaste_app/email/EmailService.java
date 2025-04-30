package com.aniketkadam.namaste_app.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async
    public void sendEmail(EmailVerificationRequest request) throws MessagingException {
        String templateName;
        if (request.getMailTemplate() == null) {
            templateName = "activate_account";
        } else {
            templateName = request.getMailTemplate().getName();
        }
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );
        Map<String, Object> properties = new HashMap<>();
        properties.put("email", request.getTo());
        properties.put("verificationCode", request.getVerificationCode());
        properties.put("verificationUrl", request.getVerificationUrl());

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("namasteapp@dev.com"); // todo -> make the email dynamic here
        helper.setTo(request.getTo());
        helper.setSubject(request.getSubject());
        helper.setSentDate(new Date(System.currentTimeMillis()));
        helper.setReplyTo("no-reply@streamify.com");

        mimeMessage.addHeader("X-Custom-Header", request.getVerificationCode() + " is your Streamify code");
        mimeMessage.setHeader("X-No-Reply", "true");

        String template = templateEngine.process(templateName, context);
        helper.setText(template, true);
        mailSender.send(mimeMessage);
    }
}
