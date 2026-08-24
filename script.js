/* =========================================================
   CART DATA
========================================================= */

let cart = [];

try {
    const savedCart = localStorage.getItem("verdantCart");

    if (savedCart) {
        cart = JSON.parse(savedCart);

        if (!Array.isArray(cart)) {
            cart = [];
        }
    }
} catch (error) {
    console.error("Unable to load cart:", error);
    cart = [];
}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            "verdantCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Unable to save cart:",
            error
        );

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function goToSection(event, sectionId) {

    if (event) {
        event.preventDefault();
    }

    document
        .querySelectorAll(".page-section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });

    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.classList.remove("active");

        });

    const section =
        document.getElementById(sectionId);

    if (section) {

        section.classList.add(
            "active-section"
        );

    }

    const activeLink =
        document.querySelector(
            `.nav-link[href="#${sectionId}"]`
        );

    if (activeLink) {

        activeLink.classList.add("active");

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (
        window.location.hash !==
        "#" + sectionId
    ) {

        history.pushState(
            null,
            "",
            "#" + sectionId
        );

    }

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
    name,
    price,
    unit,
    image,
    button
) {

    /*
     * Make sure price is a number.
     */
    price = Number(price);


    /*
     * If the image is missing, use a safe fallback.
     */
    image = image || "";


    /*
     * Check whether this product already exists.
     */
    const existing =
        cart.find(
            item => item.name === name
        );


    if (existing) {

        existing.quantity += 1;

        /*
         * Make sure existing cart item
         * also has an image.
         */
        if (!existing.image && image) {

            existing.image = image;

        }

    } else {

        cart.push({

            name: name,

            price: price,

            unit: unit,

            image: image,

            quantity: 1

        });

    }


    /*
     * Save immediately.
     */
    saveCart();


    /*
     * Refresh cart display.
     */
    updateCartUI();


    /*
     * Notification.
     */
    showToast(
        name + " added to your cart."
    );


    /*
     * Animate product image.
     */
    if (button) {

        flyToCart(button);

    }


    /*
     * Animate cart badge.
     */
    triggerCartBounce();

}


/* =========================================================
   CART BADGE ANIMATION
========================================================= */

function triggerCartBounce() {

    const badge =
        document.getElementById(
            "cart-count"
        );

    if (!badge) {
        return;
    }

    badge.classList.remove(
        "bounce"
    );

    void badge.offsetWidth;

    badge.classList.add(
        "bounce"
    );

}


/* =========================================================
   UPDATE CART UI
========================================================= */

function updateCartUI() {

    const countEl =
        document.getElementById(
            "cart-count"
        );

    const itemsListEl =
        document.getElementById(
            "cart-items-list"
        );

    const subtotalEl =
        document.getElementById(
            "cart-subtotal"
        );

    const totalEl =
        document.getElementById(
            "cart-total"
        );


    /*
     * Cart page may not exist in some situations.
     */
    if (
        !countEl ||
        !itemsListEl
    ) {

        return;

    }


    let totalCount = 0;

    let subtotal = 0;


    /*
     * Calculate cart totals.
     */
    cart.forEach(item => {

        /*
         * Protect against old/bad localStorage data.
         */
        item.quantity =
            Number(item.quantity) || 1;

        item.price =
            Number(item.price) || 0;


        totalCount +=
            item.quantity;


        subtotal +=
            item.price *
            item.quantity;

    });


    /*
     * Update cart badge.
     */
    countEl.textContent =
        totalCount;


    /*
     * Empty cart.
     */
    if (cart.length === 0) {

        itemsListEl.innerHTML = `
            <div class="empty-cart">
                <p style="color:var(--text-muted);">
                    Your cart is currently empty.
                </p>
            </div>
        `;


        if (subtotalEl) {

            subtotalEl.textContent =
                "$0.00";

        }


        if (totalEl) {

            totalEl.textContent =
                "$0.00";

        }

        return;

    }


    let html = "";


    /*
     * Create each cart item.
     */
    cart.forEach(
        (item, index) => {

            const itemTotal =
                item.price *
                item.quantity;


            /*
             * Use product image if available.
             */
            const image =
                item.image ||
                "";


            html += `

                <div class="cart-item">

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:1rem;
                            min-width:0;
                        "
                    >

                        ${
                            image
                            ?
                            `
                            <img
                                src="${escapeHtml(image)}"
                                alt="${escapeHtml(item.name)}"
                                class="cart-item-img"
                                onerror="this.style.display='none';"
                            >
                            `
                            :
                            `
                            <div
                                class="cart-item-img"
                                style="
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    background:#f1f3f1;
                                    color:#777;
                                    font-size:.75rem;
                                    text-align:center;
                                "
                            >
                                No Image
                            </div>
                            `
                        }


                        <div>

                            <h4
                                style="
                                    font-size:1rem;
                                    font-weight:600;
                                    margin-bottom:.25rem;
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
                                $${item.price.toFixed(2)}
                                /
                                ${escapeHtml(item.unit)}
                            </span>

                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:1.5rem;
                            flex-wrap:wrap;
                        "
                    >

                        <div
                            class="cart-quantity-controls"
                        >

                            <button
                                type="button"
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
                                type="button"
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
                            type="button"
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


    /*
     * Put generated cart HTML into page.
     */
    itemsListEl.innerHTML =
        html;


    /*
     * Update subtotal.
     */
    if (subtotalEl) {

        subtotalEl.textContent =
            "$" +
            subtotal.toFixed(2);

    }


    /*
     * Update total.
     */
    if (totalEl) {

        totalEl.textContent =
            "$" +
            subtotal.toFixed(2);

    }

}


/* =========================================================
   REMOVE ITEM
========================================================= */

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }


    const productName =
        cart[index].name;


    cart.splice(
        index,
        1
    );


    saveCart();

    updateCartUI();


    showToast(
        productName +
        " removed from your cart."
    );

}


/* =========================================================
   INCREASE QUANTITY
========================================================= */

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity =
        Number(cart[index].quantity) + 1;


    saveCart();

    updateCartUI();

}


/* =========================================================
   DECREASE QUANTITY
========================================================= */

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    if (
        Number(cart[index].quantity) > 1
    ) {

        cart[index].quantity -= 1;

    } else {

        const productName =
            cart[index].name;

        cart.splice(
            index,
            1
        );

        showToast(
            productName +
            " removed from your cart."
        );

    }


    saveCart();

    updateCartUI();

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function filterCategory(
    category,
    button
) {

    document
        .querySelectorAll(".cat-btn")
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    }


    const cards =
        document.querySelectorAll(
            "#full-product-grid .product-card"
        );


    cards.forEach(card => {

        const cardCategory =
            card.getAttribute(
                "data-category"
            );


        if (
            category === "All" ||
            cardCategory === category
        ) {

            card.style.display =
                "";

        } else {

            card.style.display =
                "none";

        }

    });

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const container =
        document.getElementById(
            "toast-container"
        );


    if (!container) {
        return;
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            if (toast.parentNode) {

                toast.remove();

            }

        },
        3000
    );

}


/* =========================================================
   CONTACT
========================================================= */

function handleContact(event) {

    event.preventDefault();


    showToast(
        "Thank you! Your message has been received."
    );


    event.target.reset();

}


/* =========================================================
   CHECKOUT
========================================================= */

async function checkoutOrder() {

    /*
     * Prevent checkout if empty.
     */
    if (cart.length === 0) {

        showToast(
            "Your cart is empty. Please add a product first."
        );

        return;

    }


    let total = 0;


    /*
     * Calculate total.
     */
    cart.forEach(item => {

        total +=
            Number(item.price) *
            Number(item.quantity);

    });


    /*
     * Confirmation.
     */
    const confirmed =
        confirm(
            "Your order total is $" +
            total.toFixed(2) +
            ".\n\nProceed with checkout?"
        );


    if (!confirmed) {
        return;
    }


    showToast(
        "Processing your order..."
    );


    try {

        /*
         * Create a clean copy of the cart.
         *
         * This is important because we explicitly
         * send the image along with every product.
         */
        const checkoutCart =
            cart.map(item => ({

                name: String(item.name),

                price: Number(item.price),

                unit: String(item.unit),

                image: item.image
                    ? String(item.image)
                    : "",

                quantity:
                    Number(item.quantity)

            }));


        /*
         * Send cart to PHP.
         */
        const response =
            await fetch(
                "checkout.php",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"

                    },

                    body: JSON.stringify({

                        cart: checkoutCart,

                        total: total

                    })

                }
            );


        /*
         * Read response safely.
         */
        const responseText =
            await response.text();


        let data;


        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch (jsonError) {

            console.error(
                "Invalid JSON returned by checkout.php:",
                responseText
            );

            throw new Error(
                "The checkout server returned an invalid response."
            );

        }


        /*
         * Check HTTP status.
         */
        if (!response.ok) {

            throw new Error(
                data.message ||
                "Server returned " +
                response.status
            );

        }


        /*
         * Successful checkout.
         */
        if (
            data.status ===
            "success"
        ) {

            showToast(
                data.message ||
                "Your order has been placed successfully."
            );


            /*
             * Clear cart only AFTER
             * successful checkout.
             */
            cart = [];


            saveCart();

            updateCartUI();

        } else {

            showToast(
                data.message ||
                "Checkout failed."
            );

        }

    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );


        showToast(
            error.message ||
            "Checkout error. Please try again."
        );

    }

}


/* =========================================================
   FLY TO CART
========================================================= */

function flyToCart(button) {

    if (!button) {
        return;
    }


    const card =
        button.closest(
            ".product-card"
        );


    const img =
        card
            ? card.querySelector(
                ".product-img"
            )
            : null;


    const cartTarget =
        document.querySelector(
            'nav a[href="#cart"]'
        );


    if (
        !img ||
        !cartTarget
    ) {

        return;

    }


    const imgRect =
        img.getBoundingClientRect();


    const cartRect =
        cartTarget.getBoundingClientRect();


    const flyer =
        document.createElement(
            "img"
        );


    flyer.src =
        img.src;


    flyer.className =
        "flying-img";


    flyer.style.left =
        imgRect.left + "px";


    flyer.style.top =
        imgRect.top + "px";


    flyer.style.width =
        imgRect.width + "px";


    flyer.style.height =
        imgRect.height + "px";


    document.body.appendChild(
        flyer
    );


    requestAnimationFrame(
        () => {

            flyer.style.left =
                (
                    cartRect.left +
                    cartRect.width / 2
                ) + "px";


            flyer.style.top =
                cartRect.top + "px";


            flyer.style.width =
                "20px";


            flyer.style.height =
                "20px";


            flyer.style.opacity =
                "0.5";

        }
    );


    setTimeout(
        () => {

            if (flyer.parentNode) {

                flyer.remove();

            }

        },
        850
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Display saved cart.
         */
        updateCartUI();


        /*
         * Check URL hash.
         */
        const hash =
            window.location.hash.substring(1);


        if (hash) {

            const validSections = [

                "home",

                "groceries",

                "cart",

                "about",

                "contact"

            ];


            if (
                validSections.includes(
                    hash
                )
            ) {

                goToSection(
                    null,
                    hash
                );

            }

        }

    }
);