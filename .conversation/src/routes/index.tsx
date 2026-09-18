import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import heroImage from "../assets/zalv-hero.jpg";
import jacketImage from "../assets/zalv-jacket.jpg";
import bootsImage from "../assets/zalv-boots.jpg";
import perfumeImage from "../assets/zalv-perfume.jpg";
import craftImage from "../assets/zalv-craft.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZALV — Fearless Objects" },
      {
        name: "description",
        content:
          "Leather outerwear, resoleable boots and concentrated perfume, made in small batches in Jalandhar.",
      },
      { property: "og:title", content: "ZALV — Fearless Objects" },
      {
        property: "og:description",
        content: "Objects built to outlast the season. Made to be worn, repaired, and worn again.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Category = "Jackets" | "Boots" | "Perfume";
type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  image: string;
  note: string;
  tag?: string;
};

const products: Product[] = [
  { id: 1, name: "The Katra Jacket", category: "Jackets", price: 680, image: jacketImage, note: "Vegetable-tanned lambskin. Cut close through the body and finished with solid brass hardware.", tag: "NEW" },
  { id: 2, name: "The Grand Trunk Boot", category: "Boots", price: 420, image: bootsImage, note: "Full-grain calf, Goodyear welted on a stacked leather sole. Built to be resoled for decades.", tag: "RESTOCKED" },
  { id: 3, name: "No. 01 — Burnt Vetiver", category: "Perfume", price: 145, image: perfumeImage, note: "A dry concentration of vetiver root, smoked cedar, black tea and worn leather." },
  { id: 4, name: "The Highway Jacket", category: "Jackets", price: 720, image: heroImage, note: "Heavy horsehide shaped over time by the wearer. Numbered and made in runs of twenty." },
  { id: 5, name: "The Jodhpur Boot", category: "Boots", price: 390, image: bootsImage, note: "A clean ankle boot in oiled leather with a storm welt and replaceable heel." },
  { id: 6, name: "No. 04 — After Tobacco", category: "Perfume", price: 160, image: perfumeImage, note: "Tobacco leaf, clove, hay and a restrained trace of oud. Extrait concentration.", tag: "LIMITED" },
];

const categoryImages: Record<Category, string> = {
  Jackets: jacketImage,
  Boots: bootsImage,
  Perfume: perfumeImage,
};

function Index() {
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [signedUp, setSignedUp] = useState(false);

  const shownProducts = useMemo(
    () => (filter === "All" ? products : products.filter((product) => product.category === filter)),
    [filter],
  );

  return (
    <main>
      <div className="announce">MEMBER DAYS · COMPLIMENTARY SHIPPING OVER $150</div>
      <header className="site-header">
        <div className="nav-wrap">
          <button className="icon-button mobile-only" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu /></button>
          <a className="wordmark" href="#top" aria-label="ZALV home">ZALV<span>®</span></a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#new">New</a><a href="#shop">Jackets</a><a href="#shop">Boots</a><a href="#scent">Perfume</a><a href="#craft">Journal</a>
          </nav>
          <div className="nav-actions">
            <button className="icon-button desktop-only" aria-label="Search"><Search /></button>
            {/* Demo Mode: Cart Bag disabled */}
            <button className="bag-button" aria-label="Bag disabled for demo">
              <ShoppingBag /><span>Bag</span><b>00</b>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && <div className="mobile-menu">
        <button className="icon-button menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></button>
        <a className="wordmark" href="#top">ZALV</a>
        <nav><a href="#new" onClick={() => setMenuOpen(false)}>New collection</a><a href="#shop" onClick={() => setMenuOpen(false)}>Jackets</a><a href="#shop" onClick={() => setMenuOpen(false)}>Boots</a><a href="#scent" onClick={() => setMenuOpen(false)}>Perfume</a><a href="#craft" onClick={() => setMenuOpen(false)}>Our workshop</a></nav>
      </div>}

      <section className="hero" id="top">
        <img className="hero-image" src={heroImage} alt="Model wearing ZALV oxblood leather jacket" width={1280} height={1600} />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow light">AUTUMN / WINTER 2026 · JALANDHAR</p>
          <h1>Fearless<br /><em>objects.</em></h1>
          <p className="hero-intro">Leather outerwear, resoleable boots and dry-down perfumes. Made in small batches for people who keep things.</p>
          <a className="text-link light" href="#shop">Shop the drop <ArrowDown /></a>
        </div>
        <p className="hero-index">COLLECTION 01 / 19 PIECES</p>
      </section>

      <section className="manifesto" id="new">
        <p className="eyebrow">OUR POSITION</p>
        <p className="manifesto-copy">Not trend. Not nostalgia.<br />Objects with the courage to <em>age.</em></p>
        <div className="manifesto-notes"><span>Full-grain hides</span><span>Goodyear welts</span><span>Concentrated parfum</span><span>Made to be re-worn</span></div>
      </section>

      <section className="categories" aria-labelledby="category-title">
        <div className="section-heading"><p className="eyebrow">01 / DISCIPLINES</p><h2 id="category-title">Three ways<br />to leave a mark.</h2><p>One workshop philosophy, expressed in hide, sole, and scent.</p></div>
        <div className="category-grid">
          {(Object.keys(categoryImages) as Category[]).map((category, index) => (
            <button className="category-tile" key={category} onClick={() => { setFilter(category); document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" }); }}>
              <img src={categoryImages[category]} alt={`Shop ZALV ${category.toLowerCase()}`} width={1024} height={1280} loading="lazy" />
              <span className="category-number">0{index + 1}</span>
              <span className="category-name">{category}</span>
              <ArrowRight />
            </button>
          ))}
        </div>
      </section>

      <section className="shop" id="shop" aria-labelledby="shop-title">
        <div className="shop-top"><div><p className="eyebrow">02 / CURRENT RANGE</p><h2 id="shop-title">Made now.</h2></div><p>Nineteen pieces, restocked in small runs.<br />No permanent collection.</p></div>
        <div className="filter-row" role="group" aria-label="Product filters">
          {(["All", "Jackets", "Boots", "Perfume"] as const).map((option) => <button key={option} className={filter === option ? "active" : ""} onClick={() => setFilter(option)}>{option}</button>)}
        </div>
        <div className="product-grid">
          {shownProducts.map((product, index) => (
            <article className={`product-card ${index === 0 ? "featured-product" : ""}`} key={product.id}>
              <button className="product-media" onClick={() => setSelected(product)} aria-label={`View ${product.name}`}>
                <img src={product.image} alt={product.name} width={1024} height={1280} loading="lazy" />
                {product.tag && <span className="product-tag">{product.tag}</span>}
                <span className="quick-view">Quick view <ArrowRight /></span>
              </button>
              <div className="product-info"><div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div><p>${product.price}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="craft" id="craft">
        <div className="craft-image"><img src={craftImage} alt="Leather artisan hand-cutting a hide in the ZALV workshop" width={1280} height={960} loading="lazy" /><span>JALANDHAR, PUNJAB<br />31.3260° N, 75.5762° E</span></div>
        <div className="craft-copy"><p className="eyebrow light">03 / THE WORKSHOP</p><h2>Cut around<br />the scars.</h2><p>Every hide tells us where it wants to be cut. We follow its grain, keep its history visible, and waste less than six percent per jacket.</p><a className="text-link light" href="#footer">Meet the makers <ArrowRight /></a></div>
      </section>

      <section className="scent" id="scent">
        <img src={perfumeImage} alt="ZALV Burnt Vetiver perfume" width={1024} height={1280} loading="lazy" />
        <div className="scent-copy"><p className="eyebrow">04 / THE SCENT LIBRARY</p><h2>What leather<br />remembers.</h2><p>Four concentrated eau de parfums built around smoke, leather, oud, vetiver and tobacco. Close to the body. Hard to forget.</p><button className="solid-button" onClick={() => { setFilter("Perfume"); document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" }); }}>Discover the scents <ArrowRight /></button></div>
      </section>

      <section className="newsletter">
        <p className="eyebrow light">PRIVATE LIST</p>
        <h2>{signedUp ? "You're on the list." : "First to know. Last to follow."}</h2>
        {!signedUp && <form onSubmit={(event) => { event.preventDefault(); setSignedUp(true); }}><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Email address" required /><button type="submit" aria-label="Join mailing list"><ArrowRight /></button></form>}
        {signedUp && <Check className="signup-check" aria-hidden="true" />}
      </section>

      <footer id="footer">
        <div className="footer-brand"><a className="wordmark large" href="#top">ZALV</a><p>Objects for use, abuse,<br />repair and return.</p></div>
        <FooterColumn title="SHOP" links={["Jackets", "Boots", "Perfume", "Gift cards"]} />
        <FooterColumn title="ASSISTANCE" links={["Shipping", "Returns", "Size guide", "Contact"]} />
        <FooterColumn title="STUDIO" links={["Purpose", "Craftsmanship", "Careers", "Journal"]} />
        <div className="footer-bottom"><span>© 2026 ZALV</span><span>JALANDHAR · INDIA</span><span>INSTAGRAM ↗</span></div>
      </footer>

      {selected && <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={selected.name} onClick={() => setSelected(null)}>
        <div className="quick-modal" onClick={(event) => event.stopPropagation()}>
          <button className="icon-button modal-close" aria-label="Close quick view" onClick={() => setSelected(null)}><X /></button>
          <img src={selected.image} alt={selected.name} width={1024} height={1280} />
          <div className="modal-copy">
            <p className="eyebrow">{selected.category}</p>
            <h2>{selected.name}</h2>
            <p className="modal-price">${selected.price}</p>
            <p>{selected.note}</p>
            {selected.category !== "Perfume" && <div className="size-row"><span>SELECT SIZE</span>{["XS", "S", "M", "L", "XL"].map((size) => <button key={size}>{size}</button>)}</div>}
            <button className="solid-button full" onClick={() => setSelected(null)}>Close Preview <ArrowRight /></button>
          </div>
        </div>
      </div>}
    </main>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return <div className="footer-column"><h3>{title}</h3>{links.map((link) => <a href="#top" key={link}>{link}</a>)}</div>;
}
