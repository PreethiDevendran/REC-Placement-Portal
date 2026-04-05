package com.rec.placement_portal.repository;

import com.rec.placement_portal.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    // 🔍 Find user by email (for login & register check)
    Optional<User> findByEmail(String email);

}