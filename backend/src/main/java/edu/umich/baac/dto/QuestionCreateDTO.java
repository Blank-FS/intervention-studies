package edu.umich.baac.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionCreateDTO {
    private String questionText;
    private Long moduleId;
    private List<OptionCreateDTO> options;
}
