import React, { useState, useEffect } from "react";

function Profile() {
    const userEmail = localStorage.getItem("email") || "student@rajalakshmi.edu.in";
    
    // User profile state
    const [profile, setProfile] = useState({
        email: userEmail,
        fullName: "",
        phone: "",
        dept: "",
        year: "",
        profilePic: "",
        cgpa: 0.0,
        backlogs: 0,
        skills: [],
        certifications: [],
        resume: "",
        linkedinUrl: "",
        githubUrl: "",
        leetcodeUrl: "",
        role: "STUDENT"
    });

    const [isEditing, setIsEditing] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [certInput, setCertInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Load Profile from DB on mount
    useEffect(() => {
        fetch(`http://localhost:8080/users/${userEmail}`)
            .then(res => {
                if (!res.ok) throw new Error("Profile not found");
                return res.json();
            })
            .then(data => {
                setProfile({
                    ...data,
                    skills: data.skills || [],
                    certifications: data.certifications || [],
                    cgpa: data.cgpa || 0.0,
                    backlogs: data.backlogs || 0
                });
                
                // Store updated fields in localStorage for sidebar/layout
                if (data.fullName) localStorage.setItem("fullName", data.fullName);
                if (data.profilePic) localStorage.setItem("profilePic", data.profilePic);
                if (data.dept) localStorage.setItem("dept", data.dept);
                if (data.year) localStorage.setItem("year", data.year);
                if (data.role) localStorage.setItem("role", data.role);
                
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading profile:", err);
                setLoading(false);
            });
    }, [userEmail]);

    // Handle inputs changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle Photo upload (Base64 conversion)
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({
                ...prev,
                profilePic: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    // Handle Resume upload (Base64 conversion)
    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // limit to 2MB for base64 storage in mongo
        if (file.size > 2 * 1024 * 1024) {
            alert("File too large. Maximum size is 2MB.");
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({
                ...prev,
                resume: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    // Handle adding skills
    const addSkill = () => {
        if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
            setProfile(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput("");
        }
    };

    // Handle removing skill
    const removeSkill = (index) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    // Handle adding certifications
    const addCert = () => {
        if (certInput.trim() && !profile.certifications.includes(certInput.trim())) {
            setProfile(prev => ({
                ...prev,
                certifications: [...prev.certifications, certInput.trim()]
            }));
            setCertInput("");
        }
    };

    // Handle removing certification
    const removeCert = (index) => {
        setProfile(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    // Save changes to DB
    const handleSave = () => {
        setLoading(true);
        fetch(`http://localhost:8080/users/${userEmail}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profile)
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to save profile");
            return res.json();
        })
        .then(data => {
            setProfile(data);
            localStorage.setItem("fullName", data.fullName || "");
            localStorage.setItem("profilePic", data.profilePic || "");
            localStorage.setItem("dept", data.dept || "");
            localStorage.setItem("year", data.year || "");
            setIsEditing(false);
            setMessage("✅ Profile saved successfully!");
            setLoading(false);
            setTimeout(() => setMessage(""), 3000);
        })
        .catch(err => {
            console.error("Save error:", err);
            setMessage("❌ Failed to save changes.");
            setLoading(false);
            setTimeout(() => setMessage(""), 3000);
        });
    };

    // Calculate Eligibility Status
    const isCgpaEligible = profile.cgpa >= 6.0;
    const isBacklogEligible = profile.backlogs === 0;
    const isEligible = isCgpaEligible && isBacklogEligible;

    // Helper to download resume base64
    const downloadResume = () => {
        if (!profile.resume) return;
        const link = document.createElement("a");
        link.href = profile.resume;
        link.download = `${profile.fullName || "student"}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading && profile.fullName === "") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
                <div style={{
                    width: "50px",
                    height: "50px",
                    border: "5px solid rgba(106, 27, 154, 0.2)",
                    borderTop: "5px solid #6a1b9a",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            
            {/* ALERT NOTIFICATION */}
            {message && (
                <div style={{
                    padding: "15px",
                    borderRadius: "10px",
                    backgroundColor: message.includes("✅") ? "rgba(46, 204, 113, 0.15)" : "rgba(231, 76, 60, 0.15)",
                    border: `1px solid ${message.includes("✅") ? "#2ecc71" : "#e74c3c"}`,
                    color: message.includes("✅") ? "#27ae60" : "#c0392b",
                    fontWeight: "600",
                    marginBottom: "20px",
                    animation: "fadeIn 0.3s ease"
                }}>
                    {message}
                </div>
            )}

            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "30px",
                alignItems: "start"
            }}>
                
                {/* LEFT CARD - AVATAR & ELIGIBILITY */}
                <div className="glass-card" style={{ textAlign: "center", padding: "30px 20px" }}>
                    
                    {/* PHOTO CONTAINER */}
                    <div style={{ position: "relative", width: "130px", height: "130px", margin: "0 auto 20px auto" }}>
                        {profile.profilePic ? (
                            <img
                                src={profile.profilePic}
                                alt="Avatar"
                                style={{
                                    width: "130px",
                                    height: "130px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "3px solid #6a1b9a",
                                    boxShadow: "0 6px 15px rgba(106, 27, 154, 0.15)"
                                }}
                            />
                        ) : (
                            <div style={{
                                width: "130px",
                                height: "130px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(106, 27, 154, 0.1)",
                                color: "#6a1b9a",
                                fontSize: "50px",
                                fontWeight: "800",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "3px dashed rgba(106, 27, 154, 0.3)"
                            }}>
                                {profile.fullName ? profile.fullName[0].toUpperCase() : "S"}
                            </div>
                        )}
                        
                        {/* PHOTO UPLOAD TOGGLE (ONLY IN EDIT MODE) */}
                        {isEditing && (
                            <label style={{
                                position: "absolute",
                                bottom: "0",
                                right: "0",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#6a1b9a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                border: "2px solid #ffffff",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                            }}>
                                📷
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    style={{ display: "none" }}
                                />
                            </label>
                        )}
                    </div>

                    <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", fontWeight: "700" }}>{profile.fullName || "Student Profile"}</h3>
                    <p style={{ margin: "0 0 20px 0", color: "#7f8c8d", fontSize: "14px" }}>🎓 {profile.dept || "Department Not Set"} | Year {profile.year || "N/A"}</p>

                    {/* ELIGIBILITY STATUS CARD */}
                    <div style={{
                        marginTop: "25px",
                        padding: "20px",
                        borderRadius: "15px",
                        backgroundColor: isEligible ? "rgba(46, 204, 113, 0.1)" : "rgba(231, 76, 60, 0.1)",
                        border: `1px solid ${isEligible ? "rgba(46, 204, 113, 0.2)" : "rgba(231, 76, 60, 0.2)"}`,
                        textAlign: "left"
                    }}>
                        <h4 style={{
                            margin: "0 0 10px 0",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: isEligible ? "#27ae60" : "#c0392b",
                            textTransform: "uppercase"
                        }}>
                            Drive Eligibility
                        </h4>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                            <span style={{ fontSize: "22px" }}>{isEligible ? "🟩" : "🟥"}</span>
                            <span style={{ fontSize: "15px", fontWeight: "700", color: isEligible ? "#27ae60" : "#c0392b" }}>
                                {isEligible ? "Eligible for Drives" : "Not Eligible"}
                            </span>
                        </div>

                        {/* Verification Criteria */}
                        <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#7f8c8d" }}>CGPA Limit (>= 6.0):</span>
                                <span style={{ fontWeight: "700", color: isCgpaEligible ? "#2ecc71" : "#e74c3c" }}>
                                    {profile.cgpa.toFixed(2)} {isCgpaEligible ? "✓" : "✗"}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#7f8c8d" }}>Active Backlogs (= 0):</span>
                                <span style={{ fontWeight: "700", color: isBacklogEligible ? "#2ecc71" : "#e74c3c" }}>
                                    {profile.backlogs} {isBacklogEligible ? "✓" : "✗"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT CARD - DETAILED PROFILE TABS */}
                <div className="glass-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "15px" }}>
                        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>Profile Details</h3>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="primary-btn" style={{ padding: "8px 20px", fontSize: "13px" }}>
                                Edit Profile ✏️
                            </button>
                        ) : (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={() => setIsEditing(false)} className="primary-btn" style={{ padding: "8px 20px", fontSize: "13px", background: "#95a5a6" }}>
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="accent-btn" style={{ padding: "8px 20px", fontSize: "13px" }}>
                                    Save Changes 💾
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SECTION 1: PERSONAL INFORMATION */}
                    <div style={{ marginBottom: "30px" }}>
                        <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#6a1b9a", marginBottom: "15px" }}>📞 Personal Information</h4>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="custom-input"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>College Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    disabled={true} // Email is key and cannot be edited
                                    className="custom-input"
                                    style={{ backgroundColor: "#f1f3f5" }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Department</label>
                                <select
                                    name="dept"
                                    value={profile.dept}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="custom-input"
                                >
                                    <option value="">Select Department</option>
                                    <option value="CSE">CSE</option>
                                    <option value="IT">IT</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="AIML">AIML</option>
                                    <option value="AIDS">AIDS</option>
                                    <option value="MECH">MECH</option>
                                    <option value="CIVIL">CIVIL</option>
                                    <option value="BIOTECH">BIOTECH</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Year of Study</label>
                                <select
                                    name="year"
                                    value={profile.year}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="custom-input"
                                >
                                    <option value="">Select Year</option>
                                    <option value="I">I Year</option>
                                    <option value="II">II Year</option>
                                    <option value="III">III Year</option>
                                    <option value="IV">IV Year</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="custom-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: ACADEMIC DETAILS */}
                    <div style={{ marginBottom: "30px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "20px" }}>
                        <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#6a1b9a", marginBottom: "15px" }}>📝 Academic Information</h4>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Current CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="cgpa"
                                    value={profile.cgpa}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="custom-input"
                                    min="0"
                                    max="10"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Active Backlogs</label>
                                <input
                                    type="number"
                                    name="backlogs"
                                    value={profile.backlogs}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="custom-input"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* SKILLS TAGS */}
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Skills</label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" }}>
                                {profile.skills.map((skill, index) => (
                                    <span key={index} className="tag" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        {skill}
                                        {isEditing && (
                                            <button 
                                                onClick={() => removeSkill(index)}
                                                style={{ border: "none", background: "none", color: "#4a148c", cursor: "pointer", padding: "0 2px", fontWeight: "700" }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </span>
                                ))}
                                {profile.skills.length === 0 && <span style={{ fontSize: "13px", color: "#95a5a6", italic: "true" }}>No skills added.</span>}
                            </div>
                            {isEditing && (
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <input
                                        type="text"
                                        placeholder="Add skill (e.g. Java, React)"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                                        className="custom-input"
                                        style={{ maxWidth: "250px" }}
                                    />
                                    <button onClick={addSkill} className="primary-btn" style={{ padding: "8px 15px", fontSize: "13px" }}>Add</button>
                                </div>
                            )}
                        </div>

                        {/* CERTIFICATIONS */}
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Certifications</label>
                            <ul style={{ paddingLeft: "20px", margin: "0 0 10px 0", fontSize: "14px", color: "#34495e" }}>
                                {profile.certifications.map((cert, index) => (
                                    <li key={index} style={{ marginBottom: "5px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "400px" }}>
                                            <span>🥇 {cert}</span>
                                            {isEditing && (
                                                <button 
                                                    onClick={() => removeCert(index)}
                                                    style={{ border: "none", background: "none", color: "#e74c3c", cursor: "pointer", fontWeight: "700" }}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {profile.certifications.length === 0 && <span style={{ fontSize: "13px", color: "#95a5a6" }}>No certifications listed.</span>}
                            </ul>
                            {isEditing && (
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <input
                                        type="text"
                                        placeholder="Add Certification (e.g. AWS Cloud Practitioner)"
                                        value={certInput}
                                        onChange={(e) => setCertInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCert(); } }}
                                        className="custom-input"
                                        style={{ maxWidth: "350px" }}
                                    />
                                    <button onClick={addCert} className="primary-btn" style={{ padding: "8px 15px", fontSize: "13px" }}>Add</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION 3: PLACEMENT PREPARATION (LINKS & RESUME) */}
                    <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "20px" }}>
                        <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#6a1b9a", marginBottom: "15px" }}>🚀 Placement Preparation</h4>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>LinkedIn Profile Link</label>
                                <input
                                    type="url"
                                    name="linkedinUrl"
                                    value={profile.linkedinUrl}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="https://linkedin.com/in/username"
                                    className="custom-input"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>GitHub Profile Link</label>
                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={profile.githubUrl}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="https://github.com/username"
                                    className="custom-input"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>LeetCode Profile Link</label>
                                <input
                                    type="url"
                                    name="leetcodeUrl"
                                    value={profile.leetcodeUrl}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="https://leetcode.com/username"
                                    className="custom-input"
                                />
                            </div>
                            
                            {/* RESUME UPLOAD SECTION */}
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Resume (PDF Format)</label>
                                {isEditing ? (
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleResumeUpload}
                                        className="custom-input"
                                    />
                                ) : (
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        {profile.resume ? (
                                            <>
                                                <span style={{ fontSize: "14px", color: "#27ae60", fontWeight: "600" }}>📄 Resume Uploaded</span>
                                                <button onClick={downloadResume} className="primary-btn" style={{ padding: "6px 12px", fontSize: "12px", background: "#27ae60" }}>
                                                    Download Resume ⬇️
                                                </button>
                                            </>
                                        ) : (
                                            <span style={{ fontSize: "14px", color: "#e74c3c", fontWeight: "600" }}>❌ No resume uploaded. Edit profile to upload.</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;