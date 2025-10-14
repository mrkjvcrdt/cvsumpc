// src/pages/admin/PendingUsers.js
import React, { useEffect, useState } from "react";
import "./PendingUsers.css"; // Create a CSS file for table styling

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
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

    fetchPendingUsers();
  }, []);

  return (
    <div className="content">
      <h2>Pending User Registrations</h2>
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
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : pendingUsers.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No records found.
              </td>
            </tr>
          ) : (
            pendingUsers.map((user) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
