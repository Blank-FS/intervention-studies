package edu.umich.baac.dto;

import edu.umich.baac.model.UserFluStudy;
import lombok.Data;

@Data
public class FluStudyResponseDTO {
    private Long id;
    private String prolificId;
    private String email;
    private Integer age;
    private Boolean valid;
    private Integer baselineVaxIntent;
    private Integer postVaxIntent;

    public FluStudyResponseDTO(UserFluStudy userFluStudy) {
        this.id = userFluStudy.getUser().getId();
        this.prolificId = userFluStudy.getUser().getProlificId();
        this.email = userFluStudy.getUser().getEmail();
        this.age = userFluStudy.getAge();
        this.valid = userFluStudy.getValid();
        this.baselineVaxIntent = userFluStudy.getBaselineVaxIntent();
        this.postVaxIntent = userFluStudy.getPostVaxIntent();
    }
}
