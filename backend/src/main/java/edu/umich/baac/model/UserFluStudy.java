package edu.umich.baac.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_flu_study")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserFluStudy {
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

    @OneToOne
    private User user;
}
