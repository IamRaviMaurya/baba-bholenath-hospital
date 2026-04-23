import '../css/components/hero.css';

const Hero = ({ onBookAppointment }) => {
  return (
    <section className="hero" style={{ padding: 0, paddingTop: '80px' }}>
      {/* Left Side Content */}
      <div className="hero-left">
        {/* Badge */}
        <div className="hero-badge">
          <i className="fas fa-shield-heart"></i>
          Cashless Treatment Available
        </div>
        {/* Main Title */}
        <h1 className="hero-title">
          Caring for You<br />
          with <em>Precision</em><br />
          & Compassion
        </h1>
        {/* Subtitle */}
        <p className="hero-sub">
          A premier multispeciality hospital combining advanced medical technology with the warmth of personalised care. Your health is our highest calling.
        </p>
        {/* Action Buttons */}
        <div className="hero-actions">
          <a href="#" className="btn-primary" onClick={onBookAppointment}>Book Appointment</a>
          <a href="#departments" className="btn-outline">Our Departments</a>
        </div>
        {/* Emergency Contact Strip */}
        <div className="emergency-strip">
          <div className="pulse"></div>
          <div>
            <p>24/7 Emergency Helpline</p>
            <strong>+91 98765 43210</strong>
          </div>
        </div>
      </div>

      {/* Right Side Content */}
      <div className="hero-right">
        {/* Background Image Placeholder */}
        <div className="hero-img-bg"></div>
        {/* Statistics Cards */}
        <div className="hero-stats">
          <div className="stat-card">
            <div className="number">5,000+</div>
            <div className="label">Patients Treated</div>
          </div>
          <div className="stat-card">
            <div className="number">25+</div>
            <div className="label">Specialist Doctors</div>
          </div>
          <div className="stat-card">
            <div className="number">15 Yrs</div>
            <div className="label">Of Excellence</div>
          </div>
        </div>
        {/* Illustration SVG */}
        <div className="hero-illustration">
          <svg viewBox="0 0 340 380" xmlns="http://www.w3.org/2000/svg">
            {/* Hospital building */}
            <rect x="60" y="160" width="220" height="200" rx="8" fill="#0D3D38"/>
            <rect x="80" y="100" width="180" height="80" rx="6" fill="#1A6B5C"/>
            {/* Cross on building */}
            <rect x="148" y="50" width="44" height="14" rx="4" fill="#C9A84C"/>
            <rect x="162" y="36" width="16" height="42" rx="4" fill="#C9A84C"/>
            {/* Windows */}
            <rect x="88" y="178" width="36" height="36" rx="4" fill="rgba(255,255,255,0.15)"/>
            <rect x="152" y="178" width="36" height="36" rx="4" fill="rgba(255,255,255,0.15)"/>
            <rect x="216" y="178" width="36" height="36" rx="4" fill="rgba(255,255,255,0.15)"/>
            <rect x="88" y="230" width="36" height="36" rx="4" fill="rgba(255,255,255,0.1)"/>
            <rect x="216" y="230" width="36" height="36" rx="4" fill="rgba(255,255,255,0.1)"/>
            {/* Door */}
            <rect x="140" y="290" width="60" height="70" rx="6" fill="rgba(201,168,76,0.3)"/>
            <circle cx="190" cy="326" r="4" fill="var(--gold)"/>
            {/* Ground */}
            <rect x="0" y="355" width="340" height="25" rx="4" fill="#E8F5F2"/>
            {/* Trees */}
            <rect x="28" y="320" width="8" height="36" rx="2" fill="#1A6B5C"/>
            <circle cx="32" cy="305" r="22" fill="#2E9E84" opacity="0.7"/>
            <rect x="298" y="320" width="8" height="36" rx="2" fill="#1A6B5C"/>
            <circle cx="302" cy="305" r="22" fill="#2E9E84" opacity="0.7"/>
            {/* Ambulance */}
            <rect x="100" y="330" width="60" height="28" rx="4" fill="white"/>
            <rect x="100" y="330" width="20" height="28" rx="4" fill="#2E9E84"/>
            <rect x="112" y="336" width="8" height="2" rx="1" fill="white"/>
            <rect x="115" y="333" width="2" height="8" rx="1" fill="white"/>
            <circle cx="115" cy="360" r="5" fill="#1C1C1E"/>
            <circle cx="150" cy="360" r="5" fill="#1C1C1E"/>
            {/* Heartbeat line */}
            <polyline points="0,40 60,40 80,10 100,70 120,40 200,40 220,5 240,75 260,40 340,40" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;