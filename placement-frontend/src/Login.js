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
            .then(res => res.json())   // ⚠️ IMPORTANT (not json)
            .then(data => {
                if (data.success) {

                    // ✅ Store user info
                    localStorage.setItem("email", data.email);
                    localStorage.setItem("dept", data.dept);        // dummy for now
                    localStorage.setItem("year", data.year);  // dummy

                    navigate("/dashboard");
                } else {
                    setError("❌ Invalid credentials");
                }
            })
            .catch(() => {
                setError("⚠️ Server error");
            });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>

            <h2>REC PLACEMENT PORTAL</h2>

            <div style={{
                border: "1px solid #ddd",
                padding: "30px",
                width: "300px",
                margin: "auto",
                borderRadius: "15px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
            }}>

                {/* EMAIL */}
                <input
                    placeholder="College Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "10px"
                    }}
                />

                {/* PASSWORD */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "10px"
                    }}
                />

                {/* ERROR */}
                {error && (
                    <p style={{ color: "red", fontSize: "14px" }}>
                        {error}
                    </p>
                )}

                {/* REGISTER */}
                <button
                    onClick={() => navigate("/register")}
                    style={{
                        marginTop: "10px",
                        padding: "8px",
                        width: "100%",
                        borderRadius: "10px",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        marginBottom: "10px",
                        cursor: "pointer"
                    }}
                >
                    New User
                </button>

                {/* LOGIN */}
                <button
                    onClick={handleLogin}
                    style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        padding: "10px",
                        width: "100%",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    LOGIN
                </button>

            </div>
        </div>
    );
}

export default Login;