import React, { useState } from 'react';
import { useHMS } from '../HMSContext';
import { Receipt, Package } from 'lucide-react';

function BillingInventory() {
  const { state, dispatch } = useHMS();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [bill, setBill] = useState({ roomRent: 0, doctorFees: 0, medicines: 0 });

  const calculateTotal = () => {
    return bill.roomRent + bill.doctorFees + bill.medicines;
  };

  const handleGenerateBill = () => {
    if (selectedPatient) {
      const newBill = {
        patientId: selectedPatient.id,
        ...bill,
        total: calculateTotal(),
        date: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_BILL', payload: newBill });
      setBill({ roomRent: 0, doctorFees: 0, medicines: 0 });
    }
  };

  return (
    <div className="hms-main">
      <section className="hms-section">
        <h2>Billing & Inventory</h2>
        <div className="hms-grid hms-grid-2">
          <div className="hms-card">
            <h3><Receipt className="w-5 h-5 inline-block mr-2" />Real-time Bill Calculation</h3>
            <select
              onChange={(e) => setSelectedPatient(state.patients.find(p => p.id == e.target.value))}
              className="hms-select"
            >
              <option value="">Select Patient</option>
              {state.patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {selectedPatient && (
              <>
                <div className="hms-form-row">
                  <input
                    type="number"
                    placeholder="Room Rent"
                    value={bill.roomRent}
                    onChange={(e) => setBill({ ...bill, roomRent: +e.target.value })}
                    className="hms-input"
                  />
                  <input
                    type="number"
                    placeholder="Doctor Fees"
                    value={bill.doctorFees}
                    onChange={(e) => setBill({ ...bill, doctorFees: +e.target.value })}
                    className="hms-input"
                  />
                  <input
                    type="number"
                    placeholder="Medicines"
                    value={bill.medicines}
                    onChange={(e) => setBill({ ...bill, medicines: +e.target.value })}
                    className="hms-input"
                  />
                </div>
                <p className="stat-value">Total: ${calculateTotal()}</p>
                <button onClick={handleGenerateBill} className="hms-button">Generate Bill</button>
              </>
            )}
          </div>
          <div className="hms-card">
            <h3><Package className="w-5 h-5 inline-block mr-2" />Pharmacy Inventory</h3>
            <ul className="hms-list">
              {state.inventory.medicines.map(med => (
                <li key={med.id} className="hms-list-row">
                  <span>{med.name}</span>
                  <span>Stock: {med.stock} | Price: ${med.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BillingInventory;