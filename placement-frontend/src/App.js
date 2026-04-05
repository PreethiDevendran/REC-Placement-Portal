import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import CompanyUI from "./CompanyUI";
import Layout from "./Layout";
import Profile from "./Profile";
import ProudOfREC from "./ProudOfREC";
import Experience from "./StudentExperience"; // if you have it

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* 🔓 PUBLIC ROUTES (NO SIDEBAR) */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 🔐 PROTECTED ROUTES (WITH SIDEBAR) */}
                <Route path="/" element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="companies" element={<CompanyUI />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="ProudOfREC" element={<ProudOfREC />} />
                    <Route path="experience" element={<Experience />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;