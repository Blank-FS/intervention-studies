package edu.umich.baac.service;

import edu.umich.baac.model.User;
import edu.umich.baac.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserCleanupService {

    private final UserRepository userRepository;

    @Scheduled(fixedRate = 60_000) // run every minute
    public void removeExpiredUsers() {
        LocalDateTime cutoff = LocalDateTime.now(ZoneOffset.UTC).minusMinutes(15);
        List<User> expiredUsers = userRepository.findAllByEnabledFalseAndCreatedAtBefore(cutoff);

        if (!expiredUsers.isEmpty()) {
            userRepository.deleteAll(expiredUsers);
            System.out.println("Deleted " + expiredUsers.size() + " expired users");
        }
    }
}
