import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: "",
        dept: "",
        year: ""
    });

    const handleRegister = () => {
        const validDomain = "@rajalakshmi.edu.in";

        // ✅ Email validation
        if (!email.endsWith(validDomain)) {
            setError("❌ Only REC students can register");
            return;
        }

        // ✅ API call
        fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
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
        <div style={{ textAlign: "center", marginTop: "100px" }}>

            <h2>Create Account</h2>

            <div style={{
                border: "1px solid #ccc",
                padding: "30px",
                width: "300px",
                margin: "auto",
                borderRadius: "15px",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
            }}>

                {/* EMAIL INPUT */}
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

                {/* PASSWORD INPUT */}
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

                {/* ERROR MESSAGE */}
                {error && (
                    <p style={{ color: "red", fontSize: "14px" }}>
                        {error}
                    </p>
                )}

                {/* REGISTER BUTTON */}
                <button
                    onClick={handleRegister}
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
                    Register
                </button>

            </div>
        </div>
    );
}

export default Register;