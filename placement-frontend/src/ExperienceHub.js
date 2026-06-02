import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

function ExperienceHub() {
    const userEmail = localStorage.getItem("email") || "";
    const userName = localStorage.getItem("fullName") || "";
    const userRole = localStorage.getItem("role") || "STUDENT";
    const userDept = localStorage.getItem("dept") || "";

    const [experiences, setExperiences] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [loading, setLoading] = useState(true);

    // Modal/Form State for Adding Experience
    const [showForm, setShowForm] = useState(false);
    const [newExp, setNewExp] = useState({
        companyName: "",
        studentName: userName,
        studentEmail: userEmail,
        dept: userDept,
        year: "2026",
        interviewProcess: "",
        prepTips: "",
        experienceContent: ""
    });

    const isAuthorizedToShare = userRole === "PLACED_STUDENT" || userRole === "ADMIN";

    // Load experiences and companies lists
    const loadExperiences = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/experiences`)

            .then(res => res.json())
            .then(data => {
                setExperiences(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load experiences:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadExperiences();

        // Load companies for dropdowns
        fetch(`${API_BASE_URL}/companies`)

            .then(res => res.json())
            .then(data => setCompanies(data))
            .catch(err => console.error("Failed to load companies:", err));
    }, []);

    // Filter Logic
    const filteredExperiences = experiences.filter(exp => {
        const matchesSearch = 
            exp.studentName.toLowerCase().includes(search.toLowerCase()) || 
            exp.experienceContent.toLowerCase().includes(search.toLowerCase()) ||
            exp.prepTips.toLowerCase().includes(search.toLowerCase());
            
        const matchesCompany = selectedCompany === "" || exp.companyName.toLowerCase() === selectedCompany.toLowerCase();
        const matchesYear = selectedYear === "" || exp.year === selectedYear;

        return matchesSearch && matchesCompany && matchesYear;
    });

    // Handle Upvoting / Helpful Like
    const handleLike = (id) => {
        if (!userEmail) return;
        
        fetch(`${API_BASE_URL}/experiences/${id}/like`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userEmail)
        })
        .then(res => res.json())
        .then(updatedExp => {
            // Update experiences state locally
            setExperiences(prev => prev.map(exp => exp.id === id ? updatedExp : exp));
        })
        .catch(err => console.error("Failed to toggle like:", err));
    };

    // Handle Form Inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExp(prev => ({ ...prev, [name]: value }));
    };

    // Submit new experience
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newExp.companyName || !newExp.experienceContent) {
            alert("Please fill in the Company Name and Experience Content.");
            return;
        }

        fetch(`${API_BASE_URL}/experiences`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExp)
        })
        .then(res => res.json())
        .then(() => {
            setShowForm(false);
            setNewExp({
                companyName: "",
                studentName: userName,
                studentEmail: userEmail,
                dept: userDept,
                year: "2026",
                interviewProcess: "",
                prepTips: "",
                experienceContent: ""
            });
            loadExperiences();
        })
        .catch(err => console.error("Failed to add experience:", err));
    };

    return (
        <div className="animate-fade-in-up">
            
            {/* HUB HEADER & CONTROLS */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
                flexWrap: "wrap",
                gap: "20px"
            }}>
                <div>
                    <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0 }}>Student Experience Hub</h2>
                    <p style={{ color: "#7f8c8d", fontSize: "14px", margin: "5px 0 0 0" }}>Learn from the seniors who have cracked top placement drives.</p>
                </div>
                
                {isAuthorizedToShare && (
                    <button onClick={() => setShowForm(true)} className="primary-btn" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        Share Your Experience
                    </button>
                )}
            </div>

            {/* SEARCH & FILTERS BAR */}
            <div className="glass-card" style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: "15px",
                padding: "20px",
                marginBottom: "35px"
            }}>
                <input
                    type="text"
                    placeholder="Search student name, preparation tips, keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="custom-input"
                />
                
                <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="custom-input"
                >
                    <option value="">Filter by Company</option>
                    {companies.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="custom-input"
                >
                    <option value="">Filter by Year</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>
            </div>

            {/* ADD EXPERIENCE FORM (IF OPENED) */}
            {showForm && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    zIndex: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px"
                }}>
                    <div className="glass-card animate-fade-in-up" style={{
                        maxWidth: "650px",
                        width: "100%",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        backgroundColor: "#ffffff",
                        padding: "30px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "15px", marginBottom: "20px" }}>
                            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Share Interview Experience</h3>
                            <button onClick={() => setShowForm(false)} style={{ border: "none", background: "none", fontSize: "24px", cursor: "pointer", color: "#e74c3c" }}>×</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Company Name</label>
                                    <select
                                        name="companyName"
                                        value={newExp.companyName}
                                        onChange={handleInputChange}
                                        className="custom-input"
                                        required
                                    >
                                        <option value="">Select Company</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Placement Year</label>
                                    <select
                                        name="year"
                                        value={newExp.year}
                                        onChange={handleInputChange}
                                        className="custom-input"
                                    >
                                        <option value="2026">2026</option>
                                        <option value="2025">2025</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Interview Process</label>
                                <textarea
                                    name="interviewProcess"
                                    placeholder="Briefly describe each round (e.g. Round 1: Aptitude Test, Round 2: Technical interview...)"
                                    value={newExp.interviewProcess}
                                    onChange={handleInputChange}
                                    className="custom-input"
                                    style={{ height: "80px", fontFamily: "inherit", resize: "vertical" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Preparation Tips</label>
                                <textarea
                                    name="prepTips"
                                    placeholder="What subjects or resources did you prepare? (e.g. DSA, SQL, GeeksforGeeks...)"
                                    value={newExp.prepTips}
                                    onChange={handleInputChange}
                                    className="custom-input"
                                    style={{ height: "80px", fontFamily: "inherit", resize: "vertical" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Experience Content</label>
                                <textarea
                                    name="experienceContent"
                                    placeholder="Share your detailed interview conversation, questions asked, and overall feel..."
                                    value={newExp.experienceContent}
                                    onChange={handleInputChange}
                                    className="custom-input"
                                    style={{ height: "140px", fontFamily: "inherit", resize: "vertical" }}
                                    required
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                                <button type="button" onClick={() => setShowForm(false)} className="primary-btn" style={{ background: "#95a5a6" }}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn">
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* LIST OF EXPERIENCES */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
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
                    {filteredExperiences.length > 0 ? (
                        filteredExperiences.map((exp) => {
                            const isLiked = exp.likes && exp.likes.contains ? exp.likes.contains(userEmail) : (exp.likes && exp.likes.includes(userEmail));
                            return (
                                <div key={exp.id} className="glass-card animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    
                                    {/* Author & Header */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "12px" }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#2c3e50" }}>
                                                {exp.studentName}
                                            </h3>
                                            <span style={{ fontSize: "12px", color: "#7f8c8d" }}>
                                                {exp.dept || "Student"} | Batch of {exp.year}
                                            </span>
                                        </div>
                                        <div style={{
                                            backgroundColor: "var(--primary-purple-glow)",
                                            color: "var(--primary-purple-dark)",
                                            padding: "6px 14px",
                                            borderRadius: "10px",
                                            fontWeight: "700",
                                            fontSize: "14px"
                                        }}>
                                            {exp.companyName}
                                        </div>
                                    </div>

                                    {/* Content areas */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {exp.interviewProcess && (
                                            <div>
                                                <span style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--primary-purple-dark)", textTransform: "uppercase", marginBottom: "4px" }}>
                                                    Interview Process
                                                </span>
                                                <p style={{ margin: 0, fontSize: "14px", color: "#34495e", lineHeight: "1.5" }}>
                                                    {exp.interviewProcess}
                                                </p>
                                            </div>
                                        )}

                                        {exp.prepTips && (
                                            <div>
                                                <span style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--primary-purple-dark)", textTransform: "uppercase", marginBottom: "4px" }}>
                                                    Preparation Tips
                                                </span>
                                                <p style={{ margin: 0, fontSize: "14px", color: "#34495e", lineHeight: "1.5" }}>
                                                    {exp.prepTips}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <span style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--primary-purple-dark)", textTransform: "uppercase", marginBottom: "4px" }}>
                                                Detailed Experience
                                            </span>
                                            <p style={{ margin: 0, fontSize: "14px", color: "#2c3e50", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                                                {exp.experienceContent}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Interaction bar */}
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        borderTop: "1px solid rgba(0,0,0,0.05)",
                                        paddingTop: "12px",
                                        marginTop: "5px"
                                    }}>
                                        <button
                                            onClick={() => handleLike(exp.id)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "6px 14px",
                                                borderRadius: "10px",
                                                border: "1px solid rgba(106, 27, 154, 0.2)",
                                                backgroundColor: isLiked ? "var(--primary-purple-glow)" : "transparent",
                                                color: isLiked ? "var(--primary-purple-dark)" : "#7f8c8d",
                                                cursor: "pointer",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={(e) => {
                                                if(!isLiked) e.currentTarget.style.backgroundColor = "rgba(106, 27, 154, 0.04)";
                                            }}
                                            onMouseLeave={(e) => {
                                                if(!isLiked) e.currentTarget.style.backgroundColor = "transparent";
                                            }}
                                        >
                                            {isLiked ? "Helpful" : "Mark as Helpful"} ({exp.likes ? exp.likes.length : 0})
                                        </button>
                                    </div>

                                </div>
                            );
                        })
                    ) : (
                        <div className="glass-card" style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
                            No student experiences found matching your filters.
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default ExperienceHub;
