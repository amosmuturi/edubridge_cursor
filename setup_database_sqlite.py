#!/usr/bin/env python3
"""
Database setup script for EduBridge using SQLite (fallback option)
This script creates the database, tables, and adds sample data.
"""

import sqlite3
import hashlib
import os
from datetime import datetime

# Database configuration
DB_FILE = 'tutorlink.db'

def create_database():
    """Create the SQLite database and tables"""
    try:
        # Connect to SQLite database (creates it if it doesn't exist)
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                user_type TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create tutors table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tutor (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                subject TEXT NOT NULL,
                price_per_hour REAL NOT NULL,
                availability TEXT NOT NULL,
                whatsapp_number TEXT NOT NULL,
                location TEXT NOT NULL,
                bio TEXT,
                rating REAL DEFAULT 0.0,
                total_sessions INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
            )
        """)
        
        # Create connections table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS connection (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                tutor_id INTEGER NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES user(id) ON DELETE CASCADE,
                FOREIGN KEY (tutor_id) REFERENCES user(id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()
        print(f"✅ Database '{DB_FILE}' created successfully")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def add_sample_data():
    """Add sample users and tutors"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Sample users
        sample_users = [
            ('John Smith', 'john@tutorlink.com', hash_password('password123'), 'student'),
            ('Sarah Johnson', 'sarah@tutorlink.com', hash_password('password123'), 'student'),
            ('Mike Wilson', 'mike@tutorlink.com', hash_password('password123'), 'student'),
            ('Dr. Emily Brown', 'emily@tutorlink.com', hash_password('password123'), 'tutor'),
            ('Prof. David Lee', 'david@tutorlink.com', hash_password('password123'), 'tutor'),
            ('Maria Garcia', 'maria@tutorlink.com', hash_password('password123'), 'tutor'),
            ('Dr. James Chen', 'james@tutorlink.com', hash_password('password123'), 'tutor'),
            ('Lisa Anderson', 'lisa@tutorlink.com', hash_password('password123'), 'tutor'),
            ('Robert Taylor', 'robert@tutorlink.com', hash_password('password123'), 'tutor'),
            ('Amanda White', 'amanda@tutorlink.com', hash_password('password123'), 'tutor')
        ]
        
        # Insert users
        for user in sample_users:
            cursor.execute("""
                INSERT OR IGNORE INTO user (name, email, password_hash, user_type)
                VALUES (?, ?, ?, ?)
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
                INSERT OR IGNORE INTO tutor (user_id, subject, price_per_hour, availability, whatsapp_number, location, bio)
                VALUES (?, ?, ?, ?, ?, ?, ?)
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
                INSERT OR IGNORE INTO connection (student_id, tutor_id)
                VALUES (?, ?)
            """, connection)
        
        conn.commit()
        print("✅ Sample data added successfully")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")

def main():
    """Main setup function"""
    print("🚀 Setting up TutorLink database (SQLite)...")
    print("=" * 50)
    
    # Create database and tables
    print("\n📦 Creating database...")
    create_database()
    
    # Add sample data
    print("\n👥 Adding sample data...")
    add_sample_data()
    
    print("\n" + "=" * 50)
    print("✅ Database setup completed!")
    print(f"📁 Database file: {DB_FILE}")
    print("\n📝 Sample accounts created:")
    print("Students:")
    print("- john@tutorlink.com / password123")
    print("- sarah@tutorlink.com / password123")
    print("- mike@tutorlink.com / password123")
    print("\nTutors:")
    print("- emily@tutorlink.com / password123 (Mathematics)")
    print("- david@tutorlink.com / password123 (Physics)")
    print("- maria@tutorlink.com / password123 (English Literature)")
    print("- james@tutorlink.com / password123 (Computer Science)")
    print("- lisa@tutorlink.com / password123 (Chemistry)")
    print("- robert@tutorlink.com / password123 (Biology)")
    print("- amanda@tutorlink.com / password123 (Spanish)")
    
    print("\n🎉 You can now run: python app.py")

if __name__ == "__main__":
    main()
