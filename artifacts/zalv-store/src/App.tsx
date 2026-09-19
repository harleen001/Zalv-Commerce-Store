import { useEffect, useState, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { ArrowDown, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, CircleUserRound, LayoutDashboard, Menu, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import logo from '@assets/zalv-logo.png';
import bootsImage from '@/assets/zalv-boots.jpg';
import jacketImage from '@/assets/zalv-jacket.jpg';
import popupImage from '@/assets/zalv-perfume.jpg';
import perfumeImage from '@/assets/zalv-perfume.jpg';
import heroImage from '@/assets/zalv-hero.jpg';
import craftImage from '@/assets/zalv-craft.jpg';
import { AboutPage, INFO_PATHS, PolicyPage, ServiceCards, SiteFooter, SiteHeader, SizeGuidePage } from '@/site/SitePages';
import { privacyDoc, returnsDoc, shippingDoc, termsDoc } from '@/site/content';
import {
  catalog, createOrder, getAllOrders, getAllUsers, getOrders, getProducts, signIn, signOut, signUp, updateOrderStatus,
  type CartItem, type CheckoutDetails, type Order, type Product, type Profile,
} from '@/lib/store';

const queryClient = new QueryClient();
type User = { id: string; email: string; name: string; isAdmin?: boolean };
type AddToCart = (product: Product, size?: string) => void;
const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

function money(value: number) { return `₹${value.toLocaleString('en-IN')}`; }
function cartItemKey(item: CartItem) { return `${item.product.id}-${item.size || 'one-size'}`; }

function Shell({ children, cart, setCart, user, onSignOut, showChrome = true }: { children: ReactNode; cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>>; user: User | null; onSignOut: () => void; showChrome?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [, setLocation] = useLocation();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2200); };
  const changeQty = (id: string, size: string | undefined, delta: number) => setCart((current) => current.map((item) => cartItemKey(item) === `${id}-${size || 'one-size'}` ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  const add = (product: Product, size?: string) => { setCart((current) => { const found = current.find((item) => item.product.id === product.id && item.size === size); return found ? current.map((item) => item.product.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1, size }]; }); flash(`${product.name} added to bag`); };
  useEffect(() => { localStorage.setItem('zalv-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener('zalv-open-cart', openCart);
    return () => window.removeEventListener('zalv-open-cart', openCart);
  }, []);
  return <div className="zalv-shell">
    {showChrome && <div className="topline">Complimentary delivery across India · Cash on delivery available</div>}
    {showChrome && <header className="site-header">
      <div className="header-inner">
        <button className="menu-button" aria-label="Open navigation" data-testid="button-menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={21} strokeWidth={1.5} /></button>
        <Link href="/" data-testid="link-logo"><img className="brand-logo" src={logo} alt="Zalv" /></Link>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <Link href="/shop" data-testid="link-shop">Shop all</Link>
          <Link href="/shop/perfume" data-testid="link-perfume">Perfume</Link>
          <Link href="/shop/shoes" data-testid="link-shoes">Shoes</Link>
          <Link href="/shop/jackets" data-testid="link-jackets">Jackets</Link>
          <Link href="/about" data-testid="link-about" onClick={() => setMenuOpen(false)}>About us</Link>
        </nav>
        <div className="header-actions">
          <Link className="header-action" href="/admin" aria-label="Owner desk" data-testid="link-owner"><LayoutDashboard size={18} strokeWidth={1.4} /><span>Owner</span></Link>
          <Link className="header-action" href="/account" aria-label="Account" data-testid="link-account"><CircleUserRound size={18} strokeWidth={1.4} /><span>{user ? user.name.split(' ')[0] : 'Account'}</span></Link>
          <button className="header-action" aria-label="Open shopping bag" data-testid="button-cart" onClick={() => setCartOpen(true)}><ShoppingBag size={18} strokeWidth={1.4} /><span>Bag</span><b className="cart-count" data-testid="text-cart-count">{count}</b></button>
        </div>
      </div>
    </header>}
    {children}
    {showChrome && <footer className="footer" id="journal">
      <div className="footer-inner">
        <div><img className="footer-logo" src={logo} alt="Zalv" /><p style={{ maxWidth:260, color:'#b8aea5', lineHeight:1.7, fontSize:13, marginTop:20 }}>Objects for the way you move through the world. Made slowly in Jalandhar.</p></div>
        <div><h4>Explore</h4><Link href="/shop">Shop all</Link><Link href="/shop/perfume">Perfume</Link><Link href="/shop/shoes">Leather shoes</Link><Link href="/shop/jackets">Leather jackets</Link></div>
        <div><h4>Notes</h4><Link href="/about">About us</Link><Link href="/shipping-policy">Shipping policy</Link><Link href="/return-policy">Return &amp; exchange</Link><Link href="/size-guide">Size guide</Link><Link href="/privacy-policy">Privacy policy</Link><Link href="/terms-and-conditions">Terms &amp; conditions</Link></div>
      </div>
      <div className="footer-bottom"><span>© 2024 Zalv Objects</span><span>Made in Punjab, India</span></div>
    </footer>}
    {cartOpen && <div className="drawer-overlay" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="cart-drawer">
        <div className="drawer-head"><h2>Your bag <small style={{font:'11px var(--app-font-mono)', color:'#8c4a2f'}}>({count})</small></h2><button className="icon-button" aria-label="Close bag" data-testid="button-close-cart" onClick={() => setCartOpen(false)}><X size={20} /></button></div>
        <div className="cart-items">{cart.length === 0 ? <div style={{padding:'65px 0', textAlign:'center'}}><p style={{fontFamily:'var(--app-font-serif)',fontSize:28}}>Nothing here yet.</p><Link className="button-quiet" href="/shop" data-testid="link-empty-shop" onClick={() => setCartOpen(false)}>Browse the objects</Link></div> : cart.map((item) => <div className="cart-row" key={cartItemKey(item)} data-testid={`cart-item-${item.product.id}`}>
          <img src={item.product.image_url} alt={item.product.name} /><div><h3>{item.product.name}</h3>{item.size && <p style={{fontSize:11,color:'#786e66',margin:'5px 0 0'}}>Size {item.size}</p>}<p className="price">{money(item.product.price)}</p><div className="qty"><button aria-label={`Decrease ${item.product.name}`} data-testid={`button-decrease-${item.product.id}`} onClick={() => changeQty(item.product.id, item.size, -1)}><Minus size={12}/></button><span>{item.quantity}</span><button aria-label={`Increase ${item.product.name}`} data-testid={`button-increase-${item.product.name}`} onClick={() => changeQty(item.product.id, item.size, 1)}><Plus size={12}/></button></div></div><button className="icon-button" aria-label={`Remove ${item.product.name}`} data-testid={`button-remove-${item.product.id}`} onClick={() => setCart((current) => current.filter((entry) => cartItemKey(entry) !== cartItemKey(item)))}><X size={15}/></button>
        </div>)}</div>
        {cart.length > 0 && <div className="cart-foot"><div className="cart-total"><span>Subtotal</span><strong>{money(total)}</strong></div><button className="button-primary" style={{width:'100%'}} data-testid="button-checkout" onClick={() => { setCartOpen(false); setLocation('/account?checkout=1'); }}>Checkout · COD</button></div>}
      </div>
    </div>}
    {notice && <div className="toast-note" role="status" data-testid="status-notice">{notice}</div>}
  </div>;
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: AddToCart }) {
  const [size, setSize] = useState('');
  const needsSize = product.category !== 'perfume';
  return <article className="product-card" data-testid={`card-product-${product.id}`}>
    <div className="product-image"><img src={product.image_url} alt={product.name} />{product.is_featured && <span className="product-tag">Studio pick</span>}</div>
    <div className="product-info"><div><h3>{product.name}</h3><p>{product.category}</p></div><div style={{textAlign:'right'}}><div className="price">{money(product.price)}</div>{needsSize && <select aria-label={`Select size for ${product.name}`} value={size} onChange={(event) => setSize(event.target.value)} style={{marginTop:8,padding:'6px',background:'#f4efe7',border:'1px solid #c5bbae',fontSize:11}}><option value="">Size</option>{PRODUCT_SIZES.map((option) => <option key={option} value={option}>{option}</option>)}</select>}<button className="button-quiet" style={{marginTop:8,display:'block',marginLeft:'auto'}} disabled={needsSize && !size} data-testid={`button-add-${product.id}`} onClick={() => onAdd(product, size || undefined)}>Add to bag</button></div></div>
  </article>;
}

function WelcomeModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
    <div className="modal"><div className="modal-image"><img src={popupImage} alt="Zalv perfume surrounded by wood and roots" /></div><div className="modal-copy"><button className="icon-button modal-close" aria-label="Close welcome story" data-testid="button-close-welcome" onClick={onClose}><X size={18}/></button><span className="eyebrow">A note from Zalv</span><h2 id="welcome-title" className="display">Objects with a place to begin.</h2><p>Zalv is based in Jalandhar. We pick our leather there, from people who know what it should feel like, and give it life through objects meant to stay with you.</p><button className="button-primary" data-testid="button-welcome-shop" onClick={onClose}>Enter the collection <ArrowRight size={14}/></button><button className="button-quiet" style={{alignSelf:'flex-start',marginTop:18}} data-testid="button-welcome-dismiss" onClick={onClose}>Take me to the shop</button></div></div>
  </div>;
}

type HomeCategory = 'Jackets' | 'Boots' | 'Perfume';
type HomeProduct = { source: Product; name: string; category: HomeCategory; image: string; note: string; tag?: string };

function Home({ products, onAdd, cartCount }: { products: Product[]; onAdd: AddToCart; cartCount: number }) {
  const [filter, setFilter] = useState<'All' | HomeCategory>('All');
  const [selected, setSelected] = useState<HomeProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [signedUp, setSignedUp] = useState(false);
  const grouped = (['jackets', 'shoes', 'perfume'] as const).flatMap((category) => products.filter((product) => product.category === category).slice(0, 2));
  const homeProducts: HomeProduct[] = grouped.map((product) => ({
    source: product,
    name: product.name,
    category: product.category === 'shoes' ? 'Boots' : product.category === 'jackets' ? 'Jackets' : 'Perfume',
    image: product.image_url,
    note: product.description,
    tag: product.is_featured ? 'STUDIO PICK' : undefined,
  }));
  const shownProducts = filter === 'All' ? homeProducts : homeProducts.filter((product) => product.category === filter);
  const categoryImages: Record<HomeCategory, string> = { Jackets: jacketImage, Boots: bootsImage, Perfume: perfumeImage };
  const selectCategory = (category: HomeCategory) => {
    setFilter(category);
    document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return <main className="original-home">
    <SiteHeader cartCount={cartCount} />
    <section className="hero" id="top"><img className="hero-image" src={heroImage} alt="Model wearing ZALV oxblood leather jacket" /><div className="hero-shade" /><div className="hero-content"><p className="eyebrow light">AUTUMN / WINTER 2026 · JALANDHAR</p><h1>Fearless<br /><em>objects.</em></h1><p className="hero-intro">Leather outerwear, resoleable boots and dry-down perfumes. Made in small batches for people who keep things.</p><a className="text-link light" href="#shop">Shop the drop <ArrowDown /></a></div><p className="hero-index">COLLECTION 01 / 19 PIECES</p></section>
    <section className="manifesto" id="new"><p className="eyebrow">OUR POSITION</p><p className="manifesto-copy">Not trend. Not nostalgia.<br />Objects with the courage to <em>age.</em></p><div className="manifesto-notes"><span>Full-grain hides</span><span>Goodyear welts</span><span>Concentrated parfum</span><span>Made to be re-worn</span></div></section>
    <section className="categories" aria-labelledby="category-title"><div className="section-heading"><p className="eyebrow">01 / DISCIPLINES</p><h2 id="category-title">Three ways<br />to leave a mark.</h2><p>One workshop philosophy, expressed in hide, sole, and scent.</p></div><div className="category-grid">{(Object.keys(categoryImages) as HomeCategory[]).map((category, index) => <button className="category-tile" key={category} onClick={() => selectCategory(category)}><img src={categoryImages[category]} alt={`Shop ZALV ${category.toLowerCase()}`} /><span className="category-number">0{index + 1}</span><span className="category-name">{category}</span><ArrowRight /></button>)}</div></section>
    <section className="shop" id="shop" aria-labelledby="shop-title"><div className="shop-top"><div><p className="eyebrow">02 / CURRENT RANGE</p><h2 id="shop-title">Made now.</h2></div><p>Twelve pieces, restocked in small runs.<br />No permanent collection.</p></div><div className="filter-row" role="group" aria-label="Product filters">{(['All', 'Jackets', 'Boots', 'Perfume'] as const).map((option) => <button key={option} className={filter === option ? 'active' : ''} onClick={() => setFilter(option)}>{option}</button>)}</div><div className="product-grid">{shownProducts.map((product, index) => <article className={`product-card ${index === 0 ? 'featured-product' : ''}`} key={product.source.id}><button className="product-media" onClick={() => { setSelected(product); setSelectedSize(''); }} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} />{product.tag && <span className="product-tag">{product.tag}</span>}<span className="quick-view">Quick view <ArrowRight /></span></button><div className="product-info"><div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div><p>{money(product.source.price)}</p></div></article>)}</div></section>
    <section className="craft" id="craft"><div className="craft-image"><img src={craftImage} alt="Leather artisan hand-cutting a hide in the ZALV workshop" /><span>JALANDHAR, PUNJAB<br />31.3260° N, 75.5762° E</span></div><div className="craft-copy"><p className="eyebrow light">03 / THE WORKSHOP</p><h2>Cut around<br />the scars.</h2><p>Every hide tells us where it wants to be cut. We follow its grain, keep its history visible, and waste less than six percent per jacket.</p><Link className="text-link light" href="/about">Meet the makers <ArrowRight /></Link></div></section>
    <section className="scent" id="scent"><img src={perfumeImage} alt="ZALV Burnt Vetiver perfume" /><div className="scent-copy"><p className="eyebrow">04 / THE SCENT LIBRARY</p><h2>What leather<br />remembers.</h2><p>Four concentrated eau de parfums built around smoke, leather, oud, vetiver and tobacco. Close to the body. Hard to forget.</p><button className="solid-button" onClick={() => selectCategory('Perfume')}>Discover the scents <ArrowRight /></button></div></section>
    <ServiceCards />
    <section className="newsletter"><p className="eyebrow light">PRIVATE LIST</p><h2>{signedUp ? "You're on the list." : 'First to know. Last to follow.'}</h2>{!signedUp && <form onSubmit={(event) => { event.preventDefault(); setSignedUp(true); }}><label className="sr-only" htmlFor="home-email">Email address</label><input id="home-email" type="email" placeholder="Email address" required /><button type="submit" aria-label="Join mailing list"><ArrowRight /></button></form>}{signedUp && <Check className="signup-check" aria-hidden="true" />}</section>
    <SiteFooter />
    {selected && <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={selected.name} onClick={() => setSelected(null)}><div className="quick-modal" onClick={(event) => event.stopPropagation()}><button className="icon-button modal-close" aria-label="Close quick view" onClick={() => setSelected(null)}><X /></button><img src={selected.image} alt={selected.name} /><div className="modal-copy"><p className="eyebrow">{selected.category}</p><h2>{selected.name}</h2><p className="modal-price">{money(selected.source.price)}</p><p>{selected.note}</p>{selected.category !== 'Perfume' && <div className="size-row"><span>SELECT SIZE</span>{PRODUCT_SIZES.map((size) => <button className={selectedSize === size ? 'active' : ''} key={size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div>}<button className="solid-button full" disabled={selected.category !== 'Perfume' && !selectedSize} onClick={() => { onAdd(selected.source, selectedSize || undefined); setSelected(null); }}>Add to bag <ArrowRight /></button></div></div></div>}
  </main>;
}

function Shop({ products, onAdd }: { products: Product[]; onAdd: AddToCart }) {
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
  if (!user) return <main className="page-wrap"><div className="form-page"><span className="eyebrow">{checkout ? 'Sign in to check out' : mode === 'login' ? 'Welcome back' : 'Join the studio'}</span><h1 className="display">{mode === 'login' ? 'Your objects await.' : 'Make room for better things.'}</h1><form onSubmit={submitAuth}><div className="field">{mode === 'signup' && <><label htmlFor="name">Name</label><input id="name" autoComplete="name" data-testid="input-name" required value={form.name} onChange={(e) => setForm({...form,name:e.target.value})}/></>}</div><div className="field"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" data-testid="input-email" required value={form.email} onChange={(e) => setForm({...form,email:e.target.value})}/></div><div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} data-testid="input-password" required minLength={6} value={form.password} onChange={(e) => setForm({...form,password:e.target.value})}/></div>{message && <p role="status" data-testid="status-auth-message" style={{color:'#8c4a2f',fontSize:13}}>{message}</p>}<button className="button-primary" style={{width:'100%',marginTop:5}} disabled={busy} data-testid="button-auth-submit">{busy ? 'Please wait' : mode === 'login' ? 'Sign in' : 'Create account'}</button></form><button className="button-quiet" style={{marginTop:25}} data-testid="button-toggle-auth" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Create a new account' : 'I already have an account'}</button></div></main>;
  if (checkout) return <><main className="page-wrap"><div className="form-page" style={{maxWidth:760}}><span className="eyebrow">Checkout / cash on delivery</span><h1 className="display">Where should<br/>we send it?</h1><form onSubmit={submitOrder}><div className="account-grid" style={{paddingTop:0,gap:30}}><div><div className="field"><label htmlFor="checkout-name">Full name</label><input id="checkout-name" required data-testid="input-checkout-name" value={form.name || user.name || ''} onChange={(e)=>setForm({...form,name:e.target.value})}/></div><div className="field"><label htmlFor="checkout-email">Email</label><input id="checkout-email" type="email" required data-testid="input-checkout-email" value={form.email || user.email || ''} onChange={(e)=>setForm({...form,email:e.target.value})}/></div><div className="field"><label htmlFor="checkout-phone">Phone</label><input id="checkout-phone" required data-testid="input-checkout-phone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})}/></div><div className="field"><label htmlFor="checkout-address">Address</label><textarea id="checkout-address" required rows={3} data-testid="input-checkout-address" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})}/></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><div className="field"><label htmlFor="checkout-city">City</label><input id="checkout-city" required data-testid="input-checkout-city" value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})}/></div><div className="field"><label htmlFor="checkout-pincode">Pincode</label><input id="checkout-pincode" required pattern="[0-9]{6}" data-testid="input-checkout-pincode" value={form.pincode} onChange={(e)=>setForm({...form,pincode:e.target.value})}/></div></div></div><div className="account-card"><h2>In your bag</h2>{cart.map((item)=><div className="order-row" key={item.product.id}><span>{item.product.name} × {item.quantity}</span><strong>{money(item.product.price*item.quantity)}</strong></div>)}<div className="order-row"><strong>Total</strong><strong>{money(cart.reduce((sum,item)=>sum+item.product.price*item.quantity,0))}</strong></div><p style={{fontSize:12,lineHeight:1.6,color:'#6b625b'}}>Payment is collected on delivery. No card details needed.</p></div></div>{message && <p role="status" data-testid="status-order-message" style={{color:'#8c4a2f',fontSize:13}}>{message}</p>}<button className="button-primary" disabled={busy || cart.length === 0} data-testid="button-place-order">{busy ? 'Placing order' : 'Place order · COD'}</button></form></div></main>{orderConfirmation && <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="order-confirmation-title"><div className="modal modal-confirmation"><div className="modal-copy"><button className="icon-button modal-close" aria-label="Close order confirmation" data-testid="button-close-order-confirmation" onClick={() => setOrderConfirmation(null)}><X size={18}/></button><span className="eyebrow">Thank you</span><h2 id="order-confirmation-title" className="display">Your order is placed.</h2><p>Order <strong>{orderConfirmation.id}</strong> is confirmed. We will call on the number you shared before dispatch and collect payment on delivery.</p><button className="button-primary" data-testid="button-confirm-order-close" onClick={() => setOrderConfirmation(null)}>Continue browsing <ArrowRight size={14}/></button></div></div></div>}</>;
  if (!user) return null;
  return <main className="page-wrap"><div className="shop-header"><div><span className="eyebrow">The private view</span><h1 className="display">Hello,<br/>{user.name.split(' ')[0]}.</h1></div><button className="button-quiet" data-testid="button-signout" onClick={async()=>{await signOut();setUser(null);}}>Sign out</button></div><div className="account-grid"><section className="account-card"><h2>Profile</h2><p data-testid="text-profile-email" style={{fontSize:13}}>{user.email}</p><p style={{fontSize:13,color:'#6b625b'}}>Member since today. Your saved details will make future orders quicker.</p><Link className="button-quiet" href="/shop" data-testid="link-account-shop">Continue shopping <ArrowRight size={13}/></Link></section><section className="account-card"><h2>Order history</h2>{orders.length===0 ? <p data-testid="text-orders-empty" style={{fontSize:13,color:'#6b625b'}}>Your first Zalv object is still out there.</p> : orders.map((order)=><div className="order-row" key={order.id} data-testid={`order-${order.id}`}><div><strong>{order.id}</strong><div style={{fontSize:11,color:'#6b625b',marginTop:6}}>{new Date(order.created_at).toLocaleDateString('en-IN')}</div></div><div style={{textAlign:'right'}}><strong>{money(order.total)}</strong><div className="status">{order.status}</div></div></div>)}</section></div></main>;
}

function Admin({ user }: { user: User | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (!user?.isAdmin) { setLoaded(true); return; } Promise.all([getAllOrders(), getAllUsers()]).then(([orderData, userData]) => { setOrders(orderData); setUsers(userData); setLoaded(true); }); }, [user?.isAdmin]);
  if (!user || !user.isAdmin) return <main className="page-wrap notfound"><div><span className="eyebrow">Restricted room</span><h1 className="display">No entry.</h1><p>Sign in with an admin account to manage orders.</p><Link className="button-primary" href="/account" data-testid="link-admin-account">Go to account</Link></div></main>;
  const userRows = users.map((profile) => {
    const userOrders = orders.filter((order) => order.user_id === profile.id);
    const latestOrder = userOrders[0];
    return { profile, orderCount: userOrders.length, latestOrder };
  });
  return <main className="page-wrap"><div className="shop-header"><div><span className="eyebrow">Studio desk</span><h1 className="display">Owner desk.</h1></div><span className="eyebrow">{users.length} users · {orders.length} orders</span></div>{!loaded ? <div style={{padding:'50px 0'}}>Loading customer book…</div> : <><section className="admin-section"><div className="admin-section-head"><div><span className="eyebrow">Customer book</span><h2>Registered users.</h2></div><span className="eyebrow">{users.length} registered</span></div>{users.length === 0 ? <p className="admin-empty" data-testid="text-admin-users-empty">No registered users yet.</p> : <table className="admin-table admin-users-table"><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Orders</th><th>Latest order</th></tr></thead><tbody>{userRows.map(({ profile, orderCount, latestOrder }) => <tr key={profile.id} data-testid={`admin-user-${profile.id}`}><td><strong>{profile.full_name || 'Unnamed customer'}</strong></td><td>{profile.phone || latestOrder?.customer_phone || '—'}</td><td>{profile.email || latestOrder?.customer_email || '—'}</td><td>{orderCount}</td><td>{latestOrder ? <><strong>{latestOrder.id}</strong><br/><span style={{fontSize:10,color:'#786e66'}}>{new Date(latestOrder.created_at).toLocaleDateString('en-IN')}</span></> : <span style={{color:'#786e66'}}>No orders yet</span>}</td></tr>)}</tbody></table>}</section><section className="admin-section"><div className="admin-section-head"><div><span className="eyebrow">Fulfillment book</span><h2>Orders.</h2></div><span className="eyebrow">{orders.length} total</span></div>{orders.length === 0 ? <p className="admin-empty" data-testid="text-admin-empty">No orders yet. The ledger is quiet.</p> : <table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Items to ship</th><th>Destination</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order)=><tr key={order.id} data-testid={`admin-order-${order.id}`}><td><strong>{order.id}</strong><br/><span style={{fontSize:10,color:'#786e66'}}>{new Date(order.created_at).toLocaleDateString('en-IN')}</span></td><td><strong>{order.customer_name}</strong><br/><span style={{fontSize:11,color:'#786e66'}}>{order.customer_phone}<br/>{order.customer_email}</span></td><td><div className="admin-order-items" data-testid={`admin-items-${order.id}`}>{order.items?.length ? order.items.map((item, index) => <div className="admin-order-item" key={`${item.order_id}-${item.product_id}-${item.size || 'one-size'}-${index}`}><strong>{item.product_name}</strong><span>{item.size ? `Size ${item.size}` : 'One size'} · Qty {item.quantity}</span><span>{money(item.unit_price)} each</span></div>) : <span style={{fontSize:11,color:'#786e66'}}>Item details unavailable for this order.</span>}</div></td><td><div className="admin-destination"><strong>{order.shipping_address}</strong><span>{order.city}, {order.pincode}</span></div></td><td>{money(order.total)}</td><td><select aria-label={`Change status for ${order.id}`} data-testid={`select-status-${order.id}`} value={order.status} onChange={async(e)=>{const nextStatus = e.target.value as 'confirmed' | 'shipped' | 'delivered' | 'cancelled'; await updateOrderStatus(order.id,nextStatus);setOrders((current)=>current.map((item)=>item.id===order.id?{...item,status:nextStatus}:item));}}><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td></tr>)}</tbody></table>}</section></>}</main>;
}

function NotFound() { return <main className="page-wrap notfound"><div><span className="eyebrow">That page wandered off</span><h1 className="display">404</h1><p>There is nothing here, but there is more to find.</p><Link className="button-primary" href="/" data-testid="link-notfound-home">Back to Zalv</Link></div></main>; }

function Router() {
  const [products, setProducts] = useState<Product[]>(catalog);
  const [cart, setCart] = useState<CartItem[]>(() => { try { return JSON.parse(localStorage.getItem('zalv-cart') || '[]') as CartItem[]; } catch { return []; } });
  const [user, setUser] = useState<User | null>(() => { try { return JSON.parse(localStorage.getItem('zalv-session') || 'null') as User | null; } catch { return null; } });
  const [welcome, setWelcome] = useState(() => !localStorage.getItem('zalv-welcomed'));
  const [location] = useLocation();
  useEffect(() => { getProducts().then(setProducts); }, []);
  useEffect(() => { if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' }); }, [location]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const closeWelcome = () => { localStorage.setItem('zalv-welcomed', '1'); setWelcome(false); };
  const add = (product: Product, size?: string) => setCart((current) => { const found=current.find((item)=>item.product.id===product.id && item.size===size); return found ? current.map((item)=>item.product.id===product.id && item.size===size?{...item,quantity:item.quantity+1}:item) : [...current,{product,quantity:1,size}]; });
  return <Shell cart={cart} setCart={setCart} user={user} showChrome={location !== '/' && !INFO_PATHS.includes(location)} onSignOut={()=>{setUser(null);localStorage.removeItem('zalv-session');}}>
    <Switch>
       <Route path="/" component={() => <Home products={products} onAdd={add} cartCount={cartCount}/>}/>
      <Route path="/about"><AboutPage cartCount={cartCount}/></Route>
      <Route path="/size-guide"><SizeGuidePage cartCount={cartCount}/></Route>
      <Route path={shippingDoc.path}><PolicyPage doc={shippingDoc} cartCount={cartCount}/></Route>
      <Route path={returnsDoc.path}><PolicyPage doc={returnsDoc} cartCount={cartCount}/></Route>
      <Route path={privacyDoc.path}><PolicyPage doc={privacyDoc} cartCount={cartCount}/></Route>
      <Route path={termsDoc.path}><PolicyPage doc={termsDoc} cartCount={cartCount}/></Route>
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