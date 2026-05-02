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
import { HMSProvider, useHMS } from './HMSContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientAdmission from './components/PatientAdmission';
import BedManagement from './components/BedManagement';
import IPD from './components/IPD';
import BillingModule from './components/BillingModule';
import Discharge from './components/Discharge';

function HMSApp() {
  const { state, dispatch } = useHMS();
  const [activeModule, setActiveModule] = useState('dashboard');

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  if (!state.isLoggedIn) {
    return <Login />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':  return <Dashboard setActiveModule={setActiveModule} />;
      case 'admission':  return <PatientAdmission />;
      case 'beds':       return <BedManagement />;
      case 'ipd':        return <IPD />;
      case 'billing':    return <BillingModule />;
      case 'discharge':  return <Discharge />;
      default:           return <Dashboard setActiveModule={setActiveModule} />;
    }
  };

  return (
    <div className="hms-shell">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} onLogout={handleLogout} />
      <main className="hms-content">
        {renderModule()}
      </main>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);

  const handleBookAppointment = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const handleStaffLogin = () => setIsStaffLoggedIn(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]');
    if (link) link.href = viteIcon;
  }, []);

  useScrollReveal();

  if (isStaffLoggedIn) {
    return (
      <HMSProvider>
        <HMSApp />
      </HMSProvider>
    );
  }

  return (
    <>
      <Nav
        onBookAppointment={handleBookAppointment}
        onToggleTheme={toggleTheme}
        theme={theme}
        onStaffLogin={handleStaffLogin}
      />
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