package com.rec.placement_portal.controller;

import com.rec.placement_portal.model.Company;
import com.rec.placement_portal.model.Experience;
import com.rec.placement_portal.model.PlacementStatistics;
import com.rec.placement_portal.model.Question;
import com.rec.placement_portal.model.ChatbotKnowledge;
import com.rec.placement_portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin
public class ChatbotController {

    @Autowired
    private CompanyRepository companyRepo;

    @Autowired
    private ExperienceRepository expRepo;

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private PlacementStatisticsRepository statsRepo;

    @Autowired
    private ChatbotKnowledgeRepository kbRepo;

    @PostMapping("/ask")
    public ResponseEntity<?> askChatbot(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("reply", "Please say something!"));
        }

        String msg = userMessage.toLowerCase().trim();
        String reply = "";
        List<String> suggestions = new ArrayList<>();

        // Initialize default suggestions
        suggestions.add("Which companies visited last year?");
        suggestions.add("What is the eligibility for TCS?");
        suggestions.add("What package does Accenture offer?");
        suggestions.add("Show previous student experiences for CTS");
        suggestions.add("Show placement stats");

        // 1. EXTRACT COMPANY NAME IF PRESENT
        List<Company> allCompanies = companyRepo.findAll();
        Company targetCompany = null;
        for (Company c : allCompanies) {
            if (msg.contains(c.getName().toLowerCase())) {
                targetCompany = c;
                break;
            }
        }

        // 2. CHECK SPECIFIC SCENARIOS
        
        // Scenario A: Requesting experiences/interview prep for a company
        if ((msg.contains("experience") || msg.contains("interview") || msg.contains("prepare") || msg.contains("tips")) 
                && targetCompany != null) {
            
            List<Experience> exps = expRepo.findByCompanyName(targetCompany.getName());
            if (!exps.isEmpty()) {
                StringBuilder sb = new StringBuilder();
                sb.append("Here are previous student experiences for **").append(targetCompany.getName()).append("**:\n\n");
                for (int i = 0; i < Math.min(exps.size(), 3); i++) {
                    Experience e = exps.get(i);
                    sb.append("🗣️ **Student: ").append(e.getStudentName()).append("**\n")
                      .append("• **Interview Process:** ").append(e.getInterviewProcess() != null ? e.getInterviewProcess() : "N/A").append("\n")
                      .append("• **Prep Tips:** ").append(e.getPrepTips() != null ? e.getPrepTips() : "N/A").append("\n")
                      .append("• **Experience:** ").append(e.getExperienceContent() != null ? e.getExperienceContent() : "N/A").append("\n\n");
                }
                reply = sb.toString();
            } else {
                reply = "I found **" + targetCompany.getName() + "** in our directory, but no students have shared their interview experiences for it yet. You could ask seniors in the Q&A Forum!";
            }
        }
        
        // Scenario B: Requesting eligibility/criteria/package for a company
        else if ((msg.contains("eligibility") || msg.contains("criteria") || msg.contains("package") || msg.contains("ctc") || msg.contains("offer")) 
                && targetCompany != null) {
            
            reply = "Here are the requirements and package details for **" + targetCompany.getName() + "**:\n\n" +
                    "💵 **CTC Offered:** " + targetCompany.getCtc() + "\n" +
                    "🎓 **Target Role:** " + targetCompany.getRole() + "\n" +
                    "📋 **Eligibility Criteria:** " + targetCompany.getEligibility() + "\n" +
                    "📅 **Drive Date:** " + targetCompany.getDate();
        }
        
        // Scenario C: Requesting number of students placed / count for a company
        else if ((msg.contains("placed") || msg.contains("placements") || msg.contains("how many students")) 
                && targetCompany != null) {
            
            // Check experiences or stats
            List<Experience> exps = expRepo.findByCompanyName(targetCompany.getName());
            List<PlacementStatistics> stats = statsRepo.findByCompanyName(targetCompany.getName());
            int count = exps.size();
            if (!stats.isEmpty()) {
                count = stats.stream().mapToInt(PlacementStatistics::getPlacedCount).sum();
            }
            
            reply = "According to our placement database, **" + count + "** students were successfully placed at **" + targetCompany.getName() + "**.";
        }
        
        // Scenario D: Requesting statistics generally (highest package, average package, total placed)
        else if (msg.contains("stat") || msg.contains("highest package") || msg.contains("average package") || msg.contains("placement percentage") || msg.contains("department")) {
            List<PlacementStatistics> stats = statsRepo.findAll();
            if (!stats.isEmpty()) {
                double highest = stats.stream().mapToDouble(PlacementStatistics::getHighestPackage).max().orElse(0.0);
                double sumAverage = stats.stream().mapToDouble(PlacementStatistics::getAveragePackage).sum();
                double avg = stats.isEmpty() ? 0.0 : sumAverage / stats.size();
                int totalOffers = stats.stream().mapToInt(PlacementStatistics::getTotalOffers).sum();
                
                reply = "📊 **REC Placement Overview:**\n\n" +
                        "🏆 **Highest Package Offered:** " + highest + " LPA\n" +
                        "📈 **Average Package:** " + String.format("%.2f", avg) + " LPA\n" +
                        "💼 **Total Offers Generated:** " + totalOffers + " offers\n\n" +
                        "You can check out our dedicated **Stats Dashboard** tab for department-wise and year-wise breakdown graphs!";
            } else {
                reply = "The statistics data is currently being aggregated by the placement team. Please check back later.";
            }
        }
        
        // Scenario E: Which companies visited last year / general company listings
        else if (msg.contains("companies") || msg.contains("visited") || msg.contains("last year") || msg.contains("which company")) {
            if (!allCompanies.isEmpty()) {
                String companyList = allCompanies.stream()
                        .map(Company::getName)
                        .distinct()
                        .collect(Collectors.joining(", "));
                reply = "Here is a list of companies that have visited REC recently:\n\n👉 **" + companyList + "**\n\nClick on the **Companies Visited** tab in the sidebar to search and filter them by year!";
            } else {
                reply = "No companies have been added to the drive records yet.";
            }
        }

        // 3. SEARCH KNOWLEDGE BASE (FAQs) IF NO REPLY YET
        if (reply.isEmpty()) {
            List<ChatbotKnowledge> kbs = kbRepo.findAll();
            for (ChatbotKnowledge kb : kbs) {
                if (kb.getKeywords() != null) {
                    for (String keyword : kb.getKeywords()) {
                        if (msg.contains(keyword.toLowerCase())) {
                            reply = kb.getAnswer();
                            break;
                        }
                    }
                }
                if (!reply.isEmpty()) break;
            }
        }

        // 4. SEARCH PREVIOUS DISCUSSION DISCUSSIONS / Q&As
        if (reply.isEmpty()) {
            List<Question> questions = questionRepo.findAll();
            Question bestMatch = null;
            int maxMatchCount = 0;
            
            for (Question q : questions) {
                String qText = q.getQuestion().toLowerCase();
                int matches = 0;
                String[] tokens = msg.split("\\s+");
                for (String t : tokens) {
                    if (t.length() > 3 && qText.contains(t)) {
                        matches++;
                    }
                }
                if (matches > maxMatchCount) {
                    maxMatchCount = matches;
                    bestMatch = q;
                }
            }
            
            if (bestMatch != null && maxMatchCount >= 2) {
                StringBuilder sb = new StringBuilder();
                sb.append("🔍 I found a related discussion on the forum:\n\n")
                  .append("❓ **Question:** ").append(bestMatch.getQuestion()).append("\n");
                
                if (bestMatch.getReplies() != null && !bestMatch.getReplies().isEmpty()) {
                    sb.append("💬 **Top Answer:** ").append(bestMatch.getReplies().get(0).getText())
                      .append(" *(by ").append(bestMatch.getReplies().get(0).getAnsweredByName()).append(" - ")
                      .append(bestMatch.getReplies().get(0).getRole()).append(")*\n\n")
                      .append("You can find more replies in the **Q&A Forum** tab!");
                } else {
                    sb.append("This question doesn't have answers yet. You can post a reply yourself in the forum!");
                }
                reply = sb.toString();
            }
        }

        // 5. FALLBACK RESPONSE
        if (reply.isEmpty()) {
            reply = "👋 Hello! I am the REC Placement Assistant chatbot.\n\n" +
                    "I can answer queries regarding company eligibility, packages, student reviews, and discussion boards.\n\n" +
                    "Feel free to ask questions like:\n" +
                    "• *'What package does Google offer?'*\n" +
                    "• *'Show eligibility for Microsoft'* \n" +
                    "• *'TCS experiences'*\n" +
                    "• *'Who is placed in Amazon?'*";
        }

        return ResponseEntity.ok(Map.of(
            "reply", reply,
            "suggestions", suggestions
        ));
    }

    // ✅ ADMIN HELP: ADD FAQ TO KNOWLEDGE BASE
    @PostMapping("/knowledge")
    public ResponseEntity<?> addKnowledge(@RequestBody ChatbotKnowledge kb) {
        if (kb.getKeywords() == null) kb.setKeywords(new ArrayList<>());
        ChatbotKnowledge saved = kbRepo.save(kb);
        return ResponseEntity.ok(saved);
    }
}
