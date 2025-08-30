# EduBridge - AI-Powered Tutoring Platform

EduBridge is a comprehensive tutoring platform that connects students with expert tutors using advanced AI technology. Built with Flask, MySQL, and modern web technologies, it provides a seamless experience for both students and tutors.

## 🚀 Features

### For Students
- **AI-Powered Search**: Find tutors using semantic search with Hugging Face transformers
- **Smart Filtering**: Filter by subject, location, and availability
- **Direct Connection**: Connect with tutors via WhatsApp integration
- **AI Chatbot**: Get personalized recommendations and assistance
- **Tutor Profiles**: View detailed profiles with ratings and reviews
- **Responsive Design**: Works perfectly on desktop and mobile devices

### For Tutors
- **Profile Management**: Create and update detailed profiles
- **Statistics Dashboard**: Track sessions, earnings, and ratings
- **Student Connections**: View and manage student inquiries
- **WhatsApp Integration**: Direct communication with students
- **Analytics**: Monitor performance and engagement

### Technical Features
- **Semantic Search**: Uses sentence-transformers for intelligent tutor matching
- **User Authentication**: Secure login/signup with password hashing
- **Database Integration**: MySQL with SQLAlchemy ORM
- **RESTful API**: Clean API endpoints for all functionality
- **Responsive UI**: Modern, mobile-first design
- **Real-time Chatbot**: AI-powered assistance system

## 🛠️ Tech Stack

- **Backend**: Python Flask
- **Database**: MySQL
- **AI/ML**: Hugging Face Transformers, Sentence Transformers
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Authentication**: Flask-Login
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome

## 📋 Prerequisites

Before running EduBridge, make sure you have:

1. **Python 3.8+** installed
2. **MySQL 8.0+** installed and running
3. **Git** for cloning the repository

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd edubridge_cursor
```

### 2. Set Up Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Database

#### Option A: Using the Setup Script (Recommended)
```bash
# Edit setup_database.py and update your MySQL credentials
python setup_database.py
```

#### Option B: Manual Setup
1. Create a MySQL database named `edubridge`
2. Update the database connection in `app.py`:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/edubridge'
   ```

### 5. Configure Hugging Face API (Optional)
For enhanced AI features, get a Hugging Face API key:
1. Sign up at [Hugging Face](https://huggingface.co/)
2. Get your API key from your profile settings
3. Update the API key in `app.py`:
   ```python
   HUGGINGFACE_API_KEY = "your-actual-api-key"
   ```

### 6. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 👥 Sample Accounts

After running the setup script, you can use these sample accounts:

### Students
- **Email**: john@example.com | **Password**: password123
- **Email**: sarah@example.com | **Password**: password123
- **Email**: mike@example.com | **Password**: password123

### Tutors
- **Email**: emily@example.com | **Password**: password123 (Mathematics)
- **Email**: david@example.com | **Password**: password123 (Physics)
- **Email**: maria@example.com | **Password**: password123 (English Literature)
- **Email**: james@example.com | **Password**: password123 (Computer Science)
- **Email**: lisa@example.com | **Password**: password123 (Chemistry)
- **Email**: robert@example.com | **Password**: password123 (Biology)
- **Email**: amanda@example.com | **Password**: password123 (Spanish)

## 📁 Project Structure

```
edubridge_cursor/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── setup_database.py          # Database setup script
├── README.md                  # This file
├── static/                    # Static files
│   ├── css/
│   │   ├── style.css         # Main stylesheet
│   │   └── dashboard.css     # Dashboard-specific styles
│   └── js/
│       ├── landing.js        # Landing page JavaScript
│       ├── student_dashboard.js  # Student dashboard functionality
│       └── tutor_dashboard.js    # Tutor dashboard functionality
└── templates/                 # HTML templates
    ├── landing.html          # Landing page
    ├── student_dashboard.html # Student dashboard
    └── tutor_dashboard.html  # Tutor dashboard
```

## 🔧 Configuration

### Database Configuration
Update the database connection string in `app.py`:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/edubridge'
```

### Hugging Face API Configuration
For AI features, update the API key in `app.py`:
```python
HUGGINGFACE_API_KEY = "your-huggingface-api-key"
```

### WhatsApp Integration
The platform uses WhatsApp deep links for communication. Make sure tutors provide valid WhatsApp numbers in their profiles.

## 🎯 Usage Guide

### For Students

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Search Tutors**: Use the search bar to find tutors by subject, location, or description
3. **Filter Results**: Use the filter options to narrow down your search
4. **View Profiles**: Click on tutor cards to see detailed information
5. **Connect**: Use the WhatsApp button to connect directly with tutors
6. **AI Assistant**: Use the chatbot for personalized recommendations

### For Tutors

1. **Sign Up/Login**: Create a tutor account or log in
2. **Complete Profile**: Fill in your subject, pricing, availability, and bio
3. **Manage Profile**: Update your information anytime
4. **View Statistics**: Monitor your sessions, ratings, and earnings
5. **Student Connections**: View and manage student inquiries

## 🔍 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration
- `GET /logout` - User logout

### Tutors
- `GET /api/tutors` - Get all tutors
- `GET /api/tutors/search` - Search tutors with filters
- `GET /api/tutor/profile` - Get tutor profile
- `POST /api/tutor/profile` - Update tutor profile

### Connections
- `POST /api/connect` - Connect student with tutor

### AI Features
- `POST /api/chatbot` - AI chatbot responses

## 🤖 AI Features

### Semantic Search
The platform uses the `all-MiniLM-L6-v2` model from Hugging Face to provide intelligent tutor matching based on:
- Student queries and descriptions
- Tutor profiles and bios
- Subject relevance
- Location matching

### AI Chatbot
A rule-based chatbot that helps students with:
- Subject recommendations
- Pricing information
- Location-based suggestions
- General platform guidance

## 🎨 Design Features

- **Modern UI**: Clean, professional design with blue/white educational theme
- **Responsive Design**: Works seamlessly on all device sizes
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Mobile-First**: Optimized for mobile devices

## 🔒 Security Features

- **Password Hashing**: Secure password storage using Werkzeug
- **Session Management**: Flask-Login for secure user sessions
- **Input Validation**: Client and server-side form validation
- **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection
- **XSS Protection**: Proper HTML escaping and sanitization

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
For production deployment, consider:
1. Using a production WSGI server (Gunicorn, uWSGI)
2. Setting up a reverse proxy (Nginx)
3. Using environment variables for sensitive data
4. Setting up SSL certificates
5. Configuring proper logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your database connection
3. Ensure all dependencies are installed
4. Check that MySQL is running
5. Verify your Hugging Face API key (if using AI features)

## 🔮 Future Enhancements

- Video calling integration
- Payment processing
- Advanced analytics dashboard
- Mobile app development
- Multi-language support
- Advanced AI recommendations
- Real-time notifications
- Calendar integration

---

**EduBridge** - Connecting students with expert tutors through the power of AI.
