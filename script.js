// Cart State
let cart = [];

// Navigation switching logic
function goToSection(event, sectionId) {
    event.preventDefault();
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active-section'));
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active-section');
    
    // Find matching nav link and activate it
    const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle nav link clicks naturally
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        goToSection(e, targetId);
    });
});

// Fixed Add to Cart: captures event properly even if inline omits 'event'
function addToCart(name, price) {
    // Get the event safely from window.event if not passed directly inline
    const evt = window.event;
    const button = evt ? evt.target : null;
    let imgSrc = '';

    if (button) {
        const card = button.closest('.product-card');
        const img = card ? (card.querySelector('.product-img') || card.querySelector('img')) : null;
        imgSrc = img ? img.src : '';
        if (evt) flyToCart(evt);
    }

    // Update Cart Data
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, image: imgSrc });
    }
    
    updateCartUI();
    showToast(`Added ${name} to your cart!`);
    triggerCartBounce();
}

// Trigger Cart Icon Bounce
function triggerCartBounce() {
    const cartBadge = document.getElementById('cart-count');
    if (!cartBadge) return;
    cartBadge.classList.remove('bounce');
    void cartBadge.offsetWidth; // Trigger reflow to restart animation
    cartBadge.classList.add('bounce');
}

// Update Cart View and Total Counts
function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const itemsListEl = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (!countEl || !itemsListEl) return;

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalCount;

    if (cart.length === 0) {
        itemsListEl.innerHTML = '<p style="color: var(--text-muted);">Your cart is currently empty.</p>';
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }

    let html = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <h4 style="font-size: 1rem; font-weight: 600;">${item.name}</h4>
                        <span style="font-size: 0.85rem; color: var(--text-muted);">$${item.price.toFixed(2)} each</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                    <div class="cart-quantity-controls">
                        <button onclick="decreaseQuantity(${index})" class="qty-btn">-</button>
                        <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})" class="qty-btn">+</button>
                    </div>
                    <span style="font-weight: 700; color: var(--primary); min-width: 60px; text-align: right;">$${itemTotal.toFixed(2)}</span>
                    <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #c53030; cursor: pointer; font-size: 0.85rem; text-decoration: underline;">Remove</button>
                </div>
            </div>
        `;
    });

    itemsListEl.innerHTML = html;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Fixed Category Filtering Function Name to Match HTML
function filterCategory(cat, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('#full-product-grid .product-card');
    cards.forEach(card => {
        if (cat === 'All' || card.getAttribute('data-category') === cat) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Toast Notification
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Contact form simulation
function handleContact(e) {
    e.preventDefault();
    showToast('Thank you! Your message has been sent successfully.');
    e.target.reset();
}

// Checkout simulation
function checkoutOrder() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    showToast('Order placed successfully! Thank you for shopping with Verdant & Co.');
    cart = [];
    updateCartUI();
}

function flyToCart(event) {
    const button = event.target;
    const card = button.closest('.product-card');
    const img = card ? (card.querySelector('.product-img') || card.querySelector('img')) : null;
    const cartTarget = document.querySelector('nav a[href="#cart"]');

    if (!img || !cartTarget) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartTarget.getBoundingClientRect();

    const flyer = document.createElement('img');
    flyer.src = img.src;
    flyer.className = 'flying-img';
    flyer.style.position = 'fixed';
    flyer.style.zIndex = '9999';
    flyer.style.transition = 'all 0.8s ease-in-out';
    flyer.style.left = `${imgRect.left}px`;
    flyer.style.top = `${imgRect.top}px`;
    flyer.style.width = `${imgRect.width}px`;
    flyer.style.height = `${imgRect.height}px`;
    
    document.body.appendChild(flyer);

    setTimeout(() => {
        flyer.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyer.style.top = `${cartRect.top}px`;
        flyer.style.width = '20px';
        flyer.style.height = '20px';
        flyer.style.opacity = '0.5';
    }, 10);

    setTimeout(() => {
        flyer.remove();
    }, 800);
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCartUI();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function checkoutOrder() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }

    fetch('checkout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart })
    })
    .then(response => response.json())
    .then(data => {
        showToast('Order placed successfully! Saved to database.');
        cart = [];
        updateCartUI();
    })
    .catch(error => {
        showToast('Checkout error. Please try again.');
    });
}