package com.rec.placement_portal.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "experiences")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Experience {

    @Id
    private String id;

    private String companyName;
    private String studentName;
    private String experienceText;
}