// src/pages/employer/actions/ViewLoanRequest.js
import React, { useEffect, useState } from "react";
import "./view_loan_request.css";

export default function ViewLoanRequest({ applicationId, onClose }) {
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Approval states
  const [approvedAmount, setApprovedAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [expectedDisbursement, setExpectedDisbursement] = useState("");

  useEffect(() => {
    if (!applicationId) return;

    const fetchDetails = async () => {
      try {
        const res = await fetch(
          "http://localhost/cvsumpc/web/backend/employee/fetch_single_loan_request.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ application_id: applicationId }),
          }
        );

        const data = await res.json();
        if (data.success) {
          setLoan(data.data);
          setApprovedAmount(data.data.approved_amount || "");
          setStatus(data.data.status || "Pending");
          setExpectedDisbursement(data.data.expected_disbursement_date || "");
        }
      } catch (err) {
        console.error("Error loading loan request:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [applicationId]);

  // Handle status change
  useEffect(() => {
    if (loan && status === "Approved") {
      const today = new Date().toISOString().split("T")[0];
      setExpectedDisbursement(today);

      if (!approvedAmount) {
        setApprovedAmount(loan.amount);
      }
    } else if (loan) {
      setExpectedDisbursement(loan.expected_disbursement_date || "");
    }
  }, [status, loan]);

  const handleSave = async () => {
    if (!loan) return;

    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/employee/update_loan_request.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            application_id: loan.application_id,
            approved_amount: approvedAmount,
            status,
            expected_disbursement_date: expectedDisbursement || new Date().toISOString().split("T")[0],
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Loan request updated successfully!");
        onClose(); // close modal after saving
      } else {
        alert("Failed to update loan request: " + data.message);
      }
    } catch (err) {
      console.error("Error saving loan request:", err);
      alert("Error saving loan request.");
    }
  };

  if (!applicationId) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Loan Request Details</h3>

        {loading ? (
          <p>Loading...</p>
        ) : !loan ? (
          <p>Loan request not found.</p>
        ) : (
          <div className="details-grid">
            <div><strong>Applicant:</strong> {loan.applicant_name || "—"}</div>
            <div><strong>Loan Type:</strong> {loan.loan_type || "—"}</div>
            <div><strong>Amount:</strong> ₱{loan.amount || "—"}</div>
            <div><strong>Tenure:</strong> {loan.tenure || "—"} months</div>

            {/* Approval fields */}
            <div>
              <strong>Approved Amount:</strong>
              <input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                placeholder="Enter approved amount"
              />
            </div>

            <div>
              <strong>Status:</strong>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div><strong>Expected Disbursement:</strong> {expectedDisbursement || "—"}</div>
            <div><strong>Date Applied:</strong> {loan.application_date || "—"}</div>
            <div><strong>Created At:</strong> {loan.created_at || "—"}</div>
            <div><strong>Last Updated:</strong> {loan.updated_at || "—"}</div>

            {loan.payslip_pic && (
              <div className="full-width">
                <strong>Payslip:</strong>
                <br />
                <img
                  src={`http://localhost/cvsumpc/mobile/backend/${loan.payslip_pic}`}
                  alt="Payslip"
                  className="payslip-img"
                  style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>Close</button>
          {!loading && loan && (
            <button className="btn-save" onClick={handleSave}>Save</button>
          )}
        </div>
      </div>
    </div>
  );
}
