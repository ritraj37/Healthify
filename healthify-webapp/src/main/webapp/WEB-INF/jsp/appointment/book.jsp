<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<c:set var="pageTitle" value="Book Appointment - Healthify" />
<c:set var="pageDescription" value="Book your medical appointment with our expert doctors at Healthify." />

<jsp:include page="../common/header.jsp" />

<div class="appointment-page">
    <div class="appointment-container">
        <div class="appointment-header">
            <h1>Book Your Appointment</h1>
            <p>Schedule a consultation with our expert healthcare professionals</p>
        </div>

        <div class="appointment-form-container">
            <form method="post" action="${pageContext.request.contextPath}/appointment/book" class="professional-form">
                <!-- CSRF Token -->
                <input type="hidden" name="csrfToken" value="${csrfToken}" />

                <div class="form-row">
                    <div class="form-group">
                        <label for="doctorId">
                            <i class="fas fa-user-md"></i>
                            Select Doctor *
                        </label>
                        <select id="doctorId" name="doctorId" required>
                            <option value="">Choose a doctor...</option>
                            <c:forEach var="doctor" items="${doctors}">
                                <option value="${doctor.id}" ${param.doctorId == doctor.id ? 'selected' : ''}>
                                    Dr. <c:out value="${doctor.fullName}" /> - General Medicine
                                </option>
                            </c:forEach>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="serviceType">
                            <i class="fas fa-stethoscope"></i>
                            Service Type *
                        </label>
                        <select id="serviceType" name="serviceType" required>
                            <option value="">Select service...</option>
                            <option value="consultation" ${param.serviceType == 'consultation' ? 'selected' : ''}>General Consultation</option>
                            <option value="checkup" ${param.serviceType == 'checkup' ? 'selected' : ''}>Health Checkup</option>
                            <option value="followup" ${param.serviceType == 'followup' ? 'selected' : ''}>Follow-up Visit</option>
                            <option value="emergency" ${param.serviceType == 'emergency' ? 'selected' : ''}>Emergency Consultation</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="appointmentDate">
                            <i class="fas fa-calendar-alt"></i>
                            Preferred Date *
                        </label>
                        <input type="date" 
                               id="appointmentDate" 
                               name="appointmentDate" 
                               value="${param.appointmentDate}"
                               required>
                    </div>

                    <div class="form-group">
                        <label for="appointmentTime">
                            <i class="fas fa-clock"></i>
                            Preferred Time *
                        </label>
                        <select id="appointmentTime" name="appointmentTime" required>
                            <option value="">Select time...</option>
                            <option value="09:00" ${param.appointmentTime == '09:00' ? 'selected' : ''}>09:00 AM</option>
                            <option value="10:00" ${param.appointmentTime == '10:00' ? 'selected' : ''}>10:00 AM</option>
                            <option value="11:00" ${param.appointmentTime == '11:00' ? 'selected' : ''}>11:00 AM</option>
                            <option value="14:00" ${param.appointmentTime == '14:00' ? 'selected' : ''}>02:00 PM</option>
                            <option value="15:00" ${param.appointmentTime == '15:00' ? 'selected' : ''}>03:00 PM</option>
                            <option value="16:00" ${param.appointmentTime == '16:00' ? 'selected' : ''}>04:00 PM</option>
                        </select>
                    </div>
                </div>

                <div class="form-group full-width">
                    <label for="symptoms">
                        <i class="fas fa-notes-medical"></i>
                        Symptoms / Reason for Visit
                    </label>
                    <textarea id="symptoms" 
                              name="symptoms" 
                              placeholder="Please describe your symptoms or reason for the appointment..."
                              rows="4"><c:out value="${param.symptoms}" /></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-calendar-check"></i>
                        Book Appointment
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('appointmentDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    if (!dateInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
});
</script>

<jsp:include page="../common/footer.jsp" />