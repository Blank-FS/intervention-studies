package edu.umich.baac.model.module;

import edu.umich.baac.model.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "response")
@Data
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Question question;

    @ManyToOne
    private Option selectedOption;

    // optional for convenience
    private boolean isCorrect;
}

