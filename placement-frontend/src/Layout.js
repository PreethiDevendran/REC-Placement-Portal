import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import AIChatbot from "./AIChatbot";

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentRole, setCurrentRole] = useState("STUDENT");
    const [userName, setUserName] = useState("Student");
    const [profilePic, setProfilePic] = useState("");
    
    // Chatbot floating state
    const [chatOpen, setChatOpen] = useState(false);

    // Read session details
    useEffect(() => {
        const storedRole = localStorage.getItem("role") || "STUDENT";
        const email = localStorage.getItem("email") || "student@rajalakshmi.edu.in";
        const name = localStorage.getItem("fullName") || email.split("@")[0];
        const pic = localStorage.getItem("profilePic") || "";

        setCurrentRole(storedRole);
        setUserName(name);
        setProfilePic(pic);
    }, [location]);

    const handleRoleChange = (e) => {
        const nextRole = e.target.value;
        localStorage.setItem("role", nextRole);
        setCurrentRole(nextRole);
        
        const email = localStorage.getItem("email");
        if (email) {
            fetch(`http://localhost:8080/users/${email}/role`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nextRole)
            })
            .then(() => {
                window.location.reload();
            })
            .catch(err => {
                console.error("Failed to update role in DB:", err);
                window.location.reload();
            });
        } else {
            window.location.reload();
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Sidebar items (Profile and Chatbot removed as standalone menu items)
    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> },
        { name: "Companies Visited", path: "/companies", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M12 17h.01"/></svg> },
        { name: "Placement Stats", path: "/statistics", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg> },
        { name: "Experience Hub", path: "/experience", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
        { name: "Discussion Forum", path: "/discussions", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2z"/><path d="M23 2.1H9a2 2 0 0 0-2 2v2h10a4 4 0 0 1 4 4v6h2a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2z"/></svg> },
    ];

    // Admin dashboard link
    const showAdmin = currentRole === "ADMIN";

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#fbfbfc" }}>
            
            {/* SIDEBAR */}
            <div style={{
                width: sidebarOpen ? "260px" : "0px",
                overflow: "hidden",
                transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "linear-gradient(180deg, var(--primary-purple-dark), var(--primary-purple))",
                color: "#ffffff",
                display: "flex",
                flexDirection: "column",
                zIndex: 100,
                boxShadow: sidebarOpen ? "4px 0 25px rgba(0,0,0,0.1)" : "none",
                position: "fixed",
                left: 0,
                top: 0,
                height: "100vh"
            }}>
                {/* LOGO AREA */}
                <div style={{
                    padding: "24px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                    <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "var(--accent-yellow)",
                        border: "1px solid rgba(106,27,154,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "var(--primary-purple-dark)"
                    }}>
                        R
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "0.5px" }}>REC Placement</span>
                        <span style={{ fontSize: "11px", color: "var(--accent-yellow)", fontWeight: "700" }}>PORTAL v2.0</span>
                    </div>
                </div>

                {/* MENU LINKS */}
                <div style={{ padding: "20px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    border: "none",
                                    background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                                    color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.75)",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: isActive ? "600" : "500",
                                    textAlign: "left",
                                    transition: "all 0.2s ease",
                                    outline: "none"
                                }}
                                onMouseEnter={(e) => {
                                    if(!isActive) {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.color = "#ffffff";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if(!isActive) {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                                    }
                                }}
                            >
                                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        );
                    })}

                    {/* ADMIN MENU (IF AUTHORIZED) */}
                    {showAdmin && (
                        <div style={{ marginTop: "15px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", paddingLeft: "16px", textTransform: "uppercase", fontWeight: "700" }}>Admin</span>
                            <button
                                onClick={() => navigate("/admin")}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    width: "100%",
                                    padding: "12px 16px",
                                    marginTop: "6px",
                                    borderRadius: "12px",
                                    border: "none",
                                    background: location.pathname === "/admin" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                                    color: location.pathname === "/admin" ? "#ffffff" : "rgba(255, 255, 255, 0.75)",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    textAlign: "left",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    if(location.pathname !== "/admin") {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.color = "#ffffff";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if(location.pathname !== "/admin") {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                                    }
                                }}
                            >
                                <span style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                </span>
                                <span>Admin Panel</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* USER PROFILE INFO IN SIDEBAR (CLICKABLE: OPENS PROFILE PAGE) */}
                <div 
                    onClick={() => navigate("/profile")}
                    style={{
                        padding: "20px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                    {profilePic ? (
                        <img 
                            src={profilePic} 
                            alt="Profile" 
                            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent-yellow)" }}
                        />
                    ) : (
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "var(--accent-yellow)",
                            color: "var(--primary-purple-dark)",
                            fontSize: "16px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            {userName[0]?.toUpperCase()}
                        </div>
                    )}
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {userName}
                        </h4>
                        <span style={{ fontSize: "11px", color: "var(--accent-yellow)", fontWeight: "600" }}>{currentRole}</span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTAINER */}
            <div style={{
                flex: 1,
                marginLeft: sidebarOpen ? "260px" : "0px",
                transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                minWidth: 0
            }}>
                
                {/* TOP BAR */}
                <header style={{
                    height: "70px",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                    position: "sticky",
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={{
                                fontSize: "20px",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                color: "var(--primary-purple)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                transition: "background 0.2s",
                                outline: "none"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-purple-glow)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            ☰
                        </button>
                        <h1 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "var(--primary-purple-dark)", letterSpacing: "-0.5px" }}>
                            {menuItems.find(item => item.path === location.pathname)?.name || (location.pathname === "/admin" ? "Admin Panel" : "My Profile")}
                        </h1>
                    </div>

                    {/* TOPBAR CONTROLS */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        
                        {/* ROLE SWITCHER FOR TESTING */}
                        <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px", 
                            backgroundColor: "var(--primary-purple-glow)", 
                            padding: "6px 12px", 
                            borderRadius: "10px",
                            border: "1px solid rgba(149, 117, 205, 0.2)"
                        }}>
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--primary-purple-dark)", textTransform: "uppercase" }}>Test Role:</span>
                            <select
                                value={currentRole}
                                onChange={handleRoleChange}
                                style={{
                                    border: "none",
                                    background: "none",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "var(--primary-purple-dark)",
                                    cursor: "pointer",
                                    outline: "none"
                                }}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="PLACED_STUDENT">Placed Student</option>
                                <option value="ADMIN">Admin / Coordinator</option>
                            </select>
                        </div>

                        <button
                            onClick={handleLogout}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                borderRadius: "10px",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                background: "none",
                                color: "#ef4444",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "600",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* PAGE ROUTER CONTENT */}
                <main style={{ flex: 1, padding: "30px", overflowY: "auto", position: "relative" }}>
                    <Outlet />
                </main>
            </div>

            {/* FLOATING PERSISTENT AI CHATBOT WIDGET */}
            <div style={{
                position: "fixed",
                bottom: "35px",
                right: "35px",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end"
            }}>
                {chatOpen && (
                    <div style={{
                        width: "360px",
                        height: "500px",
                        marginBottom: "15px",
                        animation: "fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}>
                        <AIChatbot onClose={() => setChatOpen(false)} />
                    </div>
                )}
                
                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary-purple), var(--primary-purple-dark))",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "26px",
                        border: "none",
                        boxShadow: "0 6px 20px rgba(149, 117, 205, 0.3)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        outline: "none"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    {chatOpen ? (
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>✕</span>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    )}
                </button>
            </div>

        </div>
    );
}

export default Layout;