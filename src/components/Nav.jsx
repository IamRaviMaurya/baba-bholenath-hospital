import { useEffect, useState } from 'react';
import '../css/components/nav.css';

const Nav = ({ onBookAppointment, onToggleTheme, theme, onStaffLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (nav && window.scrollY > 60) {
        nav.style.boxShadow = '0 4px 30px rgba(13,61,56,0.12)';
      } else if (nav) {
        nav.style.boxShadow = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav>
      {/* Logo Section */}
      <div className="nav-logo">
        <div className="cross"></div>
        <h1>Baba Bholenath Hospital</h1>
      </div>
      
      {/* Hamburger Menu Button */}
      <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      {/* Navigation Links */}
      <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <li><a href="#departments" onClick={handleLinkClick}>Departments</a></li>
        <li><a href="#doctors" onClick={handleLinkClick}>Doctors</a></li>
        <li><a href="#services" onClick={handleLinkClick}>Services</a></li>
        <li><a href="#info" onClick={handleLinkClick}>Patient Info</a></li>
        <li><a href="#location" onClick={handleLinkClick}>Contact</a></li>
        <li><a href="#" className="nav-cta staff-login" onClick={() => { handleLinkClick(); onStaffLogin(); }}>Staff Login</a></li>
        <li><a href="#" className="nav-cta" onClick={() => { handleLinkClick(); onBookAppointment(); }}>Book Appointment</a></li>
        <li>
  <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
    <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
  </button>
</li>
      </ul>
    </nav>
  );
};

export default Nav;