package edu.umich.baac.repository;

import edu.umich.baac.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByProlificId(String prolificId);
    Optional<User> findByEmailAndVerificationCode(String email, String code);
    List<User> findAllByEnabledFalseAndCreatedAtBefore(LocalDateTime cutoff);
}

