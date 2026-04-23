const pool = require('./connection');

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        mobile VARCHAR(15),
        date_of_birth DATE,
        gender VARCHAR(10),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Doctors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        specialization VARCHAR(100) NOT NULL,
        experience INTEGER NOT NULL,
        rating DECIMAL(2,1) DEFAULT 4.5,
        credentials TEXT[],
        availability_status VARCHAR(20) DEFAULT 'available',
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Appointments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        doctor_id INTEGER REFERENCES doctors(id),
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        reason TEXT,
        status VARCHAR(20) DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contact messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(15),
        subject VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // AI chat sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_chat_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        session_id VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        confidence DECIMAL(3,2),
        image_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Medical records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        doctor_id INTEGER REFERENCES doctors(id),
        diagnosis TEXT,
        treatment TEXT,
        medications TEXT[],
        notes TEXT,
        record_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Password reset tokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Newsletter subscribers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(100),
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Emergency contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        emergency_type VARCHAR(50),
        location TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Payment tables for secure transactions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(100) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id),
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        receipt VARCHAR(100),
        status VARCHAR(20) DEFAULT 'created',
        payment_id VARCHAR(100),
        signature VARCHAR(255),
        notes JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id SERIAL PRIMARY KEY,
        payment_id VARCHAR(100) UNIQUE NOT NULL,
        order_id VARCHAR(100),
        user_id INTEGER REFERENCES users(id),
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        method VARCHAR(50),
        gateway VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All database tables created successfully');
    
    // Insert sample doctors
    await insertSampleData();
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
};

const insertSampleData = async () => {
  try {
    // Check if doctors already exist
    const doctorCount = await pool.query('SELECT COUNT(*) FROM doctors');
    
    if (parseInt(doctorCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO doctors (name, specialization, experience, rating, credentials, availability_status, image_url) VALUES
        ('Dr. Bablu Parshad', 'Cardiologist & Internal Medicine', 15, 4.9, ARRAY['MBBS', 'MD Cardiology', 'FACC'], 'available', './images/doctor-1.png'),
        ('Dr. Vyomita Sharma', 'Orthopedic Surgeon', 12, 4.8, ARRAY['MBBS', 'MS Orthopedics', 'FICS'], 'busy', './images/doctor-2.jpg'),
        ('Dr. Rituraj', 'Neurologist & Neurosurgeon', 18, 4.9, ARRAY['MBBS', 'MCh Neurosurgery', 'FAANS'], 'available', './images/doctor-3.png')
      `);
      console.log('✅ Sample doctors inserted');
    }
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
};

module.exports = { createTables };