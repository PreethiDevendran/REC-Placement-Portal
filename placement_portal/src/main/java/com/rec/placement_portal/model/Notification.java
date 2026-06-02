package com.rec.placement_portal.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {

    @Id
    private String id;

    private String title;
    private String message;
    private String type; // INFO, DRIVE, DISCUSSION
    private String createdAt;
}
