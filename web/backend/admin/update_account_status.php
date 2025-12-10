<?php
header("Content-Type: application/json");
include '../dbconn.php';

$data = json_decode(file_get_contents("php://input"), true);

$account_id = $data["account_id"] ?? null;
$action = $data["action"] ?? null;

$response = ["success" => false];

if (!$account_id || !$action) {
    $response["message"] = "Missing required fields.";
    echo json_encode($response);
    exit;
}

$status = ($action === "approve") ? "Approved" : "Rejected";

try {
    $sql = "UPDATE accounts SET status = ?, updated_at = NOW() WHERE account_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $status, $account_id);

    if ($stmt->execute()) {
        $response["success"] = true;
        $response["message"] = "Account has been " . strtolower($status) . ".";
    } else {
        $response["message"] = "Failed to update account.";
    }

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

echo json_encode($response);
$stmt->close();
$conn->close();
