package com.aniketkadam.namaste_app.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "aniket205kadam",
                        email = "aniketrkadam205@gmail.com",
                        url = "https://aniketkadam.dev"
                ),
                description = "This is the OpenAPI documentation for the Namaste App backend API. It includes all endpoints related to authentication, user management, and secured resources, powered by Spring Security and JWT authentication.",
                title = "OpenAPI Specification - Namaste App",
                version = "1.0",
                /*license = @License(
                        name = "MIT License",
                        url = "https://opensource.org/licenses/MIT"
                ),*/
                termsOfService = "https://aniketkadam.dev/terms"
        )
        ,
        servers = {
                @Server(
                        description = "Local ENV",
                        url = "http://localhost:8088/api/v1"
                ),
                @Server(
                        description = "PROD ENV",
                        url = "https://aniketkadam.dev"
                )
        },
        security = {
                @SecurityRequirement(
                        name = "bearerAuth"
                )
        }
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
    // http://localhost:8080/swagger-ui/index.html
}
