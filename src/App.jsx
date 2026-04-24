import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Departments from './components/Departments';
import Doctors from './components/Doctors';
import Services from './components/Services';
import PatientInfo from './components/PatientInfo';
import Location from './components/Location';
import Footer from './components/Footer';
import Modal from './components/Modal';
import useScrollReveal from './hooks/useScrollReveal';
import viteIcon from './assets/gemini-svg.svg?url';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleBookAppointment = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = viteIcon;
    }
  }, []);

  // Initialize scroll reveal
  useScrollReveal();

  return (
    <>
      <Nav onBookAppointment={handleBookAppointment} onToggleTheme={toggleTheme} theme={theme} />
      <Hero onBookAppointment={handleBookAppointment} />
      <Marquee />
      <Departments />
      <Doctors />
      <Services />
      <PatientInfo />
      <Location />
      <Footer />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default App;