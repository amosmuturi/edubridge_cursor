// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    loadStats();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Profile form submission
    const profileForm = document.getElementById('tutorProfileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }
}

// Load tutor profile
function loadProfile() {
    fetch('/api/tutor/profile')
        .then(response => response.json())
        .then(data => {
            if (data.subject) {
                // Profile exists, populate form
                document.getElementById('subject').value = data.subject;
                document.getElementById('pricePerHour').value = data.price_per_hour;
                document.getElementById('availability').value = data.availability;
                document.getElementById('whatsappNumber').value = data.whatsapp_number;
                document.getElementById('location').value = data.location;
                document.getElementById('bio').value = data.bio || '';
                
                // Update stats
                updateStats(data);
            } else {
                // No profile yet, show empty form
                console.log('No profile found. Please create your profile.');
            }
        })
        .catch(error => {
            console.error('Error loading profile:', error);
        });
}

// Save tutor profile
function saveProfile() {
    const formData = {
        subject: document.getElementById('subject').value,
        price_per_hour: document.getElementById('pricePerHour').value,
        availability: document.getElementById('availability').value,
        whatsapp_number: document.getElementById('whatsappNumber').value,
        location: document.getElementById('location').value,
        bio: document.getElementById('bio').value
    };
    
    // Basic validation
    if (!formData.subject || !formData.price_per_hour || !formData.availability || 
        !formData.whatsapp_number || !formData.location) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (isNaN(formData.price_per_hour) || formData.price_per_hour <= 0) {
        alert('Please enter a valid price');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#tutorProfileForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    fetch('/api/tutor/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Profile saved successfully!');
            loadStats(); // Refresh stats
        } else {
            alert('Failed to save profile. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error saving profile:', error);
        alert('An error occurred while saving your profile');
    })
    .finally(() => {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Load tutor statistics
function loadStats() {
    fetch('/api/tutor/profile')
        .then(response => response.json())
        .then(data => {
            updateStats(data);
        })
        .catch(error => {
            console.error('Error loading stats:', error);
        });
}

// Update statistics display
function updateStats(profileData) {
    // Update rating
    const rating = profileData.rating || 0;
    document.getElementById('tutorRating').textContent = rating.toFixed(1);
    
    // Update total sessions
    const totalSessions = profileData.total_sessions || 0;
    document.getElementById('totalSessions').textContent = totalSessions;
    
    // Update this month sessions (mock data for now)
    const thisMonth = Math.floor(totalSessions * 0.3); // 30% of total as this month
    document.getElementById('thisMonth').textContent = thisMonth;
    
    // Update total earnings (mock calculation)
    const totalEarnings = totalSessions * (profileData.price_per_hour || 25);
    document.getElementById('totalEarnings').textContent = `$${totalEarnings.toFixed(0)}`;
}

// Format phone number for display
function formatPhoneNumber(phoneNumber) {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length > 11) {
        // International number
        return `+${cleaned}`;
    }
    
    return phoneNumber; // Return original if can't format
}

// Validate phone number
function validatePhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 10;
}

// Add phone number formatting to input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('whatsappNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = value;
        });
    }
});

// Add price formatting
document.addEventListener('DOMContentLoaded', function() {
    const priceInput = document.getElementById('pricePerHour');
    if (priceInput) {
        priceInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d.]/g, '');
            
            // Ensure only one decimal point
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            
            // Limit to 2 decimal places
            if (parts.length === 2 && parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].slice(0, 2);
            }
            
            e.target.value = value;
        });
    }
});

// Auto-save functionality (optional)
let autoSaveTimer;
function setupAutoSave() {
    const form = document.getElementById('tutorProfileForm');
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                // Auto-save after 3 seconds of inactivity
                saveProfile();
            }, 3000);
        });
    });
}

// Initialize auto-save if needed
// setupAutoSave();

// Export profile data (for backup)
function exportProfile() {
    fetch('/api/tutor/profile')
        .then(response => response.json())
        .then(data => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tutor-profile.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error exporting profile:', error);
            alert('Failed to export profile');
        });
}

// Profile completion percentage
function calculateProfileCompletion() {
    const fields = ['subject', 'pricePerHour', 'availability', 'whatsappNumber', 'location'];
    const optionalFields = ['bio'];
    
    let completed = 0;
    let total = fields.length + optionalFields.length;
    
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (value && value.trim() !== '') {
            completed++;
        }
    });
    
    optionalFields.forEach(field => {
        const value = document.getElementById(field).value;
        if (value && value.trim() !== '') {
            completed++;
        }
    });
    
    return Math.round((completed / total) * 100);
}

// Show profile completion indicator
function showProfileCompletion() {
    const completion = calculateProfileCompletion();
    const indicator = document.createElement('div');
    indicator.className = 'profile-completion';
    indicator.innerHTML = `
        <div class="completion-bar">
            <div class="completion-fill" style="width: ${completion}%"></div>
        </div>
        <span>Profile ${completion}% complete</span>
    `;
    
    // Add to profile section if not already present
    const profileSection = document.querySelector('.profile-section');
    const existingIndicator = profileSection.querySelector('.profile-completion');
    
    if (!existingIndicator) {
        profileSection.insertBefore(indicator, profileSection.firstChild);
    } else {
        existingIndicator.innerHTML = indicator.innerHTML;
    }
}

// Update profile completion on form changes
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tutorProfileForm');
    if (form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', showProfileCompletion);
        });
        
        // Show initial completion
        showProfileCompletion();
    }
});
