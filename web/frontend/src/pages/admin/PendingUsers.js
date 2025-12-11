// src/pages/admin/PendingUsers.js
import React, { useEffect, useState } from "react";
import "./PendingUsers.css";

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch pending accounts
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/admin/fetch_pending_accounts.php"
      );
      const data = await res.json();

      if (data.success) {
        setPendingUsers(data.pendingUsers);
      } else {
        setPendingUsers([]);
      }
    } catch (err) {
      console.error("Error fetching pending accounts:", err);
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Approve / Reject
  const handleAction = async (account_id, action) => {
    const confirmMsg =
      action === "approve" ? "Approve this account?" : "Reject this account?";
    if (!window.confirm(confirmMsg)) return;

    setProcessing({ ...processing, [account_id]: true });

    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/admin/update_account_status.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account_id, action }),
        }
      );

      const data = await res.json();
      alert(data.message);

      if (data.success) fetchPendingUsers();
    } catch (err) {
      console.error("Error updating account:", err);
      alert("Something went wrong.");
    } finally {
      setProcessing({ ...processing, [account_id]: false });
    }
  };

  // Filter results
  const filteredUsers = pendingUsers.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(search) ||
      user.last_name.toLowerCase().includes(search) ||
      user.middle_name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.contact_number.toLowerCase().includes(search) ||
      user.barangay.toLowerCase().includes(search) ||
      user.municipality.toLowerCase().includes(search) ||
      user.province.toLowerCase().includes(search)
    );
  });

  return (
    <div className="content">
      <h2>Pending Accounts</h2>

      {/* 🔍 Search Bar aligned to the right */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            width: "250px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div className="table-wrapper">
        <table className="pending-users-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Contact</th>
              <th>E-mail Address</th>
              <th>Home Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">Loading...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
                  No result found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.account_id}>
                  <td>
                    {user.last_name} {user.suffix && user.suffix + "."},{" "}
                    {user.first_name} {user.middle_name}
                  </td>

                  <td>{user.contact_number}</td>
                  <td>{user.email}</td>

                  <td>
                    {user.barangay}, {user.municipality}, {user.province}
                  </td>

                  <td>{user.status}</td>

                  <td className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() => handleAction(user.account_id, "approve")}
                      disabled={processing[user.account_id]}
                    >
                      Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => handleAction(user.account_id, "reject")}
                      disabled={processing[user.account_id]}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
