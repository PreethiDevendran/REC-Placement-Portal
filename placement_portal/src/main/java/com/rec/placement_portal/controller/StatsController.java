package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.PlacementStatistics;
import com.rec.placement_portal.repository.PlacementStatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/statistics")
@CrossOrigin
public class StatsController {

    @Autowired
    private PlacementStatisticsRepository repo;

    // ✅ GET all stats
    @GetMapping
    public List<PlacementStatistics> getAllStats() {
        return repo.findAll();
    }

    // ✅ ADD stats entry (Admin tool)
    @PostMapping
    public PlacementStatistics addStats(@RequestBody PlacementStatistics stat) {
        return repo.save(stat);
    }

    // ✅ UPDATE stats entry (Admin tool)
    @PutMapping("/{id}")
    public ResponseEntity<PlacementStatistics> updateStats(@PathVariable String id, @RequestBody PlacementStatistics details) {
        Optional<PlacementStatistics> opt = repo.findById(id);
        if (opt.isPresent()) {
            PlacementStatistics stat = opt.get();
            stat.setYear(details.getYear());
            stat.setDept(details.getDept());
            stat.setCompanyName(details.getCompanyName());
            stat.setPlacedCount(details.getPlacedCount());
            stat.setHighestPackage(details.getHighestPackage());
            stat.setAveragePackage(details.getAveragePackage());
            stat.setTotalOffers(details.getTotalOffers());
            return ResponseEntity.ok(repo.save(stat));
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ DELETE stats entry (Admin tool)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStats(@PathVariable String id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
