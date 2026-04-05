package com.rec.placement_portal.repository;

import com.rec.placement_portal.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuestionRepository extends MongoRepository<Question, String> {
}