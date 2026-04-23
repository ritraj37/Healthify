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
 * Home Servlet for displaying the main page
 */
public class HomeServlet extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(HomeServlet.class);
    private UserDAO userDAO;
    
    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
        logger.info("HomeServlet initialized");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Get featured doctors for display
        List<User> doctors = userDAO.findByRole(User.UserRole.DOCTOR);
        request.setAttribute("doctors", doctors);
        
        // Forward to home page
        request.getRequestDispatcher("/WEB-INF/jsp/home.jsp").forward(request, response);
    }
}