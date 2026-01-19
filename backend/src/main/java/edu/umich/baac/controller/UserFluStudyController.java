package edu.umich.baac.controller;

import edu.umich.baac.model.FluStudyResponse;
import edu.umich.baac.service.FluStudyResponseService;
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
    private final FluStudyResponseService fluStudyResponseService;

    public record StudyResponseRequest(String csvData, String prolificId, String studyId, String sessionId){}

    @PostMapping("/submit")
    public ResponseEntity<?> submitStudyResponse(
            @RequestBody StudyResponseRequest req
    ) {
        boolean success = fluStudyResponseService.saveResponse(req.csvData(), req.prolificId(),  req.studyId(), req.sessionId());
        if(!success)
            return new ResponseEntity<>(Map.of("message", "Failed to save response"), HttpStatus.BAD_REQUEST);
        return ResponseEntity.ok(Map.of("message", "Response saved"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> getAllStudyResponses() {
        return ResponseEntity.ok(Map.of("responses", fluStudyResponseService.getAllResponses()));
    }

//    @GetMapping("/status")
//    @PreAuthorize("hasRole('USER')")
//    public ResponseEntity<?> getUserStudyResponse(
//            Authentication authentication
//    ) {
//        UserFluStudy response = userFluStudyService.getResponse(authentication.getName());
//        if(response==null)
//            return ResponseEntity.ok(Map.of("message", "Success", "completed", false));
//        return ResponseEntity.ok(Map.of("message", "Success", "completed", true));
//    }

    @GetMapping("/data")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> getUserStudyResponseById(
            @RequestParam("id") Long responseId
    ) {
        FluStudyResponse response = fluStudyResponseService.getResponseById(responseId);
        return ResponseEntity.ok(Map.of("message", "Success", "studyData", response != null ? response.getCsvData(): ""));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> deleteUserStudyResponseById(
            @RequestParam("id") Long responseId
    ) {
        boolean deleted = fluStudyResponseService.deleteResponseById(responseId);
        if(!deleted)
            return new ResponseEntity<>(Map.of("message", "Failed to delete response"), HttpStatus.BAD_REQUEST);
        return ResponseEntity.ok(Map.of("message", "Successfully deleted response with id " + responseId));
    }
}
