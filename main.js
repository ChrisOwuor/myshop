const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const state = {
  user: null,
  currentPath: window.location.pathname,
  selectedCategory: 'all',
  cart: new Map(),
  selectedProductId: 1,
  activePayment: 'mpesa',
  trackingCode: 'GP-240198'
};

const products = [
  {
    id: 1,
    name: 'Heirloom Tomato Box',
    category: 'Produce',
    priceKsh: 2400,
    unit: '5 kg crate',
    image:
      'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=1200&q=80',
    description: 'Naturally grown heirloom tomatoes harvested this morning from our lower field.',
    relatedIds: [2, 5, 6],
    reviews: [
      { name: 'Aisha', rating: 5, comment: 'Very fresh and sweet.' },
      { name: 'Brian', rating: 4, comment: 'Perfect for salads and stews.' }
    ]
  },
  {
    id: 2,
    name: 'Pasture-Raised Eggs',
    category: 'Dairy & Eggs',
    priceKsh: 850,
    unit: 'tray of 15',
    image:
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1200&q=80',
    description: 'Rich-yolk eggs from free-range hens fed on natural pasture.',
    relatedIds: [4, 1, 3],
    reviews: [
      { name: 'Mercy', rating: 5, comment: 'Best eggs I have bought this month.' }
    ]
  },
  {
    id: 3,
    name: 'Raw Wildflower Honey',
    category: 'Pantry',
    priceKsh: 1600,
    unit: '500 g jar',
    image:
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
    description: 'Unprocessed local honey from hives at the edge of our sunflower patch.',
    relatedIds: [6, 1, 2],
    reviews: [
      { name: 'Faith', rating: 5, comment: 'Thick, natural, and aromatic.' }
    ]
  },
  {
    id: 4,
    name: 'Fresh Goat Cheese',
    category: 'Dairy & Eggs',
    priceKsh: 1100,
    unit: '250 g',
    image:
      'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1200&q=80',
    description: 'Creamy goat cheese handcrafted in small batches every two days.',
    relatedIds: [2, 5],
    reviews: [
      { name: 'Kevin', rating: 4, comment: 'Great with crackers and fruits.' }
    ]
  },
  {
    id: 5,
    name: 'Seasonal Greens Bundle',
    category: 'Produce',
    priceKsh: 1300,
    unit: 'weekly pack',
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    description: 'A rotating mix of kale, spinach, sukuma wiki, and herbs.',
    relatedIds: [1, 4],
    reviews: [
      { name: 'Njeri', rating: 5, comment: 'Loved the mix and quantity.' }
    ]
  },
  {
    id: 6,
    name: 'Farmhouse Sourdough',
    category: 'Bakery',
    priceKsh: 900,
    unit: '1 loaf',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    description: 'Naturally fermented sourdough made with stone-ground flour.',
    relatedIds: [3, 1],
    reviews: [
      { name: 'Dan', rating: 4, comment: 'Good crust and flavor.' }
    ]
  }
];

function formatKsh(value) {
  return `KSh ${value.toLocaleString('en-KE')}`;
}

function navigate(path) {
  if (path === state.currentPath) return;
  state.currentPath = path;
  window.history.pushState({}, '', path);
  render();
}

function revealOnScroll() {
  const targets = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((target) => observer.observe(target));
}

function getCartSummary() {
  let totalItems = 0;
  let total = 0;

  state.cart.forEach((qty, productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    totalItems += qty;
    total += qty * product.priceKsh;
  });

  return { totalItems, total };
}

function addToCart(productId) {
  const current = state.cart.get(productId) || 0;
  state.cart.set(productId, current + 1);
  render();
}

function removeFromCart(productId) {
  state.cart.delete(productId);
  render();
}

function renderNav() {
  const { totalItems } = getCartSummary();
  return `
    <header class="navbar">
      <a href="/" data-link class="logo">🌿 Green Pastures</a>
      <nav>
        <a href="/" data-link>Home</a>
        <a href="/profile" data-link>Profile</a>
        <a href="/tracking" data-link>Tracking</a>
        <a href="/cart" data-link>Cart (${totalItems})</a>
        ${
          state.user
            ? '<a href="/logout" data-link>Logout</a>'
            : '<a href="/login" data-link>Login</a>'
        }
      </nav>
    </header>
  `;
}

function renderHomePage() {
  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const filtered =
    state.selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === state.selectedCategory);

  return `
    <section class="hero" data-reveal>
      <div>
        <p class="kicker">Fresh from our family farm</p>
        <h1>Farm products delivered across Kenya.</h1>
        <p>Shop produce, dairy, pantry, and artisan bakery items with transparent KSh pricing.</p>
        <button class="primary" data-go-product="1">View featured product</button>
      </div>
      <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80" alt="Farm landscape" />
    </section>

    <section class="filters" data-reveal>
      <label for="category">Category</label>
      <select id="category">
        ${categories
          .map(
            (cat) =>
              `<option value="${cat}" ${cat === state.selectedCategory ? 'selected' : ''}>${cat}</option>`
          )
          .join('')}
      </select>
    </section>

    <section class="product-grid">
      ${filtered
        .map(
          (product) => `
            <article class="product-card" data-reveal>
              <img src="${product.image}" alt="${product.name}" />
              <h3>${product.name}</h3>
              <p>${product.category} • ${product.unit}</p>
              <strong>${formatKsh(product.priceKsh)}</strong>
              <div class="actions">
                <button class="primary" data-product="${product.id}">View</button>
                <button class="ghost" data-add="${product.id}">Add to cart</button>
              </div>
            </article>
          `
        )
        .join('')}
    </section>
  `;
}

function renderSingleProductPage() {
  const product = products.find((item) => item.id === state.selectedProductId) || products[0];
  const related = product.relatedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return `
    <section class="single-product" data-reveal>
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <p class="kicker">Single Product Page</p>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p class="price">${formatKsh(product.priceKsh)} • ${product.unit}</p>
        <button class="primary" data-add="${product.id}">Add to cart</button>
      </div>
    </section>

    <section data-reveal>
      <h3>Reviews</h3>
      <div class="reviews">
        ${product.reviews
          .map(
            (review) => `
              <article class="review-card">
                <strong>${review.name}</strong>
                <p>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
                <p>${review.comment}</p>
              </article>
            `
          )
          .join('')}
      </div>
    </section>

    <section data-reveal>
      <h3>Related Products</h3>
      <div class="product-grid">
        ${related
          .map(
            (item) => `
              <article class="product-card">
                <img src="${item.image}" alt="${item.name}" />
                <h4>${item.name}</h4>
                <p>${formatKsh(item.priceKsh)}</p>
                <button class="ghost" data-product="${item.id}">Open</button>
              </article>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderCartPage() {
  const rows = [];
  state.cart.forEach((qty, productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    rows.push(`
      <li>
        <span>${product.name} × ${qty}</span>
        <div>
          <strong>${formatKsh(product.priceKsh * qty)}</strong>
          <button class="ghost" data-remove="${product.id}">Remove</button>
        </div>
      </li>
    `);
  });

  const { total } = getCartSummary();

  return `
    <section data-reveal>
      <h2>Cart</h2>
      ${rows.length ? `<ul class="cart-list">${rows.join('')}</ul>` : '<p>Your cart is currently empty.</p>'}
      <p class="price">Total: ${formatKsh(total)}</p>
      <button class="primary" data-link-target="/checkout">Proceed to checkout</button>
    </section>
  `;
}

function renderCheckoutPage() {
  const paymentOptions = [
    { id: 'mpesa', label: 'M-Pesa STK Push' },
    { id: 'card', label: 'Card Payment (Visa / Mastercard)' },
    { id: 'bank', label: 'Bank Transfer' },
    { id: 'cod', label: 'Cash on Delivery (Nairobi only)' }
  ];

  return `
    <section data-reveal>
      <h2>Checkout Page</h2>
      <p>Choose your payment option below.</p>
      <div class="payment-grid">
        ${paymentOptions
          .map(
            (option) => `
              <button class="payment ${state.activePayment === option.id ? 'active' : ''}" data-payment="${
                option.id
              }">${option.label}</button>
            `
          )
          .join('')}
      </div>
      <p class="hint">Selected: ${paymentOptions.find((x) => x.id === state.activePayment)?.label}</p>
      <button class="primary" id="place-order">Place order</button>
    </section>
  `;
}

function renderTrackingPage() {
  return `
    <section data-reveal>
      <h2>Order Tracking</h2>
      <p>Track your order using your farm order number.</p>
      <form id="tracking-form">
        <input id="tracking-code" value="${state.trackingCode}" required />
        <button class="primary" type="submit">Track</button>
      </form>
      <div class="timeline">
        <p><strong>${state.trackingCode}</strong> is currently: <span class="pill">Out for delivery</span></p>
        <ol>
          <li>Order received</li>
          <li>Harvesting and packing</li>
          <li>Dispatched from farm</li>
          <li><strong>Out for delivery</strong></li>
        </ol>
      </div>
    </section>
  `;
}

function renderProfilePage() {
  const userName = state.user?.name || 'Guest Farmer Friend';
  return `
    <section data-reveal>
      <h2>Profile Page</h2>
      <p>Name: ${userName}</p>
      <p>Email: ${state.user?.email || 'guest@example.com'}</p>
      <p>Preferred delivery county: Nairobi</p>
      <p>Loyalty status: Seedling Member</p>
    </section>
  `;
}

function renderLoginPage() {
  return `
    <section data-reveal>
      <h2>Login Page</h2>
      <form id="login-form" class="auth-form">
        <label>Email
          <input type="email" id="login-email" placeholder="you@example.com" required />
        </label>
        <label>Password
          <input type="password" id="login-password" placeholder="••••••••" required />
        </label>
        <button class="primary" type="submit">Login</button>
      </form>
    </section>
  `;
}

function renderLogoutPage() {
  return `
    <section data-reveal>
      <h2>Logout Page</h2>
      <p>You can securely sign out of your account.</p>
      <button class="primary" id="confirm-logout">Logout now</button>
    </section>
  `;
}

function renderMain() {
  if (state.currentPath.startsWith('/product/')) {
    const id = Number(state.currentPath.split('/')[2]);
    if (Number.isFinite(id)) state.selectedProductId = id;
    return renderSingleProductPage();
  }

  switch (state.currentPath) {
    case '/':
      return renderHomePage();
    case '/cart':
      return renderCartPage();
    case '/checkout':
      return renderCheckoutPage();
    case '/tracking':
      return renderTrackingPage();
    case '/profile':
      return renderProfilePage();
    case '/login':
      return renderLoginPage();
    case '/logout':
      return renderLogoutPage();
    default:
      return `<section><h2>Page not found</h2><button class="primary" data-link-target="/">Back Home</button></section>`;
  }
}

function wireBackendCalls() {
  // Template examples using import.meta.env-based URL as requested for backend-ready calls.
  const endpoints = {
    products: `${API_BASE_URL}/products`,
    checkout: `${API_BASE_URL}/checkout`,
    tracking: `${API_BASE_URL}/tracking`
  };

  window.__farmApiTemplates = endpoints;
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderNav()}
    <main>
      ${renderMain()}
    </main>
  `;

  wireEvents();
  revealOnScroll();
  wireBackendCalls();
}

function wireEvents() {
  document.querySelectorAll('[data-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigate(link.getAttribute('href'));
    });
  });

  document.querySelectorAll('[data-link-target]').forEach((button) => {
    button.addEventListener('click', () => {
      navigate(button.dataset.linkTarget);
    });
  });

  const category = document.getElementById('category');
  if (category) {
    category.addEventListener('change', () => {
      state.selectedCategory = category.value;
      render();
    });
  }

  document.querySelectorAll('[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      navigate(`/product/${button.dataset.product}`);
    });
  });

  const goFeatured = document.querySelector('[data-go-product]');
  if (goFeatured) {
    goFeatured.addEventListener('click', () => navigate(`/product/${goFeatured.dataset.goProduct}`));
  }

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.add)));
  });

  document.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => removeFromCart(Number(button.dataset.remove)));
  });

  document.querySelectorAll('[data-payment]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activePayment = button.dataset.payment;
      render();
    });
  });

  const trackingForm = document.getElementById('tracking-form');
  if (trackingForm) {
    trackingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      state.trackingCode = document.getElementById('tracking-code').value.trim();
      render();
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      state.user = {
        name: 'Farm Shopper',
        email: document.getElementById('login-email').value.trim()
      };
      navigate('/profile');
    });
  }

  const logoutButton = document.getElementById('confirm-logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      state.user = null;
      navigate('/');
    });
  }

  const placeOrder = document.getElementById('place-order');
  if (placeOrder) {
    placeOrder.addEventListener('click', async () => {
      const payload = {
        paymentMethod: state.activePayment,
        items: [...state.cart.entries()].map(([productId, quantity]) => ({ productId, quantity }))
      };

      // Backend-ready template call using import.meta.env URL pattern.
      const endpoint = `${API_BASE_URL}/checkout`;
      console.info('Checkout payload template', endpoint, payload);
      alert('Order placed (demo). Integrate backend checkout endpoint next.');
    });
  }
}

window.addEventListener('popstate', () => {
  state.currentPath = window.location.pathname;
  render();
});

render();
