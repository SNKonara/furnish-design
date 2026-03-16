import { Link, NavLink, useNavigate } from 'react-router-dom'
import placeholderImage from '../assets/dummy-hero-room.svg'
import image4 from '../assets/images/desk1.webp'
import nordic from '../assets/images/nordic.webp'
import zenroom from '../assets/images/zen.webp'
import roomStudioImage from '../assets/images/velvet.jpg'
import { catalogAssets } from '../data/catalogData.js'

import './dashboard.css'

const templateCards = [
  { title: 'Nordic Living', subtitle: 'Clean lines and warm oak textures', image: nordic },
  { title: 'Zen Workspace', subtitle: 'Focus-driven minimal environments', image: zenroom },
  { title: 'Velvet Lounge', subtitle: 'Rich textures with ambient lighting', image: roomStudioImage },
]

const productCards = catalogAssets.slice(0, 8).map((asset) => ({
  tag: asset.tag,
  category: asset.category.toUpperCase(),
  name: asset.name,
  price: `$${asset.price.toLocaleString()}`,
  image: asset.image,
  id: asset.id,
}))

const ctaFeatures = [
  { title: 'AI Assistant', text: 'Generate smart layouts automatically.' },
  { title: '4K Rendering', text: 'Photorealistic outputs in seconds.' },
  { title: 'Direct Export', text: 'Seamless export to manufacturing.' },
  { title: 'Unlimited Assets', text: 'Over 50,000 components ready.' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <main className="dash-page">
      <div className="dash-shell">
        <header className="dash-topbar">
          <div className="dash-brand-group">
            <div className="dash-brand-mark" aria-hidden="true" />
            <Link to="/dashboard" className="dash-brand">
              FurnishDesign Studio
            </Link>
            <nav className="dash-nav-links" aria-label="Primary navigation">
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Dashboard
              </NavLink>
              <NavLink to="/catalog" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Catalog
              </NavLink>
              <NavLink to="/workspace" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Workspace
              </NavLink>
              <NavLink to="/templates" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Templates
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Profile
              </NavLink>
            </nav>
          </div>

          <div className="dash-tools">
            <label className="dash-search" htmlFor="dash-search-input">
              <span aria-hidden="true">o</span>
              <input
                id="dash-search-input"
                type="search"
                placeholder="Search assets..."
              />
            </label>
            <button type="button" aria-label="Notifications" className="dash-icon-btn">
              o
            </button>
            <button type="button" className="dash-logout-btn" onClick={() => navigate('/')}>
              Logout
            </button>
            <Link to="/profile" aria-label="Profile" className="dash-avatar-btn">
              FD
            </Link>
          </div>
        </header>

        <section className="dash-hero">
          <div className="dash-hero-copy">
            <span className="dash-chip">Internal Workspace</span>
            <h1>
              Design the <strong>Future</strong>
              <br />
              of Living.
            </h1>
            <p>
              Unlock professional tools for 3D room planning, curated furniture
              collections, and high-fidelity material rendering. Your vision,
              expertly crafted.
            </p>
            <div className="dash-hero-actions">
              <Link to="/workspace" className="dash-primary-btn">
                Launch Workspace <span aria-hidden="true">&gt;</span>
              </Link>
              <Link to="/catalog" className="dash-secondary-btn">
                View Catalog
              </Link>
            </div>
            <div className="dash-joined-row">
              <div className="dash-avatar-stack" aria-hidden="true">
                <span>AK</span>
                <span>TR</span>
                <span>CM</span>
                <span>+12</span>
              </div>
              <p>
                Joined by <strong>12+ designers</strong> this week
              </p>
            </div>
          </div>

          <article className="dash-feature-card">
            {/* TODO: Replace with your real hero/dashboard image */}
            <img src={image4} alt="Dashboard hero placeholder" />
            <div className="dash-feature-label">
              <span>FEATURED LAYOUT</span>
              <strong>Nordic Minimalist Suite</strong>
            </div>
          </article>
        </section>

        <section className="dash-filter-bar">
          <label className="dash-catalog-search" htmlFor="catalog-search">
            <span aria-hidden="true">o</span>
            <input
              id="catalog-search"
              type="search"
              placeholder="Find components, textures, or templates..."
            />
          </label>
          <div className="dash-filter-chips">
            <button type="button" className="is-active">
              All Items
            </button>
            <button type="button">Seating</button>
            <button type="button">Lighting</button>
            <button type="button">Workstations</button>
            <button type="button">Storage</button>
          </div>
        </section>

        <section className="dash-templates">
          <div className="dash-section-head">
            <div>
              <h2>Room Templates</h2>
              <p>Choose a starting point for your project scene.</p>
            </div>
            <Link to="/templates">Explore All Templates</Link>
          </div>
          <div className="dash-template-grid">
            {templateCards.map((card) => (
              <article key={card.title} className="dash-template-card">
                {/* TODO: Replace with real room template image */}
                <img src={card.image ?? placeholderImage} alt={`${card.title} placeholder`} />
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dash-collection">
          <div className="dash-collection-head">
            <span>New Arrivals</span>
            <h2>Furniture Collection</h2>
            <p>
              Explore our high-density library of premium assets ready for your
              workspace.
            </p>
          </div>

          <div className="dash-product-grid">
            {productCards.map((card) => (
              <article key={card.name} className="dash-product-card">
                {/* TODO: Replace with real product image */}
                <img src={card.image ?? placeholderImage} alt={`${card.name} placeholder`} />
                <div className="dash-product-meta">
                  <div className="dash-product-top">
                    <span>{card.category}</span>
                    <strong>{card.price}</strong>
                  </div>
                  <h3>{card.name}</h3>
                </div>
                <em>{card.tag}</em>
              </article>
            ))}
          </div>

          <Link to="/catalog" className="dash-load-btn">
            Browse Full Catalog
          </Link>
        </section>

        <section className="dash-cta-block">
          <div className="dash-cta-copy">
            <h2>
              Ready to bring your
              <br />
              vision to life?
            </h2>
            <p>
              Start a new design project today. Access all tools and assets in
              our high-performance Workspace.
            </p>
            <div className="dash-cta-actions">
              <Link to="/workspace" className="dash-light-btn">
                Start Designing
              </Link>
              <button type="button" className="dash-ghost-btn">
                Join Workshop
              </button>
            </div>
          </div>

          <div className="dash-feature-grid">
            {ctaFeatures.map((feature) => (
              <article key={feature.title}>
                <div className="dash-feature-icon" aria-hidden="true">
                  o
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="dash-footer">
          <div className="dash-footer-brand">
            <div className="dash-brand-mark" aria-hidden="true" />
            <strong>FurnishDesign</strong>
            <p>
              Professional internal workspace for furniture designers,
              streamlining vision into reality.
            </p>
          </div>
          <div>
            <h4>RESOURCES</h4>
            <Link to="/catalog">Furniture Library</Link>
            <a href="#">Material Swatches</a>
            <a href="#">Rendering Engine</a>
          </div>
          <div>
            <h4>INTERNAL</h4>
            <a href="#">Guidelines</a>
            <a href="#">Asset Uploads</a>
            <a href="#">Team Shared</a>
          </div>
          <div>
            <h4>CONNECT</h4>
            <div className="dash-footer-icons">
              <a href="#" aria-label="Dribbble">
                o
              </a>
              <a href="#" aria-label="Behance">
                o
              </a>
            </div>
          </div>
          <p className="dash-copy">@ 2026 FurnishDesign Studio. Internal use only.</p>
        </footer>
      </div>
    </main>
  )
}
