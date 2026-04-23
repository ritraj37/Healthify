<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!-- Footer section start -->
<footer class="footer">
    <div class="footer-container">
        <div class="footer-box">
            <h3 class="footer-logo">
                <span>H</span>ealthify
            </h3>
            <p>Your trusted healthcare partner providing comprehensive medical services with cutting-edge technology and compassionate care.</p>
            <div class="social-links">
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            </div>
        </div>
        
        <div class="footer-box">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="${pageContext.request.contextPath}/">Home</a></li>
                <li><a href="${pageContext.request.contextPath}/services">Services</a></li>
                <li><a href="${pageContext.request.contextPath}/about">About Us</a></li>
                <li><a href="${pageContext.request.contextPath}/#contact">Contact</a></li>
                <li><a href="${pageContext.request.contextPath}/appointment/book">Book Appointment</a></li>
            </ul>
        </div>
        
        <div class="footer-box">
            <h3>Services</h3>
            <ul>
                <li><a href="${pageContext.request.contextPath}/services#cardiology">Cardiology</a></li>
                <li><a href="${pageContext.request.contextPath}/services#neurology">Neurology</a></li>
                <li><a href="${pageContext.request.contextPath}/services#orthopedics">Orthopedics</a></li>
                <li><a href="${pageContext.request.contextPath}/services#pediatrics">Pediatrics</a></li>
                <li><a href="${pageContext.request.contextPath}/emergency">Emergency Care</a></li>
            </ul>
        </div>
        
        <div class="footer-box contact-info">
            <h3>Contact Info</h3>
            <p><i class="fas fa-map-marker-alt"></i> 123 Healthcare Ave, Medical City, MC 12345</p>
            <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
            <p><i class="fas fa-envelope"></i> info@healthify.com</p>
            <p><i class="fas fa-clock"></i> 24/7 Emergency Services</p>
        </div>
    </div>
    
    <div class="footer-bottom">
        <p>&copy; 2024 <span>Healthify</span>. All rights reserved. | 
           <a href="${pageContext.request.contextPath}/privacy-policy">Privacy Policy</a> | 
           <a href="${pageContext.request.contextPath}/terms-of-service">Terms of Service</a>
        </p>
    </div>
</footer>
<!-- Footer section end -->

<!-- Custom JavaScript -->
<script src="${pageContext.request.contextPath}/js/main.js"></script>

<!-- Additional JavaScript -->
<c:if test="${not empty additionalJS}">
    <c:forEach var="js" items="${additionalJS}">
        <script src="${pageContext.request.contextPath}/js/${js}"></script>
    </c:forEach>
</c:if>

</body>
</html>