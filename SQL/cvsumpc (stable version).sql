-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 14, 2025 at 01:06 PM
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
-- Database: `cvsumpc`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `PIN` varchar(255) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `contact_number` varchar(20) NOT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `nationality` varchar(100) NOT NULL,
  `birthday` date DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `barangay` varchar(150) NOT NULL,
  `municipality` varchar(150) NOT NULL,
  `province` varchar(150) NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `account_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `email`, `password`, `PIN`, `last_name`, `first_name`, `middle_name`, `suffix`, `contact_number`, `gender`, `nationality`, `birthday`, `street`, `barangay`, `municipality`, `province`, `zipcode`, `status`, `account_status`, `created_at`, `updated_at`) VALUES
(1, 'test@example.com', '$2y$10$jfTg2GTL0aa2RsNK5ZgNOeLS450tEuAX0keOCFh4AoB10v/hx0Zcq', '$2y$10$GXacaPDCUtGIjqgejNiqx.LjXi9idwMtUSSPb4u1MrTT3ZnAKnRjS', 'Doe', 'John', '', '', '09996899896', 'Male', 'Filipino', '2000-10-15', 'Purok', 'Uno', 'Indang', 'Cavite', '4122', 'Approved', 'Active', '2025-12-10 22:40:15', '2025-12-11 10:57:44'),
(2, 'shawn@example.com', '$2y$10$ZTqIU6h4K4.M8U6ECNrieOIgBpXGJrwFyEbAzmxqAsJ4XAFZVzCGe', '', 'Ferrer', 'Pogi', 'Sarap', '', '09123456789', 'Male', 'Russian', '2003-04-12', 'Young', 'Stunna', 'Imus', 'Cavite', '4120', 'Pending', 'Active', '2025-12-11 06:07:05', '2025-12-11 06:07:05');

-- --------------------------------------------------------

--
-- Table structure for table `staffuser`
--

CREATE TABLE `staffuser` (
  `userID` int(11) NOT NULL,
  `employerID` varchar(50) DEFAULT NULL,
  `companyName` varchar(100) DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('employer','admin') NOT NULL DEFAULT 'employer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffuser`
--

INSERT INTO `staffuser` (`userID`, `employerID`, `companyName`, `firstName`, `middleName`, `lastName`, `suffix`, `email`, `password`, `role`, `created_at`) VALUES
(2, '201911757', 'CVSU LOAN', 'Mark', 'Noveno', 'Credito', NULL, 'test@example.com', '$2y$10$XZyOHaYF5tgjob5HPf9KqeTQo1JfxDYA3Llpvhpwk7aHZg5uX5wjK', 'employer', '2025-10-09 18:44:38'),
(3, '201911777', '123456', 'Mark', 'Noveno', 'Credito', NULL, 'wil@yahoo.com', '$2y$10$MzD5iQT97rvG/1aebjaQOOiWSdx3FjzCoEN0hNo9h3iv0xjnEeU96', 'admin', '2025-10-10 15:25:07'),
(9, '201911555', 'DSWD', 'Mark', 'Noveno', 'Credito', NULL, 'dag@wil.enr', '$2y$10$TkHNrToekMnZBnynzApBOerIh1gxySTCjZYyJ63i2nKB2qw8QLmiC', 'admin', '2025-11-28 11:31:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `staffuser`
--
ALTER TABLE `staffuser`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `employerID` (`employerID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staffuser`
--
ALTER TABLE `staffuser`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
