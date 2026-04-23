package com.healthify.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * Security Headers Filter for adding security headers to responses
 */
public class SecurityHeadersFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(SecurityHeadersFilter.class);
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Content Security Policy
        httpResponse.setHeader("Content-Security-Policy", 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
            "img-src 'self' data: https:; " +
            "connect-src 'self'; " +
            "frame-ancestors 'none'");
        
        // X-Frame-Options
        httpResponse.setHeader("X-Frame-Options", "DENY");
        
        // X-Content-Type-Options
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        
        // X-XSS-Protection
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        
        // Referrer Policy
        httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        
        // Strict Transport Security (HTTPS only)
        httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        
        // Permissions Policy
        httpResponse.setHeader("Permissions-Policy", 
            "geolocation=(), microphone=(), camera=()");
        
        chain.doFilter(request, response);
    }
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("Security Headers Filter initialized");
    }
    
    @Override
    public void destroy() {
        logger.info("Security Headers Filter destroyed");
    }
}