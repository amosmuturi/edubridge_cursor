#!/usr/bin/env python3
"""
Database setup script for EduBridge
This script creates the database, tables, and adds sample data.
"""

import mysql.connector
from mysql.connector import Error
import hashlib
import os

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',  # Change this to your MySQL password
    'database': 'edubridge'
}

def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect without specifying database
        connection = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create database
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")
            print(f"Database '{DB_CONFIG['database']}' created successfully")
            
            cursor.close()
            connection.close()
            
    except Error as e:
        print(f"Error creating database: {e}")

def create_tables():
    """Create all necessary tables"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(120) UNIQUE NOT NULL,
                    password_hash VARCHAR(200) NOT NULL,
                    user_type VARCHAR(20) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create tutors table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tutor (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    subject VARCHAR(100) NOT NULL,
                    price_per_hour FLOAT NOT NULL,
                    availability TEXT NOT NULL,
                    whatsapp_number VARCHAR(20) NOT NULL,
                    location VARCHAR(100) NOT NULL,
                    bio TEXT,
                    rating FLOAT DEFAULT 0.0,
                    total_sessions INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
                )
            """)
            
            # Create connections table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS connection (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    student_id INT NOT NULL,
                    tutor_id INT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_id) REFERENCES user(id) ON DELETE CASCADE,
                    FOREIGN KEY (tutor_id) REFERENCES user(id) ON DELETE CASCADE
                )
            """)
            
            connection.commit()
            print("Tables created successfully")
            
            cursor.close()
            connection.close()
            
    except Error as e:
        print(f"Error creating tables: {e}")

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def add_sample_data():
    """Add sample users and tutors"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Sample users
            sample_users = [
                ('John Smith', 'john@example.com', hash_password('password123'), 'student'),
                ('Sarah Johnson', 'sarah@example.com', hash_password('password123'), 'student'),
                ('Mike Wilson', 'mike@example.com', hash_password('password123'), 'student'),
                ('Dr. Emily Brown', 'emily@example.com', hash_password('password123'), 'tutor'),
                ('Prof. David Lee', 'david@example.com', hash_password('password123'), 'tutor'),
                ('Maria Garcia', 'maria@example.com', hash_password('password123'), 'tutor'),
                ('Dr. James Chen', 'james@example.com', hash_password('password123'), 'tutor'),
                ('Lisa Anderson', 'lisa@example.com', hash_password('password123'), 'tutor'),
                ('Robert Taylor', 'robert@example.com', hash_password('password123'), 'tutor'),
                ('Amanda White', 'amanda@example.com', hash_password('password123'), 'tutor')
            ]
            
            # Insert users
            for user in sample_users:
                cursor.execute("""
                    INSERT IGNORE INTO user (name, email, password_hash, user_type)
                    VALUES (%s, %s, %s, %s)
                """, user)
            
            # Sample tutors
            sample_tutors = [
                (4, 'Mathematics', 35.0, 'Weekdays 6-9 PM, Weekends 10 AM-2 PM', '+1234567890', 'New York, NY', 'PhD in Mathematics with 10+ years of teaching experience. Specializing in calculus, algebra, and statistics.'),
                (5, 'Physics', 40.0, 'Monday-Friday 4-8 PM', '+1234567891', 'Boston, MA', 'Experienced physics professor with expertise in mechanics, thermodynamics, and quantum physics.'),
                (6, 'English Literature', 30.0, 'Tuesday-Thursday 5-9 PM, Saturday 9 AM-1 PM', '+1234567892', 'Los Angeles, CA', 'English literature specialist with focus on classic and modern literature, essay writing, and creative writing.'),
                (7, 'Computer Science', 45.0, 'Weekdays 7-10 PM, Sunday 2-6 PM', '+1234567893', 'San Francisco, CA', 'Software engineer with 15+ years experience. Teaching programming, algorithms, and software development.'),
                (8, 'Chemistry', 35.0, 'Monday, Wednesday, Friday 6-9 PM', '+1234567894', 'Chicago, IL', 'Chemistry professor specializing in organic chemistry, biochemistry, and laboratory techniques.'),
                (9, 'Biology', 32.0, 'Tuesday, Thursday 4-7 PM, Saturday 10 AM-2 PM', '+1234567895', 'Miami, FL', 'Biology expert with focus on cell biology, genetics, and ecology.'),
                (10, 'Spanish', 28.0, 'Monday-Friday 5-8 PM', '+1234567896', 'Austin, TX', 'Native Spanish speaker with 8 years of teaching experience. Conversational and academic Spanish.')
            ]
            
            # Insert tutors
            for tutor in sample_tutors:
                cursor.execute("""
                    INSERT IGNORE INTO tutor (user_id, subject, price_per_hour, availability, whatsapp_number, location, bio)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, tutor)
            
            # Sample connections
            sample_connections = [
                (1, 4),  # John connected with Emily (Math)
                (2, 5),  # Sarah connected with David (Physics)
                (3, 6),  # Mike connected with Maria (English)
                (1, 7),  # John connected with James (CS)
                (2, 8),  # Sarah connected with Lisa (Chemistry)
            ]
            
            # Insert connections
            for connection in sample_connections:
                cursor.execute("""
                    INSERT IGNORE INTO connection (student_id, tutor_id)
                    VALUES (%s, %s)
                """, connection)
            
            connection.commit()
            print("Sample data added successfully")
            
            cursor.close()
            connection.close()
            
    except Error as e:
        print(f"Error adding sample data: {e}")

def main():
    """Main setup function"""
    print("Setting up EduBridge database...")
    
    # Create database
    create_database()
    
    # Create tables
    create_tables()
    
    # Add sample data
    add_sample_data()
    
    print("\nDatabase setup completed!")
    print("\nSample accounts created:")
    print("Students:")
    print("- john@example.com / password123")
    print("- sarah@example.com / password123")
    print("- mike@example.com / password123")
    print("\nTutors:")
    print("- emily@example.com / password123 (Mathematics)")
    print("- david@example.com / password123 (Physics)")
    print("- maria@example.com / password123 (English Literature)")
    print("- james@example.com / password123 (Computer Science)")
    print("- lisa@example.com / password123 (Chemistry)")
    print("- robert@example.com / password123 (Biology)")
    print("- amanda@example.com / password123 (Spanish)")

if __name__ == "__main__":
    main()
