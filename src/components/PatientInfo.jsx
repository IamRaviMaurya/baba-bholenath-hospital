import '../css/components/patient-info.css';

const PatientInfo = () => {
  return (
    <section className="patient-info" id="info">
      {/* Section Header */}
      <div className="section-label reveal">Patient Resources</div>
      <h2 className="section-title reveal">Everything You Need <em>to Know</em></h2>
      {/* Info Grid */}
      <div className="info-grid">
        {/* Appointment Booking Card */}
        <div className="info-card reveal">
          <div className="info-card-header">
            <div className="info-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>Appointment Booking</h3>
          </div>
          <div className="info-row">
            <span className="key">Online Booking</span>
            <span className="val">Available 24/7</span>
          </div>
          <div className="info-row">
            <span className="key">Phone Booking</span>
            <span className="val">+91 98765 43210</span>
          </div>
          <div className="info-row">
            <span className="key">Walk-in</span>
            <span className="val">No appointment needed</span>
          </div>
        </div>
        {/* Visiting Hours Card */}
        <div className="info-card reveal">
          <div className="info-card-header">
            <div className="info-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>Visiting Hours</h3>
          </div>
          <div className="info-row">
            <span className="key">OPD Hours</span>
            <span className="val">8:00 AM - 8:00 PM</span>
          </div>
          <div className="info-row">
            <span className="key">Emergency</span>
            <span className="val">24 Hours Open</span>
          </div>
          <div className="info-row">
            <span className="key">Pharmacy</span>
            <span className="val">24 Hours Open</span>
          </div>
        </div>
        {/* Insurance & Billing Card */}
        <div className="info-card reveal">
          <div className="info-card-header">
            <div className="info-icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <h3>Insurance & Billing</h3>
          </div>
          <div className="info-row">
            <span className="key">Cashless</span>
            <span className="val">All major insurers</span>
          </div>
          <div className="info-row">
            <span className="key">TPA Support</span>
            <span className="val">Dedicated team</span>
          </div>
          {/* Insurance Logos */}
          <div className="insurance-logos">
            <span className="ins-badge">Star Health</span>
            <span className="ins-badge">ICICI Lombard</span>
            <span className="ins-badge">HDFC Ergo</span>
            <span className="ins-badge">Bajaj Allianz</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientInfo;