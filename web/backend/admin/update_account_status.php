<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include '../dbconn.php';

$data = json_decode(file_get_contents("php://input"), true);

$account_id = $data["account_id"] ?? null;
$action = $data["action"] ?? null;

if (!$account_id || !$action) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit;
}

$status = ($action === "approve") ? "Approved" : "Rejected";

// 🔍 IMPORTANT: make sure the column name is CORRECT
$sql = "UPDATE accounts SET status = ?, updated_at = NOW() WHERE account_id = ?";

$stmt = $conn->prepare($sql);

// --- DEBUG: check if prepare failed ---
if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "SQL prepare failed: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("si", $status, $account_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Account has been " . strtolower($status) . "."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Execution failed: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
