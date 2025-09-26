package edu.umich.baac.config;

import edu.umich.baac.model.User;
import edu.umich.baac.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("password"));
                admin.setProlificId("00000");
                admin.setRole("RESEARCHER");
                admin.setEnabled(true);
                userRepository.save(admin);
            }

            if (userRepository.findByEmail("participant@example.com").isEmpty()) {
                User participant = new User();
                participant.setEmail("participant@example.com");
                participant.setPassword(passwordEncoder.encode("password"));
                participant.setProlificId("00001");
                participant.setRole("PARTICIPANT");
                participant.setEnabled(true);
                userRepository.save(participant);
            }
        };
    }
}

