package com.rec.placement_portal.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "chatbot_knowledge")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatbotKnowledge {

    @Id
    private String id;

    private String question;
    private String answer;
    private List<String> keywords;
}
