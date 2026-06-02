package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.Question;
import com.rec.placement_portal.model.Question.Reply;
import com.rec.placement_portal.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/questions")
@CrossOrigin
public class QuestionController {

    @Autowired
    private QuestionRepository repo;

    // ✅ GET all questions
    @GetMapping
    public List<Question> getAllQuestions() {
        return repo.findAll();
    }

    // ✅ ADD new question
    @PostMapping
    public Question addQuestion(@RequestBody Question q) {
        if (q.getUpvotes() == null) q.setUpvotes(new ArrayList<>());
        if (q.getReplies() == null) q.setReplies(new ArrayList<>());
        return repo.save(q);
    }

    // ✅ TOGGLE Upvote on a question
    @PostMapping("/{id}/upvote")
    public ResponseEntity<Question> toggleUpvote(@PathVariable String id, @RequestBody String email) {
        String cleanEmail = email.replace("\"", "").trim();
        Optional<Question> opt = repo.findById(id);
        if (opt.isPresent()) {
            Question q = opt.get();
            if (q.getUpvotes() == null) q.setUpvotes(new ArrayList<>());
            
            if (q.getUpvotes().contains(cleanEmail)) {
                q.getUpvotes().remove(cleanEmail);
            } else {
                q.getUpvotes().add(cleanEmail);
            }
            return ResponseEntity.ok(repo.save(q));
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ ADD reply to a question
    @PostMapping("/{id}/answer")
    public ResponseEntity<Question> addAnswer(@PathVariable String id, @RequestBody Reply reply) {
        Optional<Question> opt = repo.findById(id);
        if (opt.isPresent()) {
            Question q = opt.get();
            if (q.getReplies() == null) q.setReplies(new ArrayList<>());
            if (reply.getUpvotes() == null) reply.setUpvotes(new ArrayList<>());
            
            q.getReplies().add(reply);
            return ResponseEntity.ok(repo.save(q));
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ TOGGLE Upvote on a reply (using reply text or index - let's use reply index)
    @PostMapping("/{id}/answer/{replyIndex}/upvote")
    public ResponseEntity<Question> toggleReplyUpvote(
            @PathVariable String id,
            @PathVariable int replyIndex,
            @RequestBody String email) {
        String cleanEmail = email.replace("\"", "").trim();
        Optional<Question> opt = repo.findById(id);
        if (opt.isPresent()) {
            Question q = opt.get();
            if (q.getReplies() != null && replyIndex >= 0 && replyIndex < q.getReplies().size()) {
                Reply r = q.getReplies().get(replyIndex);
                if (r.getUpvotes() == null) r.setUpvotes(new ArrayList<>());
                
                if (r.getUpvotes().contains(cleanEmail)) {
                    r.getUpvotes().remove(cleanEmail);
                } else {
                    r.getUpvotes().add(cleanEmail);
                }
                return ResponseEntity.ok(repo.save(q));
            }
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ DELETE question (Admin Moderate)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable String id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}