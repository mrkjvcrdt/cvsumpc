// src/pages/admin/modals/AddLoanType.js
import React, { useState } from "react";
import "./AddLoanType.css";

export default function AddLoanType({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null; // Do not render if modal is closed

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rate) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/cvsumpc/web/backend/admin/add_loan_type.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, rate_percentage: rate }),
        }
      );
      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        setName("");
        setRate("");
        onSuccess(); // Notify parent to refresh list
        onClose();   // Close modal
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error connecting to server.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Loan Type</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Loan Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Rate (%)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            step="0.01"
          />
          <div className="modal-buttons">
            <button type="submit" className="btn-submit">
              Add
            </button>
            <button type="button" className="btn-close" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
        {message && <p className="modal-message">{message}</p>}
      </div>
    </div>
  );
}
