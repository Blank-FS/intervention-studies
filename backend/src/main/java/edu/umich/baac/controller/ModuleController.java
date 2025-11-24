package edu.umich.baac.controller;

import edu.umich.baac.dto.QuestionCreateDTO;
import edu.umich.baac.dto.QuestionReadDTO;
import edu.umich.baac.dto.form.ModuleFormDTO;
import edu.umich.baac.dto.response.ModuleResponseDTO;
import edu.umich.baac.service.ModuleService;
import edu.umich.baac.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {
    private final ModuleService moduleService;
    private final QuestionService questionService;

    //============================== "/modules" ==============================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN') or hasRole('USER')")
    public ResponseEntity<List<ModuleResponseDTO>> getModules() {
        return ResponseEntity.ok(moduleService.getModules());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<ModuleResponseDTO> createModule(@ModelAttribute ModuleFormDTO formData) throws IOException {
        return ResponseEntity.ok(moduleService.createModule(formData));
    }

    //============================== "/modules/{id}" ==============================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<Void> deleteModuleById(@PathVariable Long id) {
        boolean deleted = moduleService.deleteModuleById(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    //============================== "/modules/{id}/questions" ==============================
    @GetMapping("/{id}/questions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN') or hasRole('USER')")
    public ResponseEntity<?> getQuestionsByModule(
            @PathVariable Long id,
            Authentication authentication
    ) {
        List<QuestionReadDTO> result = questionService.getQuestionsByModule(id, authentication.getName());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/questions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> createQuestion(@RequestBody QuestionCreateDTO dto) {
        QuestionReadDTO saved = questionService.createQuestion(dto);
        return ResponseEntity.ok(saved);
    }
}


