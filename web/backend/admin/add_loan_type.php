<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../dbconn.php'; // adjust path if needed

$response = ["success" => false];

$data = json_decode(file_get_contents("php://input"), true);

// Validate input
$name = trim($data['name'] ?? '');
$rate = trim($data['rate_percentage'] ?? '');

if (!$name || !$rate || !is_numeric($rate)) {
    $response['message'] = "Invalid input. Name and numeric rate are required.";
    echo json_encode($response);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO loan_type (name, rate_percentage, created_at, updated_at) VALUES (?, ?, NOW(), NOW())");
    $stmt->bind_param("sd", $name, $rate);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Loan type added successfully.";
    } else {
        $response['message'] = "Failed to add loan type.";
    }

} catch (Exception $e) {
    $response['message'] = "Error: " . $e->getMessage();
}

echo json_encode($response);

$stmt->close();
$conn->close();
