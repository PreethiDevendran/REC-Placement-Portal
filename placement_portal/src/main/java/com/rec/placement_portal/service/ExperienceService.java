package com.rec.placement_portal.service;

import com.rec.placement_portal.model.Experience;
import com.rec.placement_portal.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class ExperienceService {

    @Autowired
    private ExperienceRepository repo;

    public Experience addExperience(Experience exp) {
        if (exp.getLikes() == null) {
            exp.setLikes(new ArrayList<>());
        }
        return repo.save(exp);
    }

    public List<Experience> getByCompany(String companyName) {
        return repo.findByCompanyName(companyName);
    }

    public List<Experience> getAllExperiences() {
        return repo.findAll();
    }

    public Experience toggleLike(String id, String userEmail) {
        Optional<Experience> opt = repo.findById(id);
        if (opt.isPresent()) {
            Experience exp = opt.get();
            if (exp.getLikes() == null) {
                exp.setLikes(new ArrayList<>());
            }
            
            if (exp.getLikes().contains(userEmail)) {
                exp.getLikes().remove(userEmail);
            } else {
                exp.getLikes().add(userEmail);
            }
            return repo.save(exp);
        }
        return null;
    }

    public void deleteExperience(String id) {
        repo.deleteById(id);
    }
}