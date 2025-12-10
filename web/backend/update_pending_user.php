<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../dbconn.php';

$data = json_decode(file_get_contents("php://input"), true);

// Required fields
$pending_id = $data['pending_id'] ?? null;
$status = $data['status'] ?? null; // "approved" or "rejected"
$remarks = $data['remarks'] ?? null;

if (!$pending_id || !in_array($status, ['approved', 'rejected'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input."
    ]);
    exit;
}

// Get the pending user record
$stmt = $conn->prepare("SELECT * FROM pending_users WHERE pending_id = ?");
$stmt->bind_param("i", $pending_id);
$stmt->execute();
$result = $stmt->get_result();
$pendingUser = $result->fetch_assoc();
$stmt->close();

if (!$pendingUser) {
    echo json_encode([
        "success" => false,
        "message" => "Pending user not found."
    ]);
    exit;
}

// Update status and remarks in pending_users
$updateStmt = $conn->prepare("UPDATE pending_users SET status = ?, remarks = ? WHERE pending_id = ?");
$updateStmt->bind_param("ssi", $status, $remarks, $pending_id);
$updateStmt->execute();
$updateStmt->close();

// If approved, insert into accounts table without password
if ($status === "approved") {
    // Check if account already exists to prevent duplicates
    $checkStmt = $conn->prepare("SELECT * FROM accounts WHERE email = ?");
    $checkStmt->bind_param("s", $pendingUser['email']);
    $checkStmt->execute();
    $existing = $checkStmt->get_result()->fetch_assoc();
    $checkStmt->close();

    if (!$existing) {
        $insertStmt = $conn->prepare("
            INSERT INTO accounts (
                pending_id, first_name, middle_name, last_name, suffix, email, sex, birthday, street, barangay, municipality, province, zip_code, is_active, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
        ");

        $insertStmt->bind_param(
            "issssssssssss",
            $pendingUser['pending_id'],
            $pendingUser['first_name'],
            $pendingUser['middle_name'],
            $pendingUser['last_name'],
            $pendingUser['suffix'],
            $pendingUser['email'],
            $pendingUser['sex'],
            $pendingUser['birthday'],
            $pendingUser['street'],
            $pendingUser['barangay'],
            $pendingUser['municipality'],
            $pendingUser['province'],
            $pendingUser['zip_code']
        );

        $insertStmt->execute();
        $insertStmt->close();
    }
}

echo json_encode([
    "success" => true,
    "message" => "Pending user updated successfully.",
    "status" => $status
]);

$conn->close();
?>
