import React, { useState } from 'react';
import { useHMS } from '../HMSContext';
import { User, Calendar, Stethoscope, BedDouble, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  { label: 'Patient Info',   icon: User },
  { label: 'Contact',        icon: Calendar },
  { label: 'Admission',      icon: Stethoscope },
  { label: 'Bed Allocation', icon: BedDouble },
];

function PatientAdmission() {
  const { state, dispatch } = useHMS();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [patient, setPatient] = useState({
    firstName: '', lastName: '', dob: '', gender: '', mobile: '', email: '',
    address: '', city: '', state: '',
  });
  const [admission, setAdmission] = useState({
    admissionDate: new Date().toISOString().slice(0, 10),
    admissionType: 'Planned',
    doctorId: '',
    bedId: null, // Force explicit selection
  });

  const availableBeds = state.beds.filter(b => b.status === 'Available');

  const handlePatientChange = e => setPatient({ ...patient, [e.target.name]: e.target.value });
  const handleAdmissionChange = e => setAdmission({ ...admission, [e.target.name]: e.target.value });

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = e => {
    e.preventDefault();
    const patientId = 'P' + String(Date.now()).slice(-6);
    const admissionId = 'ADM' + String(Date.now()).slice(-6);

    dispatch({ type: 'ADD_PATIENT', payload: { ...patient, patientId } });
    dispatch({
      type: 'ADD_ADMISSION',
      payload: {
        admissionId, patientId,
        doctorId: admission.doctorId,
        admissionDate: admission.admissionDate,
        admissionType: admission.admissionType,
        dischargeDate: null,
        status: 'Admitted',
      },
    });
    if (admission.bedId) {
      dispatch({ type: 'UPDATE_BED', payload: { ...state.beds.find(b => b.bedId === admission.bedId), status: 'Occupied' } });
    }
    setSubmitted(true);
  };

  const reset = () => {
    setPatient({ firstName: '', lastName: '', dob: '', gender: '', mobile: '', email: '', address: '', city: '', state: '' });
    setAdmission({ admissionDate: new Date().toISOString().slice(0, 10), admissionType: 'Planned', doctorId: '', bedId: null });
    setStep(0);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="hms-main">
        <div className="hms-success-card">
          <CheckCircle2 size={64} className="hms-success-icon" />
          <h2>Patient Admitted Successfully!</h2>
          <p>Patient <strong>{patient.firstName} {patient.lastName}</strong> has been admitted to the hospital.</p>
          <button className="hms-button" onClick={reset}>Admit Another Patient</button>
        </div>
      </div>
    );
  }

  return (
    <div className="hms-main">
      {/* Page Header */}
      <section className="hms-page-header">
        <div className="hms-page-copy">
          <span className="hms-page-label">In-Patient Registration</span>
          <h2>Patient Admission</h2>
          <p>Register new patients and create admission records aligned with the Patients &amp; Admissions schema.</p>
        </div>
      </section>

      {/* Stepper */}
      <div className="hms-stepper">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={idx}>
              <div className={`hms-step${idx === step ? ' active' : ''}${idx < step ? ' done' : ''}`}>
                <div className="hms-step-circle">
                  {idx < step ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                </div>
                <span className="hms-step-label">{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && <div className={`hms-step-line${idx < step ? ' done' : ''}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="hms-card">

          {/* Step 0 – Patient Info */}
          {step === 0 && (
            <div>
              <h3 className="hms-form-section-title"><User size={18} /> Patient Information</h3>
              <div className="hms-form-row hms-form-row-2">
                <div className="hms-input-block">
                  <label>First Name *</label>
                  <input name="firstName" value={patient.firstName} onChange={handlePatientChange} className="hms-input" placeholder="First Name" required />
                </div>
                <div className="hms-input-block">
                  <label>Last Name *</label>
                  <input name="lastName" value={patient.lastName} onChange={handlePatientChange} className="hms-input" placeholder="Last Name" required />
                </div>
                <div className="hms-input-block">
                  <label>Date of Birth *</label>
                  <input type="date" name="dob" value={patient.dob} onChange={handlePatientChange} className="hms-input" required />
                </div>
                <div className="hms-input-block">
                  <label>Gender *</label>
                  <select name="gender" value={patient.gender} onChange={handlePatientChange} className="hms-select" required>
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 – Contact Details */}
          {step === 1 && (
            <div>
              <h3 className="hms-form-section-title"><Calendar size={18} /> Contact Details</h3>
              <div className="hms-form-row hms-form-row-2">
                <div className="hms-input-block">
                  <label>Mobile *</label>
                  <input name="mobile" value={patient.mobile} onChange={handlePatientChange} className="hms-input" placeholder="10-digit mobile" required />
                </div>
                <div className="hms-input-block">
                  <label>Email</label>
                  <input type="email" name="email" value={patient.email} onChange={handlePatientChange} className="hms-input" placeholder="email@example.com" />
                </div>
                <div className="hms-input-block" style={{ gridColumn: '1/-1' }}>
                  <label>Address</label>
                  <input name="address" value={patient.address} onChange={handlePatientChange} className="hms-input" placeholder="Street / Colony" />
                </div>
                <div className="hms-input-block">
                  <label>City</label>
                  <input name="city" value={patient.city} onChange={handlePatientChange} className="hms-input" placeholder="City" />
                </div>
                <div className="hms-input-block">
                  <label>State</label>
                  <input name="state" value={patient.state} onChange={handlePatientChange} className="hms-input" placeholder="State" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 – Admission Details */}
          {step === 2 && (
            <div>
              <h3 className="hms-form-section-title"><Stethoscope size={18} /> Admission Details</h3>
              <div className="hms-form-row hms-form-row-2">
                <div className="hms-input-block">
                  <label>Admission Date *</label>
                  <input type="date" name="admissionDate" value={admission.admissionDate} onChange={handleAdmissionChange} className="hms-input" required />
                </div>
                <div className="hms-input-block">
                  <label>Admission Type *</label>
                  <select name="admissionType" value={admission.admissionType} onChange={handleAdmissionChange} className="hms-select" required>
                    <option>Planned</option>
                    <option>Emergency</option>
                    <option>Referral</option>
                    <option>Maternity</option>
                  </select>
                </div>
                <div className="hms-input-block" style={{ gridColumn: '1/-1' }}>
                  <label>Assign Doctor *</label>
                  <select name="doctorId" value={admission.doctorId} onChange={handleAdmissionChange} className="hms-select" required>
                    <option value="">Select Doctor</option>
                    {state.doctors.map(d => (
                      <option key={d.doctorId} value={d.doctorId}>
                        Dr. {d.firstName} {d.lastName} — {d.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 – Bed Allocation */}
          {step === 3 && (
            <div>
              <h3 className="hms-form-section-title"><BedDouble size={18} /> Bed Allocation</h3>
              <p className="hms-note" style={{ marginBottom: 16 }}>{availableBeds.length} bed(s) currently available</p>
              <div className="hms-bed-selector">
                <label className="hms-bed-option hms-bed-none">
                  <input type="radio" name="bedId" value="" checked={admission.bedId === ''} onChange={handleAdmissionChange} />
                  <span>No Bed (OPD)</span>
                </label>
                {availableBeds.map(bed => {
                  const room = state.rooms.find(r => r.roomId === bed.roomId);
                  return (
                    <label key={bed.bedId} className={`hms-bed-option${admission.bedId === bed.bedId ? ' selected' : ''}`}>
                      <input type="radio" name="bedId" value={bed.bedId} checked={admission.bedId === bed.bedId} onChange={handleAdmissionChange} />
                      <BedDouble size={20} />
                      <div>
                        <strong>{bed.bedNumber}</strong>
                        <span>{room?.roomType} • Room {room?.roomNumber}</span>
                        <span>₹{room?.chargesPerDay}/day</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="hms-actions" style={{ marginTop: 28 }}>
            {step > 0 && (
              <button type="button" onClick={prev} className="hms-button-secondary">
                <ChevronLeft size={16} /> Previous
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="hms-button">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                type="submit" 
                className="hms-button hms-button-gold" 
                disabled={admission.bedId === null}
                style={{ opacity: admission.bedId === null ? 0.5 : 1, cursor: admission.bedId === null ? 'not-allowed' : 'pointer' }}
              >
                <CheckCircle2 size={16} /> Admit Patient
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Recent Admissions Table */}
      <section className="hms-section" style={{ marginTop: 32 }}>
        <h3 className="hms-section-title">Recent Admissions</h3>
        <div className="hms-table-wrap">
          <table className="hms-table">
            <thead>
              <tr>
                <th>Admission ID</th>
                <th>Patient</th>
                <th>Admission Date</th>
                <th>Type</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.admissions.map(adm => {
                const pat = state.patients.find(p => p.patientId === adm.patientId);
                const doc = state.doctors.find(d => d.doctorId === adm.doctorId);
                return (
                  <tr key={adm.admissionId}>
                    <td><span className="hms-badge hms-badge-info">{adm.admissionId}</span></td>
                    <td>{pat ? `${pat.firstName} ${pat.lastName}` : '—'}</td>
                    <td>{adm.admissionDate}</td>
                    <td>{adm.admissionType}</td>
                    <td>{doc ? `Dr. ${doc.firstName} ${doc.lastName}` : '—'}</td>
                    <td>
                      <span className={`hms-badge ${adm.status === 'Admitted' ? 'hms-badge-green' : 'hms-badge-muted'}`}>
                        {adm.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default PatientAdmission;