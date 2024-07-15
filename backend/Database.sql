

USE ERP_system;

-- Create a table
CREATE TABLE Booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(255),
    addtional_message VARCHAR(255),
    student_discount TEXT,
    service_type TEXT,
    date DATE
);

CREATE TABLE Booking (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255),
    client_name VARCHAR(255),
    abn VARCHAR(255),
    telephone VARCHAR(255),
    email VARCHAR(255)
    date DATE
);


-- Insert some data
INSERT INTO Booking (first_name, last_name, email, phone_number, additional_message, student_discount, service_type, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
INSERT INTO Clients (company_name, client_name, abn, telephone, email) VALUES ('Test Company 2', 'Test Name', '123456789', '1234567890', 'test@example.com');


