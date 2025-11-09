package edu.umich.baac.service;

import edu.umich.baac.model.User;
import edu.umich.baac.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder; // configure BCryptPasswordEncoder
    private final JavaMailSender mailSender;

    public void registerUser(String email, String rawPassword, String prolificId) {
        if (userRepo.findByEmail(email).isPresent())
            throw new IllegalArgumentException("Account with Email already exists");
        if (userRepo.findByProlificId(prolificId).isPresent())
            throw new IllegalArgumentException("Account with Prolific ID already exists");

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setProlificId(prolificId);
        user.setEnabled(false);

        // generate verification code
        String code = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(code);
        user.setVerificationExpiry(Instant.now().plus(15, ChronoUnit.MINUTES));

        userRepo.save(user);

        sendVerificationEmail(user.getEmail(), code);
    }

    public boolean verifyUser(String email, String code) {
        Optional<User> optUser = userRepo.findByEmailAndVerificationCode(email, code);

        if (optUser.isPresent()) {
            User user = optUser.get();
            if (user.getVerificationExpiry().isAfter(Instant.now())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationExpiry(null);
                userRepo.save(user);
                return true;
            }
        }
        return false;
    }

    private void sendVerificationEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Verify your account");
        message.setText("Your verification code is: " + code + "\nIt will expire in 15 minutes.");
        mailSender.send(message);
    }

    public List<User> getUsers() {
        return userRepo.findAll();
    }
}
