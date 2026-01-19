package edu.umich.baac.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "flu_study_response",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_prolific_study_session",
                        columnNames = {"prolific_id", "study_id", "session_id"}
                )
        }
    )
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FluStudyResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private Boolean completed = false;

    @Builder.Default
    private Boolean valid = true;

    @Column(length = 50000)
    private String csvData;

    @Column
    private Integer age;

    @Column
    private Integer baselineVaxIntent;

    @Column
    private Integer postVaxIntent;

    @Column(name = "prolific_id", nullable = false)
    private String prolificId;

    @Column(name = "study_id", nullable = false)
    private String studyId;

    @Column(name = "session_id", nullable = false)
    private String sessionId;

}
