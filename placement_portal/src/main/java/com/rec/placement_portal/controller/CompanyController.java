package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.Company;
import com.rec.placement_portal.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/companies")
@CrossOrigin
public class CompanyController {

    @Autowired
    private CompanyService service;

    @PostMapping
    public Company addCompany(@RequestBody Company company) {
        return service.addCompany(company);
    }

    @GetMapping
    public List<Company> getAllCompanies() {
        return service.getAllCompanies();
    }
}