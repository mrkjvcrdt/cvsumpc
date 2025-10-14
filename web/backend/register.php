<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'dbconn.php';

$data = json_decode(file_get_contents("php://input"), true);

// Safely extract values
$employerID = $data['employerID'] ?? '';
$companyName = $data['companyName'] ?? '';
$firstName = $data['firstName'] ?? '';
$middleName = $data['middleName'] ?? '';
$lastName = $data['lastName'] ?? '';
$suffix = !empty($data['suffix']) ? $data['suffix'] : null;
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'employer';

// Validate required fields
if (!$employerID || !$companyName || !$email || !$password) {
  echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
  exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Prepare SQL
$sql = "INSERT INTO staffuser (employerID, companyName, firstName, middleName, lastName, suffix, email, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssss", 
  $employerID, 
  $companyName, 
  $firstName, 
  $middleName, 
  $lastName, 
  $suffix, 
  $email, 
  $hashedPassword, 
  $role
);

// Execute + respond
if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "✅ Staff account created successfully!"]);
} else {
  echo json_encode(["success" => false, "message" => "❌ Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
