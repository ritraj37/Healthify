// Professional Audit Logging System for Healthcare Data Compliance
const pool = require('../database/connection');

class AuditLogger {
  
  // Log all data access and modifications
  static async logDataAccess(action, tableName, recordId, userId, metadata = {}) {
    try {
      await pool.query(`
        INSERT INTO audit_logs (
          action, table_name, record_id, user_id, 
          ip_address, user_agent, metadata, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        action,
        tableName,
        recordId,
        userId || null,
        metadata.ip || 'unknown',
        metadata.userAgent || 'unknown',
        JSON.stringify(metadata),
        new Date()
      ]);
      
      console.log(`📋 [AUDIT] ${action} on ${tableName}:${recordId} by user:${userId || 'anonymous'}`);
    } catch (error) {
      console.error('❌ [AUDIT] Logging failed:', error);
    }
  }

  // Log patient data access (HIPAA compliance)
  static async logPatientDataAccess(patientId, accessedBy, dataType, purpose) {
    try {
      await pool.query(`
        INSERT INTO patient_access_logs (
          patient_id, accessed_by, data_type, access_purpose, 
          access_timestamp, compliance_status
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        patientId,
        accessedBy,
        dataType,
        purpose,
        new Date(),
        'compliant'
      ]);
      
      console.log(`🏥 [PATIENT-ACCESS] ${dataType} accessed for patient:${patientId} by:${accessedBy} - Purpose: ${purpose}`);
    } catch (error) {
      console.error('❌ [PATIENT-ACCESS] Logging failed:', error);
    }
  }

  // Log security events
  static async logSecurityEvent(eventType, severity, description, metadata = {}) {
    try {
      await pool.query(`
        INSERT INTO security_logs (
          event_type, severity, description, metadata, 
          ip_address, timestamp, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        eventType,
        severity,
        description,
        JSON.stringify(metadata),
        metadata.ip || 'unknown',
        new Date(),
        'active'
      ]);
      
      console.log(`🔐 [SECURITY-${severity.toUpperCase()}] ${eventType}: ${description}`);
    } catch (error) {
      console.error('❌ [SECURITY] Logging failed:', error);
    }
  }

  // Generate compliance reports
  static async generateComplianceReport(startDate, endDate) {
    try {
      const report = await pool.query(`
        SELECT 
          DATE(timestamp) as date,
          action,
          table_name,
          COUNT(*) as count
        FROM audit_logs 
        WHERE timestamp BETWEEN $1 AND $2
        GROUP BY DATE(timestamp), action, table_name
        ORDER BY date DESC
      `, [startDate, endDate]);
      
      console.log(`📊 [COMPLIANCE] Generated report for ${startDate} to ${endDate}: ${report.rows.length} entries`);
      return report.rows;
    } catch (error) {
      console.error('❌ [COMPLIANCE] Report generation failed:', error);
      return [];
    }
  }
}

// Middleware for automatic audit logging
const auditMiddleware = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const tableName = req.route?.path?.split('/')[1] || 'unknown';
        const userId = req.user?.id || null;
        
        AuditLogger.logDataAccess(
          action,
          tableName,
          null, // Will be updated with actual record ID if available
          userId,
          {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path,
            method: req.method,
            statusCode: res.statusCode
          }
        );
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  AuditLogger,
  auditMiddleware
};