package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.Notification;
import com.rec.placement_portal.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationRepository repo;

    // ✅ GET all notifications (newest first)
    @GetMapping
    public List<Notification> getAllNotifications() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    // ✅ POST notification (Admin tool)
    @PostMapping
    public Notification addNotification(@RequestBody Notification note) {
        if (note.getCreatedAt() == null) {
            note.setCreatedAt(new SimpleDateFormat("dd MMM yyyy, HH:mm").format(new Date()));
        }
        return repo.save(note);
    }

    // ✅ DELETE notification (Admin tool)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
