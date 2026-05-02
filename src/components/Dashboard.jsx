import React from 'react';
import { useHMS } from '../HMSContext';
import {
  Users, BedDouble, Receipt, UserCheck, Stethoscope,
  TrendingUp, AlertCircle, Clock, Activity
} from 'lucide-react';

function Dashboard({ setActiveModule }) {
  const { state } = useHMS();

  const totalPatients = state.patients.length;
  const activeAdmissions = state.admissions.filter(a => a.status === 'Admitted').length;
  const availableBeds = state.beds.filter(b => b.status === 'Available').length;
  const occupiedBeds = state.beds.filter(b => b.status === 'Occupied').length;
  const pendingBills = state.bills.filter(b => b.status === 'Pending');
  const pendingAmount = pendingBills.reduce((s, b) => s + (b.totalAmount - b.paidAmount), 0);
  const totalDischarges = state.discharges.length;

  const STATS = [
    { label: 'Total Patients',    value: totalPatients,    icon: Users,       color: 'blue',   module: 'admission' },
    { label: 'Active Admissions', value: activeAdmissions, icon: Activity,    color: 'teal',   module: 'ipd' },
    { label: 'Available Beds',    value: availableBeds,    icon: BedDouble,   color: 'green',  module: 'beds' },
    { label: 'Occupied Beds',     value: occupiedBeds,     icon: BedDouble,   color: 'orange', module: 'beds' },
    { label: 'Pending Bills',     value: pendingBills.length, icon: Receipt,  color: 'red',    module: 'billing' },
    { label: 'Total Discharged',  value: totalDischarges,  icon: UserCheck,   color: 'purple', module: 'discharge' },
  ];

  const COLOR_MAP = {
    blue:   { bg: '#EFF6FF', text: '#1D4ED8' },
    teal:   { bg: '#F0FDFA', text: '#0D9488' },
    green:  { bg: '#F0FDF4', text: '#15803D' },
    orange: { bg: '#FFF7ED', text: '#C2410C' },
    red:    { bg: '#FEF2F2', text: '#B91C1C' },
    purple: { bg: '#FAF5FF', text: '#7E22CE' },
  };

  return (
    <div className="hms-main">
      {/* Page Header */}
      <section className="hms-page-header">
        <div className="hms-page-copy">
          <span className="hms-page-label">Hospital Control Panel</span>
          <h2>Welcome back, Admin.</h2>
          <p>Here's an overview of Baba Bholenath Hospital's current status — admissions, beds, billing, and more.</p>
        </div>
        <div className="hms-actions">
          <button className="hms-button-secondary" onClick={() => setActiveModule('admission')}>New Admission</button>
          <button className="hms-button" onClick={() => setActiveModule('billing')}>Generate Bill</button>
        </div>
      </section>

      {/* Stat Cards */}
      <section className="hms-section">
        <div className="hms-dashboard-grid">
          {STATS.map(stat => {
            const Icon = stat.icon;
            const col = COLOR_MAP[stat.color];
            return (
              <button
                key={stat.label}
                className="hms-stat-card"
                onClick={() => setActiveModule(stat.module)}
              >
                <div className="hms-stat-icon" style={{ background: col.bg, color: col.text }}>
                  <Icon size={22} strokeWidth={2} />
                </div>
                <div className="hms-stat-body">
                  <p className="hms-stat-value" style={{ color: col.text }}>{stat.value}</p>
                  <p className="hms-stat-label">{stat.label}</p>
                </div>
                <TrendingUp size={14} className="hms-stat-trend" style={{ color: col.text }} />
              </button>
            );
          })}
        </div>
      </section>

      {/* Pending Balance Alert */}
      {pendingAmount > 0 && (
        <div className="hms-alert-card">
          <AlertCircle size={20} />
          <div>
            <strong>Pending Collection: ₹{pendingAmount.toLocaleString()}</strong>
            <p>{pendingBills.length} bill(s) have outstanding balance. Visit Billing to record payments.</p>
          </div>
          <button className="hms-button-secondary hms-btn-sm" onClick={() => setActiveModule('billing')}>
            Go to Billing →
          </button>
        </div>
      )}

      {/* Two-column */}
      <div className="hms-grid hms-grid-2" style={{ marginTop: 24 }}>
        {/* Recent Admissions */}
        <div className="hms-card">
          <div className="hms-card-head">
            <h3><Stethoscope size={16} /> Recent Admissions</h3>
            <button className="hms-link" onClick={() => setActiveModule('admission')}>View all →</button>
          </div>
          {state.admissions.length === 0 ? (
            <p className="hms-empty">No admissions yet.</p>
          ) : (
            <div className="hms-recent-list">
              {state.admissions.slice(-5).reverse().map(adm => {
                const pat = state.patients.find(p => p.patientId === adm.patientId);
                return (
                  <div key={adm.admissionId} className="hms-recent-row">
                    <div className="hms-patient-avatar hms-avatar-sm">
                      {pat?.firstName?.[0]}{pat?.lastName?.[0]}
                    </div>
                    <div className="hms-recent-info">
                      <strong>{pat ? `${pat.firstName} ${pat.lastName}` : '—'}</strong>
                      <span className="hms-note">{adm.admissionDate} · {adm.admissionType}</span>
                    </div>
                    <span className={`hms-badge ${adm.status === 'Admitted' ? 'hms-badge-green' : 'hms-badge-muted'}`}>
                      {adm.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bed Occupancy */}
        <div className="hms-card">
          <div className="hms-card-head">
            <h3><BedDouble size={16} /> Bed Occupancy by Room Type</h3>
            <button className="hms-link" onClick={() => setActiveModule('beds')}>Manage →</button>
          </div>
          {['General', 'Private', 'ICU'].map(type => {
            const typeBeds = state.beds.filter(b => {
              const room = state.rooms.find(r => r.roomId === b.roomId);
              return room?.roomType === type;
            });
            const occ = typeBeds.filter(b => b.status === 'Occupied').length;
            const pct = typeBeds.length > 0 ? Math.round((occ / typeBeds.length) * 100) : 0;
            return (
              <div key={type} className="hms-occ-row">
                <span className={`hms-room-type-pill hms-rtype-${type.toLowerCase()}`}>{type}</span>
                <div className="hms-occ-bar-wrap">
                  <div className="hms-occ-bar">
                    <div className="hms-occ-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="hms-note">{occ}/{typeBeds.length}</span>
                </div>
              </div>
            );
          })}

          {/* Quick Pending Bills */}
          <div className="hms-card-head" style={{ marginTop: 24 }}>
            <h3><Receipt size={16} /> Billing Summary</h3>
          </div>
          {state.bills.slice(0, 3).map(bill => {
            const pat = state.patients.find(p => p.patientId === bill.patientId);
            const bal = bill.totalAmount - bill.paidAmount;
            return (
              <div key={bill.billId} className="hms-recent-row">
                <div>
                  <strong>{pat ? `${pat.firstName} ${pat.lastName}` : '—'}</strong>
                  <span className="hms-note"> · {bill.billId}</span>
                </div>
                <span className={`hms-badge ${bill.status === 'Paid' ? 'hms-badge-green' : 'hms-badge-yellow'}`}>
                  {bill.status} {bal > 0 ? `· ₹${bal.toLocaleString()} due` : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;