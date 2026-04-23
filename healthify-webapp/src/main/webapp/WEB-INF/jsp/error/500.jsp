<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:set var="pageTitle" value="Server Error - Healthify" />
<c:set var="pageDescription" value="An internal server error has occurred." />

<jsp:include page="../common/header.jsp" />

<div class="error-page" style="margin-top: 15rem; padding: 5rem 2rem; text-align: center;">
    <div class="error-container">
        <div class="error-icon">
            <i class="fas fa-server"></i>
        </div>
        <h1>500 - Internal Server Error</h1>
        <p>We're experiencing some technical difficulties. Our team has been notified and is working to resolve the issue.</p>
        
        <div class="error-actions">
            <a href="${pageContext.request.contextPath}/" class="btn-home">
                <i class="fas fa-home"></i>
                Go to Homepage
            </a>
            <a href="javascript:location.reload()" class="btn-retry">
                <i class="fas fa-redo"></i>
                Try Again
            </a>
        </div>
        
        <div class="error-contact">
            <p>If the problem persists, please contact our support team:</p>
            <a href="tel:+15551234567" class="contact-link">
                <i class="fas fa-phone"></i>
                (555) 123-4567
            </a>
        </div>
    </div>
</div>

<style>
.error-page {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
}

.error-container {
    max-width: 500px;
    background: white;
    padding: 4rem 3rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.error-icon {
    font-size: 6rem;
    color: #dc3545;
    margin-bottom: 2rem;
}

.error-container h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1.5rem;
}

.error-container p {
    font-size: 1.6rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: 3rem;
}

.error-actions {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin-bottom: 3rem;
}

.btn-home, .btn-retry {
    padding: 1.2rem 2.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.btn-home {
    background: var(--blue);
    color: white;
}

.btn-home:hover {
    background: #0056b3;
    transform: translateY(-2px);
}

.btn-retry {
    background: #28a745;
    color: white;
}

.btn-retry:hover {
    background: #1e7e34;
    transform: translateY(-2px);
}

.error-contact {
    border-top: 1px solid #eee;
    padding-top: 2rem;
}

.error-contact p {
    font-size: 1.4rem;
    margin-bottom: 1rem;
}

.contact-link {
    color: var(--blue);
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.contact-link:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .error-container {
        padding: 3rem 2rem;
    }
    
    .error-actions {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>

<jsp:include page="../common/footer.jsp" />