// src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserShield,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../images/cvsumpc_logo.jpg";

import PendingUsers from "./admin/PendingUsers";
import StaffAccounts from "./admin/StaffAccounts";
import MemberAccounts from "./admin/MemberAccounts";
import Settings from "./admin/Settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [staffList, setStaffList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch all data from backend
  useEffect(() => {
    fetchDashboardData();
  }, []);
    useEffect(() => {
    const admin = sessionStorage.getItem("admin_logged_in");
    if (!admin) {
      window.location.replace("/Employer");
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/admin/get_admin_data.php"
      );
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staffList);
        setMembersList(data.membersList);
        setPendingUsers(data.pendingUsers);
      } else {
        console.error("Backend error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.replace("/Employer");
  };

  const renderDashboard = () => (
    <div className="content">
      <h2>Admin Dashboard Overview</h2>
      <div className="cards">
        <div className="card">
          <h3>{staffList.length}</h3>
          <p>Staff Accounts</p>
        </div>
        <div className="card">
          <h3>{membersList.length}</h3>
          <p>Member Accounts</p>
        </div>
        <div className="card">
          <h3>{pendingUsers.length}</h3>
          <p>Pending Registrations</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "staff":
        return <StaffAccounts />;
      case "members":
        return <MemberAccounts />;
      case "pending":
        return <PendingUsers />;
      case "settings":
        return <Settings />;
      default:
        return <h2>Welcome</h2>;
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="CVSUMPC Logo" className="sidebar-logo" />
          <h2>CVSUMPC Admin</h2>
        </div>
        <nav>
          <ul>
            <li onClick={() => setActiveTab("dashboard")}>
              <FaTachometerAlt /> Dashboard
            </li>
            <li onClick={() => setActiveTab("staff")}>
              <FaUserShield /> Staff Accounts
            </li>
            <li onClick={() => setActiveTab("members")}>
              <FaUsers /> Member Accounts
            </li>
            <li onClick={() => setActiveTab("pending")}>
              <FaClipboardList /> Pending Users
            </li>
            <li onClick={() => setActiveTab("settings")}>
              <FaCog /> Settings
            </li>
          </ul>
        </nav>
        <button className="logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}
