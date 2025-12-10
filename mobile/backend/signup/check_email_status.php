<?php
header('Content-Type: application/json');
include '../dbconn.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || empty($data['email'])) {
    echo json_encode(['error' => 'Email is required']);
    exit;
}

$email = $data['email'];

// Prepare statement to avoid SQL injection
$stmt = $conn->prepare("SELECT status FROM accounts WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        'exists' => true,
        'status' => $row['status']
    ]);
} else {
    echo json_encode([
        'exists' => false
    ]);
}

$stmt->close();
$conn->close();
