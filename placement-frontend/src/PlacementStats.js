import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

function PlacementStats() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Summary stats
    const [summary, setSummary] = useState({
        totalOffers: 0,
        avgPackage: 0.0,
        highestPackage: 0.0
    });

    useEffect(() => {
        fetch("http://localhost:8080/statistics")
            .then(res => res.json())
            .then(data => {
                setStats(data);
                if (data.length > 0) {
                    const offers = data.reduce((acc, curr) => acc + (curr.totalOffers || 0), 0);
                    const highest = data.reduce((max, curr) => (curr.highestPackage > max ? curr.highestPackage : max), 0);
                    const sumAvg = data.reduce((acc, curr) => acc + (curr.averagePackage || 0), 0);
                    const avg = sumAvg / data.length;

                    setSummary({
                        totalOffers: offers,
                        avgPackage: avg,
                        highestPackage: highest
                    });
                } else {
                    // Fallback mock summary if DB is empty
                    setSummary({
                        totalOffers: 428,
                        avgPackage: 6.8,
                        highestPackage: 28.0
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading stats:", err);
                setLoading(false);
            });
    }, []);

    // 1. Prepare data for graphs. Use mock fallbacks if no database records are found.
    const isDbEmpty = stats.length === 0;

    // A. Department wise placements (Bar Chart)
    const deptLabels = isDbEmpty ? ["CSE", "IT", "ECE", "EEE", "AIML", "AIDS", "MECH"] : [...new Set(stats.map(s => s.dept))];
    const deptPlacements = isDbEmpty 
        ? [120, 85, 60, 45, 55, 40, 23] 
        : deptLabels.map(dept => stats.filter(s => s.dept === dept).reduce((acc, curr) => acc + (curr.placedCount || 0), 0));

    const barData = {
        labels: deptLabels,
        datasets: [
            {
                label: "Students Placed",
                data: deptPlacements,
                backgroundColor: [
                    "rgba(106, 27, 154, 0.6)",
                    "rgba(142, 36, 170, 0.6)",
                    "rgba(79, 172, 254, 0.6)",
                    "rgba(241, 196, 15, 0.6)",
                    "rgba(39, 174, 96, 0.6)",
                    "rgba(230, 126, 34, 0.6)",
                    "rgba(52, 152, 219, 0.6)"
                ],
                borderColor: [
                    "#6a1b9a", "#8e24aa", "#4facfe", "#f1c40f", "#27ae60", "#e67e22", "#3498db"
                ],
                borderWidth: 1,
                borderRadius: 8
            }
        ]
    };

    // B. Company wise placements (Pie Chart)
    const companyLabels = isDbEmpty ? ["Google", "Amazon", "Cognizant", "TCS", "Accenture", "Infosys"] : [...new Set(stats.map(s => s.companyName))].slice(0, 6);
    const companyData = isDbEmpty 
        ? [8, 14, 85, 120, 95, 66] 
        : companyLabels.map(comp => stats.filter(s => s.companyName === comp).reduce((acc, curr) => acc + (curr.placedCount || 0), 0));

    const pieData = {
        labels: companyLabels,
        datasets: [
            {
                data: companyData,
                backgroundColor: [
                    "#6a1b9a", "#f1c40f", "#4facfe", "#2ecc71", "#e74c3c", "#9b59b6"
                ],
                hoverOffset: 4
            }
        ]
    };

    // C. Year wise average & highest packages (Line Graph)
    const yearLabels = isDbEmpty ? ["2023", "2024", "2025", "2026"] : [...new Set(stats.map(s => s.year))].sort();
    const highestPackages = isDbEmpty 
        ? [18.0, 22.0, 24.5, 28.0]
        : yearLabels.map(year => stats.filter(s => s.year === year).reduce((max, curr) => (curr.highestPackage > max ? curr.highestPackage : max), 0));
    
    const avgPackages = isDbEmpty 
        ? [5.2, 5.8, 6.2, 6.8]
        : yearLabels.map(year => {
            const list = stats.filter(s => s.year === year);
            return list.isEmpty ? 0.0 : list.reduce((acc, curr) => acc + (curr.averagePackage || 0), 0) / list.length;
        });

    const lineData = {
        labels: yearLabels,
        datasets: [
            {
                label: "Highest Package (LPA)",
                data: highestPackages,
                borderColor: "#f1c40f",
                backgroundColor: "rgba(241, 196, 15, 0.1)",
                tension: 0.3,
                fill: true,
                borderWidth: 3
            },
            {
                label: "Average Package (LPA)",
                data: avgPackages,
                borderColor: "#6a1b9a",
                backgroundColor: "rgba(106, 27, 154, 0.1)",
                tension: 0.3,
                fill: true,
                borderWidth: 3
            }
        ]
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
                <div style={{
                    width: "50px",
                    height: "50px",
                    border: "5px solid rgba(106, 27, 154, 0.2)",
                    borderTop: "5px solid #6a1b9a",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            
            {/* OVERVIEW PANEL */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "25px",
                marginBottom: "35px"
            }}>
                <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ fontSize: "36px", padding: "10px", backgroundColor: "rgba(106,27,154,0.06)", borderRadius: "12px" }}>🏆</div>
                    <div>
                        <span style={{ fontSize: "13px", color: "#7f8c8d", fontWeight: "600", textTransform: "uppercase" }}>Highest Package</span>
                        <h3 style={{ margin: "4px 0 0 0", fontSize: "28px", fontWeight: "800", color: "#2c3e50" }}>{summary.highestPackage} LPA</h3>
                    </div>
                </div>
                
                <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ fontSize: "36px", padding: "10px", backgroundColor: "rgba(79,172,254,0.06)", borderRadius: "12px" }}>📈</div>
                    <div>
                        <span style={{ fontSize: "13px", color: "#7f8c8d", fontWeight: "600", textTransform: "uppercase" }}>Average Package</span>
                        <h3 style={{ margin: "4px 0 0 0", fontSize: "28px", fontWeight: "800", color: "#2c3e50" }}>{summary.avgPackage.toFixed(1)} LPA</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ fontSize: "36px", padding: "10px", backgroundColor: "rgba(241,196,15,0.06)", borderRadius: "12px" }}>💼</div>
                    <div>
                        <span style={{ fontSize: "13px", color: "#7f8c8d", fontWeight: "600", textTransform: "uppercase" }}>Total Offers</span>
                        <h3 style={{ margin: "4px 0 0 0", fontSize: "28px", fontWeight: "800", color: "#2c3e50" }}>{summary.totalOffers} Placements</h3>
                    </div>
                </div>
            </div>

            {/* GRAPHS GRID */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "35px",
                marginBottom: "35px"
            }}>
                {/* Department placements (Bar) */}
                <div className="glass-card" style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>🎓 Placements by Department</h3>
                    <div style={{ flex: 1, position: "relative" }}>
                        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>

                {/* Company placements (Pie) */}
                <div className="glass-card" style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>🏢 Placements Share by Corporate</h3>
                    <div style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center" }}>
                        <div style={{ width: "260px" }}>
                            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Package trends (Line) */}
            <div className="glass-card" style={{ minHeight: "380px", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>📈 Salary Package Trends Over Years</h3>
                <div style={{ flex: 1, position: "relative" }}>
                    <Line data={lineData} options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { position: "top" } },
                        scales: { y: { beginAtZero: true, title: { display: true, text: "LPA" } } }
                    }} />
                </div>
            </div>

        </div>
    );
}

export default PlacementStats;
