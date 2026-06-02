package com.rec.placement_portal.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String id;

    private String email;
    private String password;
    private String dept;
    private String year;

    // Personal Info
    private String fullName;
    private String phone;
    private String profilePic; // Base64 encoded

    // Academic Info
    private Double cgpa;
    private Integer backlogs;
    private List<String> skills;
    private List<String> certifications;

    // Placement Prep
    private String resume; // Base64 encoded
    private String linkedinUrl;
    private String githubUrl;
    private String leetcodeUrl;

    // Role: STUDENT, PLACED_STUDENT, ADMIN
    private String role = "STUDENT";
}