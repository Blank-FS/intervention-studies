package edu.umich.baac.controller;

import edu.umich.baac.model.Study;
import edu.umich.baac.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/studies")
@RequiredArgsConstructor
public class StudyController {
    private final StudyService studyService;

    @GetMapping("/{name}/active")
    public ResponseEntity<?> isActive(
            @PathVariable String name
    ) {
        return ResponseEntity.ok(Map.of("isActive", studyService.getStudyByName(name).getActive()));
    }

    @PutMapping("/{name}/toggle")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<Study> toggle(@PathVariable String name) {
        return ResponseEntity.ok(studyService.toggleStudyActive(name));
    }
}