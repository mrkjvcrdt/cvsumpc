// src/pages/EmployerDashboard.js
import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
  FaHistory,
  FaFileInvoice,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../images/cvsumpc_logo.jpg";
import "./EmployerDashboard.css";

// Import your pages
import LoanRequests from "./employer/LoanRequests";
import ActiveLoans from "./employer/ActiveLoans";
import Payments from "./employer/Payments";

function DashboardOverview({ membersCount, activeLoansCount, pendingLoansCount, paymentsCollected }) {
  return (
    <div className="content">
      <h2>Dashboard Overview</h2>
      <div className="cards">
        <div className="card">
          <h3>{membersCount}</h3>
          <p>Members</p>
        </div>
        <div className="card">
          <h3>{activeLoansCount}</h3>
          <p>Active Loans</p>
        </div>
        <div className="card">
          <h3>{pendingLoansCount}</h3>
          <p>Pending Requests</p>
        </div>
        <div className="card">
          <h3>₱{paymentsCollected.toLocaleString()}</h3>
          <p>Payments Collected</p>
        </div>
      </div>
    </div>
  );
}

function MembersList({ membersList }) {
  return (
    <div className="content">
      <h2>Members & Loan History</h2>
      {membersList.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {membersList.map((member) => (
              <tr key={member.id}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
                <td>{member.contactNumber}</td>
                <td>{member.address}</td>
                <td>{member.joined_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [membersCount, setMembersCount] = useState(0);
  const [activeLoansCount, setActiveLoansCount] = useState(0);
  const [pendingLoansCount, setPendingLoansCount] = useState(0);
  const [paymentsCollected, setPaymentsCollected] = useState(0);
  const [membersList, setMembersList] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://localhost/cvsumpc/web/backend/get_dashboard_data.php");
      const data = await res.json();

      if (data.success) {
        setMembersCount(data.membersCount);
        setActiveLoansCount(data.activeLoansCount);
        setPendingLoansCount(data.pendingLoansCount);
        setPaymentsCollected(data.paymentsCollected);
        setMembersList(data.membersList);
      } else {
        console.error("Backend returned error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/Employer"; // redirect back to login
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            membersCount={membersCount}
            activeLoansCount={activeLoansCount}
            pendingLoansCount={pendingLoansCount}
            paymentsCollected={paymentsCollected}
          />
        );
      case "requests":
        return <LoanRequests />;
      case "loans":
        return <ActiveLoans />;
      case "members":
        return <MembersList membersList={membersList} />;
      case "payments":
        return <Payments />;
      case "reports":
        return <h2>Reports</h2>;
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
          <h2>CVSUMPC</h2>
        </div>
        <nav>
          <ul>
            <li onClick={() => setActiveTab("dashboard")}>
              <FaTachometerAlt /> Dashboard
            </li>
            <li onClick={() => setActiveTab("requests")}>
              <FaClipboardList /> Loan Requests
            </li>
            <li onClick={() => setActiveTab("loans")}>
              <FaMoneyBillWave /> Active Loans
            </li>
            <li onClick={() => setActiveTab("members")}>
              <FaUsers /> Members
            </li>
            <li onClick={() => setActiveTab("payments")}>
              <FaFileInvoice /> Payments
            </li>
            <li onClick={() => setActiveTab("reports")}>
              <FaHistory /> Reports
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
