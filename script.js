// Menu Data
const menuData = [
    { id: 1, name: "Classic Cheeseburger", price: 8.99, category: "Burgers", description: "Juicy beef patty with melted cheese, lettuce, and our secret sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Double Bacon Burger", price: 12.49, category: "Burgers", description: "Two patties, crispy bacon, cheddar, and BBQ sauce.", image: "https://images.unsplash.com/photo-1594212848123-ce6a14371661?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Spicy Chicken Sandwich", price: 9.99, category: "Burgers", description: "Crispy fried chicken breast, spicy mayo, pickles.", image: "https://images.unsplash.com/photo-1625869016774-3a92be237599?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Margherita Pizza", price: 14.00, category: "Pizza", description: "Fresh mozzarella, tomato sauce, and basil.", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a30536?auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Pepperoni Feast", price: 16.50, category: "Pizza", description: "Loaded with premium pepperoni and extra cheese.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Cola Regular", price: 2.50, category: "Beverages", description: "Chilled refreshing cola.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Iced Lemon Tea", price: 3.00, category: "Beverages", description: "Freshly brewed tea with lemon and ice.", image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=500&q=80" },
    { id: 8, name: "Chocolate Milkshake", price: 5.50, category: "Desserts", description: "Rich chocolate ice cream blended with milk.", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80" },
    { id: 9, name: "Cheesecake Slice", price: 6.00, category: "Desserts", description: "New York style cheesecake with strawberry drizzle.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80" },
    { id: 10, name: "Value Combo 1", price: 15.99, category: "Combo Meals", description: "Cheeseburger, Medium Fries, and a Cola.", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80" },
    { id: 11, name: "Family Pizza Combo", price: 34.99, category: "Combo Meals", description: "2 Large Pizzas, Garlic Bread, and 4 Drinks.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" }
];

// State variables
let cart = JSON.parse(localStorage.getItem('kioskCart')) || [];
let activeCategory = 'All';

// Configuration
const DOM = {
    themeToggle: document.getElementById('theme-toggle'),
    cartBadge: document.getElementById('cart-badge'),
    menuContainer: document.getElementById('menu-grid'),
    categoryFilters: document.getElementById('category-filters'),
    searchInput: document.getElementById('search-input'),
    cartItemsContainer: document.getElementById('cart-items'),
    cartTotalAmount: document.getElementById('cart-total-amount'),
    checkoutForm: document.getElementById('checkout-form'),
    confirmationDetails: document.getElementById('confirmation-details')
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateCartBadge();
    
    // Page specific initialization
    if (DOM.menuContainer) initMenuPage();
    if (DOM.cartItemsContainer) renderCartPage();
    if (DOM.checkoutForm) initCheckoutPage();
    if (DOM.confirmationDetails) renderConfirmationPage();

    // Setup Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
});

// --- Theme Management ---
function initTheme() {
    const savedTheme = localStorage.getItem('kioskTheme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('kioskTheme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    if(!DOM.themeToggle) return;
    const icon = DOM.themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// --- Cart Management (Global) ---
function addToCart(itemId) {
    const item = menuData.find(m => m.id === itemId);
    if (!item) return;

    const existingItem = cart.find(c => c.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    saveCart();
    updateCartBadge();
    showToast(`Added ${item.name} to cart!`);
}

function updateQuantity(itemId, change) {
    const itemIndex = cart.findIndex(c => c.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart();
        updateCartBadge();
        if(DOM.cartItemsContainer) renderCartPage(); // Re-render if on cart page
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    saveCart();
    updateCartBadge();
    if(DOM.cartItemsContainer) renderCartPage();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartBadge();
}

function saveCart() {
    localStorage.setItem('kioskCart', JSON.stringify(cart));
}

function updateCartBadge() {
    if (DOM.cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        DOM.cartBadge.textContent = totalItems;
        // Animation trigger
        DOM.cartBadge.style.animation = 'none';
        setTimeout(() => DOM.cartBadge.style.animation = '', 10);
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// --- Menu Page Logic ---
function initMenuPage() {
    renderMenu(menuData);
    setupFilters();
    
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = menuData.filter(item => 
                (activeCategory === 'All' || item.category === activeCategory) &&
                (item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term))
            );
            renderMenu(filtered);
        });
    }
}

function renderMenu(items) {
    if (!DOM.menuContainer) return;
    DOM.menuContainer.innerHTML = '';
    
    if(items.length === 0) {
        DOM.menuContainer.innerHTML = `<div class="empty-cart-msg"><p>No items found.</p></div>`;
        return;
    }

    items.forEach((item, index) => {
        const delay = index * 0.05; // Staggered animation
        const card = document.createElement('div');
        card.className = 'food-card';
        card.style.animationDelay = `${delay}s`;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="food-image" loading="lazy">
            <div class="food-info">
                <div class="food-title">${item.name}</div>
                <div class="food-desc">${item.description}</div>
                <div class="food-footer">
                    <div class="food-price">$${item.price.toFixed(2)}</div>
                    <button class="btn btn-primary btn-icon" onclick="addToCart(${item.id})" aria-label="Add to cart">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        DOM.menuContainer.appendChild(card);
    });
}

function setupFilters() {
    if (!DOM.categoryFilters) return;
    const categories = ['All', ...new Set(menuData.map(item => item.category))];
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${cat === 'All' ? 'active' : ''}`;
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = cat;
            
            // Re-apply search filter if any
            const term = DOM.searchInput ? DOM.searchInput.value.toLowerCase() : '';
            const filtered = menuData.filter(item => 
                (activeCategory === 'All' || item.category === activeCategory) &&
                (item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term))
            );
            renderMenu(filtered);
        });
        DOM.categoryFilters.appendChild(btn);
    });
}

// --- Cart Page Logic ---
function renderCartPage() {
    if (!DOM.cartItemsContainer) return;
    DOM.cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        DOM.cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fas fa-shopping-basket"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any delicious food yet!</p>
                <a href="menu.html" class="btn btn-primary" style="margin-top:20px;">Browse Menu</a>
            </div>
        `;
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }
    
    document.querySelector('.cart-summary').style.display = 'block';
    
    cart.forEach((item, index) => {
        const delay = index * 0.1;
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.style.animationDelay = `${delay}s`;
        el.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)"><i class="fas fa-plus"></i></button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove Item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        DOM.cartItemsContainer.appendChild(el);
    });
    
    if (DOM.cartTotalAmount) {
        DOM.cartTotalAmount.textContent = `$${getCartTotal().toFixed(2)}`;
    }
}

// --- Checkout Page Logic ---
function initCheckoutPage() {
    // Show summary
    const summaryContainer = document.getElementById('checkout-summary');
    if (summaryContainer && cart.length > 0) {
        let html = '<div class="summary-list">';
        cart.forEach(item => {
            html += `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });
        html += `</div><div class="summary-total" style="border-top:1px solid var(--border-color); padding-top:10px; margin-top:10px; font-weight:bold; font-size:1.2rem;">Total: $${getCartTotal().toFixed(2)}</div>`;
        summaryContainer.innerHTML = html;
    } else if (summaryContainer) {
        window.location.href = 'menu.html'; // Redirect if empty
    }

    DOM.checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gather order details
        const orderData = {
            id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            name: document.getElementById('customer-name').value,
            type: document.getElementById('order-type').value,
            total: getCartTotal().toFixed(2),
            items: cart,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        // Save to localstorage for confirmation page
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Clear cart
        clearCart();
        
        // Redirect
        window.location.href = 'confirmation.html';
    });
}

// --- Confirmation Page Logic ---
function renderConfirmationPage() {
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    
    if (!lastOrder) {
        DOM.confirmationDetails.innerHTML = `<p>No recent order found. <a href="menu.html">Go to Menu</a></p>`;
        return;
    }
    
    document.getElementById('order-number-display').textContent = lastOrder.id;
    
    let detailsHtml = `
        <p style="font-size:1.2rem; margin-bottom:10px;">Thank you, <strong>${lastOrder.name}</strong>!</p>
        <p class="prep-time"><i class="fas fa-clock"></i> Estimated Prep Time: 10-15 Minutes</p>
        <div style="background:var(--surface-color); padding:20px; border-radius:15px; text-align:left; max-width:400px; margin:0 auto; box-shadow:var(--card-shadow);">
            <h3 style="margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">Order Summary (${lastOrder.type})</h3>
    `;
    
    lastOrder.items.forEach(item => {
        detailsHtml += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:var(--text-muted);">
                <span>${item.quantity}x ${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    detailsHtml += `
            <div style="display:flex; justify-content:space-between; margin-top:15px; padding-top:15px; border-top:1px solid var(--border-color); font-weight:bold; font-size:1.2rem; color:var(--text-color);">
                <span>Total Paid</span>
                <span style="color:var(--primary-color)">$${lastOrder.total}</span>
            </div>
        </div>
    `;
    
    DOM.confirmationDetails.innerHTML = detailsHtml;
}

// --- UI Utilities ---
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast glass';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--success-color)"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300); // Wait for exit animation
    }, 3000);
}
