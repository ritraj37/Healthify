package com.healthify.servlet;

import com.healthify.dao.UserDAO;
import com.healthify.model.User;
import com.healthify.util.SecurityUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Authentication Servlet handling login, register, and logout
 */
public class AuthServlet extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(AuthServlet.class);
    private UserDAO userDAO;
    
    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
        logger.info("AuthServlet initialized");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String path = request.getServletPath();
        
        switch (path) {
            case "/login":
                showLoginForm(request, response);
                break;
            case "/register":
                showRegisterForm(request, response);
                break;
            case "/logout":
                handleLogout(request, response);
                break;
            default:
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String path = request.getServletPath();
        
        switch (path) {
            case "/login":
                handleLogin(request, response);
                break;
            case "/register":
                handleRegister(request, response);
                break;
            default:
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    private void showLoginForm(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Add CSRF token to request
        HttpSession session = request.getSession(true);
        String csrfToken = SecurityUtil.getCSRFToken(session);
        request.setAttribute("csrfToken", csrfToken);
        
        request.getRequestDispatcher("/WEB-INF/jsp/auth/login.jsp").forward(request, response);
    }
    
    private void showRegisterForm(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Add CSRF token to request
        HttpSession session = request.getSession(true);
        String csrfToken = SecurityUtil.getCSRFToken(session);
        request.setAttribute("csrfToken", csrfToken);
        
        request.getRequestDispatcher("/WEB-INF/jsp/auth/register.jsp").forward(request, response);
    }
    
    private void handleLogin(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        List<String> errors = new ArrayList<>();
        
        String username = SecurityUtil.sanitizeInput(request.getParameter("username"));
        String password = request.getParameter("password");
        
        // Validate input
        if (username == null || username.trim().isEmpty()) {
            errors.add("Username is required");
        }
        if (password == null || password.trim().isEmpty()) {
            errors.add("Password is required");
        }
        
        if (!errors.isEmpty()) {
            request.setAttribute("errors", errors);
            showLoginForm(request, response);
            return;
        }
        
        // Authenticate user
        User user = userDAO.findByUsername(username);
        if (user != null && SecurityUtil.verifyPassword(password, user.getPassword())) {
            // Login successful
            HttpSession session = request.getSession(true);
            session.setAttribute("user", user);
            session.setMaxInactiveInterval(30 * 60); // 30 minutes
            
            logger.info("User logged in successfully: {}", username);
            
            // Redirect to intended page or dashboard
            String redirectUrl = request.getParameter("redirect");
            if (redirectUrl != null && !redirectUrl.isEmpty()) {
                response.sendRedirect(redirectUrl);
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard");
            }
        } else {
            // Login failed
            errors.add("Invalid username or password");
            request.setAttribute("errors", errors);
            logger.warn("Failed login attempt for username: {}", username);
            showLoginForm(request, response);
        }
    }
    
    private void handleRegister(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        List<String> errors = new ArrayList<>();
        
        String username = SecurityUtil.sanitizeInput(request.getParameter("username"));
        String email = SecurityUtil.sanitizeInput(request.getParameter("email"));
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        String fullName = SecurityUtil.sanitizeInput(request.getParameter("fullName"));
        String phone = SecurityUtil.sanitizeInput(request.getParameter("phone"));
        
        // Validate input
        if (username == null || username.trim().isEmpty()) {
            errors.add("Username is required");
        } else if (username.length() < 3 || username.length() > 50) {
            errors.add("Username must be between 3 and 50 characters");
        }
        
        if (email == null || email.trim().isEmpty()) {
            errors.add("Email is required");
        } else if (!SecurityUtil.isValidEmail(email)) {
            errors.add("Invalid email format");
        }
        
        if (password == null || password.trim().isEmpty()) {
            errors.add("Password is required");
        } else if (!SecurityUtil.isValidPassword(password)) {
            errors.add("Password must be at least 6 characters");
        }
        
        if (!password.equals(confirmPassword)) {
            errors.add("Passwords do not match");
        }
        
        if (fullName == null || fullName.trim().isEmpty()) {
            errors.add("Full name is required");
        }
        
        // Check if username or email already exists
        if (userDAO.usernameExists(username)) {
            errors.add("Username already exists");
        }
        if (userDAO.emailExists(email)) {
            errors.add("Email already exists");
        }
        
        if (!errors.isEmpty()) {
            request.setAttribute("errors", errors);
            request.setAttribute("username", username);
            request.setAttribute("email", email);
            request.setAttribute("fullName", fullName);
            request.setAttribute("phone", phone);
            showRegisterForm(request, response);
            return;
        }
        
        // Create new user
        User user = new User(username, email, SecurityUtil.hashPassword(password), fullName);
        user.setPhone(phone);
        
        if (userDAO.createUser(user)) {
            // Registration successful
            logger.info("New user registered: {}", username);
            request.setAttribute("successMessage", "Registration successful! Please login.");
            showLoginForm(request, response);
        } else {
            // Registration failed
            errors.add("Registration failed. Please try again.");
            request.setAttribute("errors", errors);
            showRegisterForm(request, response);
        }
    }
    
    private void handleLogout(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        
        HttpSession session = request.getSession(false);
        if (session != null) {
            User user = (User) session.getAttribute("user");
            if (user != null) {
                logger.info("User logged out: {}", user.getUsername());
            }
            session.invalidate();
        }
        
        response.sendRedirect(request.getContextPath() + "/");
    }
}