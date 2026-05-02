import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  BedDouble,
  Stethoscope,
  Receipt,
  LogOut as DischargeIcon,
  LogOut,
  Hospital,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard',   label: 'Dashboard',        icon: LayoutDashboard },
  { id: 'admission',   label: 'Admission',         icon: UserPlus },
  { id: 'beds',        label: 'Bed Management',    icon: BedDouble },
  { id: 'ipd',         label: 'In-Patient (IPD)',  icon: Stethoscope },
  { id: 'billing',     label: 'Billing',           icon: Receipt },
  { id: 'discharge',   label: 'Discharge',         icon: DischargeIcon },
];

function Sidebar({ activeModule, setActiveModule, onLogout }) {
  return (
    <aside className="hms-sidebar">
      {/* Brand */}
      <div className="hms-sidebar-brand">
        <div className="hms-sidebar-logo">
          <Hospital size={26} strokeWidth={1.8} />
        </div>
        <div>
          <p className="hms-sidebar-name">Baba Bholenath</p>
          <p className="hms-sidebar-sub">Hospital Management</p>
        </div>
      </div>

      {/* Divider */}
      <div className="hms-sidebar-divider" />

      {/* Nav Links */}
      <div className="hms-sidebar-nav">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveModule(id)}
            className={`hms-sidebar-item${activeModule === id ? ' active' : ''}`}
          >
            <span className="hms-sidebar-icon">
              <Icon size={18} strokeWidth={2} />
            </span>
            <span>{label}</span>
            {activeModule === id && <span className="hms-sidebar-active-dot" />}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="hms-sidebar-footer">
        <button className="hms-sidebar-logout" onClick={onLogout}>
          <LogOut size={16} strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;