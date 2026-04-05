package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.User;
import com.rec.placement_portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository repo;

    private final String VALID_DOMAIN = "@rajalakshmi.edu.in";

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // 🔒 Email domain check
        if (!user.getEmail().endsWith(VALID_DOMAIN)) {
            return ResponseEntity.badRequest().body("Only REC students allowed");
        }

        // 🔍 Check if already exists
        if (repo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        repo.save(user);
        return ResponseEntity.ok("Registered Successfully");
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        // 🔒 Domain check
        if (!user.getEmail().endsWith(VALID_DOMAIN)) {
            return ResponseEntity.badRequest().body("Invalid college email");
        }

        Optional<User> existingUser = repo.findByEmail(user.getEmail());

        if (existingUser.isPresent() &&
                existingUser.get().getPassword().equals(user.getPassword())) {

            return ResponseEntity.ok(Map.of("success", true));
        }

        return ResponseEntity.ok(Map.of("success", false));
    }
}