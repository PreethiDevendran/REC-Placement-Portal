package com.rec.placement_portal.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "experiences")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Experience {

    @Id
    private String id;

    private String companyName;
    private String studentName;
    private String studentEmail;
    private String dept;
    private String year;
    
    private String interviewProcess;
    private String prepTips;
    private String experienceContent;
    
    private List<String> likes = new ArrayList<>();
}