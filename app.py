from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import json
import os
from datetime import datetime
import numpy as np
from sentence_transformers import SentenceTransformer
import re
from intasend import APIService
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tutorlink-secret-key-2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tutorlink.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Hugging Face API configuration
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
HUGGINGFACE_API_KEY = "your-huggingface-api-key"  # Replace with your actual API key

# IntaSend API configuration
INTASEND_PUBLISHABLE_KEY = os.getenv('INTASEND_PUBLISHABLE_KEY', 'ISPubKey_test_...')
INTASEND_SECRET_KEY = os.getenv('INTASEND_SECRET_KEY', 'ISSecretKey_test_...')
INTASEND_API_URL = os.getenv('INTASEND_API_URL', 'https://sandbox.intasend.com')

# Load sentence transformer model for semantic search
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
except:
    model = None

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # 'student' or 'tutor'
    phone = db.Column(db.String(15), nullable=False)
    county = db.Column(db.String(50), nullable=False)
    sub_county = db.Column(db.String(50), nullable=False)
    constituency = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Tutor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    price_per_hour = db.Column(db.Float, nullable=False)
    availability = db.Column(db.Text, nullable=False)
    whatsapp_number = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Float, default=0.0)
    total_sessions = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Connection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tutor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tutor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='KES')
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    intasend_invoice_id = db.Column(db.String(100), nullable=True)
    payment_method = db.Column(db.String(50), nullable=True)  # mpesa, card, bank
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tutor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    payment_id = db.Column(db.Integer, db.ForeignKey('payment.id'), nullable=True)
    session_date = db.Column(db.DateTime, nullable=False)
    duration_hours = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='scheduled')  # scheduled, completed, cancelled
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return jsonify({'success': True, 'redirect': url_for('dashboard')})
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'})
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        user_type = data.get('user_type')
        phone = data.get('phone')
        county = data.get('county')
        sub_county = data.get('sub_county')
        constituency = data.get('constituency')
        location = data.get('location')
        
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email already registered'})
        
        user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            user_type=user_type,
            phone=phone,
            county=county,
            sub_county=sub_county,
            constituency=constituency,
            location=location
        )
        db.session.add(user)
        db.session.commit()
        
        # If user is a tutor, create tutor profile
        if user_type == 'tutor':
            subject = data.get('subject')
            price_per_hour = data.get('price_per_hour')
            availability = data.get('availability')
            bio = data.get('bio')
            
            tutor = Tutor(
                user_id=user.id,
                subject=subject,
                price_per_hour=price_per_hour,
                availability=availability,
                bio=bio,
                whatsapp_number=phone,
                location=f"{county}, {sub_county}, {constituency}, {location}"
            )
            db.session.add(tutor)
            db.session.commit()
        
        login_user(user)
        return jsonify({'success': True, 'redirect': url_for('dashboard')})
    
    return render_template('landing.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('landing'))

@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.user_type == 'student':
        return render_template('student_dashboard.html')
    else:
        return render_template('tutor_dashboard.html')

# API Routes
@app.route('/api/tutors')
def get_tutors():
    tutors = Tutor.query.all()
    tutor_data = []
    
    for tutor in tutors:
        user = User.query.get(tutor.user_id)
        tutor_data.append({
            'id': tutor.id,
            'name': user.name,
            'subject': tutor.subject,
            'price_per_hour': tutor.price_per_hour,
            'availability': tutor.availability,
            'whatsapp_number': tutor.whatsapp_number,
            'location': tutor.location,
            'bio': tutor.bio,
            'rating': tutor.rating,
            'total_sessions': tutor.total_sessions
        })
    
    return jsonify(tutor_data)

@app.route('/api/tutors/search')
def search_tutors():
    query = request.args.get('query', '')
    subject = request.args.get('subject', '')
    location = request.args.get('location', '')
    
    tutors_query = Tutor.query
    
    if subject:
        tutors_query = tutors_query.filter(Tutor.subject.ilike(f'%{subject}%'))
    if location:
        tutors_query = tutors_query.filter(Tutor.location.ilike(f'%{location}%'))
    
    tutors = tutors_query.all()
    
    # Semantic search if query is provided and model is available
    if query and model:
        tutor_data = []
        for tutor in tutors:
            user = User.query.get(tutor.user_id)
            tutor_text = f"{user.name} {tutor.subject} {tutor.bio or ''} {tutor.location}"
            tutor_data.append({
                'tutor': tutor,
                'user': user,
                'text': tutor_text
            })
        
        # Get embeddings
        query_embedding = model.encode([query])
        tutor_embeddings = model.encode([t['text'] for t in tutor_data])
        
        # Calculate similarities
        similarities = np.dot(tutor_embeddings, query_embedding.T).flatten()
        
        # Sort by similarity
        sorted_indices = np.argsort(similarities)[::-1]
        sorted_tutors = [tutor_data[i] for i in sorted_indices]
        
        result = []
        for item in sorted_tutors:
            tutor = item['tutor']
            user = item['user']
            result.append({
                'id': tutor.id,
                'name': user.name,
                'subject': tutor.subject,
                'price_per_hour': tutor.price_per_hour,
                'availability': tutor.availability,
                'whatsapp_number': tutor.whatsapp_number,
                'location': tutor.location,
                'bio': tutor.bio,
                'rating': tutor.rating,
                'total_sessions': tutor.total_sessions,
                'similarity_score': float(similarities[sorted_indices[len(result)]])
            })
    else:
        result = []
        for tutor in tutors:
            user = User.query.get(tutor.user_id)
            result.append({
                'id': tutor.id,
                'name': user.name,
                'subject': tutor.subject,
                'price_per_hour': tutor.price_per_hour,
                'availability': tutor.availability,
                'whatsapp_number': tutor.whatsapp_number,
                'location': tutor.location,
                'bio': tutor.bio,
                'rating': tutor.rating,
                'total_sessions': tutor.total_sessions
            })
    
    return jsonify(result)

@app.route('/api/tutor/profile', methods=['GET', 'POST'])
@login_required
def tutor_profile():
    if current_user.user_type != 'tutor':
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'POST':
        data = request.get_json()
        
        tutor = Tutor.query.filter_by(user_id=current_user.id).first()
        if not tutor:
            tutor = Tutor(user_id=current_user.id)
            db.session.add(tutor)
        
        tutor.subject = data.get('subject')
        tutor.price_per_hour = float(data.get('price_per_hour'))
        tutor.availability = data.get('availability')
        tutor.whatsapp_number = data.get('whatsapp_number')
        tutor.location = data.get('location')
        tutor.bio = data.get('bio')
        
        db.session.commit()
        return jsonify({'success': True})
    
    # GET request
    tutor = Tutor.query.filter_by(user_id=current_user.id).first()
    if tutor:
        return jsonify({
            'subject': tutor.subject,
            'price_per_hour': tutor.price_per_hour,
            'availability': tutor.availability,
            'whatsapp_number': tutor.whatsapp_number,
            'location': tutor.location,
            'bio': tutor.bio,
            'rating': tutor.rating,
            'total_sessions': tutor.total_sessions
        })
    else:
        return jsonify({})

@app.route('/api/connect', methods=['POST'])
@login_required
def connect_tutor():
    if current_user.user_type != 'student':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    tutor_id = data.get('tutor_id')
    
    # Check if connection already exists
    existing_connection = Connection.query.filter_by(
        student_id=current_user.id,
        tutor_id=tutor_id
    ).first()
    
    if existing_connection:
        return jsonify({'error': 'Connection already exists'}), 400
    
    connection = Connection(
        student_id=current_user.id,
        tutor_id=tutor_id
    )
    db.session.add(connection)
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    message = data.get('message', '').lower()
    
    # Simple rule-based chatbot
    if 'math' in message or 'mathematics' in message:
        response = "I can help you find math tutors! We have tutors specializing in algebra, calculus, geometry, and more. What specific math topic are you looking for?"
    elif 'science' in message:
        response = "Great choice! We have excellent science tutors covering physics, chemistry, biology, and more. What science subject interests you?"
    elif 'english' in message or 'language' in message:
        response = "Perfect! Our English tutors can help with grammar, literature, writing, and language skills. What specific area do you need help with?"
    elif 'price' in message or 'cost' in message:
        response = "Our tutors set their own rates, typically ranging from $20-50 per hour. You can see individual pricing on each tutor's profile."
    elif 'location' in message or 'where' in message:
        response = "We have tutors available both online and in-person. You can filter by location to find tutors near you."
    else:
        response = "I'm here to help you find the perfect tutor! You can search by subject, location, or ask me about specific topics like math, science, or English."
    
    return jsonify({'response': response})

# Payment Routes
@app.route('/api/payments/create', methods=['POST'])
@login_required
def create_payment():
    if current_user.user_type != 'student':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    tutor_id = data.get('tutor_id')
    amount = data.get('amount')
    duration_hours = data.get('duration_hours', 1)
    session_date = data.get('session_date')
    payment_method = data.get('payment_method', 'mpesa')
    phone_number = data.get('phone_number')
    
    # Validate input
    if not all([tutor_id, amount, session_date]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validate phone number for M-Pesa
    if payment_method == 'mpesa' and not phone_number:
        return jsonify({'error': 'Phone number required for M-Pesa payment'}), 400
    
    try:
        # Initialize IntaSend API
        intasend = APIService(
            publishable_key=INTASEND_PUBLISHABLE_KEY,
            secret_key=INTASEND_SECRET_KEY,
            test=True  # Set to False for production
        )
        
        # Create payment record
        payment = Payment(
            student_id=current_user.id,
            tutor_id=tutor_id,
            amount=amount,
            description=f"Tutoring session - {duration_hours} hour(s)",
            payment_method=payment_method
        )
        db.session.add(payment)
        db.session.commit()
        
        # Get tutor info
        tutor = Tutor.query.get(tutor_id)
        tutor_user = User.query.get(tutor.user_id) if tutor else None
        
        # Create IntaSend invoice with M-Pesa integration
        invoice_data = {
            'invoice': {
                'number': f"INV-{payment.id:06d}",
                'currency': 'KES',
                'amount': amount,
                'description': payment.description,
                'due_date': session_date,
                'customer': {
                    'email': current_user.email,
                    'first_name': current_user.name.split()[0] if current_user.name else '',
                    'last_name': ' '.join(current_user.name.split()[1:]) if len(current_user.name.split()) > 1 else '',
                    'phone': phone_number if phone_number else None
                }
            }
        }
        
        # Add M-Pesa specific configuration
        if payment_method == 'mpesa' and phone_number:
            invoice_data['invoice']['payment_methods'] = ['mpesa']
            invoice_data['invoice']['mpesa_phone'] = phone_number
        
        response = intasend.create_invoice(invoice_data)
        
        if response.get('state') == 'PENDING':
            payment.intasend_invoice_id = response.get('invoice_id')
            payment.status = 'pending'
            db.session.commit()
            
            return jsonify({
                'success': True,
                'payment_id': payment.id,
                'invoice_id': response.get('invoice_id'),
                'payment_url': response.get('hosted_url'),
                'amount': amount,
                'tutor_name': tutor_user.name if tutor_user else 'Unknown Tutor'
            })
        else:
            payment.status = 'failed'
            db.session.commit()
            return jsonify({'error': 'Failed to create payment'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payments/status/<int:payment_id>', methods=['GET'])
@login_required
def get_payment_status(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    
    # Check if user is authorized to view this payment
    if payment.student_id != current_user.id and payment.tutor_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        # Initialize IntaSend API
        intasend = APIService(
            publishable_key=INTASEND_PUBLISHABLE_KEY,
            secret_key=INTASEND_SECRET_KEY,
            test=True
        )
        
        if payment.intasend_invoice_id:
            # Get invoice status from IntaSend
            invoice_status = intasend.get_invoice(payment.intasend_invoice_id)
            payment.status = invoice_status.get('state', 'pending').lower()
            db.session.commit()
        
        return jsonify({
            'payment_id': payment.id,
            'status': payment.status,
            'amount': payment.amount,
            'currency': payment.currency,
            'created_at': payment.created_at.isoformat(),
            'description': payment.description
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payments/webhook', methods=['POST'])
def payment_webhook():
    """Handle IntaSend payment webhooks"""
    try:
        data = request.get_json()
        
        # Verify webhook signature (you should implement this)
        # signature = request.headers.get('X-Intasend-Signature')
        
        invoice_id = data.get('invoice_id')
        state = data.get('state')
        
        # Find payment by invoice ID
        payment = Payment.query.filter_by(intasend_invoice_id=invoice_id).first()
        
        if payment:
            if state == 'COMPLETED':
                payment.status = 'completed'
                # Create session record
                session = Session(
                    student_id=payment.student_id,
                    tutor_id=payment.tutor_id,
                    payment_id=payment.id,
                    session_date=payment.created_at,  # You might want to get this from the request
                    duration_hours=1  # Default duration
                )
                db.session.add(session)
            elif state == 'FAILED':
                payment.status = 'failed'
            
            db.session.commit()
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payments/history', methods=['GET'])
@login_required
def get_payment_history():
    """Get payment history for the current user"""
    if current_user.user_type == 'student':
        payments = Payment.query.filter_by(student_id=current_user.id).order_by(Payment.created_at.desc()).all()
    else:
        payments = Payment.query.filter_by(tutor_id=current_user.id).order_by(Payment.created_at.desc()).all()
    
    payment_data = []
    for payment in payments:
        student = User.query.get(payment.student_id)
        tutor = User.query.get(payment.tutor_id)
        
        payment_data.append({
            'id': payment.id,
            'amount': payment.amount,
            'currency': payment.currency,
            'status': payment.status,
            'description': payment.description,
            'created_at': payment.created_at.isoformat(),
            'student_name': student.name if student else 'Unknown',
            'tutor_name': tutor.name if tutor else 'Unknown'
        })
    
    return jsonify(payment_data)

import os

# Ensure DB file path is absolute so Render can find/write it
db_path = os.path.join(os.getcwd(), "tutorlink.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"

@app.before_first_request
def create_tables():
    # create tables if they don't exist
    try:
        db.create_all()
    except Exception as e:
        # log so Render logs capture the failure
        app.logger.exception("Failed to create DB tables on startup: %s", e)

# Keep a local-run helper
if __name__ == "__main__":
    # Only used for local dev
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)

    
