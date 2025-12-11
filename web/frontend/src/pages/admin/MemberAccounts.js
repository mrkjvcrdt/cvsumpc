// src/pages/admin/MemberAccounts.js
import React, { useEffect, useState } from "react";
import "./MemberAccounts.css";

// Import icons
import viewIcon from "../../images/eye_open.png";
import editIcon from "../../images/edit_pencil.svg";
import deleteIcon from "../../images/delete.svg";

export default function MemberAccounts() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/admin/fetch_member_accounts.php"
      );
      const data = await res.json();

      if (data.success) {
        setMembers(data.members);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members
  const filteredMembers = members.filter((m) => {
    const fullName = `${m.last_name} ${m.suffix ? m.suffix + "." : ""} ${m.first_name} ${m.middle_name}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.contact_number.includes(searchTerm)
    );
  });

  return (
    <div className="content">
      <h2>Member Accounts</h2>

      <div className="table-controls">
        <input
          type="text"
          placeholder="Search members..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>CONTACT NUMBER</th>
              <th>STATUS</th>
              <th>DATE CREATED</th>
              <th>LAST UPDATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">Loading...</td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", color: "red", fontWeight: "bold" }}
                >
                  No approved member accounts found.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => (
                <tr key={m.account_id}>
                  <td>
                    {m.last_name} {m.suffix && m.suffix + "."},{" "}
                    {m.first_name} {m.middle_name}
                  </td>
                  <td>{m.email}</td>
                  <td>{m.contact_number}</td>
                  <td>{m.account_status}</td>
                  <td>{m.created_at}</td>
                  <td>{m.updated_at}</td>

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
