let cart = [];


/* =========================================================
   NAVIGATION
========================================================= */

function goToSection(event, sectionId) {

    if (event) {
        event.preventDefault();
    }

    document
        .querySelectorAll('.page-section')
        .forEach(section => {
            section.classList.remove('active-section');
        });


    document
        .querySelectorAll('nav a')
        .forEach(link => {
            link.classList.remove('active');
        });


    const section =
        document.getElementById(sectionId);

    if (section) {
        section.classList.add('active-section');
    }


    const activeLink =
        document.querySelector(
            `nav a[href="#${sectionId}"]`
        );


    if (activeLink) {
        activeLink.classList.add('active');
    }


    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


/* =========================================================
   NAVIGATION EVENT LISTENERS
========================================================= */

document
    .querySelectorAll('nav a')
    .forEach(link => {

        link.addEventListener('click', function(event) {

            const target =
                this.getAttribute('href');

            if (!target) {
                return;
            }

            const sectionId =
                target.substring(1);

            goToSection(
                event,
                sectionId
            );

        });

    });


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(name, price) {

    const button =
        window.event
            ? window.event.target
            : null;


    let image = '';


    if (button) {

        const card =
            button.closest('.product-card');


        const img =
            card
                ? card.querySelector('.product-img')
                : null;


        if (img) {
            image = img.src;
        }


        if (window.event) {
            flyToCart(window.event);
        }
    }


    const existing =
        cart.find(item =>
            item.name === name
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            name: name,

            price: Number(price),

            quantity: 1,

            image: image

        });
    }


    updateCartUI();

    showToast(
        `${name} added to your cart.`
    );

    triggerCartBounce();
}


/* =========================================================
   CART BADGE
========================================================= */

function triggerCartBounce() {

    const badge =
        document.getElementById(
            'cart-count'
        );


    if (!badge) {
        return;
    }


    badge.classList.remove('bounce');

    void badge.offsetWidth;

    badge.classList.add('bounce');
}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCartUI() {

    const countEl =
        document.getElementById(
            'cart-count'
        );


    const itemsListEl =
        document.getElementById(
            'cart-items-list'
        );


    const subtotalEl =
        document.getElementById(
            'cart-subtotal'
        );


    const totalEl =
        document.getElementById(
            'cart-total'
        );


    if (!countEl || !itemsListEl) {
        return;
    }


    const totalCount =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    countEl.textContent =
        totalCount;


    if (cart.length === 0) {

        itemsListEl.innerHTML =
            `<p style="color:var(--text-muted);">
                Your cart is currently empty.
            </p>`;


        if (subtotalEl) {
            subtotalEl.textContent =
                '$0.00';
        }


        if (totalEl) {
            totalEl.textContent =
                '$0.00';
        }


        return;
    }


    let html = '';

    let subtotal = 0;


    cart.forEach(
        (item, index) => {

            const itemTotal =
                item.price *
                item.quantity;


            subtotal += itemTotal;


            html += `

                <div class="cart-item">

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:1rem;
                        "
                    >

                        <img
                            src="${item.image}"
                            alt="${escapeHtml(item.name)}"
                            class="cart-item-img"
                            style="
                                width:50px;
                                height:50px;
                                object-fit:cover;
                                border-radius:4px;
                            "
                        >

                        <div>

                            <h4
                                style="
                                    font-size:1rem;
                                    font-weight:600;
                                "
                            >
                                ${escapeHtml(item.name)}
                            </h4>

                            <span
                                style="
                                    font-size:.85rem;
                                    color:var(--text-muted);
                                "
                            >
                                $${item.price.toFixed(2)} each
                            </span>

                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:1.5rem;
                        "
                    >

                        <div class="cart-quantity-controls">

                            <button
                                onclick="decreaseQuantity(${index})"
                                class="qty-btn"
                            >
                                -
                            </button>


                            <span
                                style="
                                    font-weight:600;
                                    min-width:20px;
                                    text-align:center;
                                "
                            >
                                ${item.quantity}
                            </span>


                            <button
                                onclick="increaseQuantity(${index})"
                                class="qty-btn"
                            >
                                +
                            </button>

                        </div>


                        <span
                            style="
                                font-weight:700;
                                color:var(--primary);
                                min-width:60px;
                                text-align:right;
                            "
                        >
                            $${itemTotal.toFixed(2)}
                        </span>


                        <button
                            onclick="removeFromCart(${index})"
                            style="
                                background:none;
                                border:none;
                                color:#c53030;
                                cursor:pointer;
                                font-size:.85rem;
                                text-decoration:underline;
                            "
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `;
        }
    );


    itemsListEl.innerHTML =
        html;


    if (subtotalEl) {

        subtotalEl.textContent =
            `$${subtotal.toFixed(2)}`;
    }


    if (totalEl) {

        totalEl.textContent =
            `$${subtotal.toFixed(2)}`;
    }
}


/* =========================================================
   REMOVE ITEM
========================================================= */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCartUI();
}


/* =========================================================
   QUANTITY
========================================================= */

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += 1;

    updateCartUI();
}


function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);
    }


    updateCartUI();
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function filterCategory(category, button) {

    document
        .querySelectorAll('.cat-btn')
        .forEach(btn => {
            btn.classList.remove('active');
        });


    if (button) {
        button.classList.add('active');
    }


    const cards =
        document.querySelectorAll(
            '#full-product-grid .product-card'
        );


    cards.forEach(card => {

        const cardCategory =
            card.getAttribute(
                'data-category'
            );


        if (
            category === 'All' ||
            cardCategory === category
        ) {

            card.style.display =
                'flex';

        } else {

            card.style.display =
                'none';
        }

    });
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const container =
        document.getElementById(
            'toast-container'
        );


    if (!container) {
        return;
    }


    const toast =
        document.createElement('div');


    toast.className =
        'toast';


    toast.textContent =
        message;


    container.appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 3000);
}


/* =========================================================
   CONTACT
========================================================= */

function handleContact(event) {

    event.preventDefault();


    showToast(
        'Thank you! Your message has been sent successfully.'
    );


    event.target.reset();
}


/* =========================================================
   CHECKOUT
========================================================= */

function checkoutOrder() {

    if (cart.length === 0) {

        showToast(
            'Your cart is empty!'
        );

        return;
    }


    showToast(
        'Processing your order...'
    );


    fetch('/api/checkout.php', {

        method: 'POST',

        headers: {
            'Content-Type':
                'application/json'
        },

        body: JSON.stringify({
            cart: cart
        })

    })

    .then(response => {

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        return response.json();

    })

    .then(data => {

        if (data.status === 'success') {

            showToast(
                data.message
            );


            cart = [];


            updateCartUI();

        } else {

            showToast(
                data.message ||
                'Checkout failed.'
            );
        }

    })

    .catch(error => {

        console.error(
            'Checkout error:',
            error
        );


        showToast(
            'Checkout error. Please try again.'
        );

    });
}


/* =========================================================
   FLY TO CART ANIMATION
========================================================= */

function flyToCart(event) {

    if (!event) {
        return;
    }


    const button =
        event.target;


    const card =
        button.closest(
            '.product-card'
        );


    const img =
        card
            ? card.querySelector(
                '.product-img'
            )
            : null;


    const cartTarget =
        document.querySelector(
            'nav a[href="#cart"]'
        );


    if (!img || !cartTarget) {
        return;
    }


    const imgRect =
        img.getBoundingClientRect();


    const cartRect =
        cartTarget.getBoundingClientRect();


    const flyer =
        document.createElement(
            'img'
        );


    flyer.src =
        img.src;


    flyer.className =
        'flying-img';


    flyer.style.position =
        'fixed';


    flyer.style.zIndex =
        '9999';


    flyer.style.transition =
        'all .8s ease-in-out';


    flyer.style.left =
        `${imgRect.left}px`;


    flyer.style.top =
        `${imgRect.top}px`;


    flyer.style.width =
        `${imgRect.width}px`;


    flyer.style.height =
        `${imgRect.height}px`;


    document.body.appendChild(
        flyer
    );


    setTimeout(() => {

        flyer.style.left =
            `${cartRect.left + cartRect.width / 2}px`;


        flyer.style.top =
            `${cartRect.top}px`;


        flyer.style.width =
            '20px';


        flyer.style.height =
            '20px';


        flyer.style.opacity =
            '.5';

    }, 10);


    setTimeout(() => {

        flyer.remove();

    }, 800);
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        updateCartUI();

    }
);