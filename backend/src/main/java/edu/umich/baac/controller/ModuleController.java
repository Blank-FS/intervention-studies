package edu.umich.baac.controller;

import edu.umich.baac.dto.QuestionDTO;
import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.model.module.Question;
import edu.umich.baac.model.module.Response;
import edu.umich.baac.repository.UserRepository;
import edu.umich.baac.repository.module.ModuleRepository;
import edu.umich.baac.repository.module.QuestionRepository;
import edu.umich.baac.repository.module.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleRepository moduleRepo;
    private final QuestionRepository questionRepo;
    private final ResponseRepository responseRepo;
    private final UserRepository userRepo;

    @PostMapping
    @PreAuthorize("hasRole('RESEARCHER')")
    public ResponseEntity<?> createModule(
            @RequestParam("title") String title,
            @RequestParam("paragraph") String paragraph,
            @RequestParam("video") MultipartFile video
    ) {
        try {
            if (video == null || video.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Video file is missing"));
            }

            Path uploadDir = Paths.get("data/videos");
            Files.createDirectories(uploadDir);

            String filename = UUID.randomUUID() + "_" + video.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            Files.copy(video.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Module module = new Module();
            module.setTitle(title);
            module.setParagraph(paragraph);
            module.setVideoUrl(filename);

            Module saved = moduleRepo.save(module);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{moduleId}/questions")
    @PreAuthorize("hasRole('RESEARCHER')")
    public Question addQuestion(@PathVariable Long moduleId, @RequestBody Question q) {
        Module module = moduleRepo.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        q.setModule(module);
        return questionRepo.save(q);
    }

    @GetMapping
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('PARTICIPANT')")
    public List<Module> getModules() {
        return moduleRepo.findAll();
    }

    @GetMapping("/{moduleId}/questions")
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('PARTICIPANT')")
    public ResponseEntity<?> getQuestionsByModule(
            @PathVariable Long moduleId,
            Authentication authentication
    ) {
        // 1. Get user
        String username = authentication.getName();
        User currentUser = userRepo.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // 2. Get list of questions in module
        Module module = moduleRepo.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));
        List<Question> questions = questionRepo.findByModule(module);

        // 3. Fetch existing responses for this user + module questions
        List<Response> responses = responseRepo.findByUserIdAndQuestionModuleId(currentUser.getId(), moduleId);

        // 4. Map to a DTO that includes whether the question was answered and what option was chosen
        List<QuestionDTO> result = questions.stream().map(q -> {
            QuestionDTO dto = new QuestionDTO(q);
            responses.stream()
                    .filter(r -> r.getQuestion().getId().equals(q.getId()))
                    .findFirst()
                    .ifPresent(r -> dto.setSelectedOptionId(r.getSelectedOption().getId()));
            return dto;
        }).toList();

        return ResponseEntity.ok(result);
    }


}


