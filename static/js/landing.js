// Modal functionality
function showLoginForm() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('signupModal').style.display = 'none';
}

function hideLoginForm() {
    document.getElementById('loginModal').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('signupModal').style.display = 'block';
    document.getElementById('loginModal').style.display = 'none';
}

function hideSignupForm() {
    document.getElementById('signupModal').style.display = 'none';
}

function switchToSignup() {
    hideLoginForm();
    showSignupForm();
}

function switchToLogin() {
    hideSignupForm();
    showLoginForm();
}

function toggleTutorFields() {
    const userType = document.getElementById('userType').value;
    const tutorFields = document.getElementById('tutorFields');
    
    if (userType === 'tutor') {
        tutorFields.style.display = 'block';
        // Make tutor fields required
        document.getElementById('signupSubject').required = true;
        document.getElementById('signupPrice').required = true;
        document.getElementById('signupAvailability').required = true;
        document.getElementById('signupBio').required = true;
    } else {
        tutorFields.style.display = 'none';
        // Make tutor fields not required
        document.getElementById('signupSubject').required = false;
        document.getElementById('signupPrice').required = false;
        document.getElementById('signupAvailability').required = false;
        document.getElementById('signupBio').required = false;
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target === loginModal) {
        hideLoginForm();
    }
    if (event.target === signupModal) {
        hideSignupForm();
    }
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Submit form
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    alert(data.message || 'Login failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const userType = document.getElementById('userType').value;
            const phone = document.getElementById('signupPhone').value;
            const county = document.getElementById('signupCounty').value;
            const subCounty = document.getElementById('signupSubCounty').value;
            const constituency = document.getElementById('signupConstituency').value;
            const location = document.getElementById('signupLocation').value;
            
            // Basic validation
            if (!name || !email || !password || !userType || !phone || !county || !subCounty || !constituency || !location) {
                alert('Please fill in all required fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            // Validate phone number
            if (!/^[0-9]{9}$/.test(phone)) {
                alert('Please enter a valid phone number (9 digits, e.g., 712345678)');
                return;
            }
            
            // Prepare form data
            const formData = {
                name: name,
                email: email,
                password: password,
                user_type: userType,
                phone: '+254' + phone,
                county: county,
                sub_county: subCounty,
                constituency: constituency,
                location: location
            };
            
            // Add tutor-specific fields if user is a tutor
            if (userType === 'tutor') {
                const subject = document.getElementById('signupSubject').value;
                const pricePerHour = document.getElementById('signupPrice').value;
                const availability = document.getElementById('signupAvailability').value;
                const bio = document.getElementById('signupBio').value;
                
                if (!subject || !pricePerHour || !availability || !bio) {
                    alert('Please fill in all tutor fields');
                    return;
                }
                
                formData.subject = subject;
                formData.price_per_hour = parseFloat(pricePerHour);
                formData.availability = availability;
                formData.bio = bio;
            }
            
            // Submit form
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    alert(data.message || 'Signup failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle (if needed)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}
