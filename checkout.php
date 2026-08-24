<?php
include 'db.php';

// Get JSON data sent from JavaScript fetch
$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['cart'])) {
    $total = 0;
    foreach ($data['cart'] as $item) {
        $total += $item['price'] * $item['quantity'];
    }

    // Insert order into database
    $stmt = $pdo->prepare("INSERT INTO orders (total_amount) VALUES (?)");
    $stmt->execute([$total]);

    echo json_encode(['status' => 'success', 'message' => 'Order recorded successfully!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Cart is empty.']);
}
?>