package com.rec.placement_portal;

import com.rec.placement_portal.model.*;
import com.rec.placement_portal.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.util.List;

@SpringBootApplication
public class PlacementPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlacementPortalApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepo, CompanyRepository companyRepo, PlacementStatisticsRepository statsRepo) {
        return args -> {
            // 1. Seed/Ensure default users exist
            // Ensure Admin
            User admin = userRepo.findByEmail("admin@rajalakshmi.edu.in").orElse(new User());
            admin.setEmail("admin@rajalakshmi.edu.in");
            admin.setPassword("password");
            admin.setFullName("Placement Admin");
            admin.setDept("IT");
            admin.setYear("IV");
            admin.setRole("ADMIN");
            admin.setPhone("9876543210");
            admin.setCgpa(8.5);
            admin.setBacklogs(0);
            userRepo.save(admin);

            // Ensure Student
            User student = userRepo.findByEmail("student@rajalakshmi.edu.in").orElse(new User());
            student.setEmail("student@rajalakshmi.edu.in");
            student.setPassword("password");
            student.setFullName("Preethi Student");
            student.setDept("CSE");
            student.setYear("III");
            student.setRole("STUDENT");
            student.setPhone("9123456789");
            student.setCgpa(8.9);
            student.setBacklogs(0);
            student.setSkills(List.of("Java", "React", "Python"));
            student.setCertifications(List.of("AWS Academy", "Java Certified"));
            userRepo.save(student);

            System.out.println("🌱 Guaranteed default users: admin@rajalakshmi.edu.in / student@rajalakshmi.edu.in with password 'password'");
            
            // 2. Seed companies if empty
            if (companyRepo.count() == 0) {
                Company c1 = new Company(null, "Google", "Software Engineer", "18 LPA", "CGPA >= 8.0, 0 Backlogs", "2026-04-10", "");
                Company c2 = new Company(null, "Accenture", "Associate Engineer", "4.5 LPA", "CGPA >= 6.0, Max 1 Backlog", "2026-05-15", "");
                Company c3 = new Company(null, "TCS", "Ninja Developer", "3.6 LPA", "CGPA >= 6.0, 0 Backlogs", "2026-05-20", "");
                Company c4 = new Company(null, "CTS", "Programmer Analyst", "4.0 LPA", "CGPA >= 6.0, 0 Backlogs", "2026-05-25", "");
                companyRepo.saveAll(List.of(c1, c2, c3, c4));
                System.out.println("🌱 Pre-seeded default companies");
            }

            // 3. Seed statistics if empty
            if (statsRepo.count() == 0) {
                PlacementStatistics s1 = new PlacementStatistics(null, "2026", "CSE", "Google", 3, 24.5, 18.0, 3);
                PlacementStatistics s2 = new PlacementStatistics(null, "2026", "IT", "Accenture", 42, 6.5, 4.5, 42);
                PlacementStatistics s3 = new PlacementStatistics(null, "2026", "ECE", "TCS", 75, 4.2, 3.6, 75);
                statsRepo.saveAll(List.of(s1, s2, s3));
                System.out.println("🌱 Pre-seeded default placement statistics");
            }
        };
    }
}
