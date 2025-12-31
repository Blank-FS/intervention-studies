package edu.umich.baac.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // stored hashed

    @Column(unique = true, nullable = false)
    private String prolificId;

    @Column(nullable = false)
    @Builder.Default
    private String role = "USER"; // e.g., "SUPERADMIN", "ADMIN", "USER"

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = false;

    @Column(length = 32)
    private String verificationCode;

    @Column
    private Instant verificationExpiry;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private UserFluStudy userFluStudy;
}
