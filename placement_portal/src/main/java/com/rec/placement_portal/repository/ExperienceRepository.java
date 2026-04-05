package com.rec.placement_portal.repository;

import com.rec.placement_portal.model.Experience;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExperienceRepository extends MongoRepository<Experience, String> {
    List<Experience> findByCompanyName(String companyName);
}