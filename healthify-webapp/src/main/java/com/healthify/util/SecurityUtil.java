package com.healthify.util;

import org.mindrot.jbcrypt.BCrypt;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Security utility class for password hashing and CSRF protection
 */
public class SecurityUtil {
    private static final int BCRYPT_ROUNDS = 12;
    private static final SecureRandom secureRandom = new SecureRandom();
    
    /**
     * Hash password using BCrypt
     */
    public static String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(BCRYPT_ROUNDS));
    }
    
    /**
     * Verify password against hash
     */
    public static boolean verifyPassword(String password, String hash) {
        return BCrypt.checkpw(password, hash);
    }
    
    /**
     * Generate CSRF token
     */
    public static String generateCSRFToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }
    
    /**
     * Get or create CSRF token for session
     */
    public static String getCSRFToken(HttpSession session) {
        String token = (String) session.getAttribute("csrfToken");
        if (token == null) {
            token = generateCSRFToken();
            session.setAttribute("csrfToken", token);
        }
        return token;
    }
    
    /**
     * Validate CSRF token
     */
    public static boolean validateCSRFToken(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return false;
        }
        
        String sessionToken = (String) session.getAttribute("csrfToken");
        String requestToken = request.getParameter("csrfToken");
        
        return sessionToken != null && sessionToken.equals(requestToken);
    }
    
    /**
     * Sanitize input to prevent XSS
     */
    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        return input.replaceAll("<", "&lt;")
                   .replaceAll(">", "&gt;")
                   .replaceAll("\"", "&quot;")
                   .replaceAll("'", "&#x27;")
                   .replaceAll("/", "&#x2F;");
    }
    
    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    
    /**
     * Validate password strength
     */
    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 6;
    }
}