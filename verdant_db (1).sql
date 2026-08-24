-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 24, 2026 at 09:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `verdant_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `total_amount`, `created_at`) VALUES
(1, 18.50, '2026-08-23 23:09:04'),
(2, 227.18, '2026-08-24 07:10:07');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`) VALUES
(1, 'Organic Honeycrisp Apples', 'Fruits', 4.99, 'images/apple.jpg'),
(2, 'Heirloom Local Tomatoes', 'Vegetables', 5.20, 'images/tomato.jpg'),
(3, 'Grass-Fed Angus Ribeye', 'Meat & Seafood', 18.50, 'images/ribeye.jpg'),
(4, 'Artisan Farmhouse Cheddar', 'Dairy & Eggs', 6.75, 'images/cheddar.jpg'),
(5, 'Single-Origin Stone-Ground Organic Dark Chocolate', 'Pantry', 3.75, 'images/chocolate.jpg'),
(6, 'Cold-Brew Organic Single-Origin Iced Coffee', 'Beverages', 4.50, 'images/icedcoffee.jpg'),
(7, 'Hass Avocados (3-Pack)', 'Fruits', 3.49, 'images/avocado.jpg'),
(8, 'Organic Heirloom Blood Oranges', 'Fruits', 5.50, 'images/oranges.jpg'),
(9, 'Organic Sweet Rainier Cherries', 'Fruits', 8.99, 'images/cherries.jpg'),
(10, 'Organic Golden Kiwi Fruit', 'Fruits', 4.25, 'images/kiwi.jpg'),
(11, 'Organic Heirloom Rainbow Carrots', 'Vegetables', 3.75, 'images/carrots.jpg'),
(12, 'Organic Tri-Color Bell Peppers', 'Vegetables', 4.50, 'images/bellpeppers.jpg'),
(13, 'Organic English Cucumber', 'Vegetables', 2.25, 'images/cucumber.jpg'),
(14, 'Organic Fresh Broccoli Crowns', 'Vegetables', 2.99, 'images/broccoli.jpg'),
(15, 'Grass-Fed Ground Sirloin', 'Meat & Seafood', 8.50, 'images/sirloin.jpg'),
(16, 'Pasture-Raised Organic Chicken Breast', 'Meat & Seafood', 9.99, 'images/chicken_breast.jpg'),
(17, 'Wild-Caught Alaskan Sockeye Salmon Fillet', 'Meat & Seafood', 16.75, 'images/salmon_fillet.jpg'),
(18, 'Wild Gulf White Shrimp', 'Meat & Seafood', 14.50, 'images/shrimp.jpg'),
(19, 'Pasture-Raised Heritage Pork Chops', 'Meat & Seafood', 11.25, 'images/pork_chops.jpg'),
(20, 'Pasture-Raised Organic Large Brown Eggs', 'Dairy & Eggs', 6.50, 'images/eggs.jpg'),
(21, 'Organic Whole Grass-Fed Milk', 'Dairy & Eggs', 4.80, 'images/milk.jpg'),
(22, 'French-Style Organic Crème Fraîche', 'Dairy & Eggs', 4.50, 'images/creme_fraiche.jpg'),
(23, 'Artisan Organic Greek Whole Milk Yogurt', 'Dairy & Eggs', 6.25, 'images/yogurt.jpg'),
(24, 'Organic Cream Cheese Block', 'Dairy & Eggs', 3.99, 'images/cream_cheese.jpg'),
(25, 'Organic Whole Wheat Spaghetti', 'Pantry', 3.25, 'images/spaghetti.jpg'),
(26, 'Organic Long-Grain White Rice', 'Pantry', 3.99, 'images/white_rice.jpg'),
(27, 'Organic Refined Coconut Oil', 'Pantry', 7.50, 'images/coconut_oil.jpg'),
(28, 'Organic Whole Black Peppercorns', 'Pantry', 4.50, 'images/black_pepper.jpg'),
(29, 'Organic Light Brown Sugar', 'Pantry', 2.99, 'images/brown_sugar.jpg'),
(30, 'Organic Iodized Sea Salt', 'Pantry', 2.49, 'images/sea_salt.jpg'),
(31, 'Organic Whole Milk', 'Beverages', 4.85, 'images/whole_milk.jpg'),
(32, '100% Pure Organic Orange Juice', 'Beverages', 4.50, 'images/orange_juice.jpg'),
(33, 'Organic Pure Apple Juice', 'Beverages', 3.99, 'images/apple_juice.jpg'),
(34, 'Pure Organic Coconut Water', 'Beverages', 2.75, 'images/coconut_water.jpg'),
(35, 'Organic Brewed Green Tea', 'Beverages', 3.25, 'images/green_tea.jpg'),
(36, 'Purified Artesian Spring Water', 'Beverages', 1.99, 'images/spring_water.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
