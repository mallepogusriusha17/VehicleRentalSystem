```sql
CREATE DATABASE vehicle_rental;

USE vehicle_rental;

CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_num VARCHAR(20) NOT NULL UNIQUE,
    vehicle_time VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    rent_per_day DECIMAL(10,2) NOT NULL,
    status ENUM('Available', 'Rented', 'Maintenance')
        NOT NULL DEFAULT 'Available'
);
```