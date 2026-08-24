<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

try {

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

        http_response_code(405);

        echo json_encode([
            'status' => 'error',
            'message' => 'Method not allowed.'
        ]);

        exit;
    }


    $rawData = file_get_contents('php://input');


    if (
        $rawData === false ||
        trim($rawData) === ''
    ) {

        http_response_code(400);

        echo json_encode([
            'status' => 'error',
            'message' => 'Empty request.'
        ]);

        exit;
    }


    $data = json_decode(
        $rawData,
        true
    );


    if (
        !is_array($data) ||
        !isset($data['cart']) ||
        !is_array($data['cart'])
    ) {

        http_response_code(400);

        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid cart data.'
        ]);

        exit;
    }


    if (count($data['cart']) === 0) {

        http_response_code(400);

        echo json_encode([
            'status' => 'error',
            'message' => 'Cart is empty.'
        ]);

        exit;
    }


    $total = 0;


    foreach ($data['cart'] as $item) {

        if (!is_array($item)) {
            continue;
        }


        if (
            !isset($item['price']) ||
            !isset($item['quantity'])
        ) {
            continue;
        }


        $price = filter_var(
            $item['price'],
            FILTER_VALIDATE_FLOAT
        );


        $quantity = filter_var(
            $item['quantity'],
            FILTER_VALIDATE_INT
        );


        if (
            $price === false ||
            $quantity === false ||
            $price < 0 ||
            $quantity <= 0
        ) {
            continue;
        }


        $total += $price * $quantity;
    }


    if ($total <= 0) {

        http_response_code(400);

        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid cart total.'
        ]);

        exit;
    }


    $stmt = $pdo->prepare(
        "INSERT INTO orders (total_amount)
         VALUES (:total)"
    );


    $stmt->execute([
        ':total' => $total
    ]);


    echo json_encode([
        'status' => 'success',

        'message' => 'Order recorded successfully!',

        'total' => number_format(
            $total,
            2,
            '.',
            ''
        )
    ]);

} catch (Throwable $e) {

    error_log(
        'Checkout error: ' .
        $e->getMessage()
    );


    http_response_code(500);


    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to process the order.'
    ]);
}