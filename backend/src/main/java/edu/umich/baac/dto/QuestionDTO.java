package edu.umich.baac.dto;

import edu.umich.baac.model.module.Option;
import edu.umich.baac.model.module.Question;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Long id;
    private String questionText;
    private List<Option> options;
    private Long correctOptionId;
    private Long selectedOptionId; // user's previous answer, if any

    public QuestionDTO(Question q) {
        this.id = q.getId();
        this.questionText = q.getQuestionText();
        this.correctOptionId = q.getCorrectOptionId();
        this.options = q.getOptions();
    }
}

