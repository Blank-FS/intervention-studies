package edu.umich.baac.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

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

    @Column(unique = true,nullable = false)
    private String prolificId;

    @Column(nullable = false)
    private String role = "USER"; // e.g., "SUPERADMIN", "ADMIN", "USER"

    @Column(nullable = false)
    private boolean enabled = false;

    @Column(length = 32)
    private String verificationCode;

    @Column
    private Instant verificationExpiry;
}
