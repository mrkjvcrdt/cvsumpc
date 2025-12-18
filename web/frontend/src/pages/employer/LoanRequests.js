import React, { useEffect, useState } from "react";
import "./LoanRequests.css";

// Action components
import ViewLoanRequest from "./actions/view_loan_request";

// Action icons
import viewIcon from "../../images/eye_open.png";

export default function LoanRequests() {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const fetchLoanRequests = async () => {
    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/employee/fetch_loan_requests.php"
      );
      const data = await res.json();
      if (data.success) {
        setLoanRequests(data.loanApplications);
      } else {
        setLoanRequests([]);
      }
    } catch (err) {
      console.error("Error fetching loan requests:", err);
      setLoanRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  const filteredRequests = loanRequests.filter(
    (lr) =>
      lr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lr.loan_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lr.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="loan-requests-content">
      <h2>Loan Requests</h2>

      {/* Search */}
      <div className="loan-requests-controls">
        <input
          type="text"
          placeholder="Search loan requests..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="loan-requests-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>LOAN TYPE</th>
              <th>AMOUNT</th>
              <th>DATE APPLIED</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">Loading...</td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-result">No loan requests found.</td>
              </tr>
            ) : (
              filteredRequests.map((lr) => (
                <tr key={lr.application_id}>
                  <td>{lr.name}</td>
                  <td>{lr.loan_type}</td>
                  <td>{lr.amount}</td>
                  <td>{lr.application_date}</td>
                  <td>{lr.status}</td>
                  <td className="action-icons">
                    <img 
                      src={viewIcon}
                      alt="View" 
                      className="icon icon-view"
                      title="View" 
                      onClick={() => setSelectedApplicationId(lr.application_id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {selectedApplicationId && (
          <ViewLoanRequest
            applicationId={selectedApplicationId}
            onClose={() => setSelectedApplicationId(null)}
          />
        )}
      </div>
    </div>
  );
}
