package com.rec.placement_portal.service;

import com.rec.placement_portal.model.Company;
import com.rec.placement_portal.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository repo;

    public Company addCompany(Company company) {
        return repo.save(company);
    }

    public List<Company> getAllCompanies() {
        return repo.findAll();
    }
}