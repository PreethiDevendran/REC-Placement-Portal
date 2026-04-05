import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function Layout() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <div style={{ display: "flex", background: "#f4f7fb" }}>

            {/* SIDEBAR */}
            {open && (
                <div style={{
                    width: "240px",
                    background: "linear-gradient(180deg, #1e3c72, #2a5298)",
                    color: "white",
                    padding: "20px",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    boxShadow: "2px 0 10px rgba(0,0,0,0.2)"
                }}>
                    <h2 style={{ marginBottom: "25px" }}> Menu</h2>

                    {/* Buttons */}
                    {[
                        { name: "Dashboard", path: "/dashboard" },
                        { name: "Companies Visited", path: "/companies" },
                        { name: "Proud of REC", path: "/ProudOfREC" },
                        { name: "Q&A", path: "/experience" },
                        { name: "Profile", path: "/profile" }
                    ].map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "12px",
                                marginBottom: "12px",
                                borderRadius: "10px",
                                border: "none",
                                background: "rgba(255,255,255,0.15)",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "14px",
                                transition: "0.3s"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = "#ffffff";
                                e.target.style.color = "#1e3c72";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = "rgba(255,255,255,0.15)";
                                e.target.style.color = "white";
                            }}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            )}

            {/* MAIN CONTENT */}
            <div
                style={{
                    flex: 1,
                    marginLeft: open ? "240px" : "0",
                    transition: "margin-left 0.3s"
                }}
            >

                {/* TOP BAR */}
                <div style={{
                    padding: "12px 20px",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}>
                    <button
                        onClick={() => setOpen(!open)}
                        style={{
                            fontSize: "22px",
                            borderRadius: "8px",
                            padding: "5px 12px",
                            marginRight: "15px",
                            border: "none",
                            background: "#2a5298",
                            color: "white",
                            cursor: "pointer"
                        }}
                    >
                        ☰
                    </button>

                    <h2 style={{ margin: 0, color: "#2a5298" }}>
                        Placement Portal
                    </h2>
                </div>

                {/* PAGE CONTENT */}
                <div style={{ padding: "20px" }}>
                    <Outlet />
                </div>

            </div>
        </div>
    );
}

export default Layout;