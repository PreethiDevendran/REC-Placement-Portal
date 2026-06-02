import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

function StudentExperience() {
    const userEmail = localStorage.getItem("email") || "";
    const userName = localStorage.getItem("fullName") || "";
    const userRole = localStorage.getItem("role") || "STUDENT";

    const [questions, setQuestions] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Coding");
    const [loading, setLoading] = useState(true);

    // Form inputs
    const [newQuestion, setNewQuestion] = useState("");
    const [newCategory, setNewCategory] = useState("Coding");

    const categories = [
        "Aptitude",
        "Coding",
        "HR Round",
        "Technical Interview",
        "Resume Preparation"
    ];

    // Load discussions from DB
    const loadQuestions = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/questions`)

            .then(res => res.json())
            .then(data => {
                setQuestions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load questions:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadQuestions();
    }, []);

    // Ask Question
    const handleAskQuestion = (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;

        const questionPayload = {
            question: newQuestion.trim(),
            category: newCategory,
            askedBy: userEmail,
            askedByName: userName,
            createdAt: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
            upvotes: [],
            replies: []
        };

        fetch(`${API_BASE_URL}/questions`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(questionPayload)
        })
        .then(res => res.json())
        .then(() => {
            setNewQuestion("");
            loadQuestions();
        })
        .catch(err => console.error("Failed to ask question:", err));
    };

    // Toggle Upvote on a Question
    const handleQuestionUpvote = (id) => {
        if (!userEmail) return;

        fetch(`${API_BASE_URL}/questions/${id}/upvote`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userEmail)
        })
        .then(res => res.json())
        .then(updatedQ => {
            setQuestions(prev => prev.map(q => q.id === id ? updatedQ : q));
        })
        .catch(err => console.error("Failed to upvote question:", err));
    };

    // Add Reply / Answer to a Question
    const handleAddReply = (questionId, text) => {
        if (!text.trim()) return;

        const replyPayload = {
            text: text.trim(),
            answeredBy: userEmail,
            answeredByName: userName,
            role: userRole,
            createdAt: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
            upvotes: []
        };

        fetch(`${API_BASE_URL}/questions/${questionId}/answer`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(replyPayload)
        })
        .then(res => res.json())
        .then(updatedQ => {
            setQuestions(prev => prev.map(q => q.id === questionId ? updatedQ : q));
        })
        .catch(err => console.error("Failed to submit reply:", err));
    };

    // Toggle Upvote on a specific Reply
    const handleReplyUpvote = (questionId, replyIndex) => {
        if (!userEmail) return;

        fetch(`${API_BASE_URL}/questions/${questionId}/answer/${replyIndex}/upvote`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userEmail)
        })
        .then(res => res.json())
        .then(updatedQ => {
            setQuestions(prev => prev.map(q => q.id === questionId ? updatedQ : q));
        })
        .catch(err => console.error("Failed to upvote reply:", err));
    };

    // Filter discussions based on Search + Category selection
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = q.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="animate-fade-in-up">
            
            {/* INTRO AND SEARCH BAR */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0 }}>Discussion Forum</h2>
                    <p style={{ color: "#7f8c8d", fontSize: "14px", margin: "5px 0 0 0" }}>Interact with seniors, ask queries, and prepare for interview rounds.</p>
                </div>
                <input
                    type="text"
                    placeholder="Search discussions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="custom-input"
                    style={{ maxWidth: "300px" }}
                />
            </div>

            {/* CATEGORIES COLLAPSIBLE ROW */}
            <div style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "30px",
                justifyContent: "flex-start"
            }}>
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "20px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "13.5px",
                                background: isSelected ? "linear-gradient(135deg, #6a1b9a, #8e24aa)" : "#ffffff",
                                color: isSelected ? "#ffffff" : "#4a148c",
                                boxShadow: isSelected ? "0 4px 15px rgba(106, 27, 154, 0.2)" : "0 2px 10px rgba(0,0,0,0.03)",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                                if(!isSelected) e.currentTarget.style.backgroundColor = "rgba(106, 27, 154, 0.05)";
                            }}
                            onMouseLeave={(e) => {
                                if(!isSelected) e.currentTarget.style.backgroundColor = "#ffffff";
                            }}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* ASK QUESTION CARD */}
            <div className="glass-card" style={{ marginBottom: "35px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "15px" }}>Ask a New Question</h3>
                
                <form onSubmit={handleAskQuestion} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            placeholder="Type your placement question here..."
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="custom-input"
                            style={{ flex: 3 }}
                            required
                        />
                        <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="custom-input"
                            style={{ flex: 1, minWidth: "180px" }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <button type="submit" className="primary-btn" style={{ flex: "0 0 120px" }}>
                            Post ➔
                        </button>
                    </div>
                </form>
            </div>

            {/* LIST OF QUESTIONS */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "30vh" }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        border: "4px solid rgba(106, 27, 154, 0.2)",
                        borderTop: "4px solid #6a1b9a",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }} />
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((q) => {
                            const isUpvotedQ = q.upvotes && q.upvotes.includes(userEmail);
                            return (
                                <div key={q.id} className="glass-card animate-fade-in" style={{ padding: "25px" }}>
                                    
                                    {/* Question Card Header */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px", marginBottom: "15px" }}>
                                        <div>
                                            <h3 style={{ margin: "0 0 5px 0", fontSize: "19px", fontWeight: "700", color: "#2c3e50" }}>
                                                {q.question}
                                            </h3>
                                            <span style={{ fontSize: "12px", color: "#7f8c8d" }}>
                                                Asked by **{q.askedByName || q.askedBy.split("@")[0]}** on {q.createdAt}
                                            </span>
                                        </div>

                                        {/* Question Upvote button */}
                                        <button
                                            onClick={() => handleQuestionUpvote(q.id)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                padding: "6px 12px",
                                                borderRadius: "10px",
                                                border: "1px solid rgba(106, 27, 154, 0.15)",
                                                backgroundColor: isUpvotedQ ? "var(--primary-purple-glow)" : "transparent",
                                                color: isUpvotedQ ? "var(--primary-purple-dark)" : "#7f8c8d",
                                                cursor: "pointer",
                                                fontSize: "12.5px",
                                                fontWeight: "600",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            Upvote ({q.upvotes ? q.upvotes.length : 0})
                                        </button>
                                    </div>

                                    {/* NESTED REPLIES */}
                                    <div style={{
                                        backgroundColor: "rgba(0,0,0,0.01)",
                                        borderLeft: "3px solid var(--primary-purple-light)",
                                        padding: "10px 10px 10px 20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                        marginBottom: "20px",
                                        borderRadius: "0 8px 8px 0"
                                    }}>
                                        {q.replies && q.replies.length > 0 ? (
                                            q.replies.map((reply, rIdx) => {
                                                const isUpvotedR = reply.upvotes && reply.upvotes.includes(userEmail);
                                                const isSeniorsReply = reply.role === "PLACED_STUDENT";
                                                const isAdminReply = reply.role === "ADMIN";
                                                
                                                return (
                                                    <div key={rIdx} style={{
                                                        backgroundColor: "#ffffff",
                                                        padding: "12px 15px",
                                                        borderRadius: "10px",
                                                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                                                        border: isSeniorsReply 
                                                            ? "1px solid rgba(241, 196, 15, 0.3)" 
                                                            : (isAdminReply ? "1px solid rgba(106, 27, 154, 0.2)" : "1px solid rgba(0,0,0,0.04)")
                                                    }}>
                                                        
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                                                <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#34495e" }}>
                                                                    {reply.answeredByName}
                                                                </span>
                                                                
                                                                {/* ROLES BADGES */}
                                                                 {isSeniorsReply && (
                                                                    <span style={{ fontSize: "10px", backgroundColor: "#f1c40f", color: "#1e272e", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" }}>
                                                                        Placed Senior
                                                                    </span>
                                                                )}
                                                                {isAdminReply && (
                                                                    <span style={{ fontSize: "10px", backgroundColor: "#6a1b9a", color: "#ffffff", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" }}>
                                                                        Admin / Coordinator
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span style={{ fontSize: "11px", color: "#95a5a6" }}>{reply.createdAt}</span>
                                                        </div>

                                                        <p style={{ margin: "0 0 10px 0", fontSize: "13.5px", color: "#2c3e50", lineHeight: "1.4" }}>
                                                            {reply.text}
                                                        </p>

                                                        {/* Reply upvote */}
                                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                            <button
                                                                onClick={() => handleReplyUpvote(q.id, rIdx)}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "4px",
                                                                    border: "none",
                                                                    background: "none",
                                                                    color: isUpvotedR ? "var(--primary-purple)" : "#7f8c8d",
                                                                    cursor: "pointer",
                                                                    fontSize: "12px",
                                                                    fontWeight: "600"
                                                                }}
                                                            >
                                                                Upvote Answer ({reply.upvotes ? reply.upvotes.length : 0})
                                                            </button>
                                                        </div>

                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{ padding: "10px 0", color: "#7f8c8d", fontSize: "13px", fontStyle: "italic" }}>
                                                No replies posted yet. Be the first to share guidance!
                                            </div>
                                        )}
                                    </div>

                                    {/* REPLY INPUT FIELD */}
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <input
                                            type="text"
                                            placeholder="Write helpful answer..."
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && e.target.value.trim() !== "") {
                                                    handleAddReply(q.id, e.target.value);
                                                    e.target.value = "";
                                                }
                                            }}
                                            className="custom-input"
                                            style={{ flex: 1, padding: "8px 15px", fontSize: "13px" }}
                                        />
                                        <button 
                                            onClick={(e) => {
                                                const input = e.currentTarget.previousSibling;
                                                handleAddReply(q.id, input.value);
                                                input.value = "";
                                            }}
                                            className="primary-btn" 
                                            style={{ padding: "8px 15px", fontSize: "13px" }}
                                        >
                                            Reply
                                        </button>
                                    </div>

                                </div>
                            );
                        })
                    ) : (
                        <div className="glass-card" style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
                            No questions found in this category yet.
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default StudentExperience;