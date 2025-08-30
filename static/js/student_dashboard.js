// Global variables
let allTutors = [];
let filteredTutors = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadAllTutors();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchTutors();
        });
    }
    
    // Enter key in search inputs
    document.getElementById('searchQuery').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchTutors();
        }
    });
    
    // Chatbot input
    const chatbotInput = document.getElementById('chatbotInput');
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatbotMessage();
            }
        });
    }
}

// Load all tutors
function loadAllTutors() {
    showLoading(true);
    
    fetch('/api/tutors')
        .then(response => response.json())
        .then(data => {
            allTutors = data;
            filteredTutors = data;
            displayTutors(data);
            updateResultsCount(data.length);
            showLoading(false);
        })
        .catch(error => {
            console.error('Error loading tutors:', error);
            showLoading(false);
            showNoResults();
        });
}

// Search tutors
function searchTutors() {
    const query = document.getElementById('searchQuery').value.trim();
    const subject = document.getElementById('searchSubject').value.trim();
    const location = document.getElementById('searchLocation').value.trim();
    
    if (!query && !subject && !location) {
        loadAllTutors();
        return;
    }
    
    showLoading(true);
    
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (subject) params.append('subject', subject);
    if (location) params.append('location', location);
    
    fetch(`/api/tutors/search?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            filteredTutors = data;
            displayTutors(data);
            updateResultsCount(data.length);
            showLoading(false);
            
            if (data.length === 0) {
                showNoResults();
            }
        })
        .catch(error => {
            console.error('Error searching tutors:', error);
            showLoading(false);
            showNoResults();
        });
}

// Search by subject tag
function searchBySubject(subject) {
    document.getElementById('searchSubject').value = subject;
    searchTutors();
}

// Display tutors in grid
function displayTutors(tutors) {
    const container = document.getElementById('tutorsContainer');
    
    if (tutors.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    const tutorCards = tutors.map(tutor => createTutorCard(tutor)).join('');
    container.innerHTML = tutorCards;
    
    // Add event listeners to tutor cards
    document.querySelectorAll('.tutor-card').forEach(card => {
        card.addEventListener('click', function() {
            const tutorId = this.dataset.tutorId;
            const tutor = tutors.find(t => t.id == tutorId);
            if (tutor) {
                showTutorModal(tutor);
            }
        });
    });
}

// Create tutor card HTML
function createTutorCard(tutor) {
    const rating = tutor.rating || 0;
    const stars = generateStars(rating);
    const avatar = tutor.name.charAt(0).toUpperCase();
    
    return `
        <div class="tutor-card" data-tutor-id="${tutor.id}">
            <div class="tutor-header">
                <div class="tutor-avatar">${avatar}</div>
                <div class="tutor-info">
                    <h3>${tutor.name}</h3>
                    <div class="tutor-subject">${tutor.subject}</div>
                </div>
            </div>
            
            <div class="tutor-rating">
                ${stars}
                <span>${rating.toFixed(1)} (${tutor.total_sessions || 0} sessions)</span>
            </div>
            
            <div class="tutor-details">
                <div class="tutor-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${tutor.location}</span>
                </div>
                <div class="tutor-detail">
                    <i class="fas fa-clock"></i>
                    <span>${tutor.availability}</span>
                </div>
            </div>
            
            <div class="tutor-price">$${tutor.price_per_hour}/hour</div>
            
            ${tutor.bio ? `<div class="tutor-bio">${tutor.bio}</div>` : ''}
            
            <div class="tutor-actions">
                <a href="https://wa.me/${tutor.whatsapp_number}?text=Hello! I'm interested in ${tutor.subject} tutoring" 
                   class="btn-connect" target="_blank" onclick="event.stopPropagation(); connectTutor(${tutor.id});">
                    <i class="fab fa-whatsapp"></i>
                    Connect
                </a>
                <button class="btn-view" onclick="event.stopPropagation(); showTutorModal(${JSON.stringify(tutor).replace(/"/g, '&quot;')});">
                    <i class="fas fa-eye"></i>
                    View
                </button>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Show tutor modal
function showTutorModal(tutor) {
    const modal = document.getElementById('tutorModal');
    const content = document.getElementById('tutorModalContent');
    
    const avatar = tutor.name.charAt(0).toUpperCase();
    const rating = tutor.rating || 0;
    const stars = generateStars(rating);
    
    content.innerHTML = `
        <div class="tutor-modal-content">
            <div class="tutor-modal-header">
                <div class="tutor-modal-avatar">${avatar}</div>
                <div class="tutor-modal-info">
                    <h2>${tutor.name}</h2>
                    <div class="tutor-modal-subject">${tutor.subject}</div>
                    <div class="tutor-modal-rating">
                        ${stars}
                        <span>${rating.toFixed(1)} (${tutor.total_sessions || 0} sessions)</span>
                    </div>
                </div>
            </div>
            
            <div class="tutor-modal-details">
                <div class="tutor-modal-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>Location:</strong> ${tutor.location}</span>
                </div>
                <div class="tutor-modal-detail">
                    <i class="fas fa-clock"></i>
                    <span><strong>Availability:</strong> ${tutor.availability}</span>
                </div>
                <div class="tutor-modal-detail">
                    <i class="fas fa-dollar-sign"></i>
                    <span><strong>Price:</strong> $${tutor.price_per_hour}/hour</span>
                </div>
            </div>
            
            ${tutor.bio ? `
                <div class="tutor-modal-bio">
                    <h4>About ${tutor.name}</h4>
                    <p>${tutor.bio}</p>
                </div>
            ` : ''}
            
            <div class="tutor-modal-actions">
                <a href="https://wa.me/${tutor.whatsapp_number}?text=Hello! I'm interested in ${tutor.subject} tutoring" 
                   class="btn btn-primary" target="_blank" onclick="connectTutor(${tutor.id});">
                    <i class="fab fa-whatsapp"></i>
                    Connect via WhatsApp
                </a>
                <button class="btn btn-outline" onclick="closeTutorModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close tutor modal
function closeTutorModal() {
    document.getElementById('tutorModal').style.display = 'none';
}

// Connect with tutor
function connectTutor(tutorId) {
    fetch('/api/connect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tutor_id: tutorId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Connection successful - WhatsApp will open in new tab
            console.log('Connected with tutor');
        } else {
            alert(data.error || 'Failed to connect with tutor');
        }
    })
    .catch(error => {
        console.error('Error connecting with tutor:', error);
        alert('An error occurred while connecting with the tutor');
    });
}

// Sort tutors
function sortTutors() {
    const sortBy = document.getElementById('sortBy').value;
    
    const sortedTutors = [...filteredTutors].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'price_low':
                return a.price_per_hour - b.price_per_hour;
            case 'price_high':
                return b.price_per_hour - a.price_per_hour;
            case 'relevance':
            default:
                return 0; // Keep original order for relevance
        }
    });
    
    displayTutors(sortedTutors);
}

// Update results count
function updateResultsCount(count) {
    document.getElementById('resultsCount').textContent = count;
}

// Show/hide loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');
    
    if (show) {
        spinner.style.display = 'block';
        noResults.style.display = 'none';
    } else {
        spinner.style.display = 'none';
    }
}

// Show no results message
function showNoResults() {
    document.getElementById('noResults').style.display = 'block';
}

// Chatbot functionality
function toggleChatbot() {
    const panel = document.getElementById('chatbotPanel');
    const isVisible = panel.style.display === 'flex';
    panel.style.display = isVisible ? 'none' : 'flex';
}

function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    input.value = '';
    
    // Send to backend
    fetch('/api/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        addMessage(data.response, 'bot');
    })
    .catch(error => {
        console.error('Error sending message:', error);
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    });
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Close modals when clicking outside
window.onclick = function(event) {
    const tutorModal = document.getElementById('tutorModal');
    if (event.target === tutorModal) {
        closeTutorModal();
    }
}
