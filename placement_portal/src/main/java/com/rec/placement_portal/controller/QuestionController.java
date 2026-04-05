package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.Question;
import com.rec.placement_portal.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
        q.setAnswers(new ArrayList<>());
        return repo.save(q);
    }

    // ✅ ADD answer
    @PostMapping("/{id}/answer")
    public Question addAnswer(@PathVariable String id, @RequestBody String answer) {
        Question q = repo.findById(id).orElse(null);

        if (q != null) {
            q.getAnswers().add(answer);
            return repo.save(q);
        }

        return null;
    }
}