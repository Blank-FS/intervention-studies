package edu.umich.baac.config;

import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.repository.UserRepository;
import edu.umich.baac.repository.module.ModuleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;

@Configuration
public class DataInitializer {

    // Add sample users to database for testing
    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("password"));
                admin.setProlificId("000000000000000000000000");
                admin.setRole("RESEARCHER");
                admin.setEnabled(true);
                userRepository.save(admin);
            }

            if (userRepository.findByEmail("participant@example.com").isEmpty()) {
                User participant = new User();
                participant.setEmail("participant@example.com");
                participant.setPassword(passwordEncoder.encode("password"));
                participant.setProlificId("AAAAAAAAAAAAAAAAAAAAAAAA");
                participant.setRole("PARTICIPANT");
                participant.setEnabled(true);
                userRepository.save(participant);
            }
        };
    }

    // Add sample modules to database for testing
    @Bean
    CommandLineRunner initModules(ModuleRepository moduleRepository) {
        return args -> {
            String videoFileName = "file_example_MP4_1280_10MG.mp4";
            String localDir = "data/videos";
            String remoteUrl = "https://file-examples.com/storage/feb0ee5efb68e522f95d61d/2017/04/file_example_MP4_1280_10MG.mp4";

            File dir = new File(localDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File localVideoFile = new File(dir, videoFileName);

            // Download the sample MP4 file if it doesn't exist locally
            if (!localVideoFile.exists()) {
                System.out.println("Video file not found locally. Downloading from: " + remoteUrl);
                try (InputStream in = new URL(remoteUrl).openStream();
                     FileOutputStream out = new FileOutputStream(localVideoFile)) {

                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = in.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                    }

                    System.out.println("Video downloaded to: " + localVideoFile.getAbsolutePath());
                } catch (Exception e) {
                    System.err.println("Failed to download video: " + e.getMessage());
                }
            } else {
                System.out.println("Video already exists: " + localVideoFile.getAbsolutePath());
            }

            // Create and save module to database
            Module module = new Module();
            module.setTitle("Test Module");
            module.setParagraph("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
            module.setVideoUrl("file_example_MP4_1280_10MG.mp4");
            moduleRepository.save(module);
        };
    }
}

