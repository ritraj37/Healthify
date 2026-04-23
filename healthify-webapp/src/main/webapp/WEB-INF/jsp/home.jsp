<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<c:set var="pageTitle" value="Healthify - Your Path to Better Health" />
<c:set var="pageDescription" value="Healthify provides comprehensive healthcare services including emergency care, specialist consultations, AI health assistance, and preventive care." />

<jsp:include page="common/header.jsp" />

<!-- Home section start -->
<section id="home" class="home">
    <div class="hero-container">
        <div class="row">
            <!-- Home content -->
            <div class="content">
                <div class="hero-badge">
                    <i class="fas fa-heartbeat"></i>
                    <span>Trusted Healthcare Since 2020</span>
                </div>
                <h1><span>Stay</span> Safe, <span>Stay</span> Healthy.</h1>
                <p class="hero-subtitle">Your health is our priority. Experience world-class medical care with cutting-edge technology and compassionate professionals.</p>
                <div class="hero-stats">
                    <div class="stat">
                        <h3>10K+</h3>
                        <p>Happy Patients</p>
                    </div>
                    <div class="stat">
                        <h3>50+</h3>
                        <p>Expert Doctors</p>
                    </div>
                    <div class="stat">
                        <h3>24 hours</h3>
                        <p>Emergency Care</p>
                    </div>
                </div>
                <div class="hero-buttons">
                    <c:choose>
                        <c:when test="${not empty sessionScope.user}">
                            <a href="${pageContext.request.contextPath}/appointment/book" class="btn-simple">
                                <i class="fas fa-stethoscope"></i>
                                Book Appointment
                            </a>
                        </c:when>
                        <c:otherwise>
                            <a href="${pageContext.request.contextPath}/login" class="btn-simple">
                                <i class="fas fa-stethoscope"></i>
                                Book Appointment
                            </a>
                        </c:otherwise>
                    </c:choose>
                    <a href="${pageContext.request.contextPath}/ai-assistant" class="btn-simple">
                        <i class="fas fa-robot"></i>
                        AI Assistant
                    </a>
                </div>
            </div>

            <!-- Home images -->
            <div class="images">
                <img src="${pageContext.request.contextPath}/images/home.png" alt="Healthcare Professional">
                <div class="floating-elements">
                    <div class="floating-card card-1">
                        <i class="fas fa-user-md"></i>
                        <span>Expert Care</span>
                    </div>
                    <div class="floating-card card-2">
                        <i class="fas fa-shield-alt"></i>
                        <span>Safe & Secure</span>
                    </div>
                    <div class="floating-card card-3">
                        <i class="fas fa-clock"></i>
                        <span>24/7 Available</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Home section end -->

<!-- About section start -->
<section id="about" class="about">
    <div class="about-intro">
        <h1 class="heading">About Our Facility</h1>
        <h3 class="title">Comprehensive Healthcare Services You Can Trust</h3>
        <p class="about-description">At Healthify, we combine cutting-edge medical technology with compassionate care to provide exceptional healthcare services. Our state-of-the-art facility is designed to meet all your health needs under one roof.</p>
    </div>

    <!-- Key Features -->
    <div class="features-grid">
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-award"></i>
            </div>
            <h4>Certified Excellence</h4>
            <p>JCI accredited facility with international standards</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-microscope"></i>
            </div>
            <h4>Advanced Technology</h4>
            <p>Latest medical equipment and diagnostic tools</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-heart"></i>
            </div>
            <h4>Compassionate Care</h4>
            <p>Patient-centered approach with personalized treatment</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-clock"></i>
            </div>
            <h4>24/7 Availability</h4>
            <p>Round-the-clock emergency and critical care services</p>
        </div>
    </div>
</section>
<!-- About section end -->

<!-- Doctors section start -->
<section id="doctor" class="doctors">
    <div class="container">
        <h1 class="heading">Our Expert Doctors</h1>
        <h3 class="title">Meet Our Healthcare Professionals</h3>
        
        <div class="doctors-stats">
            <div class="stat-item">
                <h4>50+</h4>
                <p>Expert Doctors</p>
            </div>
            <div class="stat-item">
                <h4>15+</h4>
                <p>Specializations</p>
            </div>
            <div class="stat-item">
                <h4>10K+</h4>
                <p>Patients Treated</p>
            </div>
        </div>

        <div class="box-container">
            <c:forEach var="doctor" items="${doctors}" varStatus="status">
                <c:if test="${status.index < 6}"> <!-- Show only first 6 doctors -->
                    <div class="doctor-card">
                        <div class="doctor-image">
                            <img src="${pageContext.request.contextPath}/images/doctor-${(status.index % 3) + 1}.png" alt="Dr. ${doctor.fullName}">
                            <div class="availability-badge available">
                                <i class="fas fa-circle"></i>
                                Available
                            </div>
                        </div>
                        
                        <div class="doctor-info">
                            <div class="doctor-header">
                                <h2>Dr. <c:out value="${doctor.fullName}" /></h2>
                                <div class="doctor-rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <span>4.9</span>
                                </div>
                            </div>
                            
                            <div class="specialization">
                                <i class="fas fa-stethoscope"></i>
                                <span>General Medicine</span>
                            </div>
                            
                            <div class="experience">
                                <i class="fas fa-calendar-alt"></i>
                                <span>10+ Years Experience</span>
                            </div>
                            
                            <div class="credentials">
                                <span class="credential">MBBS</span>
                                <span class="credential">MD</span>
                                <span class="credential">Board Certified</span>
                            </div>
                            
                            <div class="doctor-actions">
                                <c:choose>
                                    <c:when test="${not empty sessionScope.user}">
                                        <a href="${pageContext.request.contextPath}/appointment/book?doctorId=${doctor.id}" class="btn-appointment">
                                            <i class="fas fa-calendar-plus"></i>
                                            Book Appointment
                                        </a>
                                    </c:when>
                                    <c:otherwise>
                                        <a href="${pageContext.request.contextPath}/login" class="btn-appointment">
                                            <i class="fas fa-calendar-plus"></i>
                                            Book Appointment
                                        </a>
                                    </c:otherwise>
                                </c:choose>
                                
                                <div class="social-links">
                                    <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                                    <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </c:if>
            </c:forEach>
        </div>
    </div>
</section>
<!-- Doctors section end -->

<!-- Contact section start -->
<section id="contact" class="contact">
    <div class="contact-header">
        <h1 class="heading">Contact Us</h1>
        <h3 class="title">Get in Touch for Better Healthcare</h3>
        <p class="contact-description">We're here to help you with all your healthcare needs. Contact us through any of the following methods.</p>
    </div>

    <!-- Contact Info Grid -->
    <div class="contact-info-grid">
        <div class="contact-card">
            <div class="contact-icon">
                <i class="fas fa-phone-alt"></i>
            </div>
            <h4>Call Us</h4>
            <p>24/7 Emergency Hotline</p>
            <a href="tel:+15551234567" class="contact-link">+1 (555) 123-4567</a>
        </div>
        
        <div class="contact-card">
            <div class="contact-icon">
                <i class="fas fa-envelope"></i>
            </div>
            <h4>Email Us</h4>
            <p>Send us your queries</p>
            <a href="mailto:info@healthify.com" class="contact-link">info@healthify.com</a>
        </div>
        
        <div class="contact-card">
            <div class="contact-icon">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <h4>Visit Us</h4>
            <p>Our main location</p>
            <a href="#" class="contact-link">123 Healthcare Ave, Medical City</a>
        </div>
        
        <div class="contact-card">
            <div class="contact-icon">
                <i class="fas fa-clock"></i>
            </div>
            <h4>Working Hours</h4>
            <p>We're always available</p>
            <span class="contact-link">24/7 Emergency Services</span>
        </div>
    </div>
</section>
<!-- Contact section end -->

<jsp:include page="common/footer.jsp" />