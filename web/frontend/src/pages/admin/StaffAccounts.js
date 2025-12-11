// src/pages/admin/StaffAccounts.js
import React, { useEffect, useState } from "react";
import "./StaffAccounts.css";

// Import icons
import viewIcon from "../../images/eye_open.png";
import editIcon from "../../images/edit_pencil.svg";
import deleteIcon from "../../images/delete.svg";

export default function StaffAccounts() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch staff accounts
  const fetchStaff = async () => {
    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/admin/fetch_staff_accounts.php"
      );

      const data = await res.json();

      if (data.success) {
        setStaff(data.staff);
      } else {
        setStaff([]);
      }
    } catch (err) {
      console.error("Error fetching staff accounts:", err);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filter staff
  const filteredStaff = staff.filter((s) => {
    const fullName = `${s.lastName} ${s.suffix ? s.suffix + "." : ""} ${s.firstName} ${s.middleName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employerID.toString().includes(searchTerm)
    );
  });

  return (
    <div className="content">
      <h2>Staff Accounts</h2>

      {/* 🔍 Search Bar */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search staff..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>EMPLOYEE ID</th>
              <th>COMPANY</th>
              <th>EMPLOYEE NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>DATE CREATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">Loading...</td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
                  No staff accounts found.
                </td>
              </tr>
            ) : (
              filteredStaff.map((s) => (
                <tr key={s.userID}>
                  <td>{s.employerID}</td>
                  <td>{s.companyName}</td>
                  <td>
                    {s.lastName} {s.suffix && s.suffix + "."},{" "}
                    {s.firstName} {s.middleName}
                  </td>
                  <td>{s.email}</td>
                  <td>{s.role}</td>
                  <td>{s.created_at}</td>

                  {/* ACTION ICONS */}
                  <td className="action-icons">
                    <img
                      src={viewIcon}
                      alt="View"
                      className="icon icon-view"
                      title="View"
                    />
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="icon icon-edit"
                      title="Edit"
                    />
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="icon icon-delete"
                      title="Delete"
                    />
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
