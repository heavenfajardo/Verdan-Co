<?php

$host = getenv('DB_HOST') ?: 'mysql-3a335e21-heaven-portfolio.d.aivencloud.com';
$username = getenv('DB_USER') ?: 'avnadmin';
$password = getenv('DB_PASS') ?: '';
$dbname = getenv('DB_NAME') ?: 'defaultdb';
$port = getenv('DB_PORT') ?: '14870';

$caCert = __DIR__ . '/ca.pem';

try {

    if ($password === '') {
        throw new RuntimeException(
            'DB_PASS environment variable is not configured.'
        );
    }

    if (!file_exists($caCert)) {
        throw new RuntimeException(
            'ca.pem certificate file is missing.'
        );
    }

    $dsn =
        "mysql:host={$host};" .
        "port={$port};" .
        "dbname={$dbname};" .
        "charset=utf8mb4";

    $options = [
        PDO::ATTR_ERRMODE =>
            PDO::ERRMODE_EXCEPTION,

        PDO::ATTR_DEFAULT_FETCH_MODE =>
            PDO::FETCH_ASSOC,

        PDO::ATTR_EMULATE_PREPARES =>
            false,

        PDO::MYSQL_ATTR_SSL_CA =>
            $caCert
    ];

    $pdo = new PDO(
        $dsn,
        $username,
        $password,
        $options
    );

} catch (Throwable $e) {

    error_log(
        'Database connection failed: ' .
        $e->getMessage()
    );

    throw new RuntimeException(
        'Database connection failed.'
    );
}