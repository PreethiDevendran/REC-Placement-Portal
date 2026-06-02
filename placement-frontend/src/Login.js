import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        const validDomain = "@rajalakshmi.edu.in";

        // ✅ Email validation
        if (!email.endsWith(validDomain)) {
            setError("❌ Only REC students can login");
            return;
        }

        // ✅ API call
        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.user) {
                // ✅ Store user info
                localStorage.setItem("email", data.user.email);
                localStorage.setItem("fullName", data.user.fullName || data.user.email.split("@")[0]);
                localStorage.setItem("dept", data.user.dept || "");
                localStorage.setItem("year", data.user.year || "");
                localStorage.setItem("role", data.user.role || "STUDENT");
                localStorage.setItem("profilePic", data.user.profilePic || "");

                navigate("/dashboard");
            } else {
                setError("❌ Invalid credentials");
            }
        })
        .catch(() => {
            setError("⚠️ Server connection error. Please start backend.");
        });
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #4a148c, #8e24aa)",
            padding: "20px"
        }}>
            <div className="glass-card animate-fade-in-up" style={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "#ffffff",
                padding: "40px 30px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.2)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "35px" }}>
                    <div style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "15px",
                        backgroundColor: "#f1c40f",
                        color: "#4a148c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        fontWeight: "800",
                        margin: "0 auto 15px auto",
                        boxShadow: "0 6px 15px rgba(241,196,15,0.3)"
                    }}>
                        R
                    </div>
                    <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#4a148c", margin: "0 0 5px 0" }}>REC Placement Portal</h2>
                    <p style={{ color: "#7f8c8d", fontSize: "14px", margin: 0 }}>Log in to access your placement dashboard</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* EMAIL */}
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>College Email</label>
                        <input
                            type="email"
                            placeholder="username@rajalakshmi.edu.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    {/* ERROR */}
                    {error && (
                        <p style={{ color: "#e74c3c", fontSize: "13px", margin: 0, fontWeight: "600" }}>
                            {error}
                        </p>
                    )}

                    {/* LOGIN BUTTON */}
                    <button
                        onClick={handleLogin}
                        className="primary-btn"
                        style={{ width: "100%", padding: "14px" }}
                    >
                        Sign In
                    </button>

                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <span style={{ fontSize: "13px", color: "#7f8c8d" }}>New user? </span>
                        <button
                            onClick={() => navigate("/register")}
                            style={{
                                border: "none",
                                background: "none",
                                color: "#6a1b9a",
                                fontWeight: "700",
                                cursor: "pointer",
                                fontSize: "13px"
                            }}
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;