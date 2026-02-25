const API_BASE_URL = (window.__ENV__ && window.__ENV__.VITE_API_BASE_URL) || 'http://localhost:8000/api';

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
  { id: 1, name: 'Heirloom Tomato Box', category: 'Produce', priceKsh: 2400, unit: '5 kg crate', image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=1200&q=80', description: 'Naturally grown heirloom tomatoes harvested this morning.', relatedIds: [2, 5, 6], reviews: [{ name: 'Aisha', rating: 5, comment: 'Very fresh and sweet.' }] },
  { id: 2, name: 'Pasture-Raised Eggs', category: 'Dairy & Eggs', priceKsh: 850, unit: 'tray of 15', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1200&q=80', description: 'Rich-yolk eggs from free-range hens.', relatedIds: [4, 1, 3], reviews: [{ name: 'Mercy', rating: 5, comment: 'Best eggs this month.' }] },
  { id: 3, name: 'Raw Wildflower Honey', category: 'Pantry', priceKsh: 1600, unit: '500 g jar', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80', description: 'Unprocessed local honey from our sunflower edge hives.', relatedIds: [6, 1, 2], reviews: [{ name: 'Faith', rating: 5, comment: 'Thick, natural, aromatic.' }] },
  { id: 4, name: 'Fresh Goat Cheese', category: 'Dairy & Eggs', priceKsh: 1100, unit: '250 g', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1200&q=80', description: 'Creamy goat cheese handcrafted in small batches.', relatedIds: [2, 5], reviews: [{ name: 'Kevin', rating: 4, comment: 'Great with crackers.' }] },
  { id: 5, name: 'Seasonal Greens Bundle', category: 'Produce', priceKsh: 1300, unit: 'weekly pack', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80', description: 'A rotating mix of kale, spinach, and herbs.', relatedIds: [1, 4], reviews: [{ name: 'Njeri', rating: 5, comment: 'Loved the mix.' }] },
  { id: 6, name: 'Farmhouse Sourdough', category: 'Bakery', priceKsh: 900, unit: '1 loaf', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80', description: 'Naturally fermented sourdough loaf.', relatedIds: [3, 1], reviews: [{ name: 'Dan', rating: 4, comment: 'Great crust and flavor.' }] }
];

const ksh = (value) => `KSh ${value.toLocaleString('en-KE')}`;

function revealOnScroll() {
  const targets = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach((t) => observer.observe(t));
}

function navigate(path) {
  if (path === state.currentPath) return;
  history.pushState({}, '', path);
  state.currentPath = path;
  render();
}

function cartSummary() {
  let totalItems = 0;
  let total = 0;
  state.cart.forEach((qty, productId) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    totalItems += qty;
    total += qty * p.priceKsh;
  });
  return { totalItems, total };
}

function navTemplate() {
  const { totalItems } = cartSummary();
  return `<header class="navbar">
    <a href="/" data-link class="logo">🌿 Green Pastures</a>
    <nav>
      <a href="/" data-link>Home</a>
      <a href="/profile" data-link>Profile</a>
      <a href="/tracking" data-link>Tracking</a>
      <a href="/cart" data-link>Cart (${totalItems})</a>
      ${state.user ? '<a href="/logout" data-link>Logout</a>' : '<a href="/login" data-link>Login</a>'}
    </nav>
  </header>`;
}

function homeTemplate() {
  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const filtered = state.selectedCategory === 'all' ? products : products.filter((p) => p.category === state.selectedCategory);
  return `<section class="hero" data-reveal>
      <div><p class="kicker">Fresh from our family farm</p><h1>Farm products delivered across Kenya.</h1><p>Shop produce, dairy, pantry and bakery with clear KSh pricing.</p><button class="primary" data-go-product="1">View featured product</button></div>
      <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80" alt="Farm landscape" />
    </section>
    <section class="filters" data-reveal><label for="category">Category</label><select id="category">${categories.map((c) => `<option value="${c}" ${c === state.selectedCategory ? 'selected' : ''}>${c}</option>`).join('')}</select></section>
    <section class="product-grid">${filtered.map((p) => `<article class="product-card" data-reveal><img src="${p.image}" alt="${p.name}" /><h3>${p.name}</h3><p>${p.category} • ${p.unit}</p><strong>${ksh(p.priceKsh)}</strong><div class="actions"><button class="primary" data-product="${p.id}">View</button><button class="ghost" data-add="${p.id}">Add to cart</button></div></article>`).join('')}</section>`;
}

function productTemplate() {
  const p = products.find((x) => x.id === state.selectedProductId) || products[0];
  const related = p.relatedIds.map((id) => products.find((x) => x.id === id)).filter(Boolean);
  return `<section class="single-product" data-reveal><img src="${p.image}" alt="${p.name}" /><div><p class="kicker">Single Product Page</p><h2>${p.name}</h2><p>${p.description}</p><p class="price">${ksh(p.priceKsh)} • ${p.unit}</p><button class="primary" data-add="${p.id}">Add to cart</button></div></section>
  <section data-reveal><h3>Reviews</h3><div class="reviews">${p.reviews.map((r) => `<article class="review-card"><strong>${r.name}</strong><p>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</p><p>${r.comment}</p></article>`).join('')}</div></section>
  <section data-reveal><h3>Related Products</h3><div class="product-grid">${related.map((r) => `<article class="product-card"><img src="${r.image}" alt="${r.name}" /><h4>${r.name}</h4><p>${ksh(r.priceKsh)}</p><button class="ghost" data-product="${r.id}">Open</button></article>`).join('')}</div></section>`;
}

function cartTemplate() {
  const rows = [];
  state.cart.forEach((qty, id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    rows.push(`<li><span>${p.name} × ${qty}</span><div><strong>${ksh(p.priceKsh * qty)}</strong><button class="ghost" data-remove="${p.id}">Remove</button></div></li>`);
  });
  const { total } = cartSummary();
  return `<section data-reveal><h2>Cart</h2>${rows.length ? `<ul class="cart-list">${rows.join('')}</ul>` : '<p>Your cart is currently empty.</p>'}<p class="price">Total: ${ksh(total)}</p><button class="primary" data-link-target="/checkout">Proceed to checkout</button></section>`;
}

function checkoutTemplate() {
  const options = [{ id: 'mpesa', label: 'M-Pesa STK Push' }, { id: 'card', label: 'Card Payment' }, { id: 'bank', label: 'Bank Transfer' }, { id: 'cod', label: 'Cash on Delivery (Nairobi only)' }];
  return `<section data-reveal><h2>Checkout Page</h2><p>Choose payment option.</p><div class="payment-grid">${options.map((o) => `<button class="payment ${state.activePayment === o.id ? 'active' : ''}" data-payment="${o.id}">${o.label}</button>`).join('')}</div><p class="hint">Selected: ${options.find((x) => x.id === state.activePayment)?.label}</p><button class="primary" id="place-order">Place order</button></section>`;
}

function trackingTemplate() {
  return `<section data-reveal><h2>Order Tracking</h2><form id="tracking-form"><input id="tracking-code" value="${state.trackingCode}" required /><button class="primary" type="submit">Track</button></form><div class="timeline"><p><strong>${state.trackingCode}</strong> is currently <span class="pill">Out for delivery</span></p><ol><li>Order received</li><li>Harvesting and packing</li><li>Dispatched from farm</li><li><strong>Out for delivery</strong></li></ol></div></section>`;
}

function profileTemplate() {
  return `<section data-reveal><h2>Profile Page</h2><p>Name: ${state.user?.name || 'Guest'}</p><p>Email: ${state.user?.email || 'guest@example.com'}</p></section>`;
}

function loginTemplate() {
  return `<section data-reveal><h2>Login Page</h2><form id="login-form" class="auth-form"><label>Email<input type="email" id="login-email" required /></label><label>Password<input type="password" id="login-password" required /></label><button class="primary" type="submit">Login</button></form></section>`;
}

function logoutTemplate() {
  return `<section data-reveal><h2>Logout Page</h2><button class="primary" id="confirm-logout">Logout now</button></section>`;
}

function mainTemplate() {
  if (state.currentPath.startsWith('/product/')) {
    const id = Number(state.currentPath.split('/')[2]);
    if (Number.isFinite(id)) state.selectedProductId = id;
    return productTemplate();
  }
  switch (state.currentPath) {
    case '/': return homeTemplate();
    case '/cart': return cartTemplate();
    case '/checkout': return checkoutTemplate();
    case '/tracking': return trackingTemplate();
    case '/profile': return profileTemplate();
    case '/login': return loginTemplate();
    case '/logout': return logoutTemplate();
    default: return '<section><h2>Page not found</h2><button class="primary" data-link-target="/">Back Home</button></section>';
  }
}

function wireBackendTemplates() {
  window.__farmApiTemplates = {
    products: `${API_BASE_URL}/products`,
    checkout: `${API_BASE_URL}/checkout`,
    tracking: `${API_BASE_URL}/tracking`
  };
}

function wireEvents() {
  document.querySelectorAll('[data-link]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(el.getAttribute('href'));
  }));

  document.querySelectorAll('[data-link-target]').forEach((el) => el.addEventListener('click', () => navigate(el.dataset.linkTarget)));
  const category = document.getElementById('category');
  if (category) category.addEventListener('change', () => { state.selectedCategory = category.value; render(); });
  document.querySelectorAll('[data-product]').forEach((el) => el.addEventListener('click', () => navigate(`/product/${el.dataset.product}`)));
  const featured = document.querySelector('[data-go-product]');
  if (featured) featured.addEventListener('click', () => navigate(`/product/${featured.dataset.goProduct}`));
  document.querySelectorAll('[data-add]').forEach((el) => el.addEventListener('click', () => { const id = Number(el.dataset.add); state.cart.set(id, (state.cart.get(id) || 0) + 1); render(); }));
  document.querySelectorAll('[data-remove]').forEach((el) => el.addEventListener('click', () => { state.cart.delete(Number(el.dataset.remove)); render(); }));
  document.querySelectorAll('[data-payment]').forEach((el) => el.addEventListener('click', () => { state.activePayment = el.dataset.payment; render(); }));

  const trackingForm = document.getElementById('tracking-form');
  if (trackingForm) trackingForm.addEventListener('submit', (e) => { e.preventDefault(); state.trackingCode = document.getElementById('tracking-code').value.trim(); render(); });
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', (e) => { e.preventDefault(); state.user = { name: 'Farm Shopper', email: document.getElementById('login-email').value.trim() }; navigate('/profile'); });
  const logoutBtn = document.getElementById('confirm-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => { state.user = null; navigate('/'); });

  const order = document.getElementById('place-order');
  if (order) order.addEventListener('click', () => {
    const payload = { paymentMethod: state.activePayment, items: [...state.cart.entries()].map(([productId, quantity]) => ({ productId, quantity })) };
    console.info('Checkout payload template', `${API_BASE_URL}/checkout`, payload);
    alert('Order placed (demo). Connect checkout backend next.');
  });
}

function render() {
  document.getElementById('app').innerHTML = `${navTemplate()}<main>${mainTemplate()}</main>`;
  wireEvents();
  revealOnScroll();
  wireBackendTemplates();
}

window.addEventListener('popstate', () => { state.currentPath = window.location.pathname; render(); });
render();
