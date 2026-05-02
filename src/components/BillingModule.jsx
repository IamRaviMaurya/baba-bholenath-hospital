import React, { useState, useRef } from 'react';
import { useHMS } from '../HMSContext';
import {
  Receipt, CreditCard, FileText, Plus, Printer,
  CheckCircle2, Clock, IndianRupee, Trash2
} from 'lucide-react';

const SERVICE_TYPES = ['Room', 'Doctor', 'Lab', 'Medicine', 'Other'];
const PAYMENT_MODES = ['Cash', 'Card', 'UPI', 'Insurance'];

function BillingModule() {
  const { state, dispatch } = useHMS();
  const [selectedBillId, setSelectedBillId] = useState(state.bills[0]?.billId || '');
  const [newItem, setNewItem] = useState({ serviceType: 'Room', referenceId: '', amount: '' });
  const [newPayment, setNewPayment] = useState({ amount: '', paymentMode: 'Cash' });
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = useRef();

  const selectedBill = state.bills.find(b => b.billId === selectedBillId);
  const billItems = state.billItems.filter(i => i.billId === selectedBillId);
  const billPayments = state.payments.filter(p => p.billId === selectedBillId);
  const patient = state.patients.find(p => p.patientId === selectedBill?.patientId);
  const admission = state.admissions.find(a => a.admissionId === selectedBill?.admissionId);

  const totalPaid = billPayments.reduce((s, p) => s + Number(p.amount), 0);
  const balance = (selectedBill?.totalAmount || 0) - totalPaid;

  const handleAddItem = e => {
    e.preventDefault();
    const itemId = 'BI' + String(Date.now()).slice(-6);
    dispatch({
      type: 'ADD_BILL_ITEM',
      payload: { itemId, billId: selectedBillId, ...newItem, amount: Number(newItem.amount) },
    });
    // Recalculate total
    const newTotal = billItems.reduce((s, i) => s + i.amount, 0) + Number(newItem.amount);
    dispatch({ type: 'UPDATE_BILL', payload: { ...selectedBill, totalAmount: newTotal } });
    setNewItem({ serviceType: 'Room', referenceId: '', amount: '' });
  };

  const handleAddPayment = e => {
    e.preventDefault();
    const paymentId = 'PAY' + String(Date.now()).slice(-6);
    dispatch({
      type: 'ADD_PAYMENT',
      payload: {
        paymentId, billId: selectedBillId,
        amount: Number(newPayment.amount),
        paymentMode: newPayment.paymentMode,
        paymentDate: new Date().toISOString().slice(0, 10),
      },
    });
    const newPaid = totalPaid + Number(newPayment.amount);
    const newStatus = newPaid >= selectedBill.totalAmount ? 'Paid' : 'Pending';
    dispatch({ type: 'UPDATE_BILL', payload: { ...selectedBill, paidAmount: newPaid, status: newStatus } });
    setNewPayment({ amount: '', paymentMode: 'Cash' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="hms-main">
      {/* Page Header */}
      <section className="hms-page-header">
        <div className="hms-page-copy">
          <span className="hms-page-label">Bills · BillItems · Payments</span>
          <h2>Billing Module</h2>
          <p>Manage hospital bills, add itemised services, record payments and generate invoice.</p>
        </div>
        <div className="hms-actions">
          <button className="hms-button-secondary" onClick={() => setShowInvoice(v => !v)}>
            <FileText size={15} /> {showInvoice ? 'Hide Invoice' : 'Preview Invoice'}
          </button>
          <button className="hms-button hms-button-gold" onClick={handlePrint}>
            <Printer size={15} /> Print Invoice
          </button>
        </div>
      </section>

      {/* Bill Selector */}
      <div className="hms-bill-tabs">
        {state.bills.map(b => {
          const pat = state.patients.find(p => p.patientId === b.patientId);
          return (
            <button
              key={b.billId}
              onClick={() => setSelectedBillId(b.billId)}
              className={`hms-bill-tab${b.billId === selectedBillId ? ' active' : ''}`}
            >
              <span>{b.billId}</span>
              <span className="hms-note">{pat ? `${pat.firstName} ${pat.lastName}` : '—'}</span>
              <span className={`hms-badge ${b.status === 'Paid' ? 'hms-badge-green' : 'hms-badge-yellow'}`}>{b.status}</span>
            </button>
          );
        })}
        <button className="hms-bill-tab hms-bill-tab-new" onClick={() => {
          // Create a blank bill
          const billId = 'BILL' + String(Date.now()).slice(-6);
          dispatch({
            type: 'ADD_BILL',
            payload: { billId, patientId: state.patients[0]?.patientId || '', admissionId: null, totalAmount: 0, paidAmount: 0, status: 'Pending', createdAt: new Date().toISOString() },
          });
          setSelectedBillId(billId);
        }}>
          <Plus size={14} /> New Bill
        </button>
      </div>

      {selectedBill ? (
        <>
          {/* Summary Strip */}
          <div className="hms-billing-summary">
            <div className="hms-billing-stat">
              <IndianRupee size={18} />
              <div><span>₹{selectedBill.totalAmount.toLocaleString()}</span><label>Total Amount</label></div>
            </div>
            <div className="hms-billing-stat hms-billing-stat-green">
              <CheckCircle2 size={18} />
              <div><span>₹{totalPaid.toLocaleString()}</span><label>Amount Paid</label></div>
            </div>
            <div className={`hms-billing-stat ${balance > 0 ? 'hms-billing-stat-red' : 'hms-billing-stat-green'}`}>
              <Clock size={18} />
              <div><span>₹{balance.toLocaleString()}</span><label>Balance Due</label></div>
            </div>
            <div className="hms-billing-stat">
              <span className={`hms-badge hms-badge-lg ${selectedBill.status === 'Paid' ? 'hms-badge-green' : 'hms-badge-yellow'}`}>
                {selectedBill.status}
              </span>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="hms-billing-grid">
            {/* Left – Bill Items */}
            <div>
              <div className="hms-card">
                <h3 className="hms-form-section-title"><Receipt size={16} /> Bill Items</h3>
                <div className="hms-table-wrap">
                  <table className="hms-table">
                    <thead>
                      <tr><th>#</th><th>Service Type</th><th>Reference</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                      {billItems.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: 20 }}>No items yet</td></tr>
                      ) : billItems.map((item, idx) => (
                        <tr key={item.itemId}>
                          <td>{idx + 1}</td>
                          <td><span className={`hms-service-badge hms-svc-${item.serviceType.toLowerCase()}`}>{item.serviceType}</span></td>
                          <td>{item.referenceId || '—'}</td>
                          <td><strong>₹{Number(item.amount).toLocaleString()}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3}><strong>Total</strong></td>
                        <td><strong>₹{selectedBill.totalAmount.toLocaleString()}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Add Item Form */}
                <form onSubmit={handleAddItem} className="hms-add-item-form">
                  <h4>Add Service Item</h4>
                  <div className="hms-form-row hms-form-row-3">
                    <div className="hms-input-block">
                      <label>Service Type</label>
                      <select className="hms-select" value={newItem.serviceType} onChange={e => setNewItem({ ...newItem, serviceType: e.target.value })}>
                        {SERVICE_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="hms-input-block">
                      <label>Reference ID</label>
                      <input className="hms-input" value={newItem.referenceId} onChange={e => setNewItem({ ...newItem, referenceId: e.target.value })} placeholder="e.g. R001" />
                    </div>
                    <div className="hms-input-block">
                      <label>Amount (₹) *</label>
                      <input type="number" className="hms-input" value={newItem.amount} onChange={e => setNewItem({ ...newItem, amount: e.target.value })} placeholder="0" required />
                    </div>
                  </div>
                  <button type="submit" className="hms-button-secondary"><Plus size={14} /> Add Item</button>
                </form>
              </div>
            </div>

            {/* Right – Payments */}
            <div>
              <div className="hms-card">
                <h3 className="hms-form-section-title"><CreditCard size={16} /> Payments</h3>
                {billPayments.length === 0 ? (
                  <p className="hms-empty">No payments recorded.</p>
                ) : (
                  <div className="hms-payment-list">
                    {billPayments.map(pay => (
                      <div key={pay.paymentId} className="hms-payment-row">
                        <div className="hms-payment-icon">
                          <CreditCard size={16} />
                        </div>
                        <div className="hms-payment-info">
                          <strong>₹{Number(pay.amount).toLocaleString()}</strong>
                          <span>{pay.paymentMode} · {pay.paymentDate}</span>
                        </div>
                        <span className="hms-badge hms-badge-green">{pay.paymentId}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Payment */}
                <form onSubmit={handleAddPayment} className="hms-add-item-form">
                  <h4>Record Payment</h4>
                  <div className="hms-form-row hms-form-row-2">
                    <div className="hms-input-block">
                      <label>Amount (₹) *</label>
                      <input type="number" className="hms-input" value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} placeholder="Enter amount" required />
                    </div>
                    <div className="hms-input-block">
                      <label>Payment Mode</label>
                      <select className="hms-select" value={newPayment.paymentMode} onChange={e => setNewPayment({ ...newPayment, paymentMode: e.target.value })}>
                        {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="hms-button"><IndianRupee size={14} /> Record Payment</button>
                </form>
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          {showInvoice && (
            <div className="hms-invoice-overlay" ref={invoiceRef}>
              <div className="hms-invoice">
                <div className="hms-invoice-head">
                  <div>
                    <h2 className="hms-invoice-title">Baba Bholenath Hospital</h2>
                    <p>Varanasi, Uttar Pradesh · Tel: +91-9876543210</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="hms-invoice-id">Invoice #{selectedBill.billId}</p>
                    <p className="hms-note">{new Date(selectedBill.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <hr className="hms-invoice-divider" />
                <div className="hms-invoice-patient">
                  <div><label>Patient:</label> <strong>{patient ? `${patient.firstName} ${patient.lastName}` : '—'}</strong></div>
                  <div><label>Admission:</label> {selectedBill.admissionId || '—'}</div>
                  <div><label>Type:</label> {admission?.admissionType || '—'}</div>
                </div>
                <table className="hms-invoice-table">
                  <thead><tr><th>#</th><th>Service</th><th>Reference</th><th>Amount</th></tr></thead>
                  <tbody>
                    {billItems.map((item, idx) => (
                      <tr key={item.itemId}>
                        <td>{idx + 1}</td>
                        <td>{item.serviceType}</td>
                        <td>{item.referenceId || '—'}</td>
                        <td>₹{Number(item.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr><td colSpan={3}><strong>Total</strong></td><td><strong>₹{selectedBill.totalAmount.toLocaleString()}</strong></td></tr>
                    <tr><td colSpan={3}>Amount Paid</td><td>₹{totalPaid.toLocaleString()}</td></tr>
                    <tr className="hms-invoice-balance"><td colSpan={3}><strong>Balance Due</strong></td><td><strong>₹{balance.toLocaleString()}</strong></td></tr>
                  </tfoot>
                </table>
                <div className="hms-invoice-footer">
                  <p>Thank you for choosing Baba Bholenath Hospital.</p>
                  <p className="hms-note">This is a computer-generated invoice.</p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="hms-card hms-empty-state">
          <Receipt size={48} strokeWidth={1} />
          <h3>No bill selected</h3>
          <p>Select an existing bill or create a new one.</p>
        </div>
      )}
    </div>
  );
}

export default BillingModule;
