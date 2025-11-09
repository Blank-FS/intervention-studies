package edu.umich.baac.controller;

import edu.umich.baac.dto.ResponseRequest;
import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Option;
import edu.umich.baac.model.module.Question;
import edu.umich.baac.model.module.Response;
import edu.umich.baac.repository.UserRepository;
import edu.umich.baac.repository.module.OptionRepository;
import edu.umich.baac.repository.module.QuestionRepository;
import edu.umich.baac.repository.module.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/responses")
@RequiredArgsConstructor
public class ResponseController {
    private final ResponseRepository responseRepo;
    private final UserRepository userRepo;
    private final QuestionRepository questionRepo;
    private final OptionRepository optionRepo;

    @PostMapping
    @PreAuthorize("hasRole('PARTICIPANT')")
    public ResponseEntity<?> submitResponse(
            Authentication authentication,
            @RequestBody ResponseRequest req
    ) {
        // 1. Get user
        String username = authentication.getName();
        User currentUser = userRepo.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // 2. Check if response already exists
        Optional<Response> existing = responseRepo.findByUserIdAndQuestionId(currentUser.getId(), req.getQuestionId());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Response already exists for user + question pair"));
        }

        Question question = questionRepo.findById(req.getQuestionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));
        Option option = optionRepo.findById(req.getOptionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Option not found"));

        Response response = new Response();
        response.setUser(currentUser);
        response.setQuestion(question);
        response.setSelectedOption(option);
        response.setCorrect(option.getId().equals(question.getCorrectOptionId()));

        responseRepo.save(response);

        return ResponseEntity.ok(Map.of("message", "Response saved"));
    }

}
