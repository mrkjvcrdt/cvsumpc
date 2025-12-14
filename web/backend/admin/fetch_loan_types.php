<?php
// htdocs/cvsumpc/web/backend/admin/fetch_loan_types.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../dbconn.php'; // adjust path if needed

$response = ['success' => false, 'loanTypes' => []];

try {
    $sql = "SELECT type_id, name, rate_percentage, created_at, updated_at FROM loan_type ORDER BY type_id ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $loanTypes = [];
    while ($row = $result->fetch_assoc()) {
        $loanTypes[] = $row;
    }

    $response['success'] = true;
    $response['loanTypes'] = $loanTypes;

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);

$stmt->close();
$conn->close();
