<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "dbconn.php";

// Read JSON input from frontend
$data = json_decode(file_get_contents("php://input"), true);
$identifier = $data["identifier"] ?? "";
$password = $data["password"] ?? "";

// Validate fields
if (empty($identifier) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Please fill in all fields."]);
    exit;
}

// Prepare query: match either email or employerID (consistent with frontend)
$stmt = $conn->prepare("SELECT * FROM staffuser WHERE email = ? OR employerID = ?");
$stmt->bind_param("ss", $identifier, $identifier);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verify password hash
    if (password_verify($password, $user["password"])) {
        echo json_encode([
            "success" => true,
            "message" => "Login successful!",
            "role" => $user["role"],
            "user" => [
                "id" => $user["id"] ?? null,
                "firstName" => $user["firstName"] ?? "",
                "lastName" => $user["lastName"] ?? "",
                "email" => $user["email"] ?? "",
                "employerID" => $user["employerID"] ?? "",
                "companyName" => $user["companyName"] ?? "",
                "role" => $user["role"] ?? "",
            ],
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No user found with that Email or Employer ID."]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
