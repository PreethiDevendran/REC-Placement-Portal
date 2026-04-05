import { useState } from "react";

function ProudOfREC() {
    const [selectedDept, setSelectedDept] = useState(null);

    const departments = [
        "CSE", "IT", "ECE", "EEE", "AIML",
        "AIDS", "MECH", "CIVIL", "BIOTECH"
    ];

    const allStudents = {
        CSE: [
            { name: "Rahul", company: "Google", package: "25 LPA", type: "Full-Time" },
            { name: "Priya", company: "Microsoft", package: "22 LPA", type: "Full-Time" },
        ],
        IT: [
            { name: "Ananya", company: "Infosys", package: "8 LPA", type: "Full-Time" },
            { name: "Preethi", company: "Caterpillar", package: "15 LPA", type: "Full-Time" },
            { name: "Adithya Charan", company: "Amazon", package: "18 LPA", type: "Full-Time" },
        ],
        ECE: [
            { name: "Amit", company: "Intel", package: "15 LPA", type: "Full-Time" },
        ],
        EEE: [
            { name: "Karthik", company: "ABB", package: "12 LPA", type: "Full-Time" },
        ],
        AIML: [
            { name: "Abiram", company: "EY", package: "7 LPA", type: "Intern" },
        ],
        AIDS: [
            { name: "Santhiya", company: "Capgemini", package: "7.5 LPA", type: "Full-Time" },
        ],
        MECH: [
            { name: "Vikram", company: "Ashok Leyland", package: "10 LPA", type: "Full-Time" },
        ],
        CIVIL: [
            { name: "Soumiya", company: "Tata Projects", package: "6.5 LPA", type: "Full-Time" },
        ],
        BIOTECH: [
            { name: "Divya", company: "Bharat Biotech", package: "7.5 LPA", type: "Full-Time" },
        ],
    };

    return (
        <div style={{ padding: "30px", textAlign: "center" }}>

            {/* TITLE */}
            <h1 style={{ marginBottom: "25px" }}>
                Proud of REC - 2026
            </h1>

            {/* DEPARTMENTS (CENTERED BUTTONS) */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "15px",
                marginBottom: "30px"
            }}>
                {departments.map((dept) => (
                    <button
                        key={dept}
                        onClick={() => setSelectedDept(dept)}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "20px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            background:
                                selectedDept === dept
                                    ? "linear-gradient(135deg, #4facfe, #00f2fe)"
                                    : "#e2e8f0",
                            color: selectedDept === dept ? "#fff" : "#333",
                            boxShadow:
                                selectedDept === dept
                                    ? "0 4px 12px rgba(0,0,0,0.2)"
                                    : "none",
                            transition: "0.3s"
                        }}
                    >
                        {dept}
                    </button>
                ))}
            </div>

            {/* STUDENTS (SHOW ONLY WHEN CLICKED) */}
            {selectedDept && (
                <div style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    padding: "20px",
                    borderRadius: "15px",
                    background: "#f8fafc",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
                }}>
                    <h2 style={{ marginBottom: "20px" }}>
                        {selectedDept} Department
                    </h2>

                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "20px"
                    }}>
                        {allStudents[selectedDept]?.map((student, index) => (
                            <div
                                key={index}
                                style={{
                                    width: "220px",
                                    padding: "15px",
                                    borderRadius: "12px",
                                    background: "white",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    transition: "0.3s",
                                    cursor: "pointer"
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform = "scale(1.05)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform = "scale(1)")
                                }
                            >
                                <h3 style={{ color: "#2563eb" }}>
                                    {student.name}
                                </h3>
                                <p><b>Company:</b> {student.company}</p>
                                <p><b>Package:</b> {student.package}</p>
                                <p><b>Type:</b> {student.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

export default ProudOfREC;