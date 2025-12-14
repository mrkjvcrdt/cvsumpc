import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaFacebook } from "react-icons/fa";
import logo from "../images/cvsumpc_logo.jpg";
import background from "../images/CvSU-Front.jpg";
import coopLogo from "../images/cvsumpc_logo.jpg";
import "./Employer.css";
import { useNavigate } from "react-router-dom";

export default function Employer() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState(""); // can be email or employee ID
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields (still available, uses register.php)
  const [form, setForm] = useState({
    employerID: "",
    companyName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle login
  const handleLogin = async () => {
    if (!loginIdentifier || !loginPassword) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost/cvsumpc/web/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier, // email or employeeID
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ " + data.message);

        // Redirect based on role
        if (data.role === "admin") {
          sessionStorage.setItem("admin_logged_in", "true");
          navigate("/admin-dashboard", { replace: true });
        } else if (data.role === "employer") {
          sessionStorage.setItem("employer_logged_in", "true");
          navigate("/employer-dashboard", { replace: true });
        } else {
          setMessage("⚠️ Unknown role: " + data.role);
        }
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error connecting to server.1");
    }
  };

  // Handle registration (still available if needed)
  const handleSignUp = async () => {
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost/cvsumpc/web/backend/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) setShowSignUp(false);
    } catch {
      setMessage("❌ Error connecting to server.2");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="contact-info">
          <a href="tel:#########">
            <FaPhone /> (046) 415-1605
          </a>
          <a href="mailto:contactus@csu.coop">
            <FaEnvelope /> contactus@csu.coop
          </a>
          <a
            href="https://www.facebook.com/csudc.indangcavite"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebook /> CvSU Multipurpose Cooperative
          </a>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="CVSUMPC Logo" className="logo" />
          <span>CVSUMPC</span>
        </div>
        <div className="nav-right">
          <a href="/" className="nav-link">
            Member
          </a>
          <a href="/employer" className="nav-link active">
            Employer
          </a>
          <a href="/about" className="nav-link">
            About
          </a>
        </div>
      </nav>

      {/* Employer Section */}
      <main className="employer-main" style={{ backgroundImage: `url(${background})` }}>
        <div className="auth-card">
          <img src={coopLogo} alt="Logo" className="form-logo" />
          <h2>Employer Login</h2>

          {/* Login Inputs */}
          <input
            type="text"
            placeholder="Email or Employee ID"
            value={loginIdentifier}
            onChange={(e) => setLoginIdentifier(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button className="btn" onClick={handleLogin}>
            Login
          </button>

          <p className="signup-text">
            Don't have an account?{" "}
            <button className="link-btn" onClick={() => setShowSignUp(true)}>
              Sign Up
            </button>
          </p>

          <button className="btn-secondary" onClick={() => navigate("/registerstaff")}>
            Register Staff
          </button>

          {message && <p className="message">{message}</p>}
        </div>
      </main>

      {/* Registration Modal */}
      {showSignUp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Employer Registration</h2>
            {[
              "employerID",
              "companyName",
              "firstName",
              "middleName",
              "lastName",
              "suffix",
              "email",
              "password",
              "confirmPassword",
            ].map((field) => (
              <input
                key={field}
                type={field.includes("password") ? "password" : "text"}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            ))}
            <button className="btn" onClick={handleSignUp}>
              Register
            </button>
            <button className="close-btn" onClick={() => setShowSignUp(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} CVSUMPC. All rights reserved.</p>
      </footer>
    </>
  );
}
