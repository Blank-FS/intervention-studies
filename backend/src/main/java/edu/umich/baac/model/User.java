package edu.umich.baac.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private Instant createdAt;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // stored hashed

    @Column(unique = true,nullable = false)
    private String prolificId;

    @Column(nullable = false)
    private String role = "PARTICIPANT"; // e.g., "RESEARCHER", "PARTICIPANT"

    @Column(nullable = false)
    private boolean enabled = false;

    @Column(length = 32)
    private String verificationCode;

    @Column
    private Instant verificationExpiry;
}
