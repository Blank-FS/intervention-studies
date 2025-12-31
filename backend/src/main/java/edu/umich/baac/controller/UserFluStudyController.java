package edu.umich.baac.controller;

import edu.umich.baac.model.UserFluStudy;
import edu.umich.baac.service.UserFluStudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/api/flu-study")
@RequiredArgsConstructor
public class UserFluStudyController {
    private final UserFluStudyService userFluStudyService;

    public record StudyResponseRequest(String csvData){}

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> submitStudyResponse(
            Authentication authentication,
            @RequestBody StudyResponseRequest req
    ) {
        boolean success = userFluStudyService.saveResponse(authentication.getName(), req.csvData());
        if(!success)
            return new ResponseEntity<>(Map.of("message", "Failed to save response"), HttpStatus.BAD_REQUEST);
        return ResponseEntity.ok(Map.of("message", "Response saved"));
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserStudyResponse(
            Authentication authentication
    ) {
        UserFluStudy response = userFluStudyService.getResponse(authentication.getName());
        if(response==null)
            return new ResponseEntity<>(Map.of("message", "Bad request"), HttpStatus.BAD_REQUEST);
        return ResponseEntity.ok(Map.of("message", "Success", "completed", response.getCompleted()));
    }

    @GetMapping("/data")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> getUserStudyResponseById(
            @RequestParam("id") Long id
    ) {
        UserFluStudy response = userFluStudyService.getResponseById(id);
        return ResponseEntity.ok(Map.of("message", "Success", "studyData", response != null ? response.getCsvData(): ""));
    }
}
