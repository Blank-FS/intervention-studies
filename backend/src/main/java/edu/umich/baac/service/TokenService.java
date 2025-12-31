package edu.umich.baac.service;

import edu.umich.baac.model.User;
import edu.umich.baac.repository.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final UserRepository  userRepository;

    public TokenService(JwtEncoder encoder,  UserRepository userRepository) {
        this.encoder = encoder;
        this.userRepository = userRepository;
    }

    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // e.g. ROLE_RESEARCHER
                .map(auth -> auth.replace("ROLE_", "")) // strip prefix if you prefer
                .findFirst()
                .orElse("PARTICIPANT");

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(24, ChronoUnit.HOURS))
                .subject(authentication.getName())
                .claim("role", role)
                .build();
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public String generateTokenByEmail(String email) {
        // Load user from DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Build authorities list
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );

        // Create a dummy Authentication object
        Authentication auth = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, authorities
        );

        return generateToken(auth); // reuse existing method
    }
}
