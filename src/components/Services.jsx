import '../css/components/services.css';

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="services-layout">
        {/* Services List */}
        <div>
          <div className="section-label">What We Offer</div>
          <h2 className="section-title">Comprehensive <em>Healthcare</em><br />Solutions</h2>
          {/* Service Items */}
          <div className="service-list">
            <div className="service-item reveal">
              <div className="service-icon">
                <i className="fas fa-ambulance"></i>
              </div>
              <div className="service-text">
                <h4>24/7 Emergency Care</h4>
                <p>Round-the-clock emergency services with rapid response teams and advanced life support.</p>
              </div>
            </div>
            <div className="service-item reveal">
              <div className="service-icon">
                <i className="fas fa-microscope"></i>
              </div>
              <div className="service-text">
                <h4>Advanced Diagnostics</h4>
                <p>State-of-the-art laboratory and imaging services for accurate and timely diagnosis.</p>
              </div>
            </div>
            <div className="service-item reveal">
              <div className="service-icon">
                <i className="fas fa-syringe"></i>
              </div>
              <div className="service-text">
                <h4>Day Care Surgery</h4>
                <p>Minimally invasive procedures performed on an outpatient basis for faster recovery.</p>
              </div>
            </div>
            <div className="service-item reveal">
              <div className="service-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="service-text">
                <h4>Cardiac Services</h4>
                <p>Complete cardiovascular care including angiography, angioplasty, and cardiac surgery.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Services Visual Cards */}
        <div className="services-visual">
          <div className="visual-card">
            <div className="vc-icon"><i className="fas fa-users"></i></div>
            <h4>Patient Centered</h4>
            <p>Every treatment plan is tailored to individual patient needs and preferences.</p>
          </div>
          <div className="visual-card">
            <div className="vc-icon"><i className="fas fa-award"></i></div>
            <h4>NABH Accredited</h4>
            <p>Certified for quality healthcare services meeting international standards.</p>
          </div>
          <div className="visual-card">
            <div className="vc-icon"><i className="fas fa-shield-alt"></i></div>
            <h4>Cashless Treatment</h4>
            <p>Direct settlement with all major insurance providers for hassle-free billing.</p>
          </div>
          <div className="visual-card">
            <div className="vc-icon"><i className="fas fa-clock"></i></div>
            <h4>24/7 Support</h4>
            <p>Round-the-clock medical assistance and patient care services.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;