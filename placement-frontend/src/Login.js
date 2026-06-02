import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loginType, setLoginType] = useState("student"); // "student" or "admin"
    const navigate = useNavigate();

    const handleLogin = () => {
        const validDomain = "@rajalakshmi.edu.in";

        // ✅ Email validation
        if (!email.endsWith(validDomain)) {
            setError("❌ Only REC students can login");
            return;
        }

        // ✅ API call
        fetch(`${API_BASE_URL}/auth/login`, {
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
                // Lock admin portal login to ADMIN accounts only
                if (loginType === "admin" && data.user.role !== "ADMIN") {
                    setError("❌ Access Denied: Not an Admin account");
                    return;
                }

                // Store user info
                localStorage.setItem("email", data.user.email);
                localStorage.setItem("fullName", data.user.fullName || data.user.email.split("@")[0]);
                localStorage.setItem("dept", data.user.dept || "");
                localStorage.setItem("year", data.user.year || "");
                localStorage.setItem("role", data.user.role || "STUDENT");
                localStorage.setItem("profilePic", data.user.profilePic || "");

                // Redirect based on role
                if (data.user.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/dashboard");
                }
            } else {
                setError("❌ Invalid credentials");
            }
        })
        .catch(() => {
            setError("⚠️ Server connection error. Please start backend.");
        });
    };

    const isFormValid = email.trim() !== "" && password.trim() !== "";

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
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
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

                {/* LOGIN TYPE TABS */}
                <div style={{
                    display: "flex",
                    borderRadius: "10px",
                    background: "rgba(106, 27, 154, 0.05)",
                    padding: "4px",
                    marginBottom: "25px"
                }}>
                    <button
                        onClick={() => { setLoginType("student"); setError(""); }}
                        style={{
                            flex: 1,
                            padding: "10px",
                            border: "none",
                            borderRadius: "8px",
                            background: loginType === "student" ? "#4a148c" : "transparent",
                            color: loginType === "student" ? "#ffffff" : "#7f8c8d",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                    >
                        Student Portal
                    </button>
                    <button
                        onClick={() => { setLoginType("admin"); setError(""); }}
                        style={{
                            flex: 1,
                            padding: "10px",
                            border: "none",
                            borderRadius: "8px",
                            background: loginType === "admin" ? "#4a148c" : "transparent",
                            color: loginType === "admin" ? "#ffffff" : "#7f8c8d",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                    >
                        Admin Portal
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* EMAIL */}
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "6px" }}>
                            {loginType === "admin" ? "Admin Email" : "College Email"}
                        </label>
                        <input
                            type="email"
                            placeholder={loginType === "admin" ? "admin@rajalakshmi.edu.in" : "username@rajalakshmi.edu.in"}
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
                        disabled={!isFormValid}
                        className="primary-btn"
                        style={{
                            width: "100%",
                            padding: "14px",
                            opacity: isFormValid ? 1 : 0.5,
                            cursor: isFormValid ? "pointer" : "not-allowed",
                            transition: "all 0.2s ease"
                        }}
                    >
                        Sign In
                    </button>

                    {loginType === "student" && (
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;