import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
// Replace these placeholder paths with your real room images.
// Example: import livingRoomImg from '../assets/images/living-room-real.jpg'
import livingRoomImg from '../assets/images/rt-img1.webp'
import livingRoomImg2 from '../assets/images/rt-img2.webp'
import livingRoomImg3 from '../assets/images/rt-img3.webp'


import bedRoomImg from '../assets/images/rt-img4.webp'
import bedRoomImg2 from '../assets/images/rt-img5.webp'
import bedRoomImg3 from '../assets/images/rt-img6.webp'

import bathRoomImg from '../assets/images/rt-img7.webp'
import bathRoomImg2 from '../assets/images/rt-img8.webp'

import kitchenImg from '../assets/images/rt-img9.webp'

import diningRoomImg from '../assets/images/rt-img10.webp'

import officeImg from '../assets/images/rt-img13.webp'
import studioImg from '../assets/images/rt-img12.webp'
import entryImg from '../assets/images/rt-img11.webp'
import { createWorkspaceDesignFromTemplate, savePendingTemplateDesign } from '../designState.js'
import './roomTemplates.css'

// Keep these keys exactly the same as each template's `room` value.
// Update each value to the image import you want for that room.
const ROOM_IMAGES = {
  'Living Room': livingRoomImg,
  'Living Room 2': livingRoomImg2,
  'Living Room 3': livingRoomImg3,

  Bedroom: bedRoomImg,
  'Bedroom guest': bedRoomImg2,
  'Bedroom kid': bedRoomImg3,


  Bathroom: bathRoomImg,
  Bathroom2: bathRoomImg2,

  Kitchen: kitchenImg,
  'Dining Room': diningRoomImg,
  Office: officeImg,
  Studio: studioImg,
  Entry: entryImg,
}

const ALL_TEMPLATES = [
  {
    id: 1,
    title: 'Living Room – Modern',
    room: 'Living Room 2',
    style: 'Modern',
    size: 'Large',
    rating: 5,
    pieces: 14,
    volume: '32m³',
    lighting: 'Warm',
    description:
      'A sleek, contemporary living space designed with clean lines, neutral tones, and high-end Italian furniture. Perfect for spacious open-plan homes.',
    assets: [
      'Premium Walnut Bedframe',
      'Ambient Smart Lighting Kit',
      'Custom Wool Area Rug',
      'Minimalist Nightstand Duo',
    ],
    featured: true,
  },
  {
    id: 2,
    title: 'Living Room – Minimal',
    room: 'Living Room 3',
    style: 'Minimalist',
    size: 'Medium',
    rating: 4,
    pieces: 9,
    volume: '28m³',
    lighting: 'Natural',
    description:
      'Stripped-back elegance with an emphasis on open space and thoughtful material choices. Ideal for modern urban apartments.',
    assets: ['Slim Oak Console', 'Linen Sofa Set', 'Concrete Pendant Light', 'Marble Side Table'],
    featured: false,
  },
  {
    id: 3,
    title: 'Bedroom – Master',
    room: 'Bedroom',
    style: 'Luxury',
    size: 'Extra Large',
    rating: 5,
    pieces: 18,
    volume: '40m³',
    lighting: 'Soft',
    description:
      'Opulent master bedroom featuring rich fabrics, statement lighting, and a bespoke wardrobe system. Designed for maximum comfort and elegance.',
    assets: [
      'King Platform Bed',
      'Bespoke Wardrobe System',
      'Crystal Chandelier',
      'Velvet Bench Set',
    ],
    featured: false,
  },
  {
    id: 4,
    title: 'Bedroom – Guest',
    room: 'Bedroom guest',
    style: 'Cozy',
    size: 'Medium',
    rating: 4,
    pieces: 10,
    volume: '22m³',
    lighting: 'Warm',
    description:
      'A welcoming guest room that balances comfort and style with soft textures and warm accents. Every visitor will feel at home.',
    assets: ['Queen Upholstered Bed', 'Knit Throw Blanket', 'Brass Reading Lamp', 'Woven Rug'],
    featured: false,
  },
  {
    id: 5,
    title: "Kid's Bedroom",
    room: 'Bedroom kid',
    style: 'Playful',
    size: 'Medium',
    rating: 5,
    pieces: 16,
    volume: '20m³',
    lighting: 'Bright',
    description:
      'Vibrant and functional space designed to inspire creativity and provide plenty of storage for growing minds.',
    assets: ['Loft Bunk Bed', 'Toy Storage Unit', 'Activity Desk', 'Colourful Rug'],
    featured: false,
  },
  {
    id: 6,
    title: 'Bathroom – Spa',
    room: 'Bathroom',
    style: 'Zen',
    size: 'Medium',
    rating: 5,
    pieces: 11,
    volume: '14m³',
    lighting: 'Soft',
    description:
      'A tranquil spa-inspired retreat with natural stone, freestanding tub, and mood lighting for ultimate relaxation.',
    assets: ['Freestanding Soaking Tub', 'Bamboo Shelving', 'Rain Shower Head', 'Pebble Floor Mat'],
    featured: false,
  },
  {
    id: 7,
    title: 'Bathroom – Compact',
    room: 'Bathroom2',
    style: 'Modern',
    size: 'Small',
    rating: 3,
    pieces: 7,
    volume: '8m³',
    lighting: 'Cool',
    description:
      'A smart and efficient compact bathroom layout that maximizes every inch without sacrificing style.',
    assets: ['Wall-mount Vanity', 'Frameless Mirror', 'Slim Towel Rack', 'Porcelain Tile Set'],
    featured: false,
  },
  {
    id: 8,
    title: 'Kitchen – Open Plan',
    room: 'Kitchen',
    style: 'Industrial',
    size: 'Extra Large',
    rating: 4,
    pieces: 22,
    volume: '50m³',
    lighting: 'Mixed',
    description:
      'Bold open-plan kitchen with exposed brick, steel fixtures, and a large island. Perfect for entertaining and everyday living.',
    assets: [
      'Steel Island Unit',
      'Exposed Edison Pendants',
      'Matte Black Fixtures',
      'Reclaimed Wood Shelves',
    ],
    featured: false,
  },
  {
    id: 9,
    title: 'Dining Room',
    room: 'Dining Room',
    style: 'Classic',
    size: 'Large',
    rating: 4,
    pieces: 12,
    volume: '30m³',
    lighting: 'Warm',
    description:
      'Timeless dining room with a statement table, upholstered chairs, and elegant lighting for formal and casual gatherings.',
    assets: [
      'Extendable Dining Table',
      'Velvet Dining Chairs Set',
      'Statement Chandelier',
      'Drinks Cabinet',
    ],
    featured: false,
  },
  {
    id: 10,
    title: 'Home Office',
    room: 'Office',
    style: 'Professional',
    size: 'Small',
    rating: 4,
    pieces: 8,
    volume: '16m³',
    lighting: 'Natural',
    description:
      'Focused and ergonomic workspace with clean desk setup, smart storage, and bias lighting to boost productivity.',
    assets: [
      'Standing Desk Pro',
      'Ergonomic Task Chair',
      'Modular Bookshelf',
      'Cable Management Kit',
    ],
    featured: false,
  },
  {
    id: 11,
    title: 'Studio Apartment',
    room: 'Studio',
    style: 'Urban',
    size: 'Medium',
    rating: 4,
    pieces: 20,
    volume: '38m³',
    lighting: 'Ambient',
    description:
      'A fully furnished studio layout with smart zoning, multifunctional furniture, and a cohesive urban palette.',
    assets: ['Sofa Bed', 'Folding Dining Set', 'Compact Kitchen Pod', 'Partition Shelving'],
    featured: false,
  },
  {
    id: 12,
    title: 'Entryway',
    room: 'Entry',
    style: 'Inviting',
    size: 'Small',
    rating: 4,
    pieces: 6,
    volume: '6m³',
    lighting: 'Warm',
    description:
      'Make a lasting first impression with a curated entryway featuring smart storage and welcoming decor.',
    assets: [
      'Coat & Shoe Bench',
      'Decorative Mirror',
      'Wall-mounted Hooks',
      'Statement Console Table',
    ],
    featured: false,
  },
]

const ROOMS = ['All Rooms', 'Living Room', 'Bedroom', 'Bathroom', 'Kitchen', 'Dining Room', 'Office', 'Studio', 'Entry']
const STYLES = ['All Styles', 'Modern', 'Minimalist', 'Luxury', 'Cozy', 'Playful', 'Zen', 'Industrial', 'Classic', 'Professional', 'Urban', 'Inviting']

function StarRating({ count }) {
  return (
    <span className="rt-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? 'rt-star filled' : 'rt-star'}>★</span>
      ))}
    </span>
  )
}

function getTemplateImage(room) {
  return ROOM_IMAGES[room] || livingRoomImg
}

export default function RoomTemplates() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(ALL_TEMPLATES[0])
  const [roomFilter, setRoomFilter] = useState('All Rooms')
  const [styleFilter, setStyleFilter] = useState('All Styles')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const PER_PAGE = 9

  const filtered = ALL_TEMPLATES.filter((t) => {
    const matchRoom = roomFilter === 'All Rooms' || t.room === roomFilter
    const matchStyle = styleFilter === 'All Styles' || t.style === styleFilter
    const matchSearch =
      search.trim() === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.style.toLowerCase().includes(search.toLowerCase())
    return matchRoom && matchStyle && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleFilterChange(setter) {
    return (e) => {
      setter(e.target.value)
      setPage(1)
    }
  }

  function openTemplateInWorkspace(template) {
    const workspaceSeed = createWorkspaceDesignFromTemplate(template)
    savePendingTemplateDesign(workspaceSeed)
    navigate('/workspace', { state: { workspaceSeed } })
  }

  return (
    <main className="rt-page">
      <div className="rt-shell">
        {/* ── Top bar ── */}
        <header className="rt-topbar">
          <div className="rt-brand-group">
            <div className="rt-brand-mark" aria-hidden="true" />
            <Link to="/dashboard" className="rt-brand">FurnishDesign Studio</Link>
            <nav className="rt-nav-links" aria-label="Primary navigation">
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
          <div className="rt-tools">
            <label className="rt-search-wrap" htmlFor="rt-top-search">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input id="rt-top-search" type="search" placeholder="Search assets..." />
            </label>
            <button type="button" className="rt-logout-btn" onClick={() => navigate('/')}>
              Logout
            </button>
            <Link to="/profile" aria-label="Profile" className="rt-avatar-btn">FD</Link>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="rt-body">
          {/* ── Left: listing ── */}
          <div className="rt-listing">
            {/* Breadcrumb */}
            <nav className="rt-breadcrumb" aria-label="Breadcrumb">
              <Link to="/dashboard">Dashboard</Link>
              <span aria-hidden="true">›</span>
              <span>Browse Templates</span>
            </nav>

            <div className="rt-listing-head">
              <div>
                <h1>Room Templates</h1>
                <p>Kickstart your next project with professionally curated room layouts designed for every aesthetic and functional need.</p>
              </div>
            </div>

            {/* Filters */}
            <div className="rt-filters">
              <label className="rt-filter-search" htmlFor="rt-filter-search-input">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  id="rt-filter-search-input"
                  type="search"
                  placeholder="Search templates (e.g. 'Living Room', 'Minimal')..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                />
              </label>
              <div className="rt-filter-selects">
                <select value={roomFilter} onChange={handleFilterChange(setRoomFilter)} aria-label="Filter by room">
                  {ROOMS.map((r) => <option key={r}>{r}</option>)}
                </select>
                <select value={styleFilter} onChange={handleFilterChange(setStyleFilter)} aria-label="Filter by style">
                  {STYLES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button type="button" className="rt-sort-btn">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Sort: Popular
                </button>
                <button type="button" className="rt-filter-btn">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M1 3h14M4 8h8M7 13h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Filters
                </button>
              </div>
            </div>

            {/* Grid */}
            {paginated.length === 0 ? (
              <p className="rt-empty">No templates match your filters.</p>
            ) : (
              <div className="rt-grid">
                {paginated.map((t) => (
                  <article
                    key={t.id}
                    className={`rt-card${selected?.id === t.id ? ' is-selected' : ''}`}
                    onClick={() => setSelected(t)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelected(t)}
                    aria-pressed={selected?.id === t.id}
                  >
                    <div className="rt-card-img">
                      <img src={getTemplateImage(t.room)} alt={t.title} />
                    </div>
                    <div className="rt-card-body">
                      <h3>{t.title}</h3>
                      <div className="rt-card-tags">
                        <span>{t.style}</span>
                        <span>{t.size}</span>
                      </div>
                      <button
                        type="button"
                        className="rt-use-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelected(t)
                          openTemplateInWorkspace(t)
                        }}
                      >
                        Use Template
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="rt-pagination" aria-label="Pagination">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rt-page-btn"
                >
                  ‹ Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`rt-page-num${page === n ? ' is-active' : ''}`}
                    aria-current={page === n ? 'page' : undefined}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rt-page-btn"
                >
                  Next ›
                </button>
              </nav>
            )}
          </div>

          {/* ── Right: detail panel ── */}
          {selected && (
            <aside className="rt-detail">
              {selected.featured && <div className="rt-featured-badge">Featured Choice</div>}
              <div className="rt-detail-img">
                <img src={getTemplateImage(selected.room)} alt={selected.title} />
              </div>
              <div className="rt-detail-body">
                <div className="rt-detail-title-row">
                  <h2>{selected.title}</h2>
                  <StarRating count={selected.rating} />
                </div>
                <p className="rt-detail-desc">{selected.description}</p>

                <div className="rt-detail-stats">
                  <div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <rect x="2" y="6" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M5 6V4a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                    <span className="rt-stat-label">PIECES</span>
                    <strong>{selected.pieces}</strong>
                  </div>
                  <div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 13L8 3l5 10H3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                    </svg>
                    <span className="rt-stat-label">VOLUME</span>
                    <strong>{selected.volume}</strong>
                  </div>
                  <div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M8 1v1M8 13v1M1 7h1M13 7h1M3 3l.7.7M11.3 11.3l.7.7M3 11l.7-.7M11.3 3.7l.7-.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <span className="rt-stat-label">LIGHTING</span>
                    <strong>{selected.lighting}</strong>
                  </div>
                </div>

                <div className="rt-detail-assets">
                  <h4>INCLUDED ASSETS</h4>
                  <ul>
                    {selected.assets.map((asset) => (
                      <li key={asset}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
                          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {asset}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/workspace"
                  state={{ workspaceSeed: createWorkspaceDesignFromTemplate(selected) }}
                  className="rt-open-btn"
                  onClick={() => {
                    savePendingTemplateDesign(createWorkspaceDesignFromTemplate(selected))
                  }}
                >
                  Open in Workspace →
                </Link>
              </div>
            </aside>
          )}
        </div>

        <footer className="rt-footer">
          <div className="rt-footer-brand">
            <div className="rt-brand-mark" aria-hidden="true" />
            <strong>FurnishDesign</strong>
          </div>
          <nav aria-label="Footer links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/catalog">Catalog</Link>
            <a href="#">Help Center</a>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </nav>
          <p className="rt-copy">© 2026 FurnishDesign Studio. Internal use only.</p>
        </footer>
      </div>
    </main>
  )
}
