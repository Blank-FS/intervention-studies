package edu.umich.baac.service;

import edu.umich.baac.dto.OptionCreateDTO;
import edu.umich.baac.dto.QuestionCreateDTO;
import edu.umich.baac.dto.QuestionReadDTO;
import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.model.module.Option;
import edu.umich.baac.model.module.Question;
import edu.umich.baac.model.module.Response;
import edu.umich.baac.repository.UserRepository;
import edu.umich.baac.repository.module.ModuleRepository;
import edu.umich.baac.repository.module.QuestionRepository;
import edu.umich.baac.repository.module.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final ModuleRepository moduleRepo;
    private final QuestionRepository questionRepo;
    private final ResponseRepository responseRepo;
    private final UserRepository userRepo;

    @Transactional
    public QuestionReadDTO createQuestion(QuestionCreateDTO dto) {
        Module module = moduleRepo.findById(dto.getModuleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        Question question = new Question();
        question.setQuestionText(dto.getQuestionText());
        question.setModule(module);

        List<Option> options = new ArrayList<>();
        Option correct = null;

        for (OptionCreateDTO optDto : dto.getOptions()) {
            Option option = new Option();
            option.setText(optDto.getText());
            option.setQuestion(question);
            options.add(option);
            if (optDto.getIsCorrect()) correct = option;
        }

        if (correct == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question must have a correct option");

        question.setOptions(options);
        questionRepo.save(question);

        // After saving, options have IDs populated
        question.setCorrectOptionId(correct.getId());
        Question saved = questionRepo.save(question);

        return new QuestionReadDTO(saved);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        var question = questionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));
        questionRepo.delete(question);
    }

    public List<QuestionReadDTO> getQuestionsByModule(Long moduleId, String username) {
        User currentUser = userRepo.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Module module = moduleRepo.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        List<Question> questions = questionRepo.findByModule(module);
        List<Response> responses = responseRepo.findByUserIdAndQuestionModuleId(currentUser.getId(), moduleId);

        return questions.stream().map(q -> {
            QuestionReadDTO dto = new QuestionReadDTO(q);
            responses.stream()
                    .filter(r -> r.getQuestion().getId().equals(q.getId()))
                    .findFirst()
                    .ifPresent(r -> dto.setSelectedOptionId(r.getSelectedOption().getId()));
            return dto;
        }).toList();
    }
}
