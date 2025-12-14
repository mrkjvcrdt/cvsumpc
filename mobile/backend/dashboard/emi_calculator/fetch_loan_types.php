<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
include '../../dbconn.php';

$query = "SELECT name, rate_percentage FROM loan_type";
$result = $conn->query($query);

$loanTypes = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $loanTypes[] = [
            "name" => $row['name'],
            "rate_percentage" => $row['rate_percentage']
        ];
    }
}

echo json_encode([
    "success" => true,
    "loan_types" => $loanTypes
]);

$conn->close();
?>
