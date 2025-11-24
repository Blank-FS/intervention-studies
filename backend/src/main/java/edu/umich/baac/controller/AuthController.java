package edu.umich.baac.controller;

import edu.umich.baac.dto.auth.LoginRequestDTO;
import edu.umich.baac.dto.auth.RegisterRequestDTO;
import edu.umich.baac.dto.auth.VerifyRequestDTO;
import edu.umich.baac.service.TokenService;
import edu.umich.baac.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping ("/auth")
public class AuthController {

    private static final Logger LOG = LoggerFactory.getLogger(AuthController.class);
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;


    @PostMapping("/token")
    public Map<String, String> token(@RequestBody LoginRequestDTO userLogin) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLogin.username(), userLogin.password()));
        LOG.debug("Token requested for user: '{}'", authentication.getName());
        String token = tokenService.generateToken(authentication);
        // Extract role from authentication
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // e.g. ROLE_RESEARCHER
                .map(auth -> auth.replace("ROLE_", "")) // strip prefix if you prefer
                .findFirst()
                .orElse("PARTICIPANT");
        LOG.debug("Token granted {}", token);
        return Map.of("token", token);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDTO req) {
        userService.registerUser(req.email(), req.password(), req.prolificId());
        return ResponseEntity.ok("Verification code sent to your email");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyRequestDTO req) {
        boolean success = userService.verifyUser(req.email(), req.code());
        if (success) {
            String token = tokenService.generateTokenByEmail(req.email());
            return ResponseEntity.ok(Map.of("token", token));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired code"));
        }
    }
}