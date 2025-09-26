package edu.umich.baac.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // stored hashed

    @Column(unique = true,nullable = false)
    private String prolificId;

    @Column(nullable = false)
    private String role = "PARTICIPANT"; // e.g., "RESEARCHER", "PARTICIPANT"

    private boolean enabled = false;

    private String verificationCode;

    private Instant verificationExpiry;

    // getters, setters, constructors
}
