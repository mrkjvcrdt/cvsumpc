// src/pages/admin/PendingUsers.js
import React, { useEffect, useState } from "react";
import "./PendingUsers.css";

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({}); // Track which user is being processed

  // Fetch pending users
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/admin/fetch_pending_users.php"
      );
      const data = await res.json();

      if (data.success) {
        setPendingUsers(data.pendingUsers);
      } else {
        setPendingUsers([]);
      }
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Handle Approve / Reject
  const handleAction = async (pending_id, action) => {
    const confirmMsg =
      action === "approve"
        ? "Are you sure you want to approve this pending user?"
        : "Are you sure you want to reject this pending user?";
    if (!window.confirm(confirmMsg)) return;

    setProcessing({ ...processing, [pending_id]: true });

    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/admin/update_pending_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pending_id, action }),
        }
      );

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        fetchPendingUsers(); // Refresh table
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Something went wrong.");
    } finally {
      setProcessing({ ...processing, [pending_id]: false });
    }
  };

  return (
    <div className="content">
      <h2>Pending User Registrations</h2>

      <div className="table-wrapper">
        <table className="pending-users-table">
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : pendingUsers.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No records found.
                </td>
              </tr>
            ) : (
              pendingUsers.map((user) => (
                <tr key={user.pending_id}>
                  <td>
                    {user.first_name} {user.middle_name} {user.last_name}{" "}
                    {user.suffix || ""}
                  </td>
                  <td>{user.sex}</td>
                  <td>{user.birthday}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.street}, {user.barangay}, {user.municipality},{" "}
                    {user.province} {user.zip_code}
                  </td>
                  <td>{user.status}</td>
                  <td>{user.remarks}</td>
                  <td>{user.created_at}</td>
                  <td className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() => handleAction(user.pending_id, "approve")}
                      disabled={processing[user.pending_id]}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleAction(user.pending_id, "reject")}
                      disabled={processing[user.pending_id]}
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
