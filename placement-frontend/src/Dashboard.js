import { useEffect, useState } from "react";

function Dashboard() {

    // Previous drive companies
    const previousCompanies = [
        { id: 1, name: "Google", logo: "/logos/google.png" },
        { id: 2, name: "Microsoft", logo: "/logos/microsoft.png" },
        { id: 3, name: "Amazon", logo: "/logos/amazon.png" },
        { id: 4, name: "Apple", logo: "/logos/apple.png" },
        { id: 5, name: "Facebook", logo: "/logos/facebook.png" },
    ];

    return (
        <div style={{ background: "#f4f7fb", minHeight: "100vh" }}>

            {/* HEADER */}
            <div style={{ marginBottom: "20px" }}>
                <h1 style={{ margin: 0, color: "#2a5298" }}>Dashboard</h1>
                <p style={{ margin: 0, color: "#555" }}>Welcome back 👋</p>
            </div>

            {/* ONGOING DRIVE CARD */}
            <div style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                marginBottom: "25px"
            }}>

                <h2 style={{ color: "#2a5298" }}> Ongoing Drive</h2>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <img
                        src="/logos/google.png"
                        alt="company"
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            objectFit: "contain",
                            background: "#fff",
                            padding: "8px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            marginRight: "10px"
                        }}
                    />
                    <h3 style={{ margin: 0 }}>Google</h3>
                </div>

                <p><b>Date:</b> 10 April 2026</p>
                <p><b>Students Placed:</b> 5</p>
                <p><b>Package:</b> 12 LPA</p>

                <h4>Selected Students</h4>

                <div style={{ display: "flex", gap: "15px" }}>
                    {["Rahul", "Priya"].map((name, index) => (
                        <div key={index} style={{ textAlign: "center" }}>
                            <img
                                src="https://via.placeholder.com/60"
                                alt="student"
                                style={{
                                    borderRadius: "50%",
                                    width: "60px",
                                    height: "60px",
                                    border: "2px solid #2a5298"
                                }}
                            />
                            <p>{name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* PREVIOUS DRIVE */}
            <div style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
            }}>

                <h2 style={{ color: "#2a5298" }}> Previous Drives</h2>

                <div style={{
                    display: "flex",
                    gap: "25px",
                    overflowX: "auto",
                    padding: "10px"
                }}>

                    {previousCompanies.map((company) => (
                        <div
                            key={company.id}
                            style={{
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "0.3s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                            <img
                                src={company.logo}
                                alt={company.name}
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "contain",
                                    background: "#fff",
                                    padding: "10px",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                                }}
                            />
                            <p style={{ marginTop: "8px" }}>{company.name}</p>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    );
}

export default Dashboard;