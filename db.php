<?php

$host = "localhost";
$username = "4784693_verdant_db";
$password = ".AM#p9)@5W!2kpuC";
$dbname = "4784693_verdant_db";
$port = 3306;

try {

    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ];

    $pdo = new PDO(
        $dsn,
        $username,
        $password,
        $options
    );

} catch (PDOException $e) {

    error_log(
        "Database connection failed: " . $e->getMessage()
    );

    die(
        "Database connection failed. Please check your MySQL configuration."
    );
}
?>