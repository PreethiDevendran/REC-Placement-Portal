package com.rec.placement_portal.repository;

import com.rec.placement_portal.model.PlacementStatistics;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PlacementStatisticsRepository extends MongoRepository<PlacementStatistics, String> {
    List<PlacementStatistics> findByYear(String year);
    List<PlacementStatistics> findByDept(String dept);
    List<PlacementStatistics> findByCompanyName(String companyName);
}
