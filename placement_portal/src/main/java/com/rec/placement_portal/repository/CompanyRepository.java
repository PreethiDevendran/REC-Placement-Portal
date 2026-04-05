package com.rec.placement_portal.repository;

import com.rec.placement_portal.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CompanyRepository extends MongoRepository<Company, String> {
}