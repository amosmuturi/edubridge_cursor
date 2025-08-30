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

app = Flask(__name__)
app.config['SECRET_KEY'] = 'edubridge-secret-key-2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:password@localhost/edubridge'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Hugging Face API configuration
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
HUGGINGFACE_API_KEY = "your-huggingface-api-key"  # Replace with your actual API key

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
        
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email already registered'})
        
        user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            user_type=user_type
        )
        db.session.add(user)
        db.session.commit()
        
        login_user(user)
        return jsonify({'success': True, 'redirect': url_for('dashboard')})
    
    return render_template('signup.html')

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
