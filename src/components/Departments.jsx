import '../css/components/departments.css';

const Departments = () => {
  return (
    <section className="depts" id="departments">
      {/* Section Header */}
      <div className="depts-header reveal">
        <div>
          <div className="section-label">Our Specialities</div>
          <h2 className="section-title">Expert Care <em>Across</em><br />Every Specialty</h2>
        </div>
        <p className="section-desc">World-class treatment delivered by India's finest specialists, equipped with the latest medical technology.</p>
      </div>
      {/* Department Grid */}
      <div className="dept-grid">
        <div className="dept-card reveal">
          <div className="dept-icon"><i className="fas fa-heart-pulse"></i></div>
          <div className="dept-name">Cardiology</div>
          <div className="dept-desc">Heart & vascular care with cath lab & echo services</div>
        </div>
        <div className="dept-card reveal">
          <div className="dept-icon"><i className="fas fa-bone"></i></div>
          <div className="dept-name">Orthopedics</div>
          <div className="dept-desc">Joint replacements, fracture care & sports medicine</div>
        </div>
        <div className="dept-card reveal">
          <div className="dept-icon"><i className="fas fa-brain"></i></div>
          <div className="dept-name">Neurology</div>
          <div className="dept-desc">Brain & nervous system disorders treatment</div>
        </div>
        <div className="dept-card reveal">
          <div className="dept-icon"><i className="fas fa-lungs"></i></div>
          <div className="dept-name">Pulmonology</div>
          <div className="dept-desc">Respiratory diseases & critical care</div>
        </div>
        <div className="dept-card reveal">
          <div className="dept-icon"><i className="fas fa-stethoscope"></i></div>
          <div className="dept-name">General Medicine</div>
          <div className="dept-desc">Comprehensive primary healthcare services</div>
        </div>
      </div>
    </section>
  );
};

export default Departments;