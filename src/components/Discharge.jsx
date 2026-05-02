import React, { useState } from 'react';
import { useHMS } from '../HMSContext';
import { FileText, Calendar, Lightbulb, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

function Discharge() {
  const { state, dispatch } = useHMS();
  const [selectedAdmId, setSelectedAdmId] = useState('');
  const [form, setForm] = useState({
    summary: '',
    advice: '',
    followUpDate: '',
  });
  const [discharged, setDischarged] = useState(false);

  const activeAdmissions = state.admissions.filter(a => a.status === 'Admitted');
  const selectedAdm = state.admissions.find(a => a.admissionId === selectedAdmId);
  const patient = state.patients.find(p => p.patientId === selectedAdm?.patientId);
  const doctor = state.doctors.find(d => d.doctorId === selectedAdm?.doctorId);

  const patientBill = state.bills.find(b => b.admissionId === selectedAdmId);
  const hasBalance = patientBill && patientBill.totalAmount > patientBill.paidAmount;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDischarge = e => {
    e.preventDefault();
    const dischargeId = 'DIS' + String(Date.now()).slice(-6);
    dispatch({
      type: 'ADD_DISCHARGE',
      payload: {
        dischargeId,
        admissionId: selectedAdmId,
        summary: form.summary,
        advice: form.advice,
        followUpDate: form.followUpDate,
        createdAt: new Date().toISOString(),
      },
    });
    setDischarged(true);
  };

  const reset = () => {
    setSelectedAdmId('');
    setForm({ summary: '', advice: '', followUpDate: '' });
    setDischarged(false);
  };

  if (discharged) {
    return (
      <div className="hms-main">
        <div className="hms-success-card">
          <UserCheck size={64} className="hms-success-icon" />
          <h2>Patient Discharged Successfully!</h2>
          <p>
            <strong>{patient?.firstName} {patient?.lastName}</strong> has been discharged.
            {form.followUpDate && ` Follow-up scheduled on ${form.followUpDate}.`}
          </p>
          <button className="hms-button" onClick={reset}>Discharge Another Patient</button>
        </div>
      </div>
    );
  }

  return (
    <div className="hms-main">
      {/* Page Header */}
      <section className="hms-page-header">
        <div className="hms-page-copy">
          <span className="hms-page-label">Discharges Table</span>
          <h2>Discharge Patient</h2>
          <p>Complete the discharge summary, add advice and follow-up date, then toggle the admission status to 'Discharged'.</p>
        </div>
      </section>

      {/* Patient Selection */}
      <div className="hms-card" style={{ marginBottom: 24 }}>
        <h3 className="hms-form-section-title"><UserCheck size={18} /> Select Patient for Discharge</h3>
        {activeAdmissions.length === 0 ? (
          <p className="hms-empty">No admitted patients at this time.</p>
        ) : (
          <div className="hms-discharge-patient-grid">
            {activeAdmissions.map(adm => {
              const pat = state.patients.find(p => p.patientId === adm.patientId);
              const doc = state.doctors.find(d => d.doctorId === adm.doctorId);
              const bill = state.bills.find(b => b.admissionId === adm.admissionId);
              const pendingBal = bill ? bill.totalAmount - bill.paidAmount : 0;
              return (
                <label
                  key={adm.admissionId}
                  className={`hms-discharge-patient-card${selectedAdmId === adm.admissionId ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="selectedAdmId"
                    value={adm.admissionId}
                    checked={selectedAdmId === adm.admissionId}
                    onChange={() => setSelectedAdmId(adm.admissionId)}
                  />
                  <div className="hms-patient-avatar">{pat?.firstName?.[0]}{pat?.lastName?.[0]}</div>
                  <div className="hms-discharge-info">
                    <strong>{pat ? `${pat.firstName} ${pat.lastName}` : '—'}</strong>
                    <span>Dr. {doc?.firstName} {doc?.lastName}</span>
                    <span className="hms-note">Admitted: {adm.admissionDate} · {adm.admissionType}</span>
                    {pendingBal > 0 && (
                      <span className="hms-discharge-balance-warn">
                        <AlertTriangle size={12} /> ₹{pendingBal.toLocaleString()} balance due
                      </span>
                    )}
                  </div>
                  <span className="hms-badge hms-badge-green">Admitted</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Discharge Form */}
      {selectedAdm && (
        <form onSubmit={handleDischarge}>
          <div className="hms-discharge-grid">
            {/* Main Form */}
            <div className="hms-card">
              <h3 className="hms-form-section-title"><FileText size={18} /> Discharge Summary (Discharges Table)</h3>
              <div className="hms-form">
                <div className="hms-input-block">
                  <label>Discharge Summary *</label>
                  <textarea
                    name="summary"
                    value={form.summary}
                    onChange={handleChange}
                    className="hms-textarea"
                    rows={5}
                    placeholder="Provide a detailed clinical summary of the patient's hospital stay, treatment given, and outcomes…"
                    required
                  />
                </div>
                <div className="hms-input-block">
                  <label><Lightbulb size={14} style={{ display: 'inline', marginRight: 6 }} />Post-Discharge Advice *</label>
                  <textarea
                    name="advice"
                    value={form.advice}
                    onChange={handleChange}
                    className="hms-textarea"
                    rows={3}
                    placeholder="Diet instructions, medication reminders, activity restrictions, warning signs to watch for…"
                    required
                  />
                </div>
                <div className="hms-input-block">
                  <label><Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />Follow-Up Date</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={form.followUpDate}
                    onChange={handleChange}
                    className="hms-input"
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </div>

                {/* Status Toggle Preview */}
                <div className="hms-status-toggle">
                  <div className="hms-status-toggle-label">Admission Status will change to:</div>
                  <div className="hms-status-toggle-track">
                    <span className="hms-badge hms-badge-green hms-status-admitted">Admitted</span>
                    <div className="hms-status-arrow">→</div>
                    <span className="hms-badge hms-badge-muted hms-status-discharged">Discharged</span>
                  </div>
                </div>

                {hasBalance && (
                  <div className="hms-discharge-warning">
                    <AlertTriangle size={18} />
                    <div>
                      <strong>Pending Payment</strong>
                      <p>This patient has an outstanding balance of ₹{(patientBill.totalAmount - patientBill.paidAmount).toLocaleString()}. Please clear dues before discharge.</p>
                    </div>
                  </div>
                )}

                <div className="hms-actions">
                  <button type="submit" className="hms-button hms-button-gold">
                    <CheckCircle2 size={16} /> Confirm Discharge
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel — Patient Summary */}
            <div>
              <div className="hms-card hms-discharge-summary-card">
                <h3 className="hms-form-section-title">Patient Summary</h3>
                <div className="hms-summary-avatar">
                  {patient?.firstName?.[0]}{patient?.lastName?.[0]}
                </div>
                <h4>{patient?.firstName} {patient?.lastName}</h4>
                <p className="hms-note">{patient?.gender} · DOB: {patient?.dob}</p>
                <div className="hms-summary-divider" />
                <div className="hms-summary-row"><label>Admission ID</label><span>{selectedAdm.admissionId}</span></div>
                <div className="hms-summary-row"><label>Admitted On</label><span>{selectedAdm.admissionDate}</span></div>
                <div className="hms-summary-row"><label>Type</label><span>{selectedAdm.admissionType}</span></div>
                <div className="hms-summary-row"><label>Doctor</label><span>Dr. {doctor?.firstName} {doctor?.lastName}</span></div>
                <div className="hms-summary-row"><label>Specialization</label><span>{doctor?.specialization}</span></div>
                {patientBill && (
                  <>
                    <div className="hms-summary-divider" />
                    <div className="hms-summary-row"><label>Bill Amount</label><span>₹{patientBill.totalAmount?.toLocaleString()}</span></div>
                    <div className="hms-summary-row"><label>Paid</label><span>₹{patientBill.paidAmount?.toLocaleString()}</span></div>
                    <div className="hms-summary-row">
                      <label>Balance</label>
                      <span className={hasBalance ? 'hms-text-red' : 'hms-text-green'}>
                        ₹{(patientBill.totalAmount - patientBill.paidAmount).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Discharge History */}
              {state.discharges.length > 0 && (
                <div className="hms-card" style={{ marginTop: 20 }}>
                  <h3 className="hms-form-section-title">Recent Discharges</h3>
                  {state.discharges.slice(-3).map(d => {
                    const adm = state.admissions.find(a => a.admissionId === d.admissionId);
                    const pat = state.patients.find(p => p.patientId === adm?.patientId);
                    return (
                      <div key={d.dischargeId} className="hms-discharge-history-item">
                        <div className="hms-patient-avatar hms-avatar-sm">{pat?.firstName?.[0]}{pat?.lastName?.[0]}</div>
                        <div>
                          <strong>{pat?.firstName} {pat?.lastName}</strong>
                          <span className="hms-note">{new Date(d.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="hms-badge hms-badge-muted">Discharged</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Discharge;