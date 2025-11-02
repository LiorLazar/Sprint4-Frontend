import { Link } from 'react-router-dom'
import { ClipboardList, Users, Workflow, Cloud } from 'lucide-react'
import './HomePage.css'
import pic1 from '../assets/img/pic-1.png'
import pic2 from '../assets/img/pic-2.png'

export function HomePage() {
  return (
    <section className="home-page">
      {/* ===== HERO SECTION ===== */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>
            Organize. Collaborate. Deliver. <br />
            <span className="highlight">TaskRail</span> keeps your workflow on track.
          </h1>
          <p className="hero-subtitle">
            Manage tasks, teams, and projects visually — with the power and clarity of TaskRail’s smart boards.
          </p>

          <div className="hero-buttons">
            <Link to="/board" className="cta-btn primary">
              Try TaskRail for Free
            </Link>
          </div>
        </div>

        <div className="hero-illustration">
          <img src={pic1} alt="TaskRail board preview" className="hero-img main" />
          <img src={pic2} alt="TaskRail workspace preview" className="hero-img secondary" />
        </div>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <div className="features-section">
        <h2>Why teams love TaskRail</h2>
        <div className="features-grid">
          <div className="feature-card">
            <ClipboardList className="feature-icon" />
            <h3>Visual Task Boards</h3>
            <p>
              Drag, drop, and organize every task effortlessly. See progress at a glance and keep everyone aligned.
            </p>
          </div>

          <div className="feature-card">
            <Users className="feature-icon" />
            <h3>Smart Collaboration</h3>
            <p>
              Add teammates, assign tasks, and track updates in real time — communication made simple.
            </p>
          </div>

          <div className="feature-card">
            <Workflow className="feature-icon" />
            <h3>Custom Workflows</h3>
            <p>
              Adapt TaskRail to your team’s process — manage design sprints, dev cycles, or daily operations smoothly.
            </p>
          </div>

          <div className="feature-card">
            <Cloud className="feature-icon" />
            <h3>Cloud-Synced & Secure</h3>
            <p>
              Work from anywhere, with real-time updates and data that’s safely stored in the cloud.
            </p>
          </div>
        </div>
      </div>

      {/* ===== CALL TO ACTION SECTION ===== */}
      <div className="cta-section">
        <h2>Start building better projects today</h2>
        <p>
          Join teams who already organize their workflow with TaskRail. Fast, visual, and intuitive.
        </p>
        <Link to="/board" className="cta-btn large">
          Try TaskRail for Free →
        </Link>
      </div>
    </section>
  )
}
