import heroPlaceholder from '../assets/images/login.jpg'
import { useNavigate } from 'react-router-dom'
import './login.css'

export default function Login() {
  const navigate = useNavigate()

  return (
    <main className="page-shell">
      <section className="studio-card">
        <div className="hero-panel">
          {/* TODO: Replace with your real project image */}
          <img
            src={heroPlaceholder}
            alt="Dummy living room placeholder"
            className="hero-image"
          />

          <div className="top-glass-bar">
            <div className="brand-wrap">
              <div className="brand-mark" aria-hidden="true" />
              <span>FurnishDesign Studio</span>
            </div>

            <span className="live-pill">V3.0 now live</span>
          </div>

          <div className="hero-overlay-content">
            <p className="portal-tag">DESIGNER PORTAL</p>
            <h1>
              Design Without
              <br />
              Boundaries.
            </h1>
            <p className="hero-copy">
              Unlock the power of our advanced workspace. Manage collections,
              prototype rooms, and visualize your next masterpiece.
            </p>

            <div className="stats-row">
              <div>
                <strong>2.4k+</strong>
                <span>ASSETS</span>
              </div>
              <div>
                <strong>150+</strong>
                <span>MATERIALS</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>RATING</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="login-panel">
          <div className="panel-top-links">
            <button type="button" className="link-button">
              Support
            </button>
            <button type="button" className="mini-action">
              In-house Login
            </button>
          </div>

          <div className="form-wrap">
            <h2>Welcome Back</h2>
            <p>Please enter your in-house credentials to access the design studio.</p>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                navigate('/dashboard')
              }}
            >
              <label htmlFor="work-email">Work Email</label>
              <input
                id="work-email"
                type="email"
                placeholder="name@furnishdesign.com"
              />

              <div className="password-label-row">
                <label htmlFor="password">Password</label>
                <button type="button" className="link-button muted">
                  Forgot password?
                </button>
              </div>
              <div className="password-box">
                <input id="password" type="password" placeholder="........" />
                <button type="button" className="eye-button" aria-label="Show password">
                  o
                </button>
              </div>

              <label className="remember-row" htmlFor="remember-me">
                <input id="remember-me" type="checkbox" />
                <span>Remember me for 30 days</span>
              </label>

              <button type="submit" className="submit-button">
                Sign In to Workspace
                <span aria-hidden="true">&gt;</span>
              </button>
            </form>

            <p className="admin-note">
              Don't have an account? <strong>Contact your administrator</strong>
            </p>

            <hr />

            <footer>
              <div className="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Internal Guidelines</a>
                <a href="#">System Status</a>
              </div>
              <p className="footnote">POWERED BY INTERIORS o 2024</p>
            </footer>
          </div>
        </aside>
      </section>
    </main>
  )
}
