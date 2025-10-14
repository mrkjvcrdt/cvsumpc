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
// import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [staffList, setStaffList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch all data from backend
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://localhost/cvsumpc/web/backend/get_admin_data.php");
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
    window.location.href = "/Admin"; // redirect to login
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

  const renderStaffAccounts = () => (
    <div className="content">
      <h2>Staff Accounts</h2>
      {staffList.length === 0 ? (
        <p>No staff accounts found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td>{`${staff.first_name} ${staff.middle_name} ${staff.last_name}`}</td>
                <td>{staff.email}</td>
                <td>{staff.role}</td>
                <td>{staff.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderMemberAccounts = () => (
    <div className="content">
      <h2>Member Accounts</h2>
      {membersList.length === 0 ? (
        <p>No member accounts found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {membersList.map((member) => (
              <tr key={member.id}>
                <td>{`${member.first_name} ${member.middle_name} ${member.last_name}`}</td>
                <td>{member.email}</td>
                <td>{member.contact_number}</td>
                <td>{member.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderPendingUsers = () => (
    <div className="content">
      <h2>Pending User Registrations</h2>
      {pendingUsers.length === 0 ? (
        <p>No pending registrations.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Birthday</th>
              <th>Email</th>
              <th>Address</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user.pending_id}>
                <td>{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix || ""}`}</td>
                <td>{user.sex}</td>
                <td>{user.birthday}</td>
                <td>{user.email}</td>
                <td>{`${user.street}, ${user.barangay}, ${user.municipality}, ${user.province} ${user.zip_code}`}</td>
                <td>{user.status}</td>
                <td>{user.remarks}</td>
                <td>{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "staff":
        return renderStaffAccounts();
      case "members":
        return renderMemberAccounts();
      case "pending":
        return <PendingUsers pendingUsers={pendingUsers} />;
      case "settings":
        return <h2>Settings</h2>;
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
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}
