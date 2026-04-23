<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<c:set var="pageTitle" value="Admin Dashboard - Healthify" />
<c:set var="pageDescription" value="Admin dashboard for managing Healthify healthcare system." />

<jsp:include page="../common/header.jsp" />

<div class="admin-dashboard" style="margin-top: 12rem; padding: 2rem;">
    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, <c:out value="${sessionScope.user.fullName}" />!</p>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>${totalUsers}</h3>
                    <p>Total Users</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="stat-info">
                    <h3>${totalDoctors}</h3>
                    <p>Doctors</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                    <h3>${totalAppointments}</h3>
                    <p>Appointments</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>${pendingAppointments}</h3>
                    <p>Pending</p>
                </div>
            </div>
        </div>

        <!-- Management Sections -->
        <div class="management-grid">
            <!-- User Management -->
            <div class="management-card">
                <div class="card-header">
                    <h3><i class="fas fa-users"></i> User Management</h3>
                    <a href="${pageContext.request.contextPath}/admin/users" class="btn-view-all">View All</a>
                </div>
                <div class="card-content">
                    <div class="recent-users">
                        <c:forEach var="user" items="${recentUsers}" varStatus="status">
                            <c:if test="${status.index < 5}">
                                <div class="user-item">
                                    <div class="user-info">
                                        <strong><c:out value="${user.fullName}" /></strong>
                                        <span class="user-role ${user.role.name().toLowerCase()}">
                                            <c:out value="${user.role}" />
                                        </span>
                                    </div>
                                    <div class="user-date">
                                        <fmt:formatDate value="${user.createdAt}" pattern="MMM dd" />
                                    </div>
                                </div>
                            </c:if>
                        </c:forEach>
                    </div>
                </div>
            </div>

            <!-- Appointment Management -->
            <div class="management-card">
                <div class="card-header">
                    <h3><i class="fas fa-calendar-alt"></i> Recent Appointments</h3>
                    <a href="${pageContext.request.contextPath}/admin/appointments" class="btn-view-all">View All</a>
                </div>
                <div class="card-content">
                    <div class="recent-appointments">
                        <c:forEach var="appointment" items="${recentAppointments}" varStatus="status">
                            <c:if test="${status.index < 5}">
                                <div class="appointment-item">
                                    <div class="appointment-info">
                                        <strong><c:out value="${appointment.patientName}" /></strong>
                                        <span>with Dr. <c:out value="${appointment.doctorName}" /></span>
                                    </div>
                                    <div class="appointment-status">
                                        <span class="status ${appointment.status.name().toLowerCase()}">
                                            <c:out value="${appointment.status}" />
                                        </span>
                                    </div>
                                </div>
                            </c:if>
                        </c:forEach>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="actions-grid">
                <a href="${pageContext.request.contextPath}/admin/users/create" class="action-btn">
                    <i class="fas fa-user-plus"></i>
                    <span>Add User</span>
                </a>
                <a href="${pageContext.request.contextPath}/admin/doctors/create" class="action-btn">
                    <i class="fas fa-user-md"></i>
                    <span>Add Doctor</span>
                </a>
                <a href="${pageContext.request.contextPath}/admin/appointments" class="action-btn">
                    <i class="fas fa-calendar-check"></i>
                    <span>Manage Appointments</span>
                </a>
                <a href="${pageContext.request.contextPath}/admin/reports" class="action-btn">
                    <i class="fas fa-chart-bar"></i>
                    <span>View Reports</span>
                </a>
            </div>
        </div>
    </div>
</div>

<style>
.admin-dashboard {
    min-height: 100vh;
    background: #f8f9fa;
}

.dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.dashboard-header {
    text-align: center;
    margin-bottom: 4rem;
}

.dashboard-header h1 {
    font-size: 2.5rem;
    color: var(--blue);
    margin-bottom: 1rem;
}

.dashboard-header p {
    font-size: 1.6rem;
    color: #666;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
}

.stat-card {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 2rem;
}

.stat-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--blue), #0066cc);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-icon i {
    font-size: 2rem;
    color: white;
}

.stat-info h3 {
    font-size: 2.5rem;
    color: var(--blue);
    margin-bottom: 0.5rem;
}

.stat-info p {
    font-size: 1.4rem;
    color: #666;
    margin: 0;
}

.management-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 3rem;
    margin-bottom: 4rem;
}

.management-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    overflow: hidden;
}

.card-header {
    background: var(--blue);
    color: white;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h3 {
    margin: 0;
    font-size: 1.8rem;
}

.btn-view-all {
    background: rgba(255,255,255,0.2);
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 20px;
    text-decoration: none;
    font-size: 1.2rem;
    transition: all 0.3s ease;
}

.btn-view-all:hover {
    background: rgba(255,255,255,0.3);
}

.card-content {
    padding: 2rem;
}

.user-item, .appointment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}

.user-item:last-child, .appointment-item:last-child {
    border-bottom: none;
}

.user-info, .appointment-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.user-role {
    padding: 0.3rem 0.8rem;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
}

.user-role.patient {
    background: #e3f2fd;
    color: #1976d2;
}

.user-role.doctor {
    background: #e8f5e8;
    color: #2e7d32;
}

.user-role.admin {
    background: #fff3e0;
    color: #f57c00;
}

.status {
    padding: 0.5rem 1rem;
    border-radius: 15px;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status.scheduled {
    background: #e3f2fd;
    color: #1976d2;
}

.status.confirmed {
    background: #e8f5e8;
    color: #2e7d32;
}

.status.completed {
    background: #f3e5f5;
    color: #7b1fa2;
}

.status.cancelled {
    background: #ffebee;
    color: #d32f2f;
}

.quick-actions {
    background: white;
    padding: 3rem;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.quick-actions h3 {
    color: var(--blue);
    margin-bottom: 2rem;
    font-size: 2rem;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
}

.action-btn {
    background: linear-gradient(135deg, var(--blue), #0066cc);
    color: white;
    padding: 2rem;
    border-radius: 15px;
    text-decoration: none;
    text-align: center;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.action-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(1, 136, 223, 0.3);
}

.action-btn i {
    font-size: 2.5rem;
}

.action-btn span {
    font-size: 1.4rem;
    font-weight: 600;
}

@media (max-width: 768px) {
    .dashboard-container {
        padding: 0 1rem;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .management-grid {
        grid-template-columns: 1fr;
    }
    
    .actions-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>

<jsp:include page="../common/footer.jsp" />