package edu.umich.baac.model.module;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "module")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 5000)
    private String paragraph;

    private String videoUrl;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Question> questions = new ArrayList<>();
}
