import '../css/components/footer.css';

const Footer = () => {
  return (
    <footer>
      {/* Footer Top */}
      <div className="footer-top">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="logo">
            <div className="cross"></div>
            <h2>Baba Bholenath Hospital</h2>
          </div>
          <p>Your trusted partner in health and wellness. Providing compassionate care with cutting-edge medical technology since 1996.</p>
          {/* Social Links */}
          <div className="social-links">
            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        {/* Quick Links Column */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#departments">Departments</a></li>
            <li><a href="#doctors">Our Doctors</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#info">Patient Info</a></li>
            <li><a href="#location">Contact Us</a></li>
          </ul>
        </div>
        {/* Services Column */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul className="footer-links">
            <li><a href="#">Emergency Care</a></li>
            <li><a href="#">Diagnostic Services</a></li>
            <li><a href="#">Surgery</a></li>
            <li><a href="#">Pharmacy</a></li>
            <li><a href="#">Health Checkups</a></li>
          </ul>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Baba Bholenath Hospital. All rights reserved. Made with <span>♥</span> for better healthcare.</p>
        {/* Legal Links */}
        <div>
          <a href="#" style={{ color: 'rgba(247,243,238,0.5)', textDecoration: 'none', marginRight: '20px' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'rgba(247,243,238,0.5)', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;