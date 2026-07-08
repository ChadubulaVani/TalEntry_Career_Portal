import { useNavigate } from "react-router-dom";
import "./Home.css";
import designerLogo from "../assets/Designer.png";
import TalentryCard from "../assets/Talentry Card.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
          <div className="brand" onClick={() => navigate("/")}>
            <div className="logo-dot">
              <img src={designerLogo} alt="Talentry" />
            </div>
            <span className="brand-name">TALENTRY</span>
          </div>

          <nav className="nav-links">
            <button
              className="link"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Features
            </button>

            <button
              className="link"
              onClick={() =>
                document
                  .getElementById("how")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              How it Works
            </button>

            <button
              className="link"
              onClick={() =>
                document
                  .getElementById("faq")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              FAQ
            </button>
          </nav>

          <div className="nav-actions">
            <button className="ghost" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="primary" onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          {/* LEFT */}
          <div className="hero-left">
            <div className="brand-banner">
              <div className="banner-logo-area">
                <img src={TalentryCard} alt="Talentry Card" />
              </div>
              <br />

              <div className="banner-text">
                <h3>Talentry Career Platform</h3>
                <h4>Talent + Entry → Your Gateway to Opportunities</h4>
              </div>
            </div>
            <br />

            <div className="pill">
              🚀 Career-ready platform for Students • Recruiters • Admin
            </div>

            <h1 className="hero-title">
              Build your profile.{" "}
              <span className="grad">Apply jobs faster.</span> Grow your career
              with confidence ✨
            </h1>

            <p className="hero-sub">
              A professional career portal to manage your profile, explore
              opportunities, track applications, and prepare for interviews —
              all in one place.
            </p>

            <div className="hero-cta">
              <button
                className="cta-primary"
                onClick={() => navigate("/register")}
              >
                🎯 Create Account
              </button>

              <button
                className="cta-secondary"
                onClick={() => navigate("/jobs")}
              >
                💼 Explore Jobs
              </button>
            </div>

            <div className="trust">
              <span>✅ Resume Builder</span>
              <span>✅ Interview Prep</span>
              <span>✅ Application Tracking</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-right">
            <div className="mock">
              <div className="mock-top">
                <div className="dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="mock-title">Student Dashboard Preview</div>
              </div>

              <div className="mock-body">
                <div className="mock-card big">
                  <div className="mc-head">
                    <div className="mc-title">Welcome back 👋</div>
                    <div className="mc-badge">STUDENT</div>
                  </div>
                  <div className="mc-sub">
                    Track your profile, applications and interview prep.
                  </div>
                </div>

                <div className="mock-grid">
                  <div className="mock-card">
                    <div className="mc-title">Profile</div>
                    <div className="mc-num">70%</div>
                    <div className="mc-sub">Complete your skills</div>
                  </div>

                  <div className="mock-card">
                    <div className="mc-title">Applications</div>
                    <div className="mc-num">4</div>
                    <div className="mc-sub">Track statuses</div>
                  </div>

                  <div className="mock-card">
                    <div className="mc-title">Resume</div>
                    <div className="mc-num">PDF</div>
                    <div className="mc-sub">Download instantly</div>
                  </div>

                  <div className="mock-card">
                    <div className="mc-title">Interview</div>
                    <div className="mc-num">Prep</div>
                    <div className="mc-sub">Daily practice</div>
                  </div>
                </div>

                <div className="mock-footer">
                  <button className="mini">Update Profile</button>
                  <button className="mini">View Jobs</button>
                  <button className="mini primary">Apply Now</button>
                </div>
              </div>
            </div>

            <div className="glow" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-inner">
          <div className="stat">
            <div className="stat-num">1</div>
            <div className="stat-text">Platform for all career needs</div>
          </div>

          <div className="stat">
            <div className="stat-num">3+</div>
            <div className="stat-text">Modules: Jobs, Resume, Interview</div>
          </div>

          <div className="stat">
            <div className="stat-num">100%</div>
            <div className="stat-text">Student-friendly and simple UI</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-inner">
          <h2 className="section-title">✨ Features that help you stand out</h2>
          <p className="section-sub">
            Everything you need to build your career profile and apply with
            confidence.
          </p>

          <div className="feature-grid">
            <div className="feature">
              <div className="icon">👤</div>
              <h3>Smart Profile</h3>
              <p>Update skills, education, links and improve visibility.</p>
            </div>
            <div className="feature">
              <div className="icon">💼</div>
              <h3>Jobs Explorer</h3>
              <p>Search jobs by skill, type, location and apply faster.</p>
            </div>
            <div className="feature">
              <div className="icon">📌</div>
              <h3>Track Applications</h3>
              <p>See what you applied for and manage applications easily.</p>
            </div>
            <div className="feature">
              <div className="icon">🧾</div>
              <h3>Resume Builder</h3>
              <p>Create a resume and download as PDF with one click.</p>
            </div>
            <div className="feature">
              <div className="icon">🎤</div>
              <h3>Interview Prep</h3>
              <p>Practice HR/Technical/Aptitude questions daily.</p>
            </div>
            <div className="feature">
              <div className="icon">🔒</div>
              <h3>Secure Login</h3>
              <p>Protected routes and user sessions using JWT storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how" id="how">
        <div className="section-inner">
          <h2 className="section-title">🧭 How it works</h2>
          <p className="section-sub">A simple flow designed for students.</p>

          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div>
                <h3>Create account</h3>
                <p>Register and login to access your dashboard.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div>
                <h3>Build profile + resume</h3>
                <p>Fill your profile and generate a resume PDF.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div>
                <h3>Apply and prepare</h3>
                <p>Apply for jobs and practice interview questions daily.</p>
              </div>
            </div>
          </div>

          <div className="how-cta">
            <button
              className="cta-primary"
              onClick={() => navigate("/register")}
            >
              🚀 Start Now
            </button>
            <button
              className="cta-secondary"
              onClick={() => navigate("/login")}
            >
              🔑 I already have an account
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">💬 Students love the simplicity</h2>
          <p className="section-sub">
            A clean platform that focuses on real needs.
          </p>

          <div className="test-grid">
            <div className="test">
              <p>
                “The resume builder and interview prep helped me prepare quickly
                before placements.”
              </p>
              <div className="who">— Student</div>
            </div>
            <div className="test">
              <p>
                “Applying and tracking applications is super easy. UI looks
                premium!”
              </p>
              <div className="who">— Student</div>
            </div>
            <div className="test">
              <p>
                “Everything is in one place — profile, jobs, resume, prep.
                Perfect for campus.”
              </p>
              <div className="who">— Student</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="section-inner">
          <h2 className="section-title">❓ FAQ</h2>

          <div className="faq">
            <details>
              <summary>Who can use the Career Portal?</summary>
              <p>
                Students, recruiters, and administrators can use the portal
                based on their assigned roles and permissions.
              </p>
            </details>
            <details>
              <summary>How can I apply for a job?</summary>
              <p>
                After logging in, browse available jobs and click the Apply
                button.
              </p>
            </details>
            <details>
              <summary>Can I update my profile after registration?</summary>
              <p>Yes. You can edit your details anytime.</p>
            </details>
            <details>
              <summary>Can recruiters post jobs?</summary>
              <p>Yes. Recruiters can manage multiple job postings.</p>
            </details>
            <details>
              <summary>How do I track applications?</summary>
              <p>From Applications section in dashboard.</p>
            </details>
            <details>
              <summary>Is my data secure?</summary>
              <p>Yes. JWT authentication and secure storage used.</p>
            </details>
            <details>
              <summary>Can I upload resume?</summary>
              <p>Yes. Upload and update anytime.</p>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="foot-left">
            <div className="brand small">
              <div className="logo-dot">
                <img src={designerLogo} alt="Talentry" />
              </div>
              <span className="brand-name">TALENTRY</span>
            </div>
            <p className="foot-sub">Build. Apply. Prepare. Grow.</p>
          </div>

          <div className="foot-right">
            <button className="link" onClick={() => navigate("/jobs")}>
              Jobs
            </button>
            <button className="link" onClick={() => navigate("/resume")}>
              Resume
            </button>
            <button
              className="link"
              onClick={() => navigate("/interview-prep")}
            >
              Interview
            </button>
            <button className="link" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} TALENTRY | Career Portal • Built with
          MERN
        </div>
      </footer>
    </div>
  );
}

export default Home;
