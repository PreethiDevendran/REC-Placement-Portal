import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    const activeStyle = {
        fontWeight: "bold",
        color: "#ff5722", // Active tab color
        borderBottom: "2px solid #ff5722",
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: "#1976d2",
                color: "white",
                position: "sticky",
                top: 0,
                zIndex: 1000,
            }}
        >
            <NavLink to="/dashboard" style={({ isActive }) => (isActive ? activeStyle : { color: "white" })}>
                Dashboard
            </NavLink>

            <NavLink to="/companies" style={({ isActive }) => (isActive ? activeStyle : { color: "white" })}>
                Companies
            </NavLink>

            <NavLink to="/students" style={({ isActive }) => (isActive ? activeStyle : { color: "white" })}>
                Students
            </NavLink>

            <NavLink to="/experience" style={({ isActive }) => (isActive ? activeStyle : { color: "white" })}>
                Experiences
            </NavLink>
        </nav>
    );
}

export default Navbar;