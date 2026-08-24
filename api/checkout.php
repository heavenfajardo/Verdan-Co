<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../db.php';

try {

    $rawData = file_get_contents('php://input');

    $data = json_decode($rawData, true);

    if (!is_array($data)) {

        http_response_code(400);

        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request data.'
        ]);

        exit;
    }


    if (empty($data['cart']) || !is_array($data['cart'])) {

        echo json_encode([
            'status' => 'error',
            'message' => 'Cart is empty.'
        ]);

        exit;
    }


    $total = 0;


    foreach ($data['cart'] as $item) {

        if (
            !isset($item['price']) ||
            !isset($item['quantity'])
        ) {
            continue;
        }

        $price = (float) $item['price'];

        $quantity = (int) $item['quantity'];

        if ($price < 0 || $quantity <= 0) {
            continue;
        }

        $total += $price * $quantity;
    }


    if ($total <= 0) {

        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid cart total.'
        ]);

        exit;
    }


    $stmt = $pdo->prepare(
        "INSERT INTO orders (total_amount)
         VALUES (?)"
    );


    $stmt->execute([
        $total
    ]);


    echo json_encode([
        'status' => 'success',
        'message' => 'Order recorded successfully!',
        'total' => number_format($total, 2)
    ]);


} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to process the order.'
    ]);

}