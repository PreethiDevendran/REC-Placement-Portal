package com.rec.placement_portal.service;

import com.rec.placement_portal.model.Company;
import com.rec.placement_portal.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Optional<Company> getCompanyById(String id) {
        return repo.findById(id);
    }

    public Company updateCompany(String id, Company details) {
        Optional<Company> opt = repo.findById(id);
        if (opt.isPresent()) {
            Company company = opt.get();
            company.setName(details.getName());
            company.setRole(details.getRole());
            company.setCtc(details.getCtc());
            company.setEligibility(details.getEligibility());
            company.setDate(details.getDate());
            company.setLogo(details.getLogo());
            return repo.save(company);
        }
        return null;
    }

    public void deleteCompany(String id) {
        repo.deleteById(id);
    }
}