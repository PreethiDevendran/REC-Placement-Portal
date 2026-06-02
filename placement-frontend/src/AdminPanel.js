import React, { useState, useEffect } from "react";

function AdminPanel() {
    const [activeTab, setActiveTab] = useState("companies");

    // DB lists
    const [companies, setCompanies] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form inputs
    const [companyForm, setCompanyForm] = useState({ id: "", name: "", role: "", ctc: "", eligibility: "", date: "", logo: "" });
    const [statsForm, setStatsForm] = useState({ id: "", year: "2026", dept: "CSE", companyName: "", placedCount: 0, highestPackage: 0.0, averagePackage: 0.0, totalOffers: 0 });
    const [announcementForm, setAnnouncementForm] = useState({ title: "", message: "", type: "INFO" });

    // Status message
    const [statusMsg, setStatusMsg] = useState("");

    // Load tab datasets
    const loadTabDetails = async () => {
        setLoading(true);
        try {
            if (activeTab === "companies") {
                const res = await fetch("http://localhost:8080/companies");
                setCompanies(await res.json());
            } else if (activeTab === "statistics") {
                const res = await fetch("http://localhost:8080/statistics");
                setStatistics(await res.json());
            } else if (activeTab === "experiences") {
                const res = await fetch("http://localhost:8080/experiences");
                setExperiences(await res.json());
            } else if (activeTab === "users") {
                const res = await fetch("http://localhost:8080/users");
                setUsers(await res.json());
            } else if (activeTab === "questions") {
                const res = await fetch("http://localhost:8080/questions");
                setQuestions(await res.json());
            } else if (activeTab === "notifications") {
                const res = await fetch("http://localhost:8080/notifications");
                setNotifications(await res.json());
            }
        } catch (err) {
            console.error("Failed to load admin tab data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTabDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const showMsg = (msg) => {
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(""), 3000);
    };

    // --- LOGO FILE ENCODING ---
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setCompanyForm(prev => ({ ...prev, logo: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    // --- COMPANIES CRUD ---
    const handleCompanySubmit = (e) => {
        e.preventDefault();
        const url = companyForm.id 
            ? `http://localhost:8080/companies/${companyForm.id}` 
            : "http://localhost:8080/companies";
        const method = companyForm.id ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(companyForm)
        })
        .then(res => res.json())
        .then(() => {
            setCompanyForm({ id: "", name: "", role: "", ctc: "", eligibility: "", date: "", logo: "" });
            loadTabDetails();
            showMsg("✅ Company saved successfully!");
        })
        .catch(() => showMsg("❌ Failed to save company."));
    };

    const handleCompanyEdit = (c) => {
        setCompanyForm(c);
    };

    const handleCompanyDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this company?")) return;
        fetch(`http://localhost:8080/companies/${id}`, { method: "DELETE" })
        .then(() => {
            loadTabDetails();
            showMsg("🗑️ Company deleted.");
        });
    };

    // --- STATISTICS CRUD ---
    const handleStatsSubmit = (e) => {
        e.preventDefault();
        const url = statsForm.id 
            ? `http://localhost:8080/statistics/${statsForm.id}` 
            : "http://localhost:8080/statistics";
        const method = statsForm.id ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(statsForm)
        })
        .then(res => res.json())
        .then(() => {
            setStatsForm({ id: "", year: "2026", dept: "CSE", companyName: "", placedCount: 0, highestPackage: 0.0, averagePackage: 0.0, totalOffers: 0 });
            loadTabDetails();
            showMsg("✅ Statistics updated!");
        })
        .catch(() => showMsg("❌ Failed to update stats."));
    };

    const handleStatsEdit = (s) => {
        setStatsForm(s);
    };

    const handleStatsDelete = (id) => {
        if (!window.confirm("Are you sure?")) return;
        fetch(`http://localhost:8080/statistics/${id}`, { method: "DELETE" })
        .then(() => {
            loadTabDetails();
            showMsg("🗑️ Stats deleted.");
        });
    };

    // --- ANNOUNCEMENTS (NOTIFICATIONS) ---
    const handleAnnouncementSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(announcementForm)
        })
        .then(res => res.json())
        .then(() => {
            setAnnouncementForm({ title: "", message: "", type: "INFO" });
            loadTabDetails();
            showMsg("📢 Announcement broadcasted!");
        });
    };

    const handleNotificationDelete = (id) => {
        fetch(`http://localhost:8080/notifications/${id}`, { method: "DELETE" })
        .then(() => {
            loadTabDetails();
            showMsg("🗑️ Announcement removed.");
        });
    };

    // --- MODERATE EXPERIENCES ---
    const handleDeleteExperience = (id) => {
        if (!window.confirm("Delete this student review?")) return;
        fetch(`http://localhost:8080/experiences/${id}`, { method: "DELETE" })
        .then(() => {
            loadTabDetails();
            showMsg("🗑️ Review deleted.");
        });
    };

    // --- MODERATE DISCUSSIONS ---
    const handleDeleteQuestion = (id) => {
        if (!window.confirm("Delete this discussion thread?")) return;
        fetch(`http://localhost:8080/questions/${id}`, { method: "DELETE" })
        .then(() => {
            loadTabDetails();
            showMsg("🗑️ Forum post deleted.");
        });
    };

    // --- MANAGE USER ROLES ---
    const handleUpgradeRole = (email, newRole) => {
        fetch(`http://localhost:8080/users/${email}/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRole)
        })
        .then(() => {
            loadTabDetails();
            showMsg(`✅ User role updated to ${newRole}!`);
        });
    };

    return (
        <div className="animate-fade-in-up">
            
            {/* ALERT BOX */}
            {statusMsg && (
                <div style={{
                    padding: "15px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(106, 27, 154, 0.08)",
                    border: "1px solid var(--primary-purple)",
                    color: "var(--primary-purple-dark)",
                    fontWeight: "600",
                    marginBottom: "20px"
                }}>
                    {statusMsg}
                </div>
            )}

            {/* TAB SELECTOR HEADER */}
            <div style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "35px",
                borderBottom: "2px solid rgba(106,27,154,0.1)",
                paddingBottom: "10px"
            }}>
                {[
                    { id: "companies", label: "Drive Companies", icon: "" },
                    { id: "statistics", label: "Placements Stats", icon: "" },
                    { id: "experiences", label: "Student Reviews", icon: "" },
                    { id: "questions", label: "Discussions Forum", icon: "" },
                    { id: "users", label: "Student Directory", icon: "" },
                    { id: "notifications", label: "Announcements", icon: "" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: "12px 20px",
                            border: "none",
                            background: activeTab === tab.id ? "linear-gradient(135deg, #4a148c, #6a1b9a)" : "transparent",
                            color: activeTab === tab.id ? "#ffffff" : "#4a148c",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600",
                            borderRadius: "10px 10px 0 0",
                            transition: "all 0.2s"
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENTS */}
            <div style={{ minHeight: "450px" }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                        <div style={{ width: "30px", height: "30px", border: "3px solid rgba(106, 27, 154, 0.2)", borderTop: "3px solid #6a1b9a", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    </div>
                ) : (
                    <>
                {/* 1. MANAGE COMPANIES */}
                {activeTab === "companies" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "30px", alignItems: "start" }}>
                        {/* Company Add Form */}
                        <div className="glass-card">
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>
                                {companyForm.id ? "Edit Company Details" : "Add Drive Company"}
                            </h3>
                            <form onSubmit={handleCompanySubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <input type="text" placeholder="Company Name" value={companyForm.name} onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})} className="custom-input" required />
                                <input type="text" placeholder="Job Role (e.g. Software Engineer)" value={companyForm.role} onChange={(e) => setCompanyForm({...companyForm, role: e.target.value})} className="custom-input" required />
                                <input type="text" placeholder="Salary Package (e.g. 12 LPA)" value={companyForm.ctc} onChange={(e) => setCompanyForm({...companyForm, ctc: e.target.value})} className="custom-input" required />
                                <input type="text" placeholder="Eligibility Criteria" value={companyForm.eligibility} onChange={(e) => setCompanyForm({...companyForm, eligibility: e.target.value})} className="custom-input" required />
                                <input type="date" value={companyForm.date} onChange={(e) => setCompanyForm({...companyForm, date: e.target.value})} className="custom-input" required />
                                
                                <div>
                                    <label style={{ fontSize: "12.5px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>Company Logo</label>
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="custom-input" />
                                </div>

                                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                    {companyForm.id && (
                                        <button type="button" onClick={() => setCompanyForm({ id: "", name: "", role: "", ctc: "", eligibility: "", date: "", logo: "" })} className="primary-btn" style={{ background: "#95a5a6", flex: 1 }}>Clear</button>
                                    )}
                                    <button type="submit" className="primary-btn" style={{ flex: 2 }}>Save Company</button>
                                </div>
                            </form>
                        </div>

                        {/* Company List */}
                        <div className="glass-card">
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Active Recruiters</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto" }}>
                                {companies.map(c => (
                                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 15px", border: "1px solid var(--border-light)", borderRadius: "10px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "40px", height: "40px", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {c.logo ? <img src={c.logo} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : <span>{c.name[0]}</span>}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: "15px" }}>{c.name}</h4>
                                                <span style={{ fontSize: "12px", color: "#7f8c8d" }}>{c.role} | {c.ctc}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button onClick={() => handleCompanyEdit(c)} className="primary-btn" style={{ padding: "6px 12px", fontSize: "12px", background: "#3498db" }}>Edit</button>
                                            <button onClick={() => handleCompanyDelete(c.id)} className="primary-btn" style={{ padding: "6px 12px", fontSize: "12px", background: "#ef4444" }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. MANAGE PLACEMENT STATS */}
                {activeTab === "statistics" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "30px", alignItems: "start" }}>
                        <div className="glass-card">
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>
                                {statsForm.id ? "Edit Stats Record" : "Add Placed Result"}
                            </h3>
                            <form onSubmit={handleStatsSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <input type="text" placeholder="Company Name (e.g. TCS)" value={statsForm.companyName} onChange={(e) => setStatsForm({...statsForm, companyName: e.target.value})} className="custom-input" required />
                                
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <div>
                                        <label style={{ fontSize: "11px", fontWeight: "600", color: "#7f8c8d" }}>Batch Year</label>
                                        <select value={statsForm.year} onChange={(e) => setStatsForm({...statsForm, year: e.target.value})} className="custom-input">
                                            <option value="2026">2026</option>
                                            <option value="2025">2025</option>
                                            <option value="2024">2024</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: "11px", fontWeight: "600", color: "#7f8c8d" }}>Department</label>
                                        <select value={statsForm.dept} onChange={(e) => setStatsForm({...statsForm, dept: e.target.value})} className="custom-input">
                                            <option value="CSE">CSE</option>
                                            <option value="IT">IT</option>
                                            <option value="ECE">ECE</option>
                                            <option value="EEE">EEE</option>
                                            <option value="AIML">AIML</option>
                                            <option value="AIDS">AIDS</option>
                                        </select>
                                    </div>
                                </div>

                                <input type="number" placeholder="Number Placed" value={statsForm.placedCount} onChange={(e) => setStatsForm({...statsForm, placedCount: parseInt(e.target.value)})} className="custom-input" required />
                                <input type="number" step="0.1" placeholder="Highest CTC (LPA)" value={statsForm.highestPackage} onChange={(e) => setStatsForm({...statsForm, highestPackage: parseFloat(e.target.value)})} className="custom-input" required />
                                <input type="number" step="0.1" placeholder="Average CTC (LPA)" value={statsForm.averagePackage} onChange={(e) => setStatsForm({...statsForm, averagePackage: parseFloat(e.target.value)})} className="custom-input" required />
                                <input type="number" placeholder="Total Offers" value={statsForm.totalOffers} onChange={(e) => setStatsForm({...statsForm, totalOffers: parseInt(e.target.value)})} className="custom-input" required />

                                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                    {statsForm.id && (
                                        <button type="button" onClick={() => setStatsForm({ id: "", year: "2026", dept: "CSE", companyName: "", placedCount: 0, highestPackage: 0.0, averagePackage: 0.0, totalOffers: 0 })} className="primary-btn" style={{ background: "#95a5a6", flex: 1 }}>Clear</button>
                                    )}
                                    <button type="submit" className="primary-btn" style={{ flex: 2 }}>Save Result</button>
                                </div>
                            </form>
                        </div>

                        <div className="glass-card">
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Registered Stats Records</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto" }}>
                                {statistics.map(s => (
                                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 15px", border: "1px solid var(--border-light)", borderRadius: "10px" }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: "15px" }}>{s.companyName} ({s.year} - {s.dept})</h4>
                                            <span style={{ fontSize: "12px", color: "#7f8c8d" }}>Placed: {s.placedCount} | Max: {s.highestPackage}LPA | Offers: {s.totalOffers}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button onClick={() => handleStatsEdit(s)} className="primary-btn" style={{ padding: "6px 12px", fontSize: "12px", background: "#3498db" }}>Edit</button>
                                            <button onClick={() => handleStatsDelete(s.id)} className="primary-btn" style={{ padding: "6px 12px", fontSize: "12px", background: "#ef4444" }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. MODERATE STUDENT REVIEWS */}
                {activeTab === "experiences" && (
                    <div className="glass-card">
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Moderate Student Experiences</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {experiences.map(exp => (
                                <div key={exp.id} style={{ padding: "15px", border: "1px solid var(--border-light)", borderRadius: "12px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <div>
                                            <span style={{ fontWeight: "700" }}>{exp.studentName} ({exp.companyName})</span>
                                            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#7f8c8d" }}>Year: {exp.year} | {exp.studentEmail}</p>
                                        </div>
                                        <button onClick={() => handleDeleteExperience(exp.id)} className="primary-btn" style={{ padding: "6px 12px", fontSize: "12px", background: "#ef4444" }}>
                                            Delete Review
                                        </button>
                                    </div>
                                    <p style={{ margin: 0, fontSize: "13.5px", color: "#34495e" }}>{exp.experienceContent.slice(0, 200)}...</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. MODERATE DISCUSSIONS */}
                {activeTab === "questions" && (
                    <div className="glass-card">
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Moderate Q&A Forum</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {questions.map(q => (
                                <div key={q.id} style={{ padding: "15px", border: "1px solid var(--border-light)", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <span style={{ fontWeight: "700", fontSize: "15px", color: "var(--primary-purple-dark)" }}>{q.question}</span>
                                        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#7f8c8d" }}>Category: {q.category} | Replies: {q.replies ? q.replies.length : 0}</p>
                                    </div>
                                    <button onClick={() => handleDeleteQuestion(q.id)} className="primary-btn" style={{ padding: "6px 12px", fontSize: "12px", background: "#ef4444" }}>
                                        Delete Thread
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. STUDENT DIRECTORY (ROLES) */}
                {activeTab === "users" && (
                    <div className="glass-card">
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Student Directory</h3>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                <thead>
                                    <tr style={{ textAlign: "left", borderBottom: "2px solid rgba(106,27,154,0.1)", color: "var(--primary-purple-dark)" }}>
                                        <th style={{ padding: "12px" }}>Full Name</th>
                                        <th style={{ padding: "12px" }}>Email</th>
                                        <th style={{ padding: "12px" }}>Dept/Year</th>
                                        <th style={{ padding: "12px" }}>Role</th>
                                        <th style={{ padding: "12px" }}>Modify Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id || u.email} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                                            <td style={{ padding: "12px", fontWeight: "600" }}>{u.fullName}</td>
                                            <td style={{ padding: "12px" }}>{u.email}</td>
                                            <td style={{ padding: "12px" }}>{u.dept} / {u.year}</td>
                                            <td style={{ padding: "12px" }}>
                                                <span style={{
                                                    fontSize: "11px",
                                                    fontWeight: "700",
                                                    padding: "4px 8px",
                                                    borderRadius: "10px",
                                                    backgroundColor: u.role === "ADMIN" ? "var(--primary-purple-glow)" : (u.role === "PLACED_STUDENT" ? "rgba(241,196,15,0.15)" : "#f1f3f5"),
                                                    color: u.role === "ADMIN" ? "var(--primary-purple-dark)" : (u.role === "PLACED_STUDENT" ? "#b7950b" : "#7f8c8d")
                                                }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleUpgradeRole(u.email, e.target.value)}
                                                    style={{ padding: "5px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.1)" }}
                                                >
                                                    <option value="STUDENT">Student</option>
                                                    <option value="PLACED_STUDENT">Placed Student</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 6. ANNOUNCEMENTS / NOTIFICATIONS */}
                {activeTab === "notifications" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "30px", alignItems: "start" }}>
                        <div className="glass-card">
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Post Dashboard Announcement</h3>
                            <form onSubmit={handleAnnouncementSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <input type="text" placeholder="Title (e.g. TCS drive scheduled)" value={announcementForm.title} onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} className="custom-input" required />
                                <textarea placeholder="Message content..." value={announcementForm.message} onChange={(e) => setAnnouncementForm({...announcementForm, message: e.target.value})} className="custom-input" style={{ height: "100px", fontFamily: "inherit" }} required />
                                
                                <select value={announcementForm.type} onChange={(e) => setAnnouncementForm({...announcementForm, type: e.target.value})} className="custom-input">
                                    <option value="INFO">Information Alert</option>
                                    <option value="DRIVE">Drive Broadcast</option>
                                    <option value="DISCUSSION">Discussion Alert</option>
                                </select>

                                <button type="submit" className="primary-btn" style={{ marginTop: "10px" }}>Post Announcement</button>
                            </form>
                        </div>

                        <div className="glass-card">
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Broadcast History</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto" }}>
                                {notifications.map(note => (
                                    <div key={note.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 15px", border: "1px solid var(--border-light)", borderRadius: "10px" }}>
                                        <div style={{ flex: 1, marginRight: "15px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                                <span style={{ fontWeight: "700", fontSize: "14px" }}>{note.title}</span>
                                                <span style={{ fontSize: "11px", color: "#95a5a6" }}>{note.createdAt}</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: "12.5px", color: "#34495e" }}>{note.message}</p>
                                        </div>
                                        <button onClick={() => handleNotificationDelete(note.id)} className="primary-btn" style={{ padding: "6px 12px", fontSize: "12px", background: "#ef4444", flexShrink: 0 }}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                    </>
                )}

            </div>

        </div>
    );
}

export default AdminPanel;
