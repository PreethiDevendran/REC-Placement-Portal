package com.rec.placement_portal.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "companies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Company {

    @Id
    private String id;

    private String name;
    private String role;
    private String ctc;
    private String eligibility;
    private String date;
    private String logo;
}