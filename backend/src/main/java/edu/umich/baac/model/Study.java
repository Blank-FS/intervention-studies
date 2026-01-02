package edu.umich.baac.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "study")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Study {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @Column
    @Builder.Default
    private Boolean active = true;
}
