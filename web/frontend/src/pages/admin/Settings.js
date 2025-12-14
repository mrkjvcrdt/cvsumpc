// src/pages/admin/Settings.js
import React, { useEffect, useState } from "react";
import "./Settings.css";
import editIcon from "../../images/edit_pencil.svg";
import AddLoanType from "./modals/AddLoanType";

export default function Settings() {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchLoanTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/admin/fetch_loan_types.php"
      );
      const data = await res.json();
      if (data.success) {
        setLoanTypes(data.loanTypes);
      } else {
        setLoanTypes([]);
      }
    } catch (err) {
      console.error("Error fetching loan types:", err);
      setLoanTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanTypes();
  }, []);

  const filteredLoanTypes = loanTypes.filter((lt) =>
    lt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="settings-content">
      <div className="loan-type-box">
        {/* Title and Add Button */}
        <div className="header-row">
          <h2>Loan Type Settings</h2>
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            + Add Loan Type
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-row">
          <input
            type="text"
            placeholder="Search loan types..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="settings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Rate (%)</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredLoanTypes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-result">
                    No loan types found.
                  </td>
                </tr>
              ) : (
                filteredLoanTypes.map((lt) => (
                  <tr key={lt.type_id}>
                    <td>{lt.type_id}</td>
                    <td>{lt.name}</td>
                    <td>{lt.rate_percentage}</td>
                    <td>{lt.created_at}</td>
                    <td>{lt.updated_at}</td>
                    <td className="action-icons">
                      <img
                        src={editIcon}
                        alt="Edit"
                        className="icon icon-edit"
                        title="Edit"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Loan Type Modal */}
      {showAddModal && (
        <AddLoanType
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchLoanTypes}
        />
      )}
    </div>
  );
}
