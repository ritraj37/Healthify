package com.healthify.filter;

import com.healthify.model.User;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * Authentication Filter for protecting secured resources
 */
public class AuthFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(AuthFilter.class);
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        HttpSession session = httpRequest.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;
        
        String path = httpRequest.getRequestURI();
        
        // Check if user is authenticated
        if (user == null) {
            logger.warn("Unauthorized access attempt to: {}", path);
            httpResponse.sendRedirect(httpRequest.getContextPath() + "/login?redirect=" + path);
            return;
        }
        
        // Check admin access
        if (path.contains("/admin/") && !user.isAdmin()) {
            logger.warn("Non-admin user {} attempted to access admin area: {}", user.getUsername(), path);
            httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
            return;
        }
        
        chain.doFilter(request, response);
    }
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("Auth Filter initialized");
    }
    
    @Override
    public void destroy() {
        logger.info("Auth Filter destroyed");
    }
}