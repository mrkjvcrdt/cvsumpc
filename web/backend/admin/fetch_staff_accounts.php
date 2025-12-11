<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../dbconn.php';

$response = ["success" => false];

try {
    $sql = "SELECT userID, employerID, companyName, firstName, middleName, lastName, suffix, email, role, created_at 
            FROM staffuser 
            ORDER BY created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $staffList = [];

    while ($row = $result->fetch_assoc()) {
        $staffList[] = $row;
    }

    $response["success"] = true;
    $response["staff"] = $staffList;

} catch (Exception $e) {
    $response["message"] = $e->getMessage();
}

echo json_encode($response);

$conn->close();
