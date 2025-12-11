<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include "../../config/db.php"; // adjust path if needed

// Check required fields
if (!isset($_POST['user_id']) || !isset($_POST['pin'])) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

$user_id = intval($_POST['user_id']);
$pin = $_POST['pin'];

// OPTIONAL: hash the PIN (recommended)
$hashed_pin = password_hash($pin, PASSWORD_DEFAULT);

$query = "UPDATE accounts SET PIN = ? WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("si", $hashed_pin, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "PIN updated"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}

$stmt->close();
$conn->close();
?>
