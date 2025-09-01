#!/usr/bin/env python3
"""
Deployment script for testing IntaSend integration
"""

import os
import subprocess
import sys

def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    try:
        import flask
        import intasend
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def setup_environment():
    """Setup environment variables for testing"""
    print("🔧 Setting up environment...")
    
    # Create .env file if it doesn't exist
    env_file = ".env"
    if not os.path.exists(env_file):
        print("📝 Creating .env file...")
        with open(env_file, 'w') as f:
            f.write("""# IntaSend Configuration (TESTING)
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_your_publishable_key_here
INTASEND_SECRET_KEY=ISSecretKey_test_your_secret_key_here
INTASEND_API_URL=https://sandbox.intasend.com

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
""")
        print("✅ .env file created")
        print("⚠️  Please update the IntaSend API keys in .env file")
    else:
        print("✅ .env file already exists")

def setup_database():
    """Setup database"""
    print("🗄️  Setting up database...")
    
    try:
        subprocess.run([sys.executable, "setup_database.py"], check=True)
        print("✅ Database setup completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Database setup failed: {e}")
        return False

def start_server():
    """Start the Flask development server"""
    print("🚀 Starting development server...")
    print("📱 Server will be available at: http://localhost:5000")
    print("🔗 For webhook testing, use ngrok: ngrok http 5000")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        subprocess.run([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

def main():
    """Main deployment function"""
    print("🎓 EduBridge - IntaSend Integration Test Deployment")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Setup environment
    setup_environment()
    
    # Setup database
    if not setup_database():
        return
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
