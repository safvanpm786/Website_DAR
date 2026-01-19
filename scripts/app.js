import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

const products = [
    {
        id: 1,
        name: "Sublime",
        price: 180,
        image: "assets/images/collection_1.jpg",
        desc: "A delicate symphony of floral notes."
    },
    {
        id: 2,
        name: "Chante",
        price: 160,
        image: "assets/images/collection_2.jpg",
        desc: "Whispers of the ancient winds."
    },
    {
        id: 3,
        name: "Nujoom",
        price: 200,
        image: "assets/images/collection_3.jpg",
        desc: "Bright as the desert stars."
    },
    {
        id: 4,
        name: "Enhance",
        price: 220,
        image: "assets/images/collection_4.jpg",
        desc: "Elevate your senses to new heights."
    },
    {
        id: 5,
        name: "Signature",
        price: 210,
        image: "assets/images/collection_5.jpg",
        desc: "A heavenly blend of pure oud."
    },
    {
        id: 6,
        name: "Onyx Blue",
        price: 165,
        image: "assets/images/collection_6.jpg",
        desc: "Bold, passionate, and unforgettable."
    },
    {
        id: 7,
        name: "Al Qamar",
        price: 190,
        image: "assets/images/collection_7.jpg",
        desc: "The true meaning of luxury."
    },
    {
        id: 8,
        name: "Opulence",
        price: 175,
        image: "assets/images/collection_8.jpg",
        desc: "Deep, mysterious, and captivating."
    },
    {
        id: 9,
        name: "Enticing",
        price: 220,
        image: "assets/images/collection_9.jpg",
        desc: "Rule your world with confidence."
    },
    {
        id: 10,
        name: "Monarch",
        price: 200,
        image: "assets/images/collection_10.jpg",
        desc: "Our exclusive black label fragrance."
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on
    const featuredContainer = document.getElementById('featured-products');
    const allProductsContainer = document.getElementById('all-products');
    const cartPageContainer = document.querySelector('.cart-page-items');

    if (featuredContainer) {
        renderProducts(featuredContainer, products.slice(0, 3));
    }

    if (allProductsContainer) {
        renderProducts(allProductsContainer, products);
    }

    if (cartPageContainer) {
        renderCartPage();
    }

    updateCartUI();

    // Cart Toggle
    const cartIcon = document.querySelector('.cart-icon');
    const closeBtn = document.querySelector('.close-cart');
    const cartModal = document.querySelector('.cart-modal');

    // Only add event listeners if elements exist (they should, based on common layout)
    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartModal.contains(e.target) && !cartIcon.contains(e.target) && cartModal.classList.contains('active')) {
                cartModal.classList.remove('active');
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }
});

function renderProducts(container, items) {
    if (!container) return;
    container.innerHTML = items.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-price">RM ${product.price}</span>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #aaa;">${product.desc}</p>
                <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) cartModal.classList.add('active');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    // Also update cart page if we are on it
    if (document.querySelector('.cart-page-items')) {
        renderCartPage();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.getElementById('cart-total-amount');

    if (!cartCount) return;

    // Update Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalAmount) totalAmount.textContent = `RM ${total.toFixed(2)}`;

    // Render Items in Modal
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top: 2rem; color: #666;">Your cart is empty.</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>RM ${item.price} x ${item.quantity}</p>
                        <span class="cart-remove" onclick="removeFromCart(${item.id})">Remove</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Logic for the dedicated Cart Page
function renderCartPage() {
    const container = document.querySelector('.cart-page-items');
    const subtotalEl = document.getElementById('cart-page-subtotal');
    const totalEl = document.getElementById('cart-page-total');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="4" class="text-center" style="padding: 2rem;">Your cart is empty. <a href="collections.html" class="text-gold">Continue Shopping</a></td></tr>';
        if (subtotalEl) subtotalEl.textContent = 'RM 0.00';
        if (totalEl) totalEl.textContent = 'RM 0.00';
        return;
    }

    container.innerHTML = cart.map(item => `
        <tr>
            <td style="padding: 1rem; display: flex; align-items: center;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 1rem;">
                <span>${item.name}</span>
            </td>
            <td style="padding: 1rem;">RM ${item.price}</td>
            <td style="padding: 1rem;">${item.quantity}</td> 
            <td style="padding: 1rem;">RM ${(item.price * item.quantity).toFixed(2)} <br> <span class="cart-remove" onclick="removeFromCart(${item.id})">Remove</span></td>
        </tr>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalEl) subtotalEl.textContent = `RM ${total.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `RM ${total.toFixed(2)}`;
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.closeCart = () => {
    const modal = document.querySelector('.cart-modal');
    if (modal) modal.classList.remove('active');
};

