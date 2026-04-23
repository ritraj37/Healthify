<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:set var="pageTitle" value="Page Not Found - Healthify" />
<c:set var="pageDescription" value="The page you are looking for could not be found." />

<jsp:include page="../common/header.jsp" />

<div class="error-page" style="margin-top: 15rem; padding: 5rem 2rem; text-align: center;">
    <div class="error-container">
        <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        
        <div class="error-actions">
            <a href="${pageContext.request.contextPath}/" class="btn-home">
                <i class="fas fa-home"></i>
                Go to Homepage
            </a>
            <a href="javascript:history.back()" class="btn-back">
                <i class="fas fa-arrow-left"></i>
                Go Back
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
    color: #ffc107;
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
}

.btn-home, .btn-back {
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

.btn-back {
    background: #6c757d;
    color: white;
}

.btn-back:hover {
    background: #545b62;
    transform: translateY(-2px);
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