package com.rec.placement_portal.service;

import com.rec.placement_portal.model.Experience;
import com.rec.placement_portal.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperienceService {

    @Autowired
    private ExperienceRepository repo;

    public Experience addExperience(Experience exp) {
        return repo.save(exp);
    }

    public List<Experience> getByCompany(String companyName) {
        return repo.findByCompanyName(companyName);
    }
}