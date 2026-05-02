import React, { useState } from 'react';
import { useHMS } from '../HMSContext';
import { Stethoscope, Pill, FlaskConical, Plus, ChevronDown, CheckCircle2, Clock } from 'lucide-react';

const TABS = [
  { id: 'consultations', label: 'Consultations',  icon: Stethoscope },
  { id: 'prescriptions', label: 'Prescriptions',  icon: Pill },
  { id: 'laborders',     label: 'Lab Orders',     icon: FlaskConical },
];

function IPD() {
  const { state, dispatch } = useHMS();
  const [selectedAdmId, setSelectedAdmId] = useState('');
  const [activeTab, setActiveTab] = useState('consultations');

  // New consultation form
  const [consForm, setConsForm] = useState({ symptoms: '', diagnosis: '', notes: '' });
  // New prescription item form
  const [rxItem, setRxItem] = useState({ medicineName: '', dosage: '', frequency: '', days: '', instructions: '' });
  // New lab order form
  const [labTestId, setLabTestId] = useState('');

  const selectedAdm = state.admissions.find(a => a.admissionId === selectedAdmId);
  const selectedPatient = selectedAdm ? state.patients.find(p => p.patientId === selectedAdm.patientId) : null;

  const patientConsultations = state.consultations.filter(c => c.patientId === selectedPatient?.patientId);
  const patientPrescriptions = state.prescriptions.filter(p => p.patientId === selectedPatient?.patientId);
  const patientLabOrders    = state.labOrders.filter(l => l.patientId === selectedPatient?.patientId);

  // Active (not-discharged) admissions
  const activeAdmissions = state.admissions.filter(a => a.status === 'Admitted');

  const handleAddConsultation = e => {
    e.preventDefault();
    const newCons = {
      consultationId: 'C' + String(Date.now()).slice(-6),
      appointmentId: null,
      patientId: selectedPatient.patientId,
      doctorId: selectedAdm.doctorId,
      symptoms: consForm.symptoms,
      diagnosis: consForm.diagnosis,
      notes: consForm.notes,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CONSULTATION', payload: newCons });
    setConsForm({ symptoms: '', diagnosis: '', notes: '' });
  };

  const handleAddPrescriptionItem = e => {
    e.preventDefault();
    // Ensure a prescription exists for this patient
    let rx = patientPrescriptions[0];
    if (!rx) {
      rx = {
        prescriptionId: 'RX' + String(Date.now()).slice(-6),
        consultationId: patientConsultations[0]?.consultationId || null,
        patientId: selectedPatient.patientId,
        doctorId: selectedAdm.doctorId,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_PRESCRIPTION', payload: rx });
    }
    dispatch({
      type: 'ADD_PRESCRIPTION_ITEM',
      payload: {
        itemId: 'RXI' + String(Date.now()).slice(-6),
        prescriptionId: rx.prescriptionId,
        ...rxItem,
        days: Number(rxItem.days),
      },
    });
    setRxItem({ medicineName: '', dosage: '', frequency: '', days: '', instructions: '' });
  };

  const handleAddLabOrder = e => {
    e.preventDefault();
    if (!labTestId) return;
    const test = state.labTests.find(t => t.testId === labTestId);
    const newOrder = {
      labOrderId: 'LO' + String(Date.now()).slice(-6),
      patientId: selectedPatient.patientId,
      doctorId: selectedAdm.doctorId,
      orderDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };
    dispatch({ type: 'ADD_LAB_ORDER', payload: newOrder });
    dispatch({
      type: 'ADD_LAB_ORDER_ITEM',
      payload: {
        itemId: 'LOI' + String(Date.now()).slice(-6),
        labOrderId: newOrder.labOrderId,
        testId: labTestId,
        result: '',
        normalRange: '',
        status: 'Pending',
      },
    });
    setLabTestId('');
  };

  const handleUpdateLabItem = (item, order) => {
    const result = window.prompt('Enter Lab Test Result:', item.result || '');
    if (result === null) return; // cancelled
    const normalRange = window.prompt('Enter Normal Range (optional):', item.normalRange || '');
    if (normalRange === null) return;

    // Update item status
    dispatch({
      type: 'UPDATE_LAB_ORDER_ITEM',
      payload: { ...item, result, normalRange, status: 'Completed' }
    });

    // Check if all items in the order are now completed
    const orderItems = state.labOrderItems.filter(i => i.labOrderId === order.labOrderId);
    const allCompleted = orderItems.every(i => i.itemId === item.itemId ? true : i.status === 'Completed');
    
    if (allCompleted && order.status !== 'Completed') {
      dispatch({
        type: 'UPDATE_LAB_ORDER',
        payload: { ...order, status: 'Completed' }
      });
    }
  };

  return (
    <div className="hms-main">
      {/* Page Header */}
      <section className="hms-page-header">
        <div className="hms-page-copy">
          <span className="hms-page-label">Clinical View — IPD</span>
          <h2>In-Patient Management</h2>
          <p>Doctor's dashboard for Consultations, Prescriptions, and Lab Orders per admitted patient.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="hms-mini-stat hms-mini-stat-blue" style={{ fontSize: '0.9rem' }}>
            <Stethoscope size={16} />
            <div><span>{activeAdmissions.length}</span><label>Active Patients</label></div>
          </span>
        </div>
      </section>

      {/* Patient Selector */}
      <div className="hms-card hms-patient-selector-card">
        <label className="hms-selector-label">Select Admitted Patient</label>
        <div className="hms-selector-wrap">
          <select
            value={selectedAdmId}
            onChange={e => setSelectedAdmId(e.target.value)}
            className="hms-select hms-select-large"
          >
            <option value="">— Choose a patient —</option>
            {activeAdmissions.map(adm => {
              const pat = state.patients.find(p => p.patientId === adm.patientId);
              return (
                <option key={adm.admissionId} value={adm.admissionId}>
                  {pat ? `${pat.firstName} ${pat.lastName}` : adm.patientId} — {adm.admissionId} ({adm.admissionDate})
                </option>
              );
            })}
          </select>
          <ChevronDown size={18} className="hms-selector-icon" />
        </div>
        {selectedPatient && (
          <div className="hms-patient-chip">
            <div className="hms-patient-avatar">{selectedPatient.firstName[0]}{selectedPatient.lastName[0]}</div>
            <div>
              <strong>{selectedPatient.firstName} {selectedPatient.lastName}</strong>
              <span>{selectedPatient.gender} • DOB: {selectedPatient.dob} • {selectedPatient.mobile}</span>
            </div>
            <span className={`hms-badge hms-badge-green`}>{selectedAdm?.admissionType}</span>
          </div>
        )}
      </div>

      {selectedPatient ? (
        <>
          {/* Tabs */}
          <div className="hms-tabs">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`hms-tab${activeTab === tab.id ? ' active' : ''}`}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── CONSULTATIONS ── */}
          {activeTab === 'consultations' && (
            <div className="hms-tab-content">
              <div className="hms-ipd-split">
                {/* Add Form */}
                <div className="hms-card">
                  <h3 className="hms-form-section-title"><Plus size={16} /> Add Consultation</h3>
                  <form onSubmit={handleAddConsultation} className="hms-form">
                    <div className="hms-input-block">
                      <label>Symptoms *</label>
                      <textarea
                        className="hms-textarea" rows={3}
                        value={consForm.symptoms}
                        onChange={e => setConsForm({ ...consForm, symptoms: e.target.value })}
                        placeholder="Describe presenting symptoms…"
                        required
                      />
                    </div>
                    <div className="hms-input-block">
                      <label>Diagnosis *</label>
                      <input
                        className="hms-input"
                        value={consForm.diagnosis}
                        onChange={e => setConsForm({ ...consForm, diagnosis: e.target.value })}
                        placeholder="e.g. Hypertension, Diabetes Type 2"
                        required
                      />
                    </div>
                    <div className="hms-input-block">
                      <label>Notes</label>
                      <textarea
                        className="hms-textarea" rows={2}
                        value={consForm.notes}
                        onChange={e => setConsForm({ ...consForm, notes: e.target.value })}
                        placeholder="Additional notes, recommendations…"
                      />
                    </div>
                    <button type="submit" className="hms-button">Add Consultation</button>
                  </form>
                </div>

                {/* History */}
                <div className="hms-card">
                  <h3 className="hms-form-section-title"><Stethoscope size={16} /> Consultation History</h3>
                  {patientConsultations.length === 0 ? (
                    <p className="hms-empty">No consultations recorded yet.</p>
                  ) : (
                    <div className="hms-timeline">
                      {patientConsultations.map(c => (
                        <div key={c.consultationId} className="hms-timeline-item">
                          <div className="hms-timeline-dot" />
                          <div className="hms-timeline-body">
                            <div className="hms-timeline-head">
                              <strong>{c.diagnosis}</strong>
                              <span className="hms-note">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p><span className="hms-label-sm">Symptoms:</span> {c.symptoms}</p>
                            {c.notes && <p><span className="hms-label-sm">Notes:</span> {c.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── PRESCRIPTIONS ── */}
          {activeTab === 'prescriptions' && (
            <div className="hms-tab-content">
              <div className="hms-ipd-split">
                {/* Add Form */}
                <div className="hms-card">
                  <h3 className="hms-form-section-title"><Plus size={16} /> Add Prescription Item</h3>
                  <form onSubmit={handleAddPrescriptionItem} className="hms-form">
                    <div className="hms-form-row hms-form-row-2">
                      <div className="hms-input-block">
                        <label>Medicine Name *</label>
                        <input className="hms-input" value={rxItem.medicineName} onChange={e => setRxItem({ ...rxItem, medicineName: e.target.value })} placeholder="e.g. Aspirin" required />
                      </div>
                      <div className="hms-input-block">
                        <label>Dosage *</label>
                        <input className="hms-input" value={rxItem.dosage} onChange={e => setRxItem({ ...rxItem, dosage: e.target.value })} placeholder="e.g. 75mg" required />
                      </div>
                      <div className="hms-input-block">
                        <label>Frequency *</label>
                        <select className="hms-select" value={rxItem.frequency} onChange={e => setRxItem({ ...rxItem, frequency: e.target.value })} required>
                          <option value="">Select</option>
                          <option>Once daily</option>
                          <option>Twice daily</option>
                          <option>Three times daily</option>
                          <option>Four times daily</option>
                          <option>SOS (as needed)</option>
                        </select>
                      </div>
                      <div className="hms-input-block">
                        <label>Days *</label>
                        <input type="number" className="hms-input" value={rxItem.days} onChange={e => setRxItem({ ...rxItem, days: e.target.value })} placeholder="No. of days" required />
                      </div>
                      <div className="hms-input-block" style={{ gridColumn: '1/-1' }}>
                        <label>Instructions</label>
                        <input className="hms-input" value={rxItem.instructions} onChange={e => setRxItem({ ...rxItem, instructions: e.target.value })} placeholder="e.g. After meals, with water" />
                      </div>
                    </div>
                    <button type="submit" className="hms-button">Add Medicine</button>
                  </form>
                </div>

                {/* Prescription Cards */}
                <div className="hms-card">
                  <h3 className="hms-form-section-title"><Pill size={16} /> Current Prescriptions</h3>
                  {(() => {
                    const items = state.prescriptionItems.filter(item =>
                      patientPrescriptions.some(rx => rx.prescriptionId === item.prescriptionId)
                    );
                    if (items.length === 0) return <p className="hms-empty">No prescriptions yet.</p>;
                    return (
                      <div className="hms-rx-list">
                        {items.map(item => (
                          <div key={item.itemId} className="hms-rx-item">
                            <div className="hms-rx-icon"><Pill size={16} /></div>
                            <div className="hms-rx-body">
                              <strong>{item.medicineName}</strong>
                              <span>{item.dosage} — {item.frequency} × {item.days} days</span>
                              {item.instructions && <span className="hms-note">{item.instructions}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ── LAB ORDERS ── */}
          {activeTab === 'laborders' && (
            <div className="hms-tab-content">
              <div className="hms-ipd-split">
                {/* Order Form */}
                <div className="hms-card">
                  <h3 className="hms-form-section-title"><Plus size={16} /> Order Lab Test</h3>
                  <form onSubmit={handleAddLabOrder} className="hms-form">
                    <div className="hms-input-block">
                      <label>Select Test *</label>
                      <select className="hms-select" value={labTestId} onChange={e => setLabTestId(e.target.value)} required>
                        <option value="">Choose a lab test</option>
                        {state.labTests.map(t => (
                          <option key={t.testId} value={t.testId}>{t.testName} — ₹{t.price}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="hms-button">Place Order</button>
                  </form>

                  {/* Available Tests */}
                  <div style={{ marginTop: 20 }}>
                    <h4 style={{ marginBottom: 10, color: 'var(--deep-teal)', fontSize: '0.9rem' }}>Available Tests</h4>
                    <div className="hms-lab-test-chips">
                      {state.labTests.map(t => (
                        <div key={t.testId} className="hms-lab-chip">
                          <FlaskConical size={14} />
                          <span>{t.testName}</span>
                          <span className="hms-chip-price">₹{t.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lab Orders History */}
                <div className="hms-card">
                  <h3 className="hms-form-section-title"><FlaskConical size={16} /> Lab Orders &amp; Results</h3>
                  {patientLabOrders.length === 0 ? (
                    <p className="hms-empty">No lab orders placed yet.</p>
                  ) : (
                    patientLabOrders.map(order => {
                      const orderItems = state.labOrderItems?.filter(i => i.labOrderId === order.labOrderId) || [];
                      return (
                        <div key={order.labOrderId} className="hms-lab-order-card">
                          <div className="hms-lab-order-head">
                            <span className="hms-badge hms-badge-info">{order.labOrderId}</span>
                            <span className="hms-note">{order.orderDate}</span>
                            <span className={`hms-badge ${order.status === 'Completed' ? 'hms-badge-green' : 'hms-badge-yellow'}`}>
                              {order.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                              {order.status}
                            </span>
                          </div>
                          <table className="hms-table hms-table-sm">
                            <thead>
                              <tr><th>Test</th><th>Result</th><th>Normal Range</th><th>Status</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                              {orderItems.map(item => {
                                const test = state.labTests.find(t => t.testId === item.testId);
                                return (
                                  <tr key={item.itemId}>
                                    <td>{test?.testName || item.testId}</td>
                                    <td>{item.result || '—'}</td>
                                    <td>{item.normalRange || '—'}</td>
                                    <td><span className={`hms-badge ${item.status === 'Completed' ? 'hms-badge-green' : 'hms-badge-yellow'}`}>{item.status}</span></td>
                                    <td>
                                      {item.status !== 'Completed' && (
                                        <button 
                                          className="hms-button-secondary" 
                                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                          onClick={() => handleUpdateLabItem(item, order)}
                                        >
                                          Enter Result
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="hms-card hms-empty-state">
          <Stethoscope size={48} strokeWidth={1} />
          <h3>Select a patient to view clinical records</h3>
          <p>Choose an admitted patient from the dropdown above.</p>
        </div>
      )}
    </div>
  );
}

export default IPD;