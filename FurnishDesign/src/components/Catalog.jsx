import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  activeWorkspaces,
  catalogAssets,
  catalogCategories,
  catalogMaterials,
  featuredCatalogCollection,
} from '../data/catalogData.js'
import './catalog.css'

const priceRange = { min: 200, max: 10000 }
const styleOptions = ['Scandinavian', 'Minimal', 'Modern', 'Warm Neutral']

// Image sources for the catalog cards and spotlight section come from
// `src/data/catalogData.js`. To swap images, update the imports and the
// `image:` fields there instead of changing the JSX below.

function formatPrice(value) {
  return `$${value.toLocaleString()}`
}

function CatalogCard({ asset, onSelect }) {
  return (
    <article className="catalog-card">
      <button type="button" className="catalog-card-image" onClick={() => onSelect(asset)}>
        <img src={asset.image} alt={asset.name} />
      </button>
      <div className="catalog-card-body">
        <div className="catalog-card-topline">
          <span>{asset.category}</span>
          <strong>{asset.rating.toFixed(1)}</strong>
        </div>
        <h3>{asset.name}</h3>
        <p>{asset.material} / {asset.finish}</p>
        <div className="catalog-card-footer">
          <b>{formatPrice(asset.price)}</b>
          <Link to="/workspace" state={{ catalogAssetId: asset.id }} className="catalog-card-link">
            Add to Workspace
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Catalog() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [selectedAsset, setSelectedAsset] = useState(catalogAssets[0])
  const [page, setPage] = useState(1)

  const filteredAssets = useMemo(() => {
    const term = search.trim().toLowerCase()

    return catalogAssets.filter((asset) => {
      const matchesSearch =
        !term ||
        asset.name.toLowerCase().includes(term) ||
        asset.category.toLowerCase().includes(term) ||
        asset.material.toLowerCase().includes(term)
      const matchesCategory = activeCategory === 'All' || asset.category === activeCategory
      const matchesMaterial = !selectedMaterial || asset.material === selectedMaterial

      return matchesSearch && matchesCategory && matchesMaterial
    })
  }, [activeCategory, search, selectedMaterial])

  const perPage = 6
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / perPage))
  const visibleAssets = filteredAssets.slice((page - 1) * perPage, page * perPage)

  useEffect(() => {
    if (!filteredAssets.length) {
      setSelectedAsset(null)
      return
    }

    setSelectedAsset((current) => {
      if (current && filteredAssets.some((asset) => asset.id === current.id)) {
        return current
      }

      return filteredAssets[0]
    })
  }, [filteredAssets])

  function resetFilters() {
    setSearch('')
    setActiveCategory('All')
    setSelectedMaterial('')
    setPage(1)
  }

  function handleCategoryChange(category) {
    setActiveCategory(category)
    setPage(1)
  }

  function handleMaterialChange(material) {
    setSelectedMaterial((current) => {
      const nextValue = current === material ? '' : material
      setPage(1)
      return nextValue
    })
  }

  return (
    <main className="catalog-page">
      <div className="catalog-shell">
        <header className="catalog-topbar">
          <div className="catalog-brand-group">
            <div className="catalog-brand-mark" aria-hidden="true" />
            <Link to="/dashboard" className="catalog-brand">
              FurnishDesign Studio
            </Link>
            <nav className="catalog-nav-links" aria-label="Primary navigation">
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

          <div className="catalog-tools">
            <label className="catalog-search" htmlFor="catalog-search-input">
              <span aria-hidden="true">Search</span>
              <input
                id="catalog-search-input"
                type="search"
                placeholder="Search items, materials, or styles..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
            </label>
            <button type="button" className="catalog-logout-btn" onClick={() => navigate('/')}>
              Logout
            </button>
            <Link to="/profile" aria-label="Profile" className="catalog-avatar-btn">
              FD
            </Link>
          </div>
        </header>

        <div className="catalog-layout">
          <aside className="catalog-filters">
            <div className="catalog-filter-head">
              <h2>Filters</h2>
              <button type="button" onClick={resetFilters}>Reset all</button>
            </div>

            <section className="catalog-filter-group">
              <h3>Category</h3>
              <div className="catalog-check-list">
                {catalogCategories.filter((item) => item !== 'All').map((category) => (
                  <label key={category}>
                    <input
                      type="radio"
                      name="catalog-category"
                      checked={activeCategory === category}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
                <label>
                  <input
                    type="radio"
                    name="catalog-category"
                    checked={activeCategory === 'All'}
                    onChange={() => handleCategoryChange('All')}
                  />
                  <span>All Categories</span>
                </label>
              </div>
            </section>

            <section className="catalog-filter-group">
              <h3>Price Range</h3>
              <div className="catalog-range">
                <div className="catalog-range-bar" aria-hidden="true">
                  <span />
                </div>
                <div className="catalog-range-values">
                  <span>{formatPrice(priceRange.min)}</span>
                  <span>{formatPrice(priceRange.max)}+</span>
                </div>
              </div>
            </section>

            <section className="catalog-filter-group">
              <h3>Interior Style</h3>
              <div className="catalog-pill-list is-compact">
                {styleOptions.map((style) => (
                  <span key={style}>{style}</span>
                ))}
              </div>
            </section>

            <section className="catalog-filter-group">
              <h3>Primary Material</h3>
              <div className="catalog-pill-list">
                {catalogMaterials.map((material) => (
                  <button
                    key={material}
                    type="button"
                    className={selectedMaterial === material ? 'is-active' : ''}
                    onClick={() => handleMaterialChange(material)}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <section className="catalog-main">
            <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
              <Link to="/dashboard">Home</Link>
              <span>&gt;</span>
              <span>Furniture Catalog</span>
            </nav>

            <div className="catalog-hero">
              <div>
                <h1>Designer Selection</h1>
                <p>
                  Browse curated furniture and decor assets for live projects. Use the
                  filters to narrow down categories, materials, and styles.
                </p>
                <div className="catalog-chip-row">
                  {catalogCategories.filter((item) => item !== 'All').map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={activeCategory === category ? 'is-active' : ''}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <section className="catalog-spotlight">
              <div className="catalog-spotlight-copy">
                <span>{featuredCatalogCollection.label}</span>
                <h2>{featuredCatalogCollection.title}</h2>
                <p>{featuredCatalogCollection.description}</p>
                <div className="catalog-spotlight-actions">
                  <button type="button">Browse Collection</button>
                  <small>{featuredCatalogCollection.stats}</small>
                </div>
              </div>
              <div className="catalog-spotlight-image">
                <img src={featuredCatalogCollection.image} alt={featuredCatalogCollection.title} />
              </div>
            </section>

            <div className="catalog-list-head">
              <div>
                <h2>Latest Curations</h2>
                <p>{filteredAssets.length} items available</p>
              </div>
              <div className="catalog-page-indicator">
                Page {page} of {totalPages}
              </div>
            </div>

            <div className="catalog-grid">
              {visibleAssets.map((asset) => (
                <CatalogCard key={asset.id} asset={asset} onSelect={setSelectedAsset} />
              ))}
            </div>

            <div className="catalog-pagination">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={pageNumber === page ? 'is-active' : ''}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </section>

          <aside className="catalog-sidebar">
            <section className="catalog-inspector">
              <div className="catalog-side-title">
                <strong>Active Inspector</strong>
              </div>

              {selectedAsset ? (
                <div className="catalog-inspector-card">
                  <img src={selectedAsset.image} alt={selectedAsset.name} />
                  <h3>{selectedAsset.name}</h3>
                  <p>{selectedAsset.description}</p>
                  <div className="catalog-inspector-stats">
                    <span>{selectedAsset.category}</span>
                    <span>{selectedAsset.material}</span>
                    <span>{selectedAsset.width} cm</span>
                    <span>{formatPrice(selectedAsset.price)}</span>
                  </div>
                  <Link to="/workspace" state={{ catalogAssetId: selectedAsset.id }} className="catalog-open-workspace">
                    Add to Workspace
                  </Link>
                </div>
              ) : (
                <div className="catalog-empty-inspector">
                  <strong>No Selection</strong>
                  <p>Select an item card to view details and quick actions.</p>
                </div>
              )}
            </section>

            <section className="catalog-sidebar-card">
              <div className="catalog-side-title">
                <strong>Active Workspace</strong>
                <Link to="/workspace">View All</Link>
              </div>
              <div className="catalog-workspace-list">
                {activeWorkspaces.map((workspace) => (
                  <article key={workspace.name}>
                    <strong>{workspace.name}</strong>
                    <span>{workspace.items} items</span>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <footer className="catalog-footer">
          <nav aria-label="Footer links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/templates">Templates</Link>
            <Link to="/workspace">Workspace</Link>
          </nav>
          <p>@ 2026 FurnishDesign Studio. Internal use only.</p>
        </footer>
      </div>
    </main>
  )
}
