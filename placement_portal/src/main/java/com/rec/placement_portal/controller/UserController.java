package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.User;
import com.rec.placement_portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository repo;

    // ✅ GET user profile by email
    @GetMapping("/{email}")
    public ResponseEntity<?> getProfile(@PathVariable String email) {
        Optional<User> user = repo.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ UPDATE user profile
    @PutMapping("/{email}")
    public ResponseEntity<?> updateProfile(@PathVariable String email, @RequestBody User updatedUser) {
        Optional<User> optionalUser = repo.findByEmail(email);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        
        // Only update details if provided
        if (updatedUser.getFullName() != null) user.setFullName(updatedUser.getFullName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getDept() != null) user.setDept(updatedUser.getDept());
        if (updatedUser.getYear() != null) user.setYear(updatedUser.getYear());
        if (updatedUser.getProfilePic() != null) user.setProfilePic(updatedUser.getProfilePic());
        if (updatedUser.getCgpa() != null) user.setCgpa(updatedUser.getCgpa());
        if (updatedUser.getBacklogs() != null) user.setBacklogs(updatedUser.getBacklogs());
        if (updatedUser.getSkills() != null) user.setSkills(updatedUser.getSkills());
        if (updatedUser.getCertifications() != null) user.setCertifications(updatedUser.getCertifications());
        if (updatedUser.getResume() != null) user.setResume(updatedUser.getResume());
        if (updatedUser.getLinkedinUrl() != null) user.setLinkedinUrl(updatedUser.getLinkedinUrl());
        if (updatedUser.getGithubUrl() != null) user.setGithubUrl(updatedUser.getGithubUrl());
        if (updatedUser.getLeetcodeUrl() != null) user.setLeetcodeUrl(updatedUser.getLeetcodeUrl());
        if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());

        User saved = repo.save(user);
        return ResponseEntity.ok(saved);
    }

    // ✅ GET all users (Admin view)
    @GetMapping
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // ✅ UPDATE user role (Admin or test helper tool)
    @PutMapping("/{email}/role")
    public ResponseEntity<?> updateRole(@PathVariable String email, @RequestBody String role) {
        Optional<User> optionalUser = repo.findByEmail(email);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        User user = optionalUser.get();
        // clean quote chars if sent as raw text
        String cleanRole = role.replace("\"", "").trim();
        user.setRole(cleanRole);
        repo.save(user);
        return ResponseEntity.ok(user);
    }
}
