import React from "react";
import { useNavigate } from "react-router-dom";

function Profile() {

    const navigate = useNavigate();

    // 🔐 Get user data
    const username = localStorage.getItem("username") || "User";
    const dept = localStorage.getItem("dept") || "Not Set";
    const year = localStorage.getItem("year") || "Not Set";

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={{
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "30px"
        }}>

            {/* TOP PROFILE INFO */}
            <div style={{ textAlign: "center" }}>

                {/* Avatar */}
                <div style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "white",
                    fontSize: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                    marginBottom: "15px"
                }}>
                    {username[0].toUpperCase()}
                </div>

                {/* Name */}
                <h2 style={{ margin: "5px 0" }}>{username}</h2>

                {/* Dept & Year */}
                <p style={{ color: "gray", margin: "5px 0" }}>
                    🎓 {dept} Department
                </p>

                <p style={{ color: "gray" }}>
                    📅 {year}
                </p>

            </div>

            {/* LOGOUT BUTTON (BOTTOM) */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    onClick={logout}
                    style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        padding: "12px 20px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}
                >
                    Logout
                </button>
            </div>

        </div>
    );
}

export default Profile;