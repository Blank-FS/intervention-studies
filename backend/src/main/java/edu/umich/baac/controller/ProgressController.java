package edu.umich.baac.controller;

import edu.umich.baac.dto.response.ModuleProgressResponseDTO;
import edu.umich.baac.enums.ModuleProgressType;
import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.model.progress.ModuleProgress;
import edu.umich.baac.repository.UserRepository;
import edu.umich.baac.repository.module.ModuleRepository;
import edu.umich.baac.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;
    private final UserRepository userRepo;
    private final ModuleRepository moduleRepo;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ModuleProgressResponseDTO> getProgress(Authentication authentication, @RequestParam Long moduleId) {
        String username = authentication.getName();
        User user = userRepo.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Module module = moduleRepo.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        ModuleProgress progress = progressService.getOrCreateProgress(user, module);
        ModuleProgressResponseDTO dto = new ModuleProgressResponseDTO(user.getId(), moduleId, progress.getProgress());
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ModuleProgressResponseDTO> updateProgress(Authentication authentication, @RequestParam Long moduleId, @RequestParam ModuleProgressType progressUpdate) {
        String username = authentication.getName();
        User user = userRepo.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Module module = moduleRepo.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        ModuleProgress progress = progressService.updateProgress(user, module, progressUpdate);
        ModuleProgressResponseDTO dto = new ModuleProgressResponseDTO(user.getId(), moduleId, progress.getProgress());
        return ResponseEntity.ok(dto);
    }
}
