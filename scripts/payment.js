// Razorpay Payment Integration for Dhahab Al Ramal
// ===================================================

// IMPORTANT: Replace with your actual Razorpay Test Key ID
// Get your keys from: https://dashboard.razorpay.com/app/keys
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID_HERE';

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Calculate total amount
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Display order summary
function displayOrderSummary() {
    const summaryContainer = document.getElementById('order-summary');
    if (!summaryContainer) return;

    const total = calculateTotal();

    if (cart.length === 0) {
        summaryContainer.innerHTML = `
            <p style="text-align: center; color: #999;">Your cart is empty. <a href="collections.html" class="text-gold">Continue Shopping</a></p>
        `;
        return;
    }

    const itemsHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #333;">
            <span style="color: #ccc;">${item.name} x ${item.quantity}</span>
            <span style="color: #d4af37;">RM ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    summaryContainer.innerHTML = `
        <h3 class="text-white mb-2">Order Summary</h3>
        ${itemsHTML}
        <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #d4af37; font-size: 1.2rem;">
            <span class="text-gold" style="font-weight: 600;">Total:</span>
            <span class="text-gold" style="font-weight: 600;">RM ${total.toFixed(2)}</span>
        </div>
    `;
}

// Validate form inputs
function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();

    if (!firstName || !lastName || !email || !phone || !address || !city || !zipCode) {
        alert('Please fill in all required fields.');
        return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Basic phone validation
    if (phone.length < 10) {
        alert('Please enter a valid phone number.');
        return false;
    }

    return true;
}

// Initialize Razorpay Payment
function initiatePayment() {
    // Validate form
    if (!validateForm()) {
        return;
    }

    // Check if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        window.location.href = 'collections.html';
        return;
    }

    // Get customer details
    const customerDetails = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        zipCode: document.getElementById('zipCode').value.trim()
    };

    // Calculate amount (Razorpay expects amount in smallest currency unit - paise for INR, cents for MYR)
    // For Malaysian Ringgit (MYR), multiply by 100 to convert to cents
    const totalAmount = calculateTotal();
    const amountInCents = Math.round(totalAmount * 100);

    // Generate unique order ID
    const orderId = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Razorpay options
    const options = {
        key: RAZORPAY_KEY_ID,
        amount: amountInCents, // Amount in cents
        currency: 'MYR', // Malaysian Ringgit
        name: 'Dhahab Al Ramal',
        description: 'Luxury Perfume Purchase',
        image: 'assets/images/logo_transparent.png',
        order_id: orderId, // This should ideally come from your backend

        // Pre-fill customer details
        prefill: {
            name: `${customerDetails.firstName} ${customerDetails.lastName}`,
            email: customerDetails.email,
            contact: customerDetails.phone
        },

        // Customer notes
        notes: {
            address: customerDetails.address,
            city: customerDetails.city,
            zipCode: customerDetails.zipCode,
            orderItems: cart.map(item => `${item.name} x ${item.quantity}`).join(', ')
        },

        // Theme customization
        theme: {
            color: '#d4af37' // Gold color matching your brand
        },

        // Payment methods to enable
        config: {
            display: {
                blocks: {
                    banks: {
                        name: 'Pay via Net Banking',
                        instruments: [
                            {
                                method: 'netbanking',
                                banks: ['FPXB2B1', 'FPXB2C1'] // FPX for Malaysia
                            }
                        ]
                    },
                    card: {
                        name: 'Pay with Card',
                        instruments: [
                            {
                                method: 'card'
                            }
                        ]
                    },
                    wallet: {
                        name: 'Pay via Wallet',
                        instruments: [
                            {
                                method: 'wallet',
                                wallets: ['grabpay', 'paytm', 'phonepe', 'amazonpay']
                            }
                        ]
                    }
                },
                sequence: ['block.card', 'block.wallet', 'block.banks'],
                preferences: {
                    show_default_blocks: true
                }
            }
        },

        // Success handler
        handler: function (response) {
            handlePaymentSuccess(response, customerDetails, orderId);
        },

        // Modal options
        modal: {
            ondismiss: function () {
                console.log('Payment cancelled by user');
            }
        }
    };

    // Create Razorpay instance and open checkout
    const razorpay = new Razorpay(options);

    // Handle payment failure
    razorpay.on('payment.failed', function (response) {
        handlePaymentFailure(response);
    });

    // Open Razorpay checkout
    razorpay.open();
}

// Handle successful payment
function handlePaymentSuccess(response, customerDetails, orderId) {
    console.log('Payment successful:', response);

    // Store order details in localStorage for success page
    const orderDetails = {
        orderId: orderId,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        amount: calculateTotal(),
        items: cart,
        customer: customerDetails,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

    // Clear cart
    localStorage.removeItem('cart');
    cart = [];

    // Redirect to success page
    window.location.href = 'payment-success.html';
}

// Handle payment failure
function handlePaymentFailure(response) {
    console.error('Payment failed:', response);

    // Store failure details
    const failureDetails = {
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('paymentError', JSON.stringify(failureDetails));

    // Redirect to failure page
    window.location.href = 'payment-failed.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayOrderSummary();

    // Attach payment handler to button
    const payButton = document.getElementById('pay-now-btn');
    if (payButton) {
        payButton.addEventListener('click', initiatePayment);
    }
});
