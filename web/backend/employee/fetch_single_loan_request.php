<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../dbconn.php';

$data = json_decode(file_get_contents("php://input"), true);
$application_id = $data['application_id'] ?? null;

$response = ["success" => false];

if (!$application_id) {
    $response["message"] = "Application ID is required.";
    echo json_encode($response);
    exit;
}

$sql = "SELECT 
            la.*,
            CONCAT(a.last_name, ' ', IFNULL(a.suffix, ''), ', ', a.first_name) AS applicant_name,
            lt.name AS loan_type
        FROM loan_application la
        JOIN accounts a ON la.account_id = a.account_id
        JOIN loan_type lt ON la.type_id = lt.type_id
        WHERE la.application_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $application_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $response["success"] = true;
    $response["data"] = $result->fetch_assoc();
} else {
    $response["message"] = "Loan request not found.";
}

echo json_encode($response);
$stmt->close();
$conn->close();
