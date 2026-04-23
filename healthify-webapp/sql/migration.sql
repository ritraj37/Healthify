-- Healthify Database Migration Script
-- Run this script to migrate from development to production

-- Backup existing data (run before migration)
-- mysqldump -u root -p healthify > healthify_backup_$(date +%Y%m%d_%H%M%S).sql

-- Migration Steps:

-- 1. Add new columns if needed
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP NULL;

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_medical_records_created_at ON medical_records(created_at);

-- 3. Add audit trail table
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id BIGINT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    user_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- 4. Add session management table
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB;

-- 5. Add notification system
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR') NOT NULL DEFAULT 'INFO',
    read_status BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_read_status (read_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- 6. Update existing data (if needed)
-- Update any existing admin passwords to ensure they're properly hashed
-- UPDATE users SET password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6' 
-- WHERE username = 'admin' AND password != '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsW5Qb2S6';

-- 7. Clean up old sessions (run periodically)
-- DELETE FROM user_sessions WHERE expires_at < NOW();

-- 8. Add triggers for audit logging (optional)
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS users_audit_insert 
AFTER INSERT ON users 
FOR EACH ROW 
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, new_values, created_at)
    VALUES ('users', NEW.id, 'INSERT', JSON_OBJECT(
        'username', NEW.username,
        'email', NEW.email,
        'full_name', NEW.full_name,
        'role', NEW.role,
        'active', NEW.active
    ), NOW());
END$$

CREATE TRIGGER IF NOT EXISTS users_audit_update 
AFTER UPDATE ON users 
FOR EACH ROW 
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, created_at)
    VALUES ('users', NEW.id, 'UPDATE', 
        JSON_OBJECT(
            'username', OLD.username,
            'email', OLD.email,
            'full_name', OLD.full_name,
            'role', OLD.role,
            'active', OLD.active
        ),
        JSON_OBJECT(
            'username', NEW.username,
            'email', NEW.email,
            'full_name', NEW.full_name,
            'role', NEW.role,
            'active', NEW.active
        ), 
        NOW());
END$$

DELIMITER ;

-- 9. Create stored procedures for common operations
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS GetUserAppointments(IN userId BIGINT)
BEGIN
    SELECT 
        a.id,
        a.appointment_date,
        a.service_type,
        a.status,
        d.full_name AS doctor_name,
        dp.specialization
    FROM appointments a
    JOIN users d ON a.doctor_id = d.id
    LEFT JOIN doctor_profiles dp ON d.id = dp.user_id
    WHERE a.patient_id = userId
    ORDER BY a.appointment_date DESC;
END$$

CREATE PROCEDURE IF NOT EXISTS GetDoctorSchedule(IN doctorId BIGINT, IN scheduleDate DATE)
BEGIN
    SELECT 
        a.id,
        a.appointment_date,
        a.service_type,
        a.status,
        p.full_name AS patient_name,
        p.phone AS patient_phone
    FROM appointments a
    JOIN users p ON a.patient_id = p.id
    WHERE a.doctor_id = doctorId 
    AND DATE(a.appointment_date) = scheduleDate
    ORDER BY a.appointment_date;
END$$

DELIMITER ;

-- 10. Performance optimization
-- Analyze tables for query optimization
ANALYZE TABLE users, appointments, medical_records, doctor_profiles;

-- 11. Security enhancements
-- Ensure proper privileges (run as admin)
-- CREATE USER IF NOT EXISTS 'healthify_app'@'%' IDENTIFIED BY 'secure_app_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON healthify.* TO 'healthify_app'@'%';
-- FLUSH PRIVILEGES;

-- Migration completed successfully
SELECT 'Migration completed successfully' AS status;