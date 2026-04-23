import { useState } from 'react';
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

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookAppointment = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Initialize scroll reveal
  useScrollReveal();

  return (
    <>
      <Nav onBookAppointment={handleBookAppointment} />
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