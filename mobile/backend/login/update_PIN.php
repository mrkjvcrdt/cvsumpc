<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../dbconn.php'; // Make sure path is correct

// Read JSON from request body
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['account_id']) || !isset($input['pin'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing data",
        "input" => $input
    ]);
    exit;
}

$account_id = intval($input['account_id']);
$pin = $input['pin'];

// Hash the PIN
$hashed_pin = password_hash($pin, PASSWORD_DEFAULT);

// Update accounts table
$query = "UPDATE accounts SET PIN = ? WHERE account_id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("si", $hashed_pin, $account_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "PIN updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No rows updated. Check account_id",
            "account_id" => $account_id
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
