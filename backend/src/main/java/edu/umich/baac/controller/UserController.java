package edu.umich.baac.controller;


import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.repository.UserRepository;
import edu.umich.baac.repository.module.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository  userRepository;

    @GetMapping
    @PreAuthorize("hasRole('RESEARCHER')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
