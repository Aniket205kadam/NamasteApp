package com.aniketkadam.namaste_app;

import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserRepository;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class ServerApplication {

	private static final Logger log = LoggerFactory.getLogger(ServerApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	public CommandLineRunner runner(UserRepository repository, PasswordEncoder passwordEncoder) {
		return args -> {
			String botId = System.getenv("AI_BOT_ID");

			Marker aiBotMarker = MarkerFactory.getMarker("AI-BOT");
			if (botId == null) {
				log.error(aiBotMarker, "Missing AI bot environment variables. Bot not created");
				return;
			}
			Optional<User> existingBot = repository.findBySub(botId);
			if (existingBot.isEmpty()) {
				User user = User.builder()
						.firstname("NamasteApp")
						.lastname("AI")
						.avtar("https://static.whatsapp.net/rsrc.php/v4/ye/r/W2MDyeo0zkf.png")
						.about("My name is Namaste Al. Think of me like an assistant who's " +
								"here to help you learn, plan, and connect. What can I help you with today?")
						.sub(botId)
						.isVerified(true)
						.build();
				repository.save(user);
				log.info(aiBotMarker, "Successfully create the Namaste AI bot");
			} else {
				log.info(aiBotMarker, "Already created the Namaste AI bot");
			}
		};
	}

}
