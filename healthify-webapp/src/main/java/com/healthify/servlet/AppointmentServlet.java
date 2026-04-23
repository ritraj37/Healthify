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
import java.util.ArrayList;
import java.util.List;

/**
 * Appointment Servlet for booking and managing appointments
 */
public class AppointmentServlet extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(AppointmentServlet.class);
    private UserDAO userDAO;
    
    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
        logger.info("AppointmentServlet initialized");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String pathInfo = request.getPathInfo();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            response.sendRedirect(request.getContextPath() + "/appointment/book");
            return;
        }
        
        switch (pathInfo) {
            case "/book":
                showBookingForm(request, response);
                break;
            default:
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String pathInfo = request.getPathInfo();
        
        if ("/book".equals(pathInfo)) {
            handleBooking(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    private void showBookingForm(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Get available doctors
        List<User> doctors = userDAO.findByRole(User.UserRole.DOCTOR);
        request.setAttribute("doctors", doctors);
        
        // Add CSRF token
        HttpSession session = request.getSession(true);
        String csrfToken = SecurityUtil.getCSRFToken(session);
        request.setAttribute("csrfToken", csrfToken);
        
        request.getRequestDispatcher("/WEB-INF/jsp/appointment/book.jsp").forward(request, response);
    }
    
    private void handleBooking(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        List<String> errors = new ArrayList<>();
        
        // Get form data
        String doctorId = request.getParameter("doctorId");
        String appointmentDate = request.getParameter("appointmentDate");
        String appointmentTime = request.getParameter("appointmentTime");
        String serviceType = SecurityUtil.sanitizeInput(request.getParameter("serviceType"));
        String symptoms = SecurityUtil.sanitizeInput(request.getParameter("symptoms"));
        
        // Validate input
        if (doctorId == null || doctorId.trim().isEmpty()) {
            errors.add("Please select a doctor");
        }
        if (appointmentDate == null || appointmentDate.trim().isEmpty()) {
            errors.add("Please select appointment date");
        }
        if (appointmentTime == null || appointmentTime.trim().isEmpty()) {
            errors.add("Please select appointment time");
        }
        if (serviceType == null || serviceType.trim().isEmpty()) {
            errors.add("Please select service type");
        }
        
        if (!errors.isEmpty()) {
            request.setAttribute("errors", errors);
            showBookingForm(request, response);
            return;
        }
        
        // TODO: Implement appointment booking logic with AppointmentDAO
        // For now, just show success message
        
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        
        logger.info("Appointment booking attempt by user: {} for doctor ID: {}", 
                   user.getUsername(), doctorId);
        
        request.setAttribute("successMessage", 
            "Appointment request submitted successfully! You will receive a confirmation shortly.");
        
        showBookingForm(request, response);
    }
}