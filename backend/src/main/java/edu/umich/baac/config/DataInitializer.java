package edu.umich.baac.config;

import edu.umich.baac.model.Study;
import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.model.module.Option;
import edu.umich.baac.model.module.Question;
import edu.umich.baac.repository.StudyRepository;
import edu.umich.baac.repository.UserRepository;
import edu.umich.baac.repository.module.ModuleRepository;
import edu.umich.baac.repository.module.OptionRepository;
import edu.umich.baac.repository.module.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Configuration
public class DataInitializer {

    // Add sample users to database for testing
    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("superadmin@example.com").isEmpty()) {
                User superadmin = User.builder()
                        .createdAt(LocalDateTime.now(ZoneOffset.UTC))
                        .email("superadmin@example.com")
                        .password(passwordEncoder.encode("password"))
                        .prolificId("111111111111111111111111")
                        .role("SUPERADMIN")
                        .enabled(true)
                        .build();
                userRepository.save(superadmin);
            }

            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = User.builder()
                        .createdAt(LocalDateTime.now(ZoneOffset.UTC))
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("password"))
                        .prolificId("000000000000000000000000")
                        .role("ADMIN")
                        .enabled(true)
                        .build();
                userRepository.save(admin);
            }

            if (userRepository.findByEmail("participant@example.com").isEmpty()) {
                User participant = User.builder()
                        .createdAt(LocalDateTime.now(ZoneOffset.UTC))
                        .email("participant@example.com")
                        .password(passwordEncoder.encode("password"))
                        .prolificId("AAAAAAAAAAAAAAAAAAAAAAAA")
                        .role("USER")
                        .enabled(true)
                        .build();
                userRepository.save(participant);
            }
        };
    }

    // Add sample users to database for testing
    @Bean
    CommandLineRunner initStudies(StudyRepository studyRepository) {
        return args -> {
            if (studyRepository.findByName("flu-study").isEmpty()) {
                Study fluStudy = Study.builder()
                        .name("flu-study")
                        .active(true)
                        .build();
                studyRepository.save(fluStudy);
            }
        };
    }

    // Add sample modules and its associated questions to database for testing
    @Bean
    CommandLineRunner initModules(ModuleRepository moduleRepository, QuestionRepository questionRepository, OptionRepository optionRepository) {
        return args -> {
            String videoDownloadUrl = "https://download.samplelib.com/mp4/sample-10s.mp4";

            Path uploadDir = Paths.get("uploads/videos");
            Files.createDirectories(uploadDir);

            File localVideoFile = uploadDir.resolve("sample-10s.mp4").toFile();

            // Download sample video if it does not exist
            if (!localVideoFile.exists()) {
                System.out.println("Video file not found locally. Downloading from: " + videoDownloadUrl);
                try (InputStream in = new URL(videoDownloadUrl).openStream();
                     FileOutputStream out = new FileOutputStream(localVideoFile)) {

                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = in.read(buffer)) != -1)
                        out.write(buffer, 0, bytesRead);

                    System.out.println("Video downloaded to: " + localVideoFile.getAbsolutePath());
                } catch (Exception e) {
                    System.err.println("Failed to download video: " + e.getMessage());
                }
            }

            // Create and save sample module
            Module module = Module.builder()
                    .title("Sample Module")
                    .paragraph("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")
                    .videoPath("uploads/videos/sample-10s.mp4")
                    .build();
            Module savedModule = moduleRepository.save(module);

            // Create and save sample questions
            createQuestion1(questionRepository, optionRepository, savedModule);
            createQuestion2(questionRepository, optionRepository, savedModule);

        };
    }

    private void createQuestion1(QuestionRepository questionRepository, OptionRepository optionRepository, Module module) {
        // Create amd save question to database
        Question question = new Question();
        question.setModule(module);
        question.setQuestionText("Which planet is known as the Red Planet?");
        Question savedQuestion = questionRepository.save(question);

        // Create and save question options to database
        Option option1 = new Option();
        option1.setQuestion(savedQuestion);
        option1.setText("Mars");
        Option savedOption = optionRepository.save(option1);

        Option option2 = new Option();
        option2.setQuestion(savedQuestion);
        option2.setText("Jupiter");
        optionRepository.save(option2);

        Option option3 = new Option();
        option3.setQuestion(savedQuestion);
        option3.setText("Saturn");
        optionRepository.save(option3);

        Option option4 = new Option();
        option4.setQuestion(savedQuestion);
        option4.setText("Venus");
        optionRepository.save(option4);

        // Update question's correct choice
        savedQuestion.setCorrectOptionId(savedOption.getId());
        questionRepository.save(savedQuestion);
    }

    private void createQuestion2(QuestionRepository questionRepository, OptionRepository optionRepository, Module module) {
        // Create amd save question to database
        Question question = new Question();
        question.setModule(module);
        question.setQuestionText("How many elements are there in the periodic table?");
        Question savedQuestion = questionRepository.save(question);

        // Create and save question options to database
        Option option1 = new Option();
        option1.setQuestion(savedQuestion);
        option1.setText("118");
        Option savedOption = optionRepository.save(option1);

        Option option2 = new Option();
        option2.setQuestion(savedQuestion);
        option2.setText("26");
        optionRepository.save(option2);

        Option option3 = new Option();
        option3.setQuestion(savedQuestion);
        option3.setText("92");
        optionRepository.save(option3);

        Option option4 = new Option();
        option4.setQuestion(savedQuestion);
        option4.setText("128");
        optionRepository.save(option4);

        // Update question's correct choice
        savedQuestion.setCorrectOptionId(savedOption.getId());
        questionRepository.save(savedQuestion);
    }


}