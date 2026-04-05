import React, { useEffect, useState } from "react";

function StudentExperience() {

    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [search, setSearch] = useState("");

    const isPlacedStudent = true; // 🔐 later connect from login

    // ✅ LOAD QUESTIONS
    useEffect(() => {
        fetch("http://localhost:8080/questions")
            .then(res => res.json())
            .then(data => setQuestions(data));
    }, []);

    // ✅ ADD QUESTION
    const addQuestion = () => {
        if (!newQuestion.trim()) return;

        fetch("http://localhost:8080/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: newQuestion })
        })
            .then(res => res.json())
            .then(() => {
                setNewQuestion("");
                reload();
            });
    };

    // ✅ ADD ANSWER
    const addAnswer = (id, text) => {

        if (!isPlacedStudent) {
            alert("❌ Only placed students can answer");
            return;
        }

        fetch(`http://localhost:8080/questions/${id}/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(text)
        })
            .then(() => reload());
    };

    // 🔄 Reload
    const reload = () => {
        fetch("http://localhost:8080/questions")
            .then(res => res.json())
            .then(data => setQuestions(data));
    };

    // 🔍 FILTER
    const filtered = questions.filter(q =>
        q.question.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>

            <h1 style={{ textAlign: "center" }}>Placement Q&A</h1>

            {/* SEARCH */}
            <input
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "20px",
                    marginBottom: "20px"
                }}
            />

            {/* ASK QUESTION */}
            <div style={{ display: "flex", gap: "10px" }}>
                <input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask question..."
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "20px"
                    }}
                />
                <button onClick={addQuestion}>Ask</button>
            </div>

            {/* LIST */}
            {filtered.map(q => (
                <div key={q.id} style={{
                    marginTop: "20px",
                    padding: "15px",
                    borderRadius: "10px",
                    background: "#fff",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}>

                    <h3>❓ {q.question}</h3>

                    {q.answers.map((ans, i) => (
                        <p key={i}>💬 {ans}</p>
                    ))}

                    <input
                        placeholder="Write answer..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                addAnswer(q.id, e.target.value);
                                e.target.value = "";
                            }
                        }}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "10px",
                            borderRadius: "8px"
                        }}
                    />

                </div>
            ))}

        </div>
    );
}

export default StudentExperience;