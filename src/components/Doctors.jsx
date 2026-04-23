import '../css/components/doctors.css';

const Doctors = () => {
  return (
    <section className="doctors" id="doctors">
      {/* Section Header */}
      <div className="section-label reveal">Meet Our Experts</div>
      <h2 className="section-title reveal">World-Class <em>Medical</em><br />Professionals</h2>
      {/* Doctors Grid */}
      <div className="doctor-grid">
        {/* Doctor Card 1 */}
        <div className="doctor-card reveal">
          <div className="doctor-card-top">
            <div className="doctor-avatar">DR</div>
            <div className="doctor-info-top">
              <h3>Dr. Rajesh Kumar</h3>
              <p>Chief Cardiologist</p>
            </div>
          </div>
          <div className="doctor-card-body">
            <div className="doctor-meta">
              <div className="meta-item">
                <div className="meta-label">Experience</div>
                <div className="meta-val">15 Years</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Qualification</div>
                <div className="meta-val">MD, DM</div>
              </div>
            </div>
            <div className="timing-bar">
              <i className="fas fa-clock"></i>
              Mon-Fri: 9AM-5PM
            </div>
          </div>
        </div>
        {/* Doctor Card 2 */}
        <div className="doctor-card reveal">
          <div className="doctor-card-top">
            <div className="doctor-avatar">DR</div>
            <div className="doctor-info-top">
              <h3>Dr. Priya Sharma</h3>
              <p>Senior Orthopedic Surgeon</p>
            </div>
          </div>
          <div className="doctor-card-body">
            <div className="doctor-meta">
              <div className="meta-item">
                <div className="meta-label">Experience</div>
                <div className="meta-val">12 Years</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Qualification</div>
                <div className="meta-val">MS, MCh</div>
              </div>
            </div>
            <div className="timing-bar">
              <i className="fas fa-clock"></i>
              Tue-Sat: 10AM-6PM
            </div>
          </div>
        </div>
        {/* Doctor Card 3 */}
        <div className="doctor-card reveal">
          <div className="doctor-card-top">
            <div className="doctor-avatar">DR</div>
            <div className="doctor-info-top">
              <h3>Dr. Amit Patel</h3>
              <p>Neurologist</p>
            </div>
          </div>
          <div className="doctor-card-body">
            <div className="doctor-meta">
              <div className="meta-item">
                <div className="meta-label">Experience</div>
                <div className="meta-val">10 Years</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Qualification</div>
                <div className="meta-val">MD, DM</div>
              </div>
            </div>
            <div className="timing-bar">
              <i className="fas fa-clock"></i>
              Mon-Wed: 8AM-4PM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;