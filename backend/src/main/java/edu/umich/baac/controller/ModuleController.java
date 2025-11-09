package edu.umich.baac.controller;

import edu.umich.baac.dto.QuestionCreateDTO;
import edu.umich.baac.dto.QuestionReadDTO;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.service.ModuleService;
import edu.umich.baac.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;
    private final QuestionService questionService;

    //========================= Module =========================
    @GetMapping
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('PARTICIPANT')")
    public List<Module> getModules() {
        return moduleService.getModules();
    }

    @PostMapping
    @PreAuthorize("hasRole('RESEARCHER')")
    public ResponseEntity<?> createModule(
            @RequestParam("title") String title,
            @RequestParam("paragraph") String paragraph,
            @RequestParam("video") MultipartFile video
    ) {
        try {
            Module saved = moduleService.createModule(title, paragraph, video);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    //========================= Module Question =========================
    @GetMapping("/{moduleId}/questions")
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('PARTICIPANT')")
    public ResponseEntity<?> getQuestionsByModule(
            @PathVariable Long moduleId,
            Authentication authentication
    ) {
        List<QuestionReadDTO> result = questionService.getQuestionsByModule(moduleId, authentication.getName());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{moduleId}/questions")
    @PreAuthorize("hasRole('RESEARCHER')")
    public ResponseEntity<?> createQuestion(@RequestBody QuestionCreateDTO dto) {
        QuestionReadDTO saved = questionService.createQuestion(dto);
        return ResponseEntity.ok(saved);
    }
}


