import '../css/components/location.css';

const Location = () => {
  return (
    <section className="location" id="location">
      {/* Section Header */}
      <div className="section-label reveal">Find Us</div>
      <h2 className="section-title reveal">Visit Our <em>Modern</em><br />Facility</h2>
      {/* Location Layout */}
      <div className="location-layout">
        {/* Contact Information */}
        <div className="contact-info">
          <div className="contact-item reveal">
            <div className="contact-item-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <h4>ADDRESS</h4>
              <p>123 Medical Center Road<br />Gandhi Nagar, Delhi - 110001<br />India</p>
            </div>
          </div>
          <div className="contact-item reveal">
            <div className="contact-item-icon">
              <i className="fas fa-phone"></i>
            </div>
            <div>
              <h4>PHONE</h4>
              <p>+91 98765 43210<br />+91 98765 43211</p>
            </div>
          </div>
          <div className="contact-item reveal">
            <div className="contact-item-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div>
              <h4>EMAIL</h4>
              <p>info@aarogyahospital.com<br />appointments@aarogyahospital.com</p>
            </div>
          </div>
        </div>
        {/* Map Placeholder */}
        <div className="map-placeholder">
          <i className="fas fa-map-marked-alt map-pin"></i>
          <div className="map-label">Baba Bholenath Hospital</div>
          <div className="map-addr">Near Aashapur Chuearha, Sarnath Road, Ashapur, Sarnath-221007, Uttar Pradesh</div>
        </div>
      </div>
    </section>
  );
};

export default Location;