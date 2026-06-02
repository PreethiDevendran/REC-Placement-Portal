import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config";

function Register() {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dept, setDept] = useState("");
    const [year, setYear] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isFormValid = 
        fullName.trim() !== "" &&
        phone.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        dept !== "" &&
        year !== "";

    const handleRegister = () => {
        const validDomain = "@rajalakshmi.edu.in";

        // ✅ Email validation
        if (!email.endsWith(validDomain)) {
            setError("❌ Only REC students (@rajalakshmi.edu.in) can register");
            return;
        }

        if (!isFormValid) {
            setError("❌ Please fill in all fields");
            return;
        }

        // ✅ API call
        fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                password: password,
                dept: dept,
                year: year
            })
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(msg => { throw new Error(msg); });
            }
            return res.text();
        })
        .then(() => {
            alert("✅ Account Created Successfully");
            navigate("/"); // back to login
        })
        .catch(err => {
            setError(err.message || "Something went wrong");
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
                maxWidth: "450px",
                backgroundColor: "#ffffff",
                padding: "35px 30px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.2)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#4a148c", margin: "0 0 5px 0" }}>Create Account</h2>
                    <p style={{ color: "#7f8c8d", fontSize: "14px", margin: 0 }}>REC Placement Portal</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {/* FULL NAME INPUT */}
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    {/* PHONE NUMBER INPUT */}
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>Phone Number</label>
                        <input
                            type="text"
                            placeholder="9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    {/* EMAIL INPUT */}
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>College Email</label>
                        <input
                            type="email"
                            placeholder="username@rajalakshmi.edu.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    {/* PASSWORD INPUT */}
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        {/* DEPT SELECT */}
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>Department</label>
                            <select
                                value={dept}
                                onChange={(e) => setDept(e.target.value)}
                                className="custom-input"
                            >
                                <option value="">Select</option>
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

                        {/* YEAR SELECT */}
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#7f8c8d", display: "block", marginBottom: "4px" }}>Year of Study</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="custom-input"
                            >
                                <option value="">Select</option>
                                <option value="I">I Year</option>
                                <option value="II">II Year</option>
                                <option value="III">III Year</option>
                                <option value="IV">IV Year</option>
                            </select>
                        </div>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <p style={{ color: "#e74c3c", fontSize: "13px", margin: 0, fontWeight: "600" }}>
                            {error}
                        </p>
                    )}

                    {/* REGISTER BUTTON */}
                    <button
                        onClick={handleRegister}
                        disabled={!isFormValid}
                        className="primary-btn"
                        style={{
                            marginTop: "10px",
                            width: "100%",
                            opacity: isFormValid ? 1 : 0.5,
                            cursor: isFormValid ? "pointer" : "not-allowed",
                            transition: "all 0.2s ease"
                        }}
                    >
                        Register Account
                    </button>

                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <span style={{ fontSize: "13px", color: "#7f8c8d" }}>Already have an account? </span>
                        <button
                            onClick={() => navigate("/")}
                            style={{
                                border: "none",
                                background: "none",
                                color: "#6a1b9a",
                                fontWeight: "700",
                                cursor: "pointer",
                                fontSize: "13px"
                            }}
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;