<?php
// fetch_member_accounts.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../dbconn.php';

$response = ['success' => false, 'members' => []];

try {
    $stmt = $conn->prepare("
        SELECT 
            account_id, 
            first_name, 
            middle_name, 
            last_name, 
            email, 
            contact_number, 
            status AS account_status,
            created_at,
            updated_at
        FROM accounts
        WHERE status = 'Approved'
        ORDER BY created_at DESC
    ");
    
    $stmt->execute();
    $result = $stmt->get_result();

    $membersList = [];
    while ($row = $result->fetch_assoc()) {
        $membersList[] = $row;
    }

    $response['success'] = true;
    $response['members'] = $membersList;

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
