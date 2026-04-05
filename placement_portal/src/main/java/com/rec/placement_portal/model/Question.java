package com.rec.placement_portal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    private String question;
    private List<String> answers;

    public Question() {}

    public Question(String question, List<String> answers) {
        this.question = question;
        this.answers = answers;
    }

    public String getId() { return id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getAnswers() { return answers; }
    public void setAnswers(List<String> answers) { this.answers = answers; }
}