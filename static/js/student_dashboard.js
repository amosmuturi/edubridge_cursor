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
                <button class="btn btn-primary" onclick="openPaymentModal(${JSON.stringify(tutor).replace(/"/g, '&quot;')}); closeTutorModal();">
                    <i class="fas fa-credit-card"></i>
                    Book Session
                </button>
                <a href="https://wa.me/${tutor.whatsapp_number}?text=Hello! I'm interested in ${tutor.subject} tutoring" 
                   class="btn btn-outline" target="_blank" onclick="connectTutor(${tutor.id});">
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
    const paymentModal = document.getElementById('paymentModal');
    const paymentStatusModal = document.getElementById('paymentStatusModal');
    
    if (event.target === tutorModal) {
        closeTutorModal();
    }
    if (event.target === paymentModal) {
        closePaymentModal();
    }
    if (event.target === paymentStatusModal) {
        closePaymentStatusModal();
    }
}

// Payment functionality
let selectedTutor = null;

function openPaymentModal(tutor) {
    selectedTutor = tutor;
    document.getElementById('paymentModal').style.display = 'block';
    
    // Set minimum date to today
    const today = new Date().toISOString().slice(0, 16);
    document.getElementById('sessionDate').min = today;
    
    // Calculate initial total
    calculateTotal();
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    selectedTutor = null;
}

function calculateTotal() {
    if (!selectedTutor) return;
    
    const duration = parseFloat(document.getElementById('durationHours').value);
    const total = selectedTutor.price_per_hour * duration;
    document.getElementById('totalAmount').value = total.toFixed(2);
}

function toggleMpesaForm() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const mpesaForm = document.getElementById('mpesaPhoneForm');
    
    if (paymentMethod === 'mpesa') {
        mpesaForm.style.display = 'block';
    } else {
        mpesaForm.style.display = 'none';
    }
}

function processPayment() {
    if (!selectedTutor) return;
    
    const sessionDate = document.getElementById('sessionDate').value;
    const durationHours = parseFloat(document.getElementById('durationHours').value);
    const totalAmount = parseFloat(document.getElementById('totalAmount').value);
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (!sessionDate) {
        alert('Please select a session date and time');
        return;
    }
    
    // Validate M-Pesa phone number
    if (paymentMethod === 'mpesa') {
        const mpesaPhone = document.getElementById('mpesaPhone').value.trim();
        if (!mpesaPhone || mpesaPhone.length !== 9 || !/^[0-9]{9}$/.test(mpesaPhone)) {
            alert('Please enter a valid M-Pesa phone number (9 digits, e.g., 712345678)');
            return;
        }
    }
    
    // Show loading state
    const payButton = document.querySelector('.payment-actions .btn-primary');
    const originalText = payButton.innerHTML;
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payButton.disabled = true;
    
    const paymentData = {
        tutor_id: selectedTutor.id,
        amount: totalAmount,
        duration_hours: durationHours,
        session_date: sessionDate,
        payment_method: paymentMethod
    };
    
    // Add phone number for M-Pesa
    if (paymentMethod === 'mpesa') {
        const mpesaPhone = document.getElementById('mpesaPhone').value.trim();
        paymentData.phone_number = '+254' + mpesaPhone;
    }
    
    fetch('/api/payments/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closePaymentModal();
            showPaymentStatus(data, 'pending');
            
            // If M-Pesa, show instructions
            if (paymentMethod === 'mpesa') {
                showMpesaInstructions(data);
            }
        } else {
            alert(data.error || 'Payment failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
    })
    .finally(() => {
        // Reset button
        payButton.innerHTML = originalText;
        payButton.disabled = false;
    });
}

function showMpesaInstructions(paymentData) {
    const modal = document.getElementById('paymentStatusModal');
    const content = document.getElementById('paymentStatusContent');
    
    content.innerHTML = `
        <div class="payment-status pending">
            <i class="fas fa-mobile-alt"></i>
            <h3>M-Pesa Payment Instructions</h3>
            <p>You will receive an M-Pesa prompt on your phone shortly. Please:</p>
            <div class="mpesa-instructions">
                <ol>
                    <li>Check your phone for the M-Pesa prompt</li>
                    <li>Enter your M-Pesa PIN when prompted</li>
                    <li>Confirm the payment</li>
                    <li>Wait for the confirmation message</li>
                </ol>
            </div>
            <div class="payment-amount">
                <div class="amount">KES ${paymentData.amount}</div>
                <div class="currency">Amount to Pay</div>
            </div>
            <button class="btn btn-primary" onclick="checkPaymentStatus(${paymentData.payment_id})">
                <i class="fas fa-sync-alt"></i>
                Check Payment Status
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showPaymentStatus(paymentData, status) {
    const modal = document.getElementById('paymentStatusModal');
    const content = document.getElementById('paymentStatusContent');
    
    let statusHtml = '';
    
    if (status === 'pending') {
        statusHtml = `
            <div class="payment-status pending">
                <i class="fas fa-clock"></i>
                <h3>Payment Pending</h3>
                <p>Your payment is being processed. Please complete the payment to confirm your session.</p>
                <div class="payment-amount">
                    <div class="amount">KES ${paymentData.amount}</div>
                    <div class="currency">Total Amount</div>
                </div>
                <button class="btn btn-primary" onclick="checkPaymentStatus(${paymentData.payment_id})">
                    <i class="fas fa-sync-alt"></i>
                    Check Status
                </button>
            </div>
        `;
    } else if (status === 'completed') {
        statusHtml = `
            <div class="payment-status success">
                <i class="fas fa-check-circle"></i>
                <h3>Payment Successful!</h3>
                <p>Your tutoring session has been confirmed. The tutor will contact you soon.</p>
                <div class="payment-amount">
                    <div class="amount">KES ${paymentData.amount}</div>
                    <div class="currency">Amount Paid</div>
                </div>
                <button class="btn btn-primary" onclick="closePaymentStatusModal()">Done</button>
            </div>
        `;
    } else if (status === 'failed') {
        statusHtml = `
            <div class="payment-status failed">
                <i class="fas fa-times-circle"></i>
                <h3>Payment Failed</h3>
                <p>Your payment could not be processed. Please try again or contact support.</p>
                <div class="payment-amount">
                    <div class="amount">KES ${paymentData.amount}</div>
                    <div class="currency">Amount</div>
                </div>
                <button class="btn btn-primary" onclick="closePaymentStatusModal()">Try Again</button>
            </div>
        `;
    }
    
    content.innerHTML = statusHtml;
    modal.style.display = 'block';
}

function closePaymentStatusModal() {
    document.getElementById('paymentStatusModal').style.display = 'none';
}

function checkPaymentStatus(paymentId) {
    fetch(`/api/payments/status/${paymentId}`)
        .then(response => response.json())
        .then(data => {
            showPaymentStatus(data, data.status);
        })
        .catch(error => {
            console.error('Error checking payment status:', error);
            alert('Error checking payment status. Please try again.');
        });
}
