package com.rec.placement_portal.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "placement_statistics")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlacementStatistics {

    @Id
    private String id;

    private String year;
    private String dept;
    private String companyName;
    private Integer placedCount;
    private Double highestPackage;
    private Double averagePackage;
    private Integer totalOffers;
}
