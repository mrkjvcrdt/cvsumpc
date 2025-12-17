<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../dbconn.php'; // adjust path if needed

$response = ['success' => false, 'loanApplications' => []];

try {
    $sql = "SELECT la.application_id,
                   CONCAT(a.last_name, ' ', IFNULL(a.suffix, ''), ', ', a.first_name) AS name,
                   lt.name AS loan_type,
                   la.amount,
                   la.application_date,
                   la.status
            FROM loan_application la
            JOIN accounts a ON la.account_id = a.account_id
            JOIN loan_type lt ON la.type_id = lt.type_id
            ORDER BY la.application_date DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $loanRequests = [];
    while ($row = $result->fetch_assoc()) {
        $loanRequests[] = $row;
    }

    $response['success'] = true;
    $response['loanApplications'] = $loanRequests;

} catch (Exception $e) {
    $response['message'] = "Error: " . $e->getMessage();
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>
