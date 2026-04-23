<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:set var="pageTitle" value="Register - Healthify" />
<c:set var="pageDescription" value="Create your Healthify account to access healthcare services and book appointments." />

<jsp:include page="../common/header.jsp" />

<div class="register-container" style="margin-top: 15rem;">
    <h2>Create Account</h2>
    <p class="sub">Join Healthify for better healthcare</p>

    <form method="post" action="${pageContext.request.contextPath}/register" class="register-form">
        <!-- CSRF Token -->
        <input type="hidden" name="csrfToken" value="${csrfToken}" />

        <div class="form-row">
            <div class="form-group">
                <label for="username">Username *</label>
                <input type="text" 
                       id="username" 
                       name="username" 
                       value="${username}"
                       pattern="[A-Za-z0-9]{3,20}" 
                       title="Username should be 3-20 characters (letters and numbers only)" 
                       placeholder="Enter Username" 
                       required>
            </div>

            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" 
                       id="email" 
                       name="email" 
                       value="${email}"
                       placeholder="Enter Email" 
                       required>
            </div>
        </div>

        <div class="form-group">
            <label for="fullName">Full Name *</label>
            <input type="text" 
                   id="fullName" 
                   name="fullName" 
                   value="${fullName}"
                   placeholder="Enter Full Name" 
                   required>
        </div>

        <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" 
                   id="phone" 
                   name="phone" 
                   value="${phone}"
                   pattern="[0-9]{10}" 
                   title="Please enter a valid 10-digit phone number" 
                   placeholder="Enter Phone Number">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="password">Password *</label>
                <input type="password" 
                       id="password" 
                       name="password" 
                       pattern=".{6,}" 
                       title="Password must be at least 6 characters long" 
                       placeholder="Enter Password" 
                       required>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm Password *</label>
                <input type="password" 
                       id="confirmPassword" 
                       name="confirmPassword" 
                       pattern=".{6,}" 
                       title="Password must be at least 6 characters long" 
                       placeholder="Confirm Password" 
                       required>
            </div>
        </div>

        <button type="submit" class="btn-submit">
            <i class="fas fa-user-plus"></i>
            Create Account
        </button>

        <p class="link">
            Already have an account?
            <a href="${pageContext.request.contextPath}/login">Login Here</a>
        </p>
    </form>
</div>

<style>
.register-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 3rem 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.register-container h2 {
    color: var(--blue);
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

.register-container .sub {
    color: #666;
    margin-bottom: 3rem;
    font-size: 1.6rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.form-group {
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

@media (max-width: 768px) {
    .register-container {
        margin: 12rem 1rem 0;
        padding: 2rem 1.5rem;
    }
    
    .form-row {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}
</style>

<jsp:include page="../common/footer.jsp" />