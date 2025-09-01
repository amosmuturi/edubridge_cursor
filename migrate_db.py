#!/usr/bin/env python3
"""
Database Migration Helper Script
This script helps manage database migrations for the EduBridge application.
"""

import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, upgrade, init, migrate as flask_migrate

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def create_app():
    """Create a minimal Flask app for migrations"""
    app = Flask(__name__)
    
    # Database configuration
    db_path = os.path.join(os.getcwd(), "edubridge.db")
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    return app

def run_migrations():
    """Run database migrations"""
    app = create_app()
    db = SQLAlchemy(app)
    migrate = Migrate(app, db)
    
    with app.app_context():
        try:
            # Check if migrations folder exists
            if not os.path.exists('migrations'):
                print("Initializing Flask-Migrate...")
                init()
                print("✓ Flask-Migrate initialized")
            
            # Create migration if there are changes
            print("Creating migration...")
            flask_migrate(message="Auto migration")
            print("✓ Migration created")
            
            # Apply migrations
            print("Applying migrations...")
            upgrade()
            print("✓ Migrations applied successfully")
            
        except Exception as e:
            print(f"❌ Error during migration: {e}")
            return False
    
    return True

def init_migrations():
    """Initialize migrations folder"""
    app = create_app()
    db = SQLAlchemy(app)
    migrate = Migrate(app, db)
    
    with app.app_context():
        try:
            if not os.path.exists('migrations'):
                print("Initializing Flask-Migrate...")
                init()
                print("✓ Flask-Migrate initialized successfully")
            else:
                print("✓ Migrations folder already exists")
        except Exception as e:
            print(f"❌ Error initializing migrations: {e}")
            return False
    
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "init":
            success = init_migrations()
        elif command == "migrate":
            success = run_migrations()
        else:
            print("Usage: python migrate_db.py [init|migrate]")
            print("  init    - Initialize migrations folder")
            print("  migrate - Run all pending migrations")
            sys.exit(1)
        
        if success:
            print("✓ Operation completed successfully")
            sys.exit(0)
        else:
            print("❌ Operation failed")
            sys.exit(1)
    else:
        print("Usage: python migrate_db.py [init|migrate]")
        print("  init    - Initialize migrations folder")
        print("  migrate - Run all pending migrations")
        sys.exit(1)
