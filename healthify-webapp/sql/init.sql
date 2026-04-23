-- Healthify Database Initialization Script
-- This script creates the database schema and initial data

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS healthify CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE healthify;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL DEFAULT 'PATIENT',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (active)
) ENGINE=InnoDB;

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATETIME NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    symptoms TEXT,
    notes TEXT,
    status ENUM('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT,
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_appointment_id (appointment_id)
) ENGINE=InnoDB;

-- Doctor profiles table
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialization VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    education TEXT,
    certifications TEXT,
    bio TEXT,
    consultation_fee DECIMAL(10,2),
    available_from TIME,
    available_to TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_specialization (specialization)
) ENGINE=InnoDB;

-- Insert default admin user
INSERT IGNORE INTO users (username, email, password, full_name, role, active) VALUES 
('admin', 'admin@healthify.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6', 'System Administrator', 'ADMIN', TRUE);

-- Insert sample doctors
INSERT IGNORE INTO users (username, email, password, full_name, phone, role, active) VALUES 
('dr.smith', 'dr.smith@healthify.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6', 'Dr. John Smith', '+1-555-0101', 'DOCTOR', TRUE),
('dr.johnson', 'dr.johnson@healthify.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6', 'Dr. Sarah Johnson', '+1-555-0102', 'DOCTOR', TRUE),
('dr.williams', 'dr.williams@healthify.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6', 'Dr. Michael Williams', '+1-555-0103', 'DOCTOR', TRUE),
('dr.brown', 'dr.brown@healthify.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6', 'Dr. Emily Brown', '+1-555-0104', 'DOCTOR', TRUE),
('dr.davis', 'dr.davis@healthify.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6', 'Dr. Robert Davis', '+1-555-0105', 'DOCTOR', TRUE),
('dr.wilson', 'dr.wilson@healthify.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6', 'Dr. Lisa Wilson', '+1-555-0106', 'DOCTOR', TRUE);

-- Insert doctor profiles
INSERT IGNORE INTO doctor_profiles (user_id, specialization, experience_years, education, consultation_fee, available_from, available_to) 
SELECT u.id, 'Cardiology', 15, 'MD Cardiology, Harvard Medical School', 200.00, '09:00:00', '17:00:00'
FROM users u WHERE u.username = 'dr.smith';

INSERT IGNORE INTO doctor_profiles (user_id, specialization, experience_years, education, consultation_fee, available_from, available_to) 
SELECT u.id, 'Neurology', 12, 'MD Neurology, Johns Hopkins', 250.00, '10:00:00', '18:00:00'
FROM users u WHERE u.username = 'dr.johnson';

INSERT IGNORE INTO doctor_profiles (user_id, specialization, experience_years, education, consultation_fee, available_from, available_to) 
SELECT u.id, 'Orthopedics', 18, 'MD Orthopedics, Mayo Clinic', 180.00, '08:00:00', '16:00:00'
FROM users u WHERE u.username = 'dr.williams';

INSERT IGNORE INTO doctor_profiles (user_id, specialization, experience_years, education, consultation_fee, available_from, available_to) 
SELECT u.id, 'Pediatrics', 10, 'MD Pediatrics, Stanford Medical', 150.00, '09:00:00', '17:00:00'
FROM users u WHERE u.username = 'dr.brown';

INSERT IGNORE INTO doctor_profiles (user_id, specialization, experience_years, education, consultation_fee, available_from, available_to) 
SELECT u.id, 'Gynecology', 14, 'MD Gynecology, UCLA Medical', 220.00, '10:00:00', '18:00:00'
FROM users u WHERE u.username = 'dr.davis';

INSERT IGNORE INTO doctor_profiles (user_id, specialization, experience_years, education, consultation_fee, available_from, available_to) 
SELECT u.id, 'Ophthalmology', 16, 'MD Ophthalmology, Columbia Medical', 190.00, '08:30:00', '16:30:00'
FROM users u WHERE u.username = 'dr.wilson';

-- Insert sample patient
INSERT IGNORE INTO users (username, email, password, full_name, phone, role, active) VALUES 
('patient1', 'patient@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6', 'John Doe', '+1-555-0201', 'PATIENT', TRUE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON appointments(appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, active);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_date ON medical_records(patient_id, created_at);

-- Create a view for appointment details
CREATE OR REPLACE VIEW appointment_details AS
SELECT 
    a.id,
    a.appointment_date,
    a.service_type,
    a.symptoms,
    a.notes,
    a.status,
    a.created_at,
    p.full_name AS patient_name,
    p.email AS patient_email,
    p.phone AS patient_phone,
    d.full_name AS doctor_name,
    dp.specialization AS doctor_specialization,
    dp.consultation_fee
FROM appointments a
JOIN users p ON a.patient_id = p.id
JOIN users d ON a.doctor_id = d.id
LEFT JOIN doctor_profiles dp ON d.id = dp.user_id;

-- Note: Default password for all sample users is 'password123'
-- In production, ensure to change these passwords and use strong authentication