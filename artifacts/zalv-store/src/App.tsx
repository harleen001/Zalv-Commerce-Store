import { useEffect, useState, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, CircleUserRound, Menu, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import logo from '@assets/zalv-logo.png';
import popupImage from '@/assets/zalv-perfume.jpg';
import heroImage from '@/assets/zalv-hero.jpg';
import craftImage from '@/assets/zalv-craft.jpg';
import {
  catalog, createOrder, getAllOrders, getOrders, getProducts, signIn, signOut, signUp, updateOrderStatus,
  type CartItem, type CheckoutDetails, type Order, type Product,
} from '@/lib/store';

const queryClient = new QueryClient();
type User = { id: string; email: string; name: string; isAdmin?: boolean };

function money(value: number) { return `₹${value.toLocaleString('en-IN')}`; }

function Shell({ children, cart, setCart, user, onSignOut }: { children: ReactNode; cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>>; user: User | null; onSignOut: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [, setLocation] = useLocation();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2200); };
  const changeQty = (id: string, delta: number) => setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  const add = (product: Product) => { setCart((current) => { const found = current.find((item) => item.product.id === product.id); return found ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1 }]; }); flash(`${product.name} added to bag`); };
  useEffect(() => { localStorage.setItem('zalv-cart', JSON.stringify(cart)); }, [cart]);
  return <div className="zalv-shell">
    <div className="topline">Complimentary delivery across India · Cash on delivery available</div>
    <header className="site-header">
      <div className="header-inner">
        <button className="menu-button" aria-label="Open navigation" data-testid="button-menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={21} strokeWidth={1.5} /></button>
        <Link href="/" data-testid="link-logo"><img className="brand-logo" src={logo} alt="Zalv" /></Link>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <Link href="/shop" data-testid="link-shop">Shop all</Link>
          <Link href="/shop/perfume" data-testid="link-perfume">Perfume</Link>
          <Link href="/shop/shoes" data-testid="link-shoes">Shoes</Link>
          <Link href="/shop/jackets" data-testid="link-jackets">Jackets</Link>
          <a href="#journal" data-testid="link-journal" onClick={() => setMenuOpen(false)}>Journal</a>
        </nav>
        <div className="header-actions">
          <Link className="header-action" href="/account" aria-label="Account" data-testid="link-account"><CircleUserRound size={18} strokeWidth={1.4} /><span>{user ? user.name.split(' ')[0] : 'Account'}</span></Link>
          <button className="header-action" aria-label="Open shopping bag" data-testid="button-cart" onClick={() => setCartOpen(true)}><ShoppingBag size={18} strokeWidth={1.4} /><span>Bag</span><b className="cart-count" data-testid="text-cart-count">{count}</b></button>
        </div>
      </div>
    </header>
    {children}
    <footer className="footer" id="journal">
      <div className="footer-inner">
        <div><img className="footer-logo" src={logo} alt="Zalv" /><p style={{ maxWidth:260, color:'#b8aea5', lineHeight:1.7, fontSize:13, marginTop:20 }}>Objects for the way you move through the world. Made slowly in Jalandhar.</p></div>
        <div><h4>Explore</h4><Link href="/shop">Shop all</Link><Link href="/shop/perfume">Perfume</Link><Link href="/shop/shoes">Leather shoes</Link><Link href="/shop/jackets">Leather jackets</Link></div>
        <div><h4>Notes</h4><a href="#journal">Our material</a><a href="#journal">Care guide</a><a href="#journal">Contact studio</a><a href="#journal">Shipping & returns</a></div>
      </div>
      <div className="footer-bottom"><span>© 2024 Zalv Objects</span><span>Made in Punjab, India</span></div>
    </footer>
    {cartOpen && <div className="drawer-overlay" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="cart-drawer">
        <div className="drawer-head"><h2>Your bag <small style={{font:'11px var(--app-font-mono)', color:'#8c4a2f'}}>({count})</small></h2><button className="icon-button" aria-label="Close bag" data-testid="button-close-cart" onClick={() => setCartOpen(false)}><X size={20} /></button></div>
        <div className="cart-items">{cart.length === 0 ? <div style={{padding:'65px 0', textAlign:'center'}}><p style={{fontFamily:'var(--app-font-serif)',fontSize:28}}>Nothing here yet.</p><Link className="button-quiet" href="/shop" data-testid="link-empty-shop" onClick={() => setCartOpen(false)}>Browse the objects</Link></div> : cart.map((item) => <div className="cart-row" key={item.product.id} data-testid={`cart-item-${item.product.id}`}>
          <img src={item.product.image_url} alt={item.product.name} /><div><h3>{item.product.name}</h3><p className="price">{money(item.product.price)}</p><div className="qty"><button aria-label={`Decrease ${item.product.name}`} data-testid={`button-decrease-${item.product.id}`} onClick={() => changeQty(item.product.id, -1)}><Minus size={12}/></button><span>{item.quantity}</span><button aria-label={`Increase ${item.product.name}`} data-testid={`button-increase-${item.product.id}`} onClick={() => changeQty(item.product.id, 1)}><Plus size={12}/></button></div></div><button className="icon-button" aria-label={`Remove ${item.product.name}`} data-testid={`button-remove-${item.product.id}`} onClick={() => setCart((current) => current.filter((entry) => entry.product.id !== item.product.id))}><X size={15}/></button>
        </div>)}</div>
        {cart.length > 0 && <div className="cart-foot"><div className="cart-total"><span>Subtotal</span><strong>{money(total)}</strong></div><button className="button-primary" style={{width:'100%'}} data-testid="button-checkout" onClick={() => { setCartOpen(false); setLocation('/account?checkout=1'); }}>Checkout · COD</button></div>}
      </div>
    </div>}
    {notice && <div className="toast-note" role="status" data-testid="status-notice">{notice}</div>}
  </div>;
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  return <article className="product-card" data-testid={`card-product-${product.id}`}>
    <div className="product-image"><img src={product.image_url} alt={product.name} />{product.is_featured && <span className="product-tag">Studio pick</span>}</div>
    <div className="product-info"><div><h3>{product.name}</h3><p>{product.category}</p></div><div style={{textAlign:'right'}}><div className="price">{money(product.price)}</div><button className="button-quiet" style={{marginTop:8}} data-testid={`button-add-${product.id}`} onClick={() => onAdd(product)}>Add to bag</button></div></div>
  </article>;
}

function WelcomeModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
    <div className="modal"><div className="modal-image"><img src={popupImage} alt="Zalv perfume surrounded by wood and roots" /></div><div className="modal-copy"><button className="icon-button modal-close" aria-label="Close welcome story" data-testid="button-close-welcome" onClick={onClose}><X size={18}/></button><span className="eyebrow">A note from Zalv</span><h2 id="welcome-title" className="display">Objects with a place to begin.</h2><p>Zalv is based in Jalandhar. We pick our leather there, from people who know what it should feel like, and give it life through objects meant to stay with you.</p><button className="button-primary" data-testid="button-welcome-shop" onClick={onClose}>Enter the collection <ArrowRight size={14}/></button><button className="button-quiet" style={{alignSelf:'flex-start',marginTop:18}} data-testid="button-welcome-dismiss" onClick={onClose}>Take me to the shop</button></div></div>
  </div>;
}

function Home({ products, onAdd }: { products: Product[]; onAdd: (product: Product) => void }) {
  const featured = products.filter((product) => product.is_featured).slice(0, 4);
  return <main>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">Made in Jalandhar · 31°19'N</span><h1 className="display">Wear what<br/><em>stays.</em></h1><p>Leather with a point of view. Fragrance with a memory. Zalv makes considered objects for people who would rather be remembered than noticed.</p><div style={{marginTop:30}}><Link className="button-primary" href="/shop" data-testid="button-hero-shop">Shop the collection <ArrowRight size={14}/></Link></div></div><div className="hero-media"><img src={heroImage} alt="Model wearing a deep oxblood leather jacket" /><div className="hero-stamp">Objects<br/>with a<br/>past +<br/>future</div></div></section>
    <div className="marquee"><div className="marquee-track"><span>Leather from Jalandhar</span><span>Small-batch fragrance</span><span>Made to be worn in</span><span>Leather from Jalandhar</span><span>Small-batch fragrance</span><span>Made to be worn in</span></div></div>
    <section className="page-wrap section"><div className="section-head"><div><span className="eyebrow">The edit / 01</span><h2 className="display">The ones<br/><em>we keep.</em></h2></div><Link className="button-quiet" href="/shop" data-testid="link-featured-all">View all objects <ArrowRight size={13}/></Link></div><div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd}/>)}</div></section>
    <section className="story-band"><img src={craftImage} alt="Leather artisan cutting a hide in a Jalandhar workshop" /><div className="story-copy"><span className="eyebrow" style={{color:'#f1c0a3'}}>The material / 02</span><h2 className="display">Picked there.<br/>Made here.</h2><p>Jalandhar has been working leather for generations. We stay close to that knowledge: choosing hides by hand, working with local makers, and leaving enough room for the material to speak.</p><a className="button-quiet" style={{color:'#f3eadf',alignSelf:'flex-start',marginTop:22}} href="#journal" data-testid="link-material-story">Read our material story <ArrowRight size={13}/></a></div></section>
    <section className="page-wrap section" style={{paddingBottom:0}}><div className="section-head"><div><span className="eyebrow">A quiet signature / 03</span><h2 className="display">Scent is<br/><em>texture too.</em></h2></div></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}><div style={{background:'#c9b09b',minHeight:330,overflow:'hidden'}}><img src={popupImage} alt="Zalv fragrance bottle and charred wood" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div><div style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'35px 5vw'}}><span className="eyebrow">Four compositions</span><p className="display" style={{fontSize:'clamp(28px,4vw,54px)',lineHeight:1.03,margin:'16px 0 22px'}}>A trace of smoke.<br/>A little rain.<br/>Something warm.</p><Link className="button-quiet" href="/shop/perfume" data-testid="link-perfume-edit">Discover perfume <ArrowRight size={13}/></Link></div></div></section>
  </main>;
}

function Shop({ products, onAdd }: { products: Product[]; onAdd: (product: Product) => void }) {
  const params = useParams<{ category?: string }>();
  const [filter, setFilter] = useState(params.category || 'all');
  useEffect(() => setFilter(params.category || 'all'), [params.category]);
  const visible = products.filter((p) => filter === 'all' || p.category === filter);
  return <main className="page-wrap"><div className="shop-header"><div><span className="eyebrow">The collection</span><h1 className="display">{filter === 'all' ? 'All objects.' : `${filter}.`}</h1></div><span className="eyebrow">{visible.length} pieces</span></div><div className="filters" aria-label="Product categories"><Link className={`filter ${filter === 'all' ? 'active' : ''}`} href="/shop" data-testid="filter-all">All</Link><Link className={`filter ${filter === 'perfume' ? 'active' : ''}`} href="/shop/perfume" data-testid="filter-perfume">Perfume</Link><Link className={`filter ${filter === 'shoes' ? 'active' : ''}`} href="/shop/shoes" data-testid="filter-shoes">Shoes</Link><Link className={`filter ${filter === 'jackets' ? 'active' : ''}`} href="/shop/jackets" data-testid="filter-jackets">Jackets</Link></div><div className="product-grid" style={{paddingTop:12}}>{visible.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd}/>)}</div></main>;
}

function Account({ user, setUser, cart, setCart }: { user: User | null; setUser: (user: User | null) => void; cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>> }) {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', address:'', city:'', pincode:'' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState<Order | null>(null);
  const checkout = new URLSearchParams(window.location.search).get('checkout') === '1';
  useEffect(() => { if (user) getOrders(user.id).then(setOrders); }, [user]);
  const submitAuth = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setMessage(''); try { const next = mode === 'login' ? await signIn(form.email, form.password) : await signUp(form.name, form.email, form.password); setUser(next); localStorage.setItem('zalv-session', JSON.stringify(next)); setMessage(mode === 'login' ? 'Welcome back.' : 'Your Zalv account is ready.'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Something went wrong.'); } finally { setBusy(false); } };
  const submitOrder = async (event: React.FormEvent) => { event.preventDefault(); if (!user) return; setBusy(true); try { const details: CheckoutDetails = { customer_name:form.name, customer_phone:form.phone, customer_email:form.email || user.email, shipping_address:form.address, city:form.city, pincode:form.pincode }; const order = await createOrder(user.id, details, cart); setOrders((current) => [order, ...current]); setCart([]); setMessage(`Order ${order.id} placed. We will call before dispatch.`); setOrderConfirmation(order); setLocation('/account'); } catch (error) { setMessage(error instanceof Error ? error.message : 'We could not place that order. Please try again.'); } finally { setBusy(false); } };
  if (!user) return <main className="page-wrap"><div className="form-page"><span className="eyebrow">{checkout ? 'Sign in to check out' : mode === 'login' ? 'Welcome back' : 'Join the studio'}</span><h1 className="display">{mode === 'login' ? 'Your objects await.' : 'Make room for better things.'}</h1><form onSubmit={submitAuth}><div className="field">{mode === 'signup' && <><label htmlFor="name">Name</label><input id="name" data-testid="input-name" required value={form.name} onChange={(e) => setForm({...form,name:e.target.value})}/></>}</div><div className="field"><label htmlFor="email">Email</label><input id="email" type="email" data-testid="input-email" required value={form.email} onChange={(e) => setForm({...form,email:e.target.value})}/></div><div className="field"><label htmlFor="password">Password</label><input id="password" type="password" data-testid="input-password" required minLength={6} value={form.password} onChange={(e) => setForm({...form,password:e.target.value})}/></div>{message && <p role="status" data-testid="status-auth-message" style={{color:'#8c4a2f',fontSize:13}}>{message}</p>}<button className="button-primary" style={{width:'100%',marginTop:5}} disabled={busy} data-testid="button-auth-submit">{busy ? 'Please wait' : mode === 'login' ? 'Sign in' : 'Create account'}</button></form><button className="button-quiet" style={{marginTop:25}} data-testid="button-toggle-auth" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Create a new account' : 'I already have an account'}</button></div></main>;
  if (checkout) return <><main className="page-wrap"><div className="form-page" style={{maxWidth:760}}><span className="eyebrow">Checkout / cash on delivery</span><h1 className="display">Where should<br/>we send it?</h1><form onSubmit={submitOrder}><div className="account-grid" style={{paddingTop:0,gap:30}}><div><div className="field"><label htmlFor="checkout-name">Full name</label><input id="checkout-name" required data-testid="input-checkout-name" value={form.name || user.name || ''} onChange={(e)=>setForm({...form,name:e.target.value})}/></div><div className="field"><label htmlFor="checkout-email">Email</label><input id="checkout-email" type="email" required data-testid="input-checkout-email" value={form.email || user.email || ''} onChange={(e)=>setForm({...form,email:e.target.value})}/></div><div className="field"><label htmlFor="checkout-phone">Phone</label><input id="checkout-phone" required data-testid="input-checkout-phone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})}/></div><div className="field"><label htmlFor="checkout-address">Address</label><textarea id="checkout-address" required rows={3} data-testid="input-checkout-address" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})}/></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><div className="field"><label htmlFor="checkout-city">City</label><input id="checkout-city" required data-testid="input-checkout-city" value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})}/></div><div className="field"><label htmlFor="checkout-pincode">Pincode</label><input id="checkout-pincode" required pattern="[0-9]{6}" data-testid="input-checkout-pincode" value={form.pincode} onChange={(e)=>setForm({...form,pincode:e.target.value})}/></div></div></div><div className="account-card"><h2>In your bag</h2>{cart.map((item)=><div className="order-row" key={item.product.id}><span>{item.product.name} × {item.quantity}</span><strong>{money(item.product.price*item.quantity)}</strong></div>)}<div className="order-row"><strong>Total</strong><strong>{money(cart.reduce((sum,item)=>sum+item.product.price*item.quantity,0))}</strong></div><p style={{fontSize:12,lineHeight:1.6,color:'#6b625b'}}>Payment is collected on delivery. No card details needed.</p></div></div>{message && <p role="status" data-testid="status-order-message" style={{color:'#8c4a2f',fontSize:13}}>{message}</p>}<button className="button-primary" disabled={busy || cart.length === 0} data-testid="button-place-order">{busy ? 'Placing order' : 'Place order · COD'}</button></form></div></main>{orderConfirmation && <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="order-confirmation-title"><div className="modal modal-confirmation"><div className="modal-copy"><button className="icon-button modal-close" aria-label="Close order confirmation" data-testid="button-close-order-confirmation" onClick={() => setOrderConfirmation(null)}><X size={18}/></button><span className="eyebrow">Thank you</span><h2 id="order-confirmation-title" className="display">Your order is placed.</h2><p>Order <strong>{orderConfirmation.id}</strong> is confirmed. We will call on the number you shared before dispatch and collect payment on delivery.</p><button className="button-primary" data-testid="button-confirm-order-close" onClick={() => setOrderConfirmation(null)}>Continue browsing <ArrowRight size={14}/></button></div></div></div>}</>;
  if (!user) return null;
  return <main className="page-wrap"><div className="shop-header"><div><span className="eyebrow">The private view</span><h1 className="display">Hello,<br/>{user.name.split(' ')[0]}.</h1></div><button className="button-quiet" data-testid="button-signout" onClick={async()=>{await signOut();setUser(null);}}>Sign out</button></div><div className="account-grid"><section className="account-card"><h2>Profile</h2><p data-testid="text-profile-email" style={{fontSize:13}}>{user.email}</p><p style={{fontSize:13,color:'#6b625b'}}>Member since today. Your saved details will make future orders quicker.</p><Link className="button-quiet" href="/shop" data-testid="link-account-shop">Continue shopping <ArrowRight size={13}/></Link></section><section className="account-card"><h2>Order history</h2>{orders.length===0 ? <p data-testid="text-orders-empty" style={{fontSize:13,color:'#6b625b'}}>Your first Zalv object is still out there.</p> : orders.map((order)=><div className="order-row" key={order.id} data-testid={`order-${order.id}`}><div><strong>{order.id}</strong><div style={{fontSize:11,color:'#6b625b',marginTop:6}}>{new Date(order.created_at).toLocaleDateString('en-IN')}</div></div><div style={{textAlign:'right'}}><strong>{money(order.total)}</strong><div className="status">{order.status}</div></div></div>)}</section></div></main>;
}

function Admin({ user }: { user: User | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (!user?.isAdmin) { setLoaded(true); return; } getAllOrders().then((data) => { setOrders(data); setLoaded(true); }); }, [user?.isAdmin]);
  if (!user || !user.isAdmin) return <main className="page-wrap notfound"><div><span className="eyebrow">Restricted room</span><h1 className="display">No entry.</h1><p>Sign in with an admin account to manage orders.</p><Link className="button-primary" href="/account" data-testid="link-admin-account">Go to account</Link></div></main>;
  return <main className="page-wrap"><div className="shop-header"><div><span className="eyebrow">Studio desk</span><h1 className="display">Orders.</h1></div><span className="eyebrow">{orders.length} total</span></div>{!loaded ? <div style={{padding:'50px 0'}}>Loading order book…</div> : orders.length === 0 ? <div className="notfound" style={{minHeight:300}}><p data-testid="text-admin-empty">No orders yet. The ledger is quiet.</p></div> : <table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Destination</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order)=><tr key={order.id} data-testid={`admin-order-${order.id}`}><td><strong>{order.id}</strong><br/><span style={{fontSize:10,color:'#786e66'}}>{new Date(order.created_at).toLocaleDateString('en-IN')}</span></td><td>{order.customer_name}<br/><span style={{fontSize:11,color:'#786e66'}}>{order.customer_phone}</span></td><td>{order.city}, {order.pincode}</td><td>{money(order.total)}</td><td><select aria-label={`Change status for ${order.id}`} data-testid={`select-status-${order.id}`} value={order.status} onChange={async(e)=>{const nextStatus = e.target.value as 'confirmed' | 'shipped' | 'delivered' | 'cancelled'; await updateOrderStatus(order.id,nextStatus);setOrders((current)=>current.map((item)=>item.id===order.id?{...item,status:nextStatus}:item));}}><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td></tr>)}</tbody></table>}</main>;
}

function NotFound() { return <main className="page-wrap notfound"><div><span className="eyebrow">That page wandered off</span><h1 className="display">404</h1><p>There is nothing here, but there is more to find.</p><Link className="button-primary" href="/" data-testid="link-notfound-home">Back to Zalv</Link></div></main>; }

function Router() {
  const [products, setProducts] = useState<Product[]>(catalog);
  const [cart, setCart] = useState<CartItem[]>(() => { try { return JSON.parse(localStorage.getItem('zalv-cart') || '[]') as CartItem[]; } catch { return []; } });
  const [user, setUser] = useState<User | null>(() => { try { return JSON.parse(localStorage.getItem('zalv-session') || 'null') as User | null; } catch { return null; } });
  const [welcome, setWelcome] = useState(() => !localStorage.getItem('zalv-welcomed'));
  useEffect(() => { getProducts().then(setProducts); }, []);
  const closeWelcome = () => { localStorage.setItem('zalv-welcomed', '1'); setWelcome(false); };
  const add = (product: Product) => setCart((current) => { const found=current.find((item)=>item.product.id===product.id); return found ? current.map((item)=>item.product.id===product.id?{...item,quantity:item.quantity+1}:item) : [...current,{product,quantity:1}]; });
  return <Shell cart={cart} setCart={setCart} user={user} onSignOut={()=>{setUser(null);localStorage.removeItem('zalv-session');}}>
    <Switch>
      <Route path="/" component={() => <Home products={products} onAdd={add}/>}/>
      <Route path="/shop/:category" component={() => <Shop products={products} onAdd={add}/>}/>
      <Route path="/shop" component={() => <Shop products={products} onAdd={add}/>}/>
      <Route path="/account" component={() => <Account user={user} setUser={(next)=>{setUser(next); if(next) localStorage.setItem('zalv-session',JSON.stringify(next));}} cart={cart} setCart={setCart}/>}/>
      <Route path="/admin" component={() => <Admin user={user}/>}/>
      <Route component={NotFound}/>
    </Switch>
    {welcome && <WelcomeModal onClose={closeWelcome}/>}
  </Shell>;
}

function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><Router/></ErrorBoundary></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>; }

export default App;