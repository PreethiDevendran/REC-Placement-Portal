package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.Experience;
import com.rec.placement_portal.service.ExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/experiences")
@CrossOrigin
public class ExperienceController {

    @Autowired
    private ExperienceService service;

    // ✅ GET all experiences
    @GetMapping
    public List<Experience> getAllExperiences() {
        return service.getAllExperiences();
    }

    // ✅ ADD experience
    @PostMapping
    public Experience addExperience(@RequestBody Experience exp) {
        return service.addExperience(exp);
    }

    // ✅ GET experiences by company
    @GetMapping("/{companyName}")
    public List<Experience> getExperiences(@PathVariable String companyName) {
        return service.getByCompany(companyName);
    }

    // ✅ TOGGLE like on experience
    @PostMapping("/{id}/like")
    public ResponseEntity<Experience> toggleLike(@PathVariable String id, @RequestBody String email) {
        // Clean email quotes if needed
        String cleanEmail = email.replace("\"", "").trim();
        Experience updated = service.toggleLike(id, cleanEmail);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ DELETE experience (Admin moderate)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable String id) {
        service.deleteExperience(id);
        return ResponseEntity.ok().build();
    }
}