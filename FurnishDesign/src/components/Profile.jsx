import { Link, NavLink, useNavigate } from 'react-router-dom'

import avatarImage from '../assets/images/user.webp'
import designImage1 from '../assets/images/proj1.jpg'
import designImage2 from '../assets/images/proj2.jpg'
import designImage3 from '../assets/images/proj3.webp'
import designImage4 from '../assets/images/proj4.jpg'
import designImage5 from '../assets/images/proj5.jpg'
import designImage6 from '../assets/images/proj6.jpeg'
import './profile.css'

const profileStats = [
  { label: 'Designs', value: '128' },
  { label: 'Stars', value: '45' },
  { label: 'Limit', value: '85%' },
]

const profileInfo = [
  { label: 'Full Name', value: 'Julian Alexander Rossi' },
  { label: 'Email Address', value: 'j.rossi@furnishdesign.io' },
  { label: 'Phone Number', value: '+1 (555) 234 8901' },
  { label: 'Department', value: 'Residential Design & Architecture' },
  {
    label: 'Short Bio',
    value:
      'Passionate about blending Scandinavian minimalism with functional Italian luxury. 12+ years in high-end residential refurbishments.',
  },
]

const profileDesigns = [
  {
    id: 'design-1',
    title: 'Modern Scandi Living',
    meta: 'Living Room • 24 items',
    edited: 'Edited 2h ago',
    image: designImage1,
  },
  {
    id: 'design-2',
    title: 'Valhalla Master Suite',
    meta: 'Bedroom • 18 items',
    edited: 'Edited 1d ago',
    image: designImage2,
  },
  {
    id: 'design-3',
    title: 'Industrial Loft Kitchen',
    meta: 'Kitchen • 42 items',
    edited: 'Edited 5d ago',
    image: designImage3,
  },
  {
    id: 'design-4',
    title: 'Emerald Green Office',
    meta: 'Workspace • 12 items',
    edited: 'Edited 1w ago',
    image: designImage4,
  },
  {
    id: 'design-5',
    title: 'Minimalist Patio Concept',
    meta: 'Outdoor • 9 items',
    edited: 'Edited 2w ago',
    image: designImage5,
  },
  {
    id: 'design-6',
    title: 'Velvet Cinema Room',
    meta: 'Entertainment • 31 items',
    edited: 'Edited 1m ago',
    image: designImage6,
  },
]

export default function Profile() {
  const navigate = useNavigate()

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <header className="profile-topbar">
          <div className="profile-brand-group">
            <div className="profile-brand-mark" aria-hidden="true" />
            <Link to="/dashboard" className="profile-brand">
              FurnishDesign Studio
            </Link>
            <nav className="profile-nav-links" aria-label="Primary navigation">
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Dashboard
              </NavLink>
              <NavLink to="/catalog" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Catalog
              </NavLink>
              <NavLink to="/templates" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Templates
              </NavLink>
              <NavLink to="/workspace" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Workspace
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Profile
              </NavLink>
            </nav>
          </div>

          <div className="profile-tools">
            <label className="profile-search" htmlFor="profile-top-search">
              <span aria-hidden="true">o</span>
              <input id="profile-top-search" type="search" placeholder="Search workspaces..." />
            </label>
            <button type="button" aria-label="Notifications" className="profile-icon-btn">
              o
            </button>
            <button type="button" className="profile-logout-btn" onClick={() => navigate('/')}>
              Logout
            </button>
            <Link to="/profile" className="profile-avatar-btn" aria-label="Profile">
              <img src={avatarImage} alt="Designer avatar placeholder" />
            </Link>
          </div>
        </header>

        <section className="profile-content">
          <div className="profile-heading">
            <nav className="profile-breadcrumb" aria-label="Breadcrumb">
              <Link to="/dashboard">Dashboard</Link>
              <span>/</span>
              <span>Profile</span>
            </nav>
            <div className="profile-heading-row">
              <div>
                <h1>Profile</h1>
                <p>Manage your professional identity and project history.</p>
              </div>
              <div className="profile-heading-actions">
                <button type="button" className="profile-light-btn">Share Profile</button>
                <Link to="/workspace" className="profile-dark-btn">Create New Design</Link>
              </div>
            </div>
          </div>

          <div className="profile-layout">
            <aside className="profile-sidebar">
              <div className="profile-card">
                <div className="profile-cover" aria-hidden="true" />
                <div className="profile-avatar-large-wrap">
                  <img src={avatarImage} alt="Profile placeholder" className="profile-avatar-large" />
                </div>
                <h2>Julian Rossi</h2>
                <p>Senior Interior Architect</p>
                <button type="button" className="profile-edit-btn">Edit Profile</button>

                <div className="profile-stats">
                  {profileStats.map((item) => (
                    <article key={item.label}>
                      <small>{item.label}</small>
                      <strong>{item.value}</strong>
                    </article>
                  ))}
                </div>

                <div className="profile-info-list">
                  {profileInfo.map((item) => (
                    <article key={item.label}>
                      <small>{item.label}</small>
                      <p>{item.value}</p>
                    </article>
                  ))}
                </div>

                <div className="profile-sidebar-actions">
                  <button type="button">Account Settings</button>
                  <button type="button" className="is-danger" onClick={() => navigate('/')}>
                    Logout
                  </button>
                </div>
              </div>
            </aside>

            <section className="profile-main">
              <div className="profile-toolbar">
                <label className="profile-design-search" htmlFor="profile-design-search">
                  <span aria-hidden="true">o</span>
                  <input
                    id="profile-design-search"
                    type="search"
                    placeholder="Search your designs by room, style, or date..."
                  />
                </label>
                <div className="profile-filter-group">
                  <button type="button" className="is-active">Recent</button>
                  <button type="button">Starred</button>
                  <button type="button">Shared</button>
                </div>
              </div>

              <div className="profile-selection-bar">
                <span>1 design selected</span>
                <div>
                  <button type="button">Open</button>
                  <button type="button">Share</button>
                  <button type="button">Export</button>
                  <button type="button" className="is-danger">Delete</button>
                </div>
              </div>

              <div className="profile-grid">
                {profileDesigns.map((design) => (
                  <article key={design.id} className="profile-design-card">
                    <img src={design.image} alt={`${design.title} placeholder`} />
                    <div className="profile-design-meta">
                      <h3>{design.title}</h3>
                      <p>{design.meta}</p>
                      <small>{design.edited}</small>
                    </div>
                  </article>
                ))}
              </div>

              <p className="profile-load-note">Loading more masterpiece designs...</p>
            </section>
          </div>
        </section>

        <footer className="profile-footer">
          <p>FurnishDesign</p>
          <p>@ 2026 FurnishDesign Studio. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}