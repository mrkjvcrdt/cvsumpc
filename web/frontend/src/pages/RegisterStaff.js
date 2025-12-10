import { useState } from "react";

export default function RegisterStaff() {
  const [form, setForm] = useState({
    employerID: "",
    companyName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    password: "",
    role: "employer", // default
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_HOST = "localhost"; // Replace with your actual API host
      const res = await fetch(`http://${API_HOST}/cvsumpc/web/backend/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("❌ Error connecting to server.");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h2>Register Employer Account</h2>
      <form onSubmit={handleSubmit}>
        <input name="employerID" placeholder="Employer ID" onChange={handleChange} required /><br />
        <input name="companyName" placeholder="Company Name" onChange={handleChange} required /><br />
        <input name="firstName" placeholder="First Name" onChange={handleChange} required /><br />
        <input name="middleName" placeholder="Middle Name" onChange={handleChange} /><br />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required /><br />
        <input name="suffix" placeholder="Suffix (e.g. Jr., III)" onChange={handleChange} /><br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select><br /><br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
