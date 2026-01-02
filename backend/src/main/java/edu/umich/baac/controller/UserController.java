package edu.umich.baac.controller;


import edu.umich.baac.model.User;
import edu.umich.baac.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public List<User> getAllUsers() {
        return userService.getUsers();
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<?> changeUserRole(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam String newRole) {

        // Get current logged-in user and role
        String currentUserEmail = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        // Fetch the user who needs their role changed
        User targetUser = userService.getUserById(id);
        if (targetUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        if (currentUserEmail.equals(targetUser.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("You cannot intentionally modify own role as superadmin.");
        }

        // Validate that the action is allowed:
        if ("SUPERADMIN".equals(newRole)) {
            if (targetUser.getRole().equals("SUPERADMIN")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Cannot promote to superadmin because the user is already superadmin.");
            }
            // Proceed with transferring superadmin role
            userService.transferSuperadmin(currentUserEmail, targetUser, newRole);
        } else if ("ADMIN".equals(newRole) || "USER".equals(newRole)) {
            // Regular promotion/demotion logic
            userService.changeUserRole(targetUser, newRole);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid role: " + newRole);
        }
        
        return ResponseEntity.ok(Map.of("message", "Successfully changed role"));
    }
}
