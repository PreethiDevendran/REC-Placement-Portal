import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import CompanyUI from "./CompanyUI";
import Layout from "./Layout";
import Profile from "./Profile";
import PlacementStats from "./PlacementStats";
import ExperienceHub from "./ExperienceHub";
import StudentExperience from "./StudentExperience"; // Discussion forum
import AdminPanel from "./AdminPanel";

// Auth Guard component to redirect unauthenticated users
const ProtectedRoute = ({ children }) => {
    const email = localStorage.getItem("email");
    if (!email) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 🔓 PUBLIC ROUTES (NO SIDEBAR) */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 🔐 PROTECTED ROUTES (WITH SIDEBAR) */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="companies" element={<CompanyUI />} />
                    <Route path="statistics" element={<PlacementStats />} />
                    <Route path="experience" element={<ExperienceHub />} />
                    <Route path="discussions" element={<StudentExperience />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="admin" element={<AdminPanel />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;