import React from 'react';
import { Home, UserPlus, Stethoscope, Receipt, LogOut } from 'lucide-react';

function HMSNav({ activeModule, setActiveModule, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'admission', label: 'Patient Admission', icon: UserPlus },
    { id: 'ipd', label: 'In-Patient Management', icon: Stethoscope },
    { id: 'billing', label: 'Billing & Inventory', icon: Receipt },
    { id: 'discharge', label: 'Discharge', icon: LogOut },
  ];

  return (
    <header className="hms-topbar">
      <div className="hms-topbar-brand">
        <div className="hms-topbar-logo"></div>
        <div>
          <p className="hms-topbar-label">Baba Bholenath Hospital</p>
          <h1 className="hms-topbar-title">Staff Management</h1>
        </div>
      </div>
      <nav className="hms-topbar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`hms-topbar-item ${activeModule === item.id ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </button>
          );
        })}
        <button className="hms-topbar-cta" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default HMSNav;
