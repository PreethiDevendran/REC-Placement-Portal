package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.Company;
import com.rec.placement_portal.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/companies")
@CrossOrigin
public class CompanyController {

    @Autowired
    private CompanyService service;

    // ✅ ADD Company
    @PostMapping
    public Company addCompany(@RequestBody Company company) {
        return service.addCompany(company);
    }

    // ✅ GET All Companies
    @GetMapping
    public List<Company> getAllCompanies() {
        return service.getAllCompanies();
    }

    // ✅ GET Company By ID
    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable String id) {
        Optional<Company> company = service.getCompanyById(id);
        return company.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ UPDATE Company (Admin tool)
    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable String id, @RequestBody Company details) {
        Company updated = service.updateCompany(id, details);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ DELETE Company (Admin tool)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable String id) {
        service.deleteCompany(id);
        return ResponseEntity.ok().build();
    }
}