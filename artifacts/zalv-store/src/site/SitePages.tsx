import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeftRight, ArrowRight, Banknote, MapPin, Menu, Search, ShoppingBag, Truck, X } from 'lucide-react';
import modelImage from '@/assets/zalv-about-model.jpg';
import craftImage from '@/assets/zalv-craft.jpg';
import { privacyDoc, returnsDoc, serviceCards, shippingDoc, siteInfo, sizeTables, termsDoc, type Block, type PolicyDoc } from './content';
import './site-pages.css';

export const INFO_PATHS = ['/about', '/size-guide', shippingDoc.path, returnsDoc.path, privacyDoc.path, termsDoc.path];

/** Links that work both on the home page (smooth scroll) and from any other page (go home, then scroll). */
function useSiteNav() {
  const [location, setLocation] = useLocation();
  const linkProps = (path: string, id?: string, after?: () => void) => ({
    href: path + (id ? `#${id}` : ''),
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      after?.();
      const scroll = () => (id ? document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) : window.scrollTo({ top: 0, behavior: 'smooth' }));
      if (location === path) scroll();
      else { setLocation(path); window.setTimeout(scroll, 90); }
    },
  });
  return { location, linkProps };
}

export function SiteHeader({ cartCount }: { cartCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { location, linkProps } = useSiteNav();
  const close = () => setMenuOpen(false);
  const current = (path: string) => (location === path ? 'page' as const : undefined);
  return <>
    <div className="announce">FREE SHIPPING ACROSS INDIA · CASH ON DELIVERY</div>
    <header className="site-header">
      <div className="nav-wrap">
        <button className="icon-button mobile-only" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu /></button>
        <a className="wordmark" aria-label="ZALV home" {...linkProps('/')}>ZALV<span>®</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a {...linkProps('/', 'new')}>New</a>
          <a {...linkProps('/', 'shop')}>Jackets</a>
          <a {...linkProps('/', 'shop')}>Boots</a>
          <a {...linkProps('/', 'scent')}>Perfume</a>
          <a aria-current={current('/about')} {...linkProps('/about')}>About us</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-button desktop-only" aria-label="Search"><Search /></button>
          <button className="bag-button" aria-label="Open shopping bag" data-testid="button-original-cart" onClick={() => window.dispatchEvent(new Event('zalv-open-cart'))}><ShoppingBag /><span>Bag</span><b>{String(cartCount).padStart(2, '0')}</b></button>
        </div>
      </div>
    </header>
    {menuOpen && <div className="mobile-menu">
      <button className="icon-button menu-close" aria-label="Close menu" onClick={close}><X /></button>
      <a className="wordmark" {...linkProps('/', undefined, close)}>ZALV</a>
      <nav>
        <a {...linkProps('/', 'new', close)}>New collection</a>
        <a {...linkProps('/', 'shop', close)}>Jackets</a>
        <a {...linkProps('/', 'shop', close)}>Boots</a>
        <a {...linkProps('/', 'scent', close)}>Perfume</a>
        <a {...linkProps('/', 'craft', close)}>Our workshop</a>
        <a {...linkProps('/about', undefined, close)}>About us</a>
      </nav>
    </div>}
  </>;
}

export function SiteFooter() {
  const { linkProps } = useSiteNav();
  return <footer id="footer">
    <div className="footer-brand"><a className="wordmark large" {...linkProps('/')}>ZALV</a><p>Objects for use, abuse,<br />repair and return.</p></div>
    <div className="footer-column"><h3>SHOP</h3>
      <a {...linkProps('/', 'shop')}>Jackets</a><a {...linkProps('/', 'shop')}>Boots</a><a {...linkProps('/', 'scent')}>Perfume</a>
    </div>
    <div className="footer-column"><h3>ASSISTANCE</h3>
      <a {...linkProps(shippingDoc.path)}>Shipping</a><a {...linkProps(returnsDoc.path)}>Returns</a><a {...linkProps('/size-guide')}>Size guide</a><a {...linkProps('/about', 'contact')}>Contact</a>
    </div>
    <div className="footer-column"><h3>STUDIO</h3>
      <a {...linkProps('/about')}>Purpose</a><a {...linkProps('/about', 'making')}>Craftsmanship</a><a {...linkProps(privacyDoc.path)}>Privacy Policy</a><a {...linkProps(termsDoc.path)}>Terms &amp; Conditions</a>
    </div>
    <div className="footer-bottom"><span>© 2026 ZALV</span><span>JALANDHAR · INDIA</span><a href={siteInfo.instagram} target="_blank" rel="noopener noreferrer">INSTAGRAM ↗</a></div>
  </footer>;
}

const serviceIcons = { truck: Truck, cash: Banknote, exchange: ArrowLeftRight, pin: MapPin };

export function ServiceCards() {
  return <section className="service" aria-labelledby="service-title">
    <h2 id="service-title">Service &amp; care</h2>
    <div className="service-grid">
      {serviceCards.map((card) => { const Icon = serviceIcons[card.icon]; return <div className="service-card" key={card.title}>
        <span className="service-icon"><Icon aria-hidden="true" /></span><h3>{card.title}</h3><p>{card.text}</p>
      </div>; })}
    </div>
  </section>;
}

function InfoLayout({ title, cartCount, children }: { title: string; cartCount: number; children: ReactNode }) {
  useEffect(() => {
    document.title = `${title} — ZALV`;
    return () => { document.title = 'Zalv Store'; };
  }, [title]);
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 80);
  }, []);
  return <main className="original-home">
    <SiteHeader cartCount={cartCount} />
    {children}
    <SiteFooter />
  </main>;
}

function ContactLine({ lead }: { lead: string }) {
  return <p>{lead} <a href={siteInfo.instagram} target="_blank" rel="noopener noreferrer">on Instagram</a>
    {siteInfo.email && <> or by email at <a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a></>}
    {siteInfo.phone && <> or by phone on <a href={`tel:${siteInfo.phone.replace(/\s/g, '')}`}>{siteInfo.phone}</a></>}.</p>;
}

function renderBlock(block: Block, index: number) {
  if (typeof block === 'string') return <p key={index}>{block}</p>;
  if ('list' in block) return <ul key={index}>{block.list.map((item) => <li key={item}>{item}</li>)}</ul>;
  return <ContactLine key={index} lead={block.contact} />;
}

function MoreLinks({ current }: { current: string }) {
  const { linkProps } = useSiteNav();
  const links = [['About us', '/about'], ['Shipping Policy', shippingDoc.path], ['Return & Exchange Policy', returnsDoc.path], ['Size Guide', '/size-guide'], ['Privacy Policy', privacyDoc.path], ['Terms & Conditions', termsDoc.path]].filter(([, path]) => path !== current);
  return <nav className="info-more" aria-label="More from ZALV"><p>More from ZALV</p><div>{links.map(([label, path]) => <a key={path} {...linkProps(path)}>{label}</a>)}</div></nav>;
}

export function PolicyPage({ doc, cartCount }: { doc: PolicyDoc; cartCount: number }) {
  return <InfoLayout title={doc.title} cartCount={cartCount}>
    <article className="info-doc">
      <header className="info-doc-head"><h1>{doc.title}</h1><p className="info-updated">Last updated {siteInfo.updated}</p></header>
      {doc.intro && <p className="info-lead">{doc.intro}</p>}
      {doc.sections.map((section, index) => <section key={section.heading}>
        <h2>{doc.numbered && <span className="info-num">{index + 1}.</span>}{section.heading}</h2>
        {section.body.map(renderBlock)}
      </section>)}
    </article>
    <MoreLinks current={doc.path} />
  </InfoLayout>;
}

function SizeTable({ table }: { table: { head: string[]; rows: string[][] } }) {
  return <div className="info-table-wrap"><table className="info-table">
    <thead><tr>{table.head.map((cell) => <th key={cell} scope="col">{cell}</th>)}</tr></thead>
    <tbody>{table.rows.map((row) => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody>
  </table></div>;
}

export function SizeGuidePage({ cartCount }: { cartCount: number }) {
  return <InfoLayout title="Size Guide" cartCount={cartCount}>
    <article className="info-doc">
      <header className="info-doc-head"><h1>Size Guide</h1></header>
      <p className="info-lead">Measure once, order once. These are body measurements, so use them to find the size that fits you, not the size of the garment.</p>
      <section>
        <h2>Jackets</h2>
        <SizeTable table={sizeTables.jackets} />
        <p><strong>How to measure your chest.</strong> Wrap a soft tape around the fullest part of your chest, under your arms and across your shoulder blades. Keep it level and snug, but not tight.</p>
      </section>
      <section>
        <h2>Boots</h2>
        <SizeTable table={sizeTables.boots} />
        <p><strong>How to measure your foot.</strong> Stand on a sheet of paper with your heel against a wall and mark the tip of your longest toe. Measure from the wall to the mark. It is best to measure in the evening, when your feet are at their largest.</p>
      </section>
      <section>
        <h2>Perfume</h2>
        <p>Perfumes do not have sizes, so there is nothing to measure.</p>
      </section>
      <section>
        <h2>Still not sure?</h2>
        <ContactLine lead="If you are between sizes, or want a second opinion before ordering, message us" />
        <p>Need to swap a size after delivery? See our <a href={returnsDoc.path}>Return &amp; Exchange Policy</a>.</p>
      </section>
    </article>
    <MoreLinks current="/size-guide" />
  </InfoLayout>;
}

export function AboutPage({ cartCount }: { cartCount: number }) {
  const { linkProps } = useSiteNav();
  return <InfoLayout title="About Us" cartCount={cartCount}>
    <section className="about-intro">
      <h1>Made in Jalandhar.<br />Start to finish.</h1>
      <p className="about-lead">ZALV is a small leather label from Jalandhar, Punjab. The leather, the design and the making are all local. Every piece we sell is designed and made in the same city.</p>
    </section>

    <section className="about-story">
      <figure className="about-photo"><img src={modelImage} alt="A man in a washed grey leather jacket and pale trousers leaning on a stair railing, with a brown leather duffel on the steps beside him" /></figure>
      <div className="about-blocks">
        <div>
          <h2>The leather</h2>
          <p>We source our full-grain leather here in Jalandhar, a city with a long history of leather work. Buying close to home means we can see each hide before it is cut, and we know where every piece comes from.</p>
        </div>
        <div>
          <h2>The design</h2>
          <p>Every pattern is drawn and refined in our Jalandhar studio. We design for people who wear things hard and keep them for years: jackets that soften with use, boots that can be resoled, scents that stay close to the skin.</p>
        </div>
        <div id="making">
          <h2>The making</h2>
          <p>Cutting, stitching and finishing all happen in Jalandhar, by local hands, in small batches. Nothing is sent away to be made somewhere else. When a piece needs care, it does not have to travel far to get it.</p>
        </div>
      </div>
    </section>

    <section className="about-band"><img src={craftImage} alt="A leather artisan hand-cutting a hide in the ZALV workshop" /><span>JALANDHAR, PUNJAB<br />31.3260° N, 75.5762° E</span></section>

    <section className="about-values" aria-label="What we stand for">
      <div><h3>Small batches</h3><p>We make in short runs, so each piece gets attention and nothing sits unsold in a warehouse.</p></div>
      <div><h3>Made to age</h3><p>Leather that darkens, softens and picks up your history. We call that a feature.</p></div>
      <div><h3>Local, on purpose</h3><p>Local hides, local hands, one city. It keeps the work close and the craft alive.</p></div>
    </section>

    <section className="about-contact" id="contact">
      <h2>Say hello.</h2>
      <ContactLine lead="Questions about sizing, an order, or a piece you would like to know more about? Reach us" />
      <div className="about-actions">
        <a className="solid-button" href={siteInfo.instagram} target="_blank" rel="noopener noreferrer">Message us on Instagram <ArrowRight /></a>
        <a className="text-link" {...linkProps('/', 'shop')}>Shop the collection <ArrowRight /></a>
      </div>
    </section>
  </InfoLayout>;
}
