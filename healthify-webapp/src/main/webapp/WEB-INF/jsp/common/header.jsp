<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><c:out value="${pageTitle}" default="Healthify - Your Path to Better Health" /></title>
    <meta name="description" content="<c:out value="${pageDescription}" default="Healthify provides comprehensive healthcare services including emergency care, specialist consultations, AI health assistance, and preventive care." />">
    
    <!-- Security Headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    
    <!-- Additional CSS -->
    <c:if test="${not empty additionalCSS}">
        <c:forEach var="css" items="${additionalCSS}">
            <link rel="stylesheet" href="${pageContext.request.contextPath}/css/${css}">
        </c:forEach>
    </c:if>
</head>
<body>

<!-- Header navbar section start -->
<header>
    <!-- Logo -->
    <a href="${pageContext.request.contextPath}/" class="logo">
        <span>H</span>ealthify 
        <br><span>Y</span>our path to better Health.
    </a>

    <!-- Navbar -->
    <nav class="navbar">
        <ul>
            <li><a href="${pageContext.request.contextPath}/" class="nav-link"><i class="fas fa-home"></i> Home</a></li>
            <li><a href="${pageContext.request.contextPath}/#doctor" class="nav-link"><i class="fas fa-user-md"></i> Doctors</a></li>
            <li><a href="${pageContext.request.contextPath}/services" class="nav-link"><i class="fas fa-stethoscope"></i> Services</a></li>
            <li><a href="${pageContext.request.contextPath}/ai-assistant" class="nav-link"><i class="fas fa-robot"></i> AI Assistant</a></li>
            <li><a href="${pageContext.request.contextPath}/about" class="nav-link"><i class="fas fa-info-circle"></i> About</a></li>
            <li><a href="${pageContext.request.contextPath}/#contact" class="nav-link"><i class="fas fa-phone"></i> Contact</a></li>
            
            <c:choose>
                <c:when test="${not empty sessionScope.user}">
                    <li><a href="${pageContext.request.contextPath}/dashboard" class="nav-link"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <c:if test="${sessionScope.user.admin}">
                        <li><a href="${pageContext.request.contextPath}/admin" class="nav-link"><i class="fas fa-cog"></i> Admin</a></li>
                    </c:if>
                    <li><a href="${pageContext.request.contextPath}/logout" class="nav-link" onclick="return confirm('Are you sure you want to logout?')"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                </c:when>
                <c:otherwise>
                    <li><a href="${pageContext.request.contextPath}/login" class="nav-link login-btn"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                </c:otherwise>
            </c:choose>
        </ul>
    </nav>

    <!-- Emergency contact button -->
    <div class="emergency-contact">
        <a href="tel:+15551234567" class="emergency-btn">
            <i class="fas fa-phone-alt"></i>
            <span>Emergency: (555) 123-4567</span>
        </a>
    </div>

    <div class="fas fa-bars mobile-menu"></div>
</header>
<!-- Header navbar section end -->

<!-- Display success/error messages -->
<c:if test="${not empty successMessage}">
    <div class="alert alert-success">
        <i class="fas fa-check-circle"></i>
        <c:out value="${successMessage}" />
    </div>
</c:if>

<c:if test="${not empty errors}">
    <div class="alert alert-error">
        <i class="fas fa-exclamation-triangle"></i>
        <ul>
            <c:forEach var="error" items="${errors}">
                <li><c:out value="${error}" /></li>
            </c:forEach>
        </ul>
    </div>
</c:if>