import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const products = [
  { id: 1, name: 'Heirloom Tomato Box', category: 'Produce', priceKsh: 2400, unit: '5 kg crate', image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=1200&q=80', description: 'Naturally grown heirloom tomatoes harvested this morning.', relatedIds: [2, 5], reviews: [{ name: 'Aisha', rating: 5, comment: 'Very fresh.' }] },
  { id: 2, name: 'Pasture-Raised Eggs', category: 'Dairy & Eggs', priceKsh: 850, unit: 'tray of 15', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1200&q=80', description: 'Rich-yolk eggs from free-range hens.', relatedIds: [4, 1], reviews: [{ name: 'Mercy', rating: 5, comment: 'Excellent quality.' }] },
  { id: 3, name: 'Raw Wildflower Honey', category: 'Pantry', priceKsh: 1600, unit: '500 g jar', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80', description: 'Unprocessed local honey.', relatedIds: [6, 1], reviews: [{ name: 'Faith', rating: 5, comment: 'Authentic taste.' }] },
  { id: 4, name: 'Fresh Goat Cheese', category: 'Dairy & Eggs', priceKsh: 1100, unit: '250 g', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1200&q=80', description: 'Creamy goat cheese handcrafted in small batches.', relatedIds: [2, 5], reviews: [{ name: 'Kevin', rating: 4, comment: 'Great texture.' }] },
  { id: 5, name: 'Seasonal Greens Bundle', category: 'Produce', priceKsh: 1300, unit: 'weekly pack', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80', description: 'Kale, spinach, sukuma wiki, and herbs.', relatedIds: [1, 4], reviews: [{ name: 'Njeri', rating: 5, comment: 'Good variety.' }] },
  { id: 6, name: 'Farmhouse Sourdough', category: 'Bakery', priceKsh: 900, unit: '1 loaf', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80', description: 'Naturally fermented sourdough.', relatedIds: [3, 1], reviews: [{ name: 'Dan', rating: 4, comment: 'Great crust.' }] }
];

const ksh = (v) => `KSh ${v.toLocaleString('en-KE')}`;

function Reveal({ children, className = '' }) {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('revealed');
      });
    }, { threshold: 0.1 });
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return <div className={`reveal ${className}`}>{children}</div>;
}

function Layout({ children, cartCount, user }) {
  const linkCls = ({ isActive }) => `px-2 py-1 rounded ${isActive ? 'bg-green-700 text-white' : 'text-green-900'}`;
  return (
    <div className="min-h-screen bg-stone-50 text-slate-800">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <NavLink to="/" className="font-bold text-green-900">🌿 Green Pastures</NavLink>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <NavLink to="/" className={linkCls}>Home</NavLink>
            <NavLink to="/profile" className={linkCls}>Profile</NavLink>
            <NavLink to="/tracking" className={linkCls}>Tracking</NavLink>
            <NavLink to="/cart" className={linkCls}>Cart ({cartCount})</NavLink>
            {user ? <NavLink to="/logout" className={linkCls}>Logout</NavLink> : <NavLink to="/login" className={linkCls}>Login</NavLink>}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

function Home({ onAdd }) {
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();
  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const filtered = category === 'all' ? products : products.filter((p) => p.category === category);

  return (
    <div className="space-y-5">
      <Reveal className="rounded-2xl bg-gradient-to-r from-green-900 to-green-700 text-white p-5 grid md:grid-cols-2 gap-4 items-center">
        <div>
          <p className="uppercase tracking-widest text-xs mb-2">Fresh from our family farm</p>
          <h1 className="text-3xl font-bold mb-2">Farm products delivered across Kenya.</h1>
          <p className="mb-4">Browse produce, dairy, pantry and bakery items.</p>
          <button className="bg-amber-300 text-slate-900 px-4 py-2 rounded-full font-semibold" onClick={() => navigate('/product/1')}>View featured product</button>
        </div>
        <img className="rounded-xl h-64 w-full object-cover" src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80" alt="Farm view" />
      </Reveal>

      <Reveal className="flex items-center gap-3">
        <label htmlFor="category" className="font-medium">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-md px-3 py-2">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Reveal>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Reveal key={p.id} className="bg-white rounded-xl shadow p-3">
            <img src={p.image} alt={p.name} className="rounded-lg h-44 w-full object-cover" />
            <h3 className="font-semibold mt-2">{p.name}</h3>
            <p className="text-sm text-slate-600">{p.category} • {p.unit}</p>
            <p className="font-bold text-green-900 mt-1">{ksh(p.priceKsh)}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => navigate(`/product/${p.id}`)} className="bg-green-700 text-white px-3 py-1.5 rounded-full">View</button>
              <button onClick={() => onAdd(p.id)} className="bg-green-100 text-green-900 px-3 py-1.5 rounded-full">Add to cart</button>
            </div>
          </Reveal>
        ))}
      </section>
    </div>
  );
}

function ProductPage({ onAdd }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const related = product.relatedIds.map((rid) => products.find((p) => p.id === rid)).filter(Boolean);

  return (
    <div className="space-y-5">
      <Reveal className="bg-white rounded-xl shadow p-4 grid md:grid-cols-2 gap-4">
        <img src={product.image} alt={product.name} className="rounded-lg h-72 w-full object-cover" />
        <div>
          <p className="uppercase tracking-wider text-xs text-slate-500">Single Product Page</p>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-slate-600 my-2">{product.description}</p>
          <p className="font-bold text-xl text-green-900">{ksh(product.priceKsh)} • {product.unit}</p>
          <button onClick={() => onAdd(product.id)} className="mt-3 bg-amber-300 px-4 py-2 rounded-full font-semibold">Add to cart</button>
        </div>
      </Reveal>

      <Reveal className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Reviews</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {product.reviews.map((r, i) => <div key={i} className="border rounded-lg p-3"><p className="font-medium">{r.name}</p><p>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</p><p className="text-sm text-slate-600">{r.comment}</p></div>)}
        </div>
      </Reveal>

      <Reveal className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Related products</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {related.map((r) => (
            <div key={r.id} className="border rounded-lg p-2">
              <img src={r.image} alt={r.name} className="rounded h-24 w-full object-cover" />
              <p className="font-medium mt-2">{r.name}</p>
              <p className="text-green-900 font-semibold">{ksh(r.priceKsh)}</p>
              <button className="mt-2 bg-green-100 text-green-900 px-3 py-1 rounded-full" onClick={() => navigate(`/product/${r.id}`)}>Open</button>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function CartPage({ cart, onRemove }) {
  const items = useMemo(() => [...cart.entries()].map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty })).filter((x) => x.product), [cart]);
  const total = items.reduce((sum, row) => sum + row.product.priceKsh * row.qty, 0);
  const navigate = useNavigate();

  return (
    <Reveal className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-3">Cart</h2>
      {!items.length ? <p>Your cart is empty.</p> : (
        <ul className="space-y-2 mb-4">
          {items.map((row) => <li key={row.product.id} className="flex justify-between border-b pb-2"><span>{row.product.name} × {row.qty}</span><div className="flex gap-2 items-center"><span className="font-semibold">{ksh(row.product.priceKsh * row.qty)}</span><button className="bg-green-100 px-3 py-1 rounded-full" onClick={() => onRemove(row.product.id)}>Remove</button></div></li>)}
        </ul>
      )}
      <p className="font-bold text-green-900">Total: {ksh(total)}</p>
      <button onClick={() => navigate('/checkout')} className="mt-3 bg-green-700 text-white px-4 py-2 rounded-full">Proceed to checkout</button>
    </Reveal>
  );
}

function CheckoutPage({ cart }) {
  const [payment, setPayment] = useState('mpesa');
  const options = ['mpesa', 'card', 'bank', 'cod'];

  const placeOrder = async () => {
    const payload = { paymentMethod: payment, items: [...cart.entries()].map(([productId, quantity]) => ({ productId, quantity })) };
    const endpoint = `${API_BASE_URL}/checkout`;
    console.info('Checkout template', endpoint, payload);
    alert('Demo order placed. Connect backend endpoint next.');
  };

  return (
    <Reveal className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold">Checkout</h2>
      <p className="text-slate-600 mb-3">Select payment option.</p>
      <div className="grid gap-2">
        {options.map((o) => <button key={o} onClick={() => setPayment(o)} className={`text-left rounded-lg px-3 py-2 ${payment===o?'bg-green-200 border border-green-700':'bg-green-50'}`}>{o.toUpperCase()}</button>)}
      </div>
      <p className="mt-3 text-sm">Using API base: <code>{API_BASE_URL}</code></p>
      <button onClick={placeOrder} className="mt-3 bg-amber-300 px-4 py-2 rounded-full font-semibold">Place order</button>
    </Reveal>
  );
}

function TrackingPage() {
  const [code, setCode] = useState('GP-240198');
  return (
    <Reveal className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold">Order tracking</h2>
      <p className="mb-2">Track your package</p>
      <div className="flex gap-2 mb-3"><input className="border rounded-md px-3 py-2" value={code} onChange={(e) => setCode(e.target.value)} /><button className="bg-green-700 text-white rounded-full px-4">Track</button></div>
      <p><span className="font-semibold">{code}</span> is currently <span className="bg-green-100 px-2 py-1 rounded-full">Out for delivery</span>.</p>
    </Reveal>
  );
}

function ProfilePage({ user }) {
  return <Reveal className="bg-white rounded-xl shadow p-4"><h2 className="text-xl font-bold">Profile page</h2><p>Name: {user?.name || 'Guest'}</p><p>Email: {user?.email || 'guest@example.com'}</p></Reveal>;
}

function LoginPage({ onLogin }) {
  const nav = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onLogin({ name: 'Farm Shopper', email: form.get('email') });
    nav('/profile');
  };
  return (
    <Reveal className="bg-white rounded-xl shadow p-4 max-w-lg">
      <h2 className="text-xl font-bold mb-3">Login page</h2>
      <form className="grid gap-3" onSubmit={submit}>
        <input name="email" type="email" required placeholder="you@example.com" className="border rounded-md px-3 py-2" />
        <input name="password" type="password" required placeholder="••••••••" className="border rounded-md px-3 py-2" />
        <button className="bg-green-700 text-white rounded-full px-4 py-2">Login</button>
      </form>
    </Reveal>
  );
}

function LogoutPage({ onLogout }) {
  const nav = useNavigate();
  return (
    <Reveal className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold">Logout page</h2>
      <button className="mt-3 bg-amber-300 rounded-full px-4 py-2 font-semibold" onClick={() => { onLogout(); nav('/'); }}>Logout now</button>
    </Reveal>
  );
}

export default function App() {
  const [cart, setCart] = useState(new Map());
  const [user, setUser] = useState(null);

  const addToCart = (id) => setCart((prev) => new Map(prev).set(id, (prev.get(id) || 0) + 1));
  const removeFromCart = (id) => setCart((prev) => {
    const next = new Map(prev);
    next.delete(id);
    return next;
  });

  const cartCount = [...cart.values()].reduce((sum, x) => sum + x, 0);

  return (
    <Layout cartCount={cartCount} user={user}>
      <Routes>
        <Route path="/" element={<Home onAdd={addToCart} />} />
        <Route path="/product/:id" element={<ProductPage onAdd={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} onRemove={removeFromCart} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/logout" element={<LogoutPage onLogout={() => setUser(null)} />} />
      </Routes>
    </Layout>
  );
}
