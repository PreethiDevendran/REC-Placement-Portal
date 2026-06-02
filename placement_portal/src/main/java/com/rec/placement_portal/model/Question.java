package com.rec.placement_portal.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {

    @Id
    private String id;

    private String question;
    private String category; // Aptitude, Coding, HR Round, Technical Interview, Resume Preparation
    private String askedBy; // email
    private String askedByName; // Full Name
    private String createdAt;
    
    private List<String> upvotes = new ArrayList<>();
    private List<Reply> replies = new ArrayList<>();

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Reply {
        private String text;
        private String answeredBy; // email
        private String answeredByName; // Name
        private String role; // STUDENT, PLACED_STUDENT, ADMIN
        private String createdAt;
        private List<String> upvotes = new ArrayList<>();
    }
}