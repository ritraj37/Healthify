# Healthify Web Application

A production-ready JSP/Servlet healthcare management system built with Maven, featuring secure authentication, role-based access control, and modern web technologies.

## 🏗️ Architecture

- **Backend**: Java 11, JSP/Servlet, Maven
- **Database**: MySQL 8.0 with HikariCP connection pooling
- **Security**: BCrypt password hashing, CSRF protection, XSS prevention
- **Frontend**: JSP with JSTL, Bootstrap-like responsive CSS
- **Deployment**: Docker, Tomcat 10, Nginx (optional)

## 🚀 Features

- ✅ User authentication with BCrypt password hashing
- ✅ Role-based access control (Patient, Doctor, Admin)
- ✅ CSRF token protection for forms
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Input sanitization and validation
- ✅ HikariCP database connection pooling
- ✅ Responsive design with mobile support
- ✅ Docker containerization
- ✅ Database migration scripts
- ✅ Comprehensive error handling

## 📋 Prerequisites

- Java 11 or higher
- Maven 3.6+
- MySQL 8.0+
- Docker & Docker Compose (for containerized deployment)

## 🛠️ Development Setup

### 1. Clone and Setup

```bash
cd d:\Healthify\healthify-webapp
```

### 2. Database Setup

```bash
# Start MySQL (local installation)
mysql -u root -p

# Create database and user
CREATE DATABASE healthify CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'healthify_user'@'localhost' IDENTIFIED BY 'healthify_pass';
GRANT ALL PRIVILEGES ON healthify.* TO 'healthify_user'@'localhost';
FLUSH PRIVILEGES;

# Run initialization script
mysql -u healthify_user -p healthify < sql/init.sql
```

### 3. Build and Run

```bash
# Build the application
mvn clean package

# Deploy to Tomcat
cp target/healthify.war $TOMCAT_HOME/webapps/

# Or run with embedded Tomcat (development)
mvn tomcat7:run
```

### 4. Access Application

- **Application**: http://localhost:8080/healthify
- **Admin Login**: admin / password123
- **Sample Doctor**: dr.smith / password123
- **Sample Patient**: patient1 / password123

## 🐳 Docker Deployment

### Development Environment

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production Environment

```bash
# Set environment variables
export DB_PASSWORD=your_secure_password
export DB_ROOT_PASSWORD=your_root_password

# Start with production profile
docker-compose --profile production up -d

# Scale application (if needed)
docker-compose up -d --scale app=3
```

## 🔧 Configuration

### Database Configuration

Update `src/main/webapp/WEB-INF/context.xml`:

```xml
<Resource name="jdbc/healthifyDB"
          jdbcUrl="jdbc:mysql://localhost:3306/healthify"
          username="healthify_user"
          password="healthify_pass"
          ... />
```

### Security Configuration

Security headers are configured in `SecurityHeadersFilter.java`:

- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff

### CSRF Protection

All POST forms must include CSRF token:

```jsp
<input type="hidden" name="csrfToken" value="${csrfToken}" />
```

## 📊 Database Schema

### Core Tables

- **users**: User accounts with roles (PATIENT, DOCTOR, ADMIN)
- **appointments**: Medical appointments
- **medical_records**: Patient medical history
- **doctor_profiles**: Doctor specializations and details

### Security Tables

- **audit_log**: System audit trail
- **user_sessions**: Session management
- **notifications**: User notifications

## 🔐 Security Features

### Password Security
- BCrypt hashing with 12 rounds
- Minimum 6 character requirement
- No password storage in plain text

### Session Security
- HTTP-only cookies
- Secure flag for HTTPS
- 30-minute timeout
- Session invalidation on logout

### Input Validation
- Server-side validation with Bean Validation
- XSS prevention through input sanitization
- SQL injection prevention with PreparedStatements

### Access Control
- Role-based authorization
- Protected admin routes
- Authentication filters

## 🚀 Deployment Guide

### Development → Staging

1. **Build Application**
   ```bash
   mvn clean package -Pstaging
   ```

2. **Database Migration**
   ```bash
   mysql -u root -p < sql/migration.sql
   ```

3. **Deploy WAR**
   ```bash
   cp target/healthify.war /opt/tomcat/webapps/
   ```

### Staging → Production

1. **Environment Setup**
   ```bash
   # Set production environment variables
   export JAVA_OPTS="-Xmx2g -Xms1g -XX:+UseG1GC"
   export DB_PASSWORD=production_password
   ```

2. **SSL Configuration**
   - Configure HTTPS in Tomcat or use Nginx proxy
   - Update security headers for HTTPS

3. **Database Optimization**
   ```sql
   -- Optimize for production
   SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
   SET GLOBAL max_connections = 200;
   ```

4. **Monitoring Setup**
   - Configure application logs
   - Set up health checks
   - Monitor database performance

## 📈 Performance Optimization

### Database
- HikariCP connection pooling (max 20 connections)
- Proper indexing on frequently queried columns
- Query optimization with EXPLAIN

### Application
- JSTL for view logic (no scriptlets)
- Efficient session management
- Resource compression

### Caching Strategy
- Browser caching for static resources
- Database query result caching (implement as needed)
- Session-based user data caching

## 🔍 Monitoring & Logging

### Application Logs
```bash
# View application logs
tail -f /usr/local/tomcat/logs/catalina.out

# View access logs
tail -f /usr/local/tomcat/logs/localhost_access_log.txt
```

### Health Checks
- **Application**: `GET /health`
- **Database**: Connection pool monitoring
- **Memory**: JVM heap monitoring

### Security Monitoring
- Failed login attempts tracking
- Audit log for sensitive operations
- Session monitoring

## 🧪 Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify -Pintegration-tests
```

### Security Testing
- OWASP ZAP scanning
- SQL injection testing
- XSS vulnerability testing

## 📝 API Documentation

### Authentication Endpoints
- `POST /login` - User login
- `POST /register` - User registration
- `GET /logout` - User logout

### Application Endpoints
- `GET /` - Home page
- `GET /dashboard` - User dashboard (authenticated)
- `GET /admin/*` - Admin panel (admin role)
- `POST /appointment/book` - Book appointment (authenticated)

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check MySQL service
   systemctl status mysql
   
   # Verify credentials
   mysql -u healthify_user -p
   ```

2. **CSRF Token Validation Failed**
   - Ensure forms include `${csrfToken}`
   - Check session timeout

3. **Memory Issues**
   ```bash
   # Increase JVM heap size
   export JAVA_OPTS="-Xmx1g -Xms512m"
   ```

### Performance Issues

1. **Slow Database Queries**
   ```sql
   -- Enable slow query log
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 2;
   ```

2. **High Memory Usage**
   - Monitor connection pool size
   - Check for memory leaks in sessions

## 📚 Additional Resources

- [Tomcat Documentation](https://tomcat.apache.org/tomcat-10.1-doc/)
- [HikariCP Configuration](https://github.com/brettwooldridge/HikariCP)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This is a production-ready application with security best practices. Always review and test thoroughly before deploying to production environments.