package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.Experience;
import com.rec.placement_portal.service.ExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/experiences")
@CrossOrigin
public class ExperienceController {

    @Autowired
    private ExperienceService service;

    @PostMapping
    public Experience addExperience(@RequestBody Experience exp) {
        return service.addExperience(exp);
    }

    @GetMapping("/{companyName}")
    public List<Experience> getExperiences(@PathVariable String companyName) {
        return service.getByCompany(companyName);
    }
}