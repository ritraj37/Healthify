package com.healthify.filter;

import com.healthify.util.SecurityUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * CSRF Protection Filter
 */
public class CSRFFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(CSRFFilter.class);
    
    private static final List<String> PROTECTED_METHODS = Arrays.asList("POST", "PUT", "DELETE");
    private static final List<String> EXCLUDED_PATHS = Arrays.asList("/login", "/register", "/css/", "/js/", "/images/");
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String method = httpRequest.getMethod();
        String path = httpRequest.getRequestURI();
        
        // Skip CSRF validation for safe methods and excluded paths
        if (!PROTECTED_METHODS.contains(method) || isExcludedPath(path)) {
            chain.doFilter(request, response);
            return;
        }
        
        // Validate CSRF token for protected methods
        if (!SecurityUtil.validateCSRFToken(httpRequest)) {
            logger.warn("CSRF token validation failed for request: {} {}", method, path);
            httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "CSRF token validation failed");
            return;
        }
        
        chain.doFilter(request, response);
    }
    
    private boolean isExcludedPath(String path) {
        return EXCLUDED_PATHS.stream().anyMatch(path::contains);
    }
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("CSRF Filter initialized");
    }
    
    @Override
    public void destroy() {
        logger.info("CSRF Filter destroyed");
    }
}