package edu.umich.baac.dto;

import edu.umich.baac.model.FluStudyResponse;
import lombok.Data;

@Data
public class FluStudyResponseDTO {
    private Long id;
    private String prolificId;
    private String studyId;
    private String sessionId;
    private Integer age;
    private Boolean valid;
    private Integer baselineVaxIntent;
    private Integer postVaxIntent;

    public FluStudyResponseDTO(FluStudyResponse fluStudyResponse) {
        this.id = fluStudyResponse.getId();
        this.prolificId = fluStudyResponse.getProlificId();
        this.studyId = fluStudyResponse.getStudyId();
        this.sessionId = fluStudyResponse.getSessionId();
        this.age = fluStudyResponse.getAge();
        this.valid = fluStudyResponse.getValid();
        this.baselineVaxIntent = fluStudyResponse.getBaselineVaxIntent();
        this.postVaxIntent = fluStudyResponse.getPostVaxIntent();
    }
}
