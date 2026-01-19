// EmailJS Contact Form Integration for Dhahab Al Ramal
// ======================================================

// IMPORTANT: Replace these with your actual EmailJS credentials
// Get your credentials from: https://dashboard.emailjs.com
const EMAILJS_PUBLIC_KEY = 'jJIgQka3Y-Qg6su2A';
const EMAILJS_SERVICE_ID = 'service_qrad12a';
const EMAILJS_TEMPLATE_ID = 'template_77tgkm7';

// Initialize EmailJS
(function () {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// Get form elements
const contactForm = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-btn');
const messageContainer = document.getElementById('form-message');

// Handle form submission
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Get form data
        const formData = {
            from_name: document.getElementById('firstName').value.trim() + ' ' + document.getElementById('lastName').value.trim(),
            from_email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim() || 'Contact Form Submission',
            message: document.getElementById('message').value.trim()
        };

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        hideMessage();

        // Send email using EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                showMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
                contactForm.reset();
            })
            .catch(function (error) {
                console.error('EmailJS FAILED...', error);
                const errorMsg = error.text || error.message || 'Check your internet connection or try again later.';
                showMessage('error', 'Unable to send message: ' + errorMsg);
            })
            .finally(function () {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            });
    });
}

// Form validation
function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Check required fields
    if (!firstName || !lastName) {
        showMessage('error', 'Please enter your full name.');
        return false;
    }

    if (!email) {
        showMessage('error', 'Please enter your email address.');
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('error', 'Please enter a valid email address.');
        return false;
    }

    if (!message) {
        showMessage('error', 'Please enter your message.');
        return false;
    }

    if (message.length < 10) {
        showMessage('error', 'Please enter a message with at least 10 characters.');
        return false;
    }

    return true;
}

// Show message
function showMessage(type, text) {
    if (!messageContainer) return;

    messageContainer.className = 'form-message ' + type;
    messageContainer.textContent = text;
    messageContainer.style.display = 'block';

    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

// Hide message
function hideMessage() {
    if (!messageContainer) return;
    messageContainer.style.display = 'none';
}
