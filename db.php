<?php
$host = "mysql-3a335e21-heaven-portfolio.d.aivencloud.com";
$username = "avnadmin";
$password = "AVNS_ZH3Ra5dOJLcYbjDR6j-";
$dbname = "defaultdb";
$port = "14870";
$caCert = __DIR__ . "/ca.pem"; // Make sure your ca.pem file is in the same folder

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_SSL_CA       => $caCert,
    ];

    $pdo = new PDO($dsn, $username, $password, $options);

} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>