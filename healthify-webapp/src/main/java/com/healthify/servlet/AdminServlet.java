package com.healthify.servlet;

import com.healthify.dao.UserDAO;
import com.healthify.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;

/**
 * Admin Servlet for administrative functions
 */
public class AdminServlet extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(AdminServlet.class);
    private UserDAO userDAO;
    
    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
        logger.info("AdminServlet initialized");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String pathInfo = request.getPathInfo();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            showDashboard(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    private void showDashboard(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Get statistics for dashboard
        List<User> allUsers = userDAO.findByRole(User.UserRole.PATIENT);
        List<User> doctors = userDAO.findByRole(User.UserRole.DOCTOR);
        
        request.setAttribute("totalUsers", allUsers.size());
        request.setAttribute("totalDoctors", doctors.size());
        request.setAttribute("totalAppointments", 0); // Implement when AppointmentDAO is ready
        request.setAttribute("pendingAppointments", 0);
        
        // Recent users (last 5)
        request.setAttribute("recentUsers", allUsers.size() > 5 ? 
            allUsers.subList(0, 5) : allUsers);
        
        request.getRequestDispatcher("/WEB-INF/jsp/admin/dashboard.jsp").forward(request, response);
    }
}