import React, { useState, useEffect } from "react";

function CompanyUI() {

    const [companies, setCompanies] = useState([]);
    const [activeCompany, setActiveCompany] = useState(null);
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/companies")
            .then(res => res.json())
            .then(data => setCompanies(data));
    }, []);

    const handleClick = (company) => {
        if (activeCompany && activeCompany.name === company.name) {
            // close if same clicked
            setActiveCompany(null);
            setExperiences([]);
        } else {
            setActiveCompany(company);

            fetch("http://localhost:8080/experiences/" + company.name)
                .then(res => res.json())
                .then(data => setExperiences(data));
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            padding: "30px"
        }}>

            <div style={{ width: "600px" }}>

                <h1 style={{ marginBottom: "20px" }}>
                    Companies Visited
                </h1>

                {/* COMPANY LIST */}
                {companies.map((c, index) => (
                    <div key={index} style={{ marginBottom: "15px" }}>

                        {/* HEADER */}
                        <div
                            onClick={() => handleClick(c)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "12px",
                                borderRadius: "10px",
                                background: "#f1f5f9",
                                cursor: "pointer",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                            }}
                        >

                            <h4 style={{ margin: 0 }}>{c.name}</h4>
                        </div>

                        {/* DETAILS (ONLY IF ACTIVE) */}
                        {activeCompany && activeCompany.name === c.name && (
                            <div style={{
                                padding: "15px",
                                background: "#e3f2fd",
                                borderRadius: "10px",
                                marginTop: "8px",
                                animation: "fadeIn 0.3s ease"
                            }}>
                                <p><b>Role:</b> {c.role}</p>
                                <p><b>CTC:</b> {c.ctc}</p>
                                <p><b>Date:</b> {c.date}</p>

                                <p><b>Students Placed:</b> {experiences.length}</p>

                                <h4>Experiences:</h4>
                                {experiences.length > 0 ? (
                                    experiences.map((e, i) => (
                                        <p key={i}>• {e.experienceText}</p>
                                    ))
                                ) : (
                                    <p>No experiences yet</p>
                                )}
                            </div>
                        )}

                    </div>
                ))}

                {/* 🎨 COLORFUL STATS */}
                <div style={{
                    marginTop: "30px",
                    padding: "20px",
                    borderRadius: "15px",
                    background: "linear-gradient(135deg, #42a5f5, #7e57c2)",
                    color: "white"
                }}>
                    <h3>Placement Stats 2026</h3>

                    <p>Total Companies: {companies.length}</p>
                    <p>Total Students Placed: {experiences.length}</p>
                    <p>Average Package: 6 LPA</p>
                </div>

            </div>
        </div>
    );
}

export default CompanyUI;