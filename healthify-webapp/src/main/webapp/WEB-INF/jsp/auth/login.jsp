<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:set var="pageTitle" value="Login - Healthify" />
<c:set var="pageDescription" value="Login to your Healthify account to access your dashboard and book appointments." />

<jsp:include page="../common/header.jsp" />

<div class="login-container" style="margin-top: 15rem;">
    <h2>Welcome Back</h2>
    <p class="sub">Login to continue</p>

    <form method="post" action="${pageContext.request.contextPath}/login" class="login-form">
        <!-- CSRF Token -->
        <input type="hidden" name="csrfToken" value="${csrfToken}" />
        
        <!-- Redirect URL -->
        <c:if test="${not empty param.redirect}">
            <input type="hidden" name="redirect" value="${param.redirect}" />
        </c:if>

        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" 
                   id="username" 
                   name="username" 
                   value="${param.username}"
                   pattern="[A-Za-z0-9]{3,20}" 
                   title="Username should be 3-20 characters (letters and numbers only)" 
                   placeholder="Enter Username" 
                   required>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" 
                   id="password" 
                   name="password" 
                   pattern=".{6,}" 
                   title="Password must be at least 6 characters long" 
                   placeholder="Enter Password" 
                   required>
        </div>

        <button type="submit" class="btn-submit">
            <i class="fas fa-sign-in-alt"></i>
            Login
        </button>

        <p class="link">
            Don't have an account?
            <a href="${pageContext.request.contextPath}/register">Create New Account</a>
        </p>
    </form>
</div>

<style>
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 3rem 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.login-container h2 {
    color: var(--blue);
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

.login-container .sub {
    color: #666;
    margin-bottom: 3rem;
    font-size: 1.6rem;
}

.form-group {
    margin-bottom: 2rem;
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 600;
    font-size: 1.4rem;
}

.form-group input {
    width: 100%;
    padding: 1.2rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1.4rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(1, 136, 223, 0.1);
}

.btn-submit {
    width: 100%;
    background: linear-gradient(135deg, var(--blue), #0066cc);
    color: white;
    border: none;
    padding: 1.5rem;
    border-radius: 8px;
    font-size: 1.6rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(1, 136, 223, 0.3);
}

.link {
    font-size: 1.4rem;
    color: #666;
}

.link a {
    color: var(--blue);
    text-decoration: none;
    font-weight: 600;
}

.link a:hover {
    text-decoration: underline;
}
</style>

<jsp:include page="../common/footer.jsp" />