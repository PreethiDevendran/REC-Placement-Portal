import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "./config";

function AIChatbot({ onClose }) {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! I am your **REC Placement Assistant**.\n\nAsk me anything regarding placement drives, salary packages, eligibility criteria, student interview reviews, or general statistics!",
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestions = [
        "What is the eligibility for TCS?",
        "What package does Accenture offer?",
        "Show previous student experiences for CTS",
        "How many students were placed in Infosys?",
        "Which companies visited last year?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (messageText) => {
        if (!messageText.trim()) return;

        const timestamp = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        // Add User Message
        setMessages(prev => [...prev, { sender: "user", text: messageText, time: timestamp }]);
        setInput("");
        setIsTyping(true);

        try {
            // Query Chatbot Backend API
            const res = await fetch(`${API_BASE_URL}/chatbot/ask`, {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageText })
            });
            const data = await res.json();

            // Add Bot Response
            setMessages(prev => [...prev, {
                sender: "bot",
                text: data.reply,
                time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            }]);
        } catch (err) {
            console.error("Chatbot query failed:", err);
            setMessages(prev => [...prev, {
                sender: "bot",
                text: "Server connection error. Please make sure the backend is active.",
                time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const formatMessageText = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} style={{ color: "var(--primary-purple-dark)" }}>{part.slice(2, -2)}</strong>;
            }
            if (part.includes("\n")) {
                return part.split("\n").map((line, j) => (
                    <React.Fragment key={`${i}-${j}`}>
                        {line}
                        <br />
                    </React.Fragment>
                ));
            }
            return part;
        });
    };

    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(149, 117, 205, 0.1)"
        }}>
            
            {/* CHAT HEADER */}
            <div style={{
                background: "linear-gradient(135deg, var(--primary-purple-dark), var(--primary-purple))",
                color: "#ffffff",
                padding: "15px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px"
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "14px", color: "#ffffff", fontWeight: "700", letterSpacing: "0.2px" }}>REC Placement Bot</h3>
                        <span style={{ fontSize: "10px", color: "var(--accent-yellow-dark)", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#2ecc71", display: "inline-block" }} />
                            Online
                        </span>
                    </div>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "none",
                            color: "#ffffff",
                            fontSize: "22px",
                            cursor: "pointer",
                            padding: "0 5px",
                            display: "flex",
                            alignItems: "center",
                            outline: "none"
                        }}
                    >
                        ×
                    </button>
                )}
            </div>

            {/* CHAT BUBBLES CONTAINER */}
            <div style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                backgroundColor: "#fcfdff",
                display: "flex",
                flexDirection: "column",
                gap: "15px"
            }}>
                {messages.map((msg, index) => {
                    const isBot = msg.sender === "bot";
                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignSelf: isBot ? "flex-start" : "flex-end",
                                maxWidth: "85%"
                            }}
                        >
                            <div style={{
                                padding: "10px 14px",
                                borderRadius: isBot ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
                                backgroundColor: isBot ? "#ffffff" : "var(--primary-purple)",
                                color: isBot ? "var(--text-dark)" : "#ffffff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                                border: isBot ? "1px solid rgba(149, 117, 205, 0.08)" : "none",
                                fontSize: "13px",
                                lineHeight: "1.45",
                                wordBreak: "break-word"
                            }}>
                                {isBot ? formatMessageText(msg.text) : msg.text}
                            </div>
                            <span style={{
                                fontSize: "9px",
                                color: "#95a5a6",
                                alignSelf: isBot ? "flex-start" : "flex-end",
                                marginTop: "3px",
                                padding: "0 4px"
                            }}>
                                {msg.time}
                            </span>
                        </div>
                    );
                })}

                {/* BOT TYPING INDICATOR */}
                {isTyping && (
                    <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "5px", backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: "14px 14px 14px 4px", border: "1px solid rgba(149, 117, 205, 0.08)" }}>
                        <div style={{ width: "6px", height: "6px", backgroundColor: "var(--primary-purple)", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both" }} />
                        <div style={{ width: "6px", height: "6px", backgroundColor: "var(--primary-purple)", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both 0.2s" }} />
                        <div style={{ width: "6px", height: "6px", backgroundColor: "var(--primary-purple)", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both 0.4s" }} />
                        <style>{`
                            @keyframes bounce {
                                0%, 80%, 100% { transform: scale(0); }
                                40% { transform: scale(1.0); }
                            }
                        `}</style>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* SUGGESTION CHIPS BAR */}
            <div style={{
                padding: "10px 15px 5px 15px",
                backgroundColor: "#fcfdff",
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                borderTop: "1px solid rgba(149, 117, 205, 0.05)",
                whiteSpace: "nowrap",
                scrollbarWidth: "none" // Firefox
            }}>
                {suggestions.map((sug, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "15px",
                            border: "1px solid rgba(149, 117, 205, 0.2)",
                            background: "#ffffff",
                            color: "var(--primary-purple-dark)",
                            cursor: "pointer",
                            fontSize: "11.5px",
                            fontWeight: "600",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--primary-purple-glow)";
                            e.currentTarget.style.borderColor = "var(--primary-purple)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff";
                            e.currentTarget.style.borderColor = "rgba(149, 117, 205, 0.2)";
                        }}
                    >
                        {sug}
                    </button>
                ))}
            </div>

            {/* CHAT INPUT AREA */}
            <div style={{
                padding: "15px 20px",
                backgroundColor: "#ffffff",
                borderTop: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                gap: "10px",
                alignItems: "center"
            }}>
                <input
                    type="text"
                    placeholder="Ask TCS criteria, Google package..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSend(input); }}
                    className="custom-input"
                    style={{ flex: 1, padding: "8px 12px", fontSize: "13px" }}
                />
                <button
                    onClick={() => handleSend(input)}
                    className="primary-btn"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", padding: 0, borderRadius: "10px", flexShrink: 0 }}
                >
                    ➔
                </button>
            </div>

        </div>
    );
}

export default AIChatbot;
