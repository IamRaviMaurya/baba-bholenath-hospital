import React, { createContext, useContext, useReducer } from 'react';

// ─── Seed Data (mirrors ER diagram) ──────────────────────────────────────────
const initialState = {
  isLoggedIn: false,
  currentUser: null,

  // Patients table
  patients: [
    { patientId: 'P001', firstName: 'Ravi', lastName: 'Sharma', gender: 'Male', dob: '1985-06-14', mobile: '9876543210', email: 'ravi@example.com', address: '12 Gandhi Nagar', city: 'Varanasi', state: 'UP' },
    { patientId: 'P002', firstName: 'Sunita', lastName: 'Devi', gender: 'Female', dob: '1992-03-22', mobile: '9988776655', email: 'sunita@example.com', address: '45 Shastri Colony', city: 'Varanasi', state: 'UP' },
  ],

  // Admissions table
  admissions: [
    { admissionId: 'ADM001', patientId: 'P001', doctorId: 'D001', admissionDate: '2026-04-28', dischargeDate: null, admissionType: 'Emergency', status: 'Admitted' },
    { admissionId: 'ADM002', patientId: 'P002', doctorId: 'D002', admissionDate: '2026-04-30', dischargeDate: null, admissionType: 'Planned', status: 'Admitted' },
  ],

  // Doctors
  doctors: [
    { doctorId: 'D001', firstName: 'Anand', lastName: 'Mishra', specialization: 'Cardiologist', mobile: '9911223344', consultationFee: 500 },
    { doctorId: 'D002', firstName: 'Priya', lastName: 'Gupta', specialization: 'Gynaecologist', mobile: '9922334455', consultationFee: 400 },
  ],

  // Rooms table
  rooms: [
    { roomId: 'R001', roomNumber: '101', roomType: 'General', chargesPerDay: 500, status: 'Available' },
    { roomId: 'R002', roomNumber: '102', roomType: 'Private', chargesPerDay: 1500, status: 'Occupied' },
    { roomId: 'R003', roomNumber: '201', roomType: 'ICU', chargesPerDay: 3000, status: 'Occupied' },
    { roomId: 'R004', roomNumber: '202', roomType: 'General', chargesPerDay: 500, status: 'Available' },
    { roomId: 'R005', roomNumber: '301', roomType: 'Private', chargesPerDay: 1500, status: 'Available' },
    { roomId: 'R006', roomNumber: '302', roomType: 'General', chargesPerDay: 500, status: 'Occupied' },
  ],

  // Beds table
  beds: [
    { bedId: 'B001', roomId: 'R001', bedNumber: '101-A', status: 'Available' },
    { bedId: 'B002', roomId: 'R001', bedNumber: '101-B', status: 'Available' },
    { bedId: 'B003', roomId: 'R002', bedNumber: '102-A', status: 'Occupied' },
    { bedId: 'B004', roomId: 'R003', bedNumber: '201-A', status: 'Occupied' },
    { bedId: 'B005', roomId: 'R003', bedNumber: '201-B', status: 'Occupied' },
    { bedId: 'B006', roomId: 'R004', bedNumber: '202-A', status: 'Available' },
    { bedId: 'B007', roomId: 'R004', bedNumber: '202-B', status: 'Available' },
    { bedId: 'B008', roomId: 'R005', bedNumber: '301-A', status: 'Available' },
    { bedId: 'B009', roomId: 'R006', bedNumber: '302-A', status: 'Occupied' },
    { bedId: 'B010', roomId: 'R006', bedNumber: '302-B', status: 'Available' },
  ],

  // Bed Allocations
  bedAllocations: [
    { allocationId: 'BA001', admissionId: 'ADM001', bedId: 'B003', startDate: '2026-04-28', endDate: null },
    { allocationId: 'BA002', admissionId: 'ADM002', bedId: 'B004', startDate: '2026-04-30', endDate: null },
  ],

  // Consultations
  consultations: [
    { consultationId: 'C001', appointmentId: null, symptoms: 'Chest pain, breathlessness', diagnosis: 'Angina Pectoris', notes: 'ECG recommended', createdAt: '2026-04-29T10:00:00', doctorId: 'D001', patientId: 'P001' },
  ],

  // Prescriptions
  prescriptions: [
    { prescriptionId: 'RX001', consultationId: 'C001', doctorId: 'D001', createdAt: '2026-04-29T10:30:00', patientId: 'P001' },
  ],

  // Prescription Items
  prescriptionItems: [
    { itemId: 'RXI001', prescriptionId: 'RX001', medicineName: 'Aspirin', dosage: '75mg', frequency: 'Once daily', days: 30, instructions: 'After meals' },
    { itemId: 'RXI002', prescriptionId: 'RX001', medicineName: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', days: 30, instructions: 'Before meals' },
  ],

  // Lab Tests
  labTests: [
    { testId: 'LT001', testName: 'Complete Blood Count (CBC)', price: 200 },
    { testId: 'LT002', testName: 'ECG', price: 300 },
    { testId: 'LT003', testName: 'Lipid Profile', price: 450 },
    { testId: 'LT004', testName: 'Blood Sugar (Fasting)', price: 100 },
    { testId: 'LT005', testName: 'Urine Routine', price: 150 },
  ],

  // Lab Orders
  labOrders: [
    { labOrderId: 'LO001', patientId: 'P001', doctorId: 'D001', orderDate: '2026-04-29', status: 'Completed' },
  ],

  // Lab Order Items
  labOrderItems: [
    { itemId: 'LOI001', labOrderId: 'LO001', testId: 'LT001', result: 'Normal', normalRange: '4.5-11 x10³/µL', status: 'Completed' },
    { itemId: 'LOI002', labOrderId: 'LO001', testId: 'LT002', result: 'ST depression noted', normalRange: 'Normal sinus rhythm', status: 'Completed' },
  ],

  // Bills
  bills: [
    { billId: 'BILL001', patientId: 'P001', admissionId: 'ADM001', totalAmount: 6500, paidAmount: 3000, status: 'Pending', createdAt: '2026-04-29T12:00:00' },
  ],

  // Bill Items
  billItems: [
    { itemId: 'BI001', billId: 'BILL001', serviceType: 'Room', referenceId: 'R002', amount: 3000 },
    { itemId: 'BI002', billId: 'BILL001', serviceType: 'Doctor', referenceId: 'D001', amount: 1500 },
    { itemId: 'BI003', billId: 'BILL001', serviceType: 'Lab', referenceId: 'LO001', amount: 500 },
    { itemId: 'BI004', billId: 'BILL001', serviceType: 'Medicine', referenceId: 'RX001', amount: 1500 },
  ],

  // Payments
  payments: [
    { paymentId: 'PAY001', billId: 'BILL001', amount: 3000, paymentMode: 'Cash', paymentDate: '2026-04-29' },
  ],

  // Discharges
  discharges: [],
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function hmsReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, currentUser: null };

    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] };
    case 'UPDATE_PATIENT':
      return { ...state, patients: state.patients.map(p => p.patientId === action.payload.patientId ? action.payload : p) };

    case 'ADD_ADMISSION':
      return { ...state, admissions: [...state.admissions, action.payload] };
    case 'UPDATE_ADMISSION':
      return { ...state, admissions: state.admissions.map(a => a.admissionId === action.payload.admissionId ? action.payload : a) };

    case 'UPDATE_BED':
      return { ...state, beds: state.beds.map(b => b.bedId === action.payload.bedId ? action.payload : b) };
    case 'UPDATE_ROOM':
      return { ...state, rooms: state.rooms.map(r => r.roomId === action.payload.roomId ? action.payload : r) };

    case 'ADD_CONSULTATION':
      return { ...state, consultations: [...state.consultations, action.payload] };
    case 'ADD_PRESCRIPTION':
      return { ...state, prescriptions: [...state.prescriptions, action.payload] };
    case 'ADD_PRESCRIPTION_ITEM':
      return { ...state, prescriptionItems: [...state.prescriptionItems, action.payload] };
    case 'ADD_LAB_ORDER':
      return { ...state, labOrders: [...state.labOrders, action.payload] };
    case 'UPDATE_LAB_ORDER':
      return { ...state, labOrders: state.labOrders.map(l => l.labOrderId === action.payload.labOrderId ? action.payload : l) };
    case 'ADD_LAB_ORDER_ITEM':
      return { ...state, labOrderItems: [...(state.labOrderItems || []), action.payload] };
    case 'UPDATE_LAB_ORDER_ITEM':
      return { ...state, labOrderItems: state.labOrderItems.map(l => l.itemId === action.payload.itemId ? action.payload : l) };

    case 'ADD_BILL':
      return { ...state, bills: [...state.bills, action.payload] };
    case 'ADD_BILL_ITEM':
      return { ...state, billItems: [...state.billItems, action.payload] };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_BILL':
      return { ...state, bills: state.bills.map(b => b.billId === action.payload.billId ? action.payload : b) };

    case 'ADD_DISCHARGE':
      return {
        ...state,
        discharges: [...state.discharges, action.payload],
        admissions: state.admissions.map(a =>
          a.admissionId === action.payload.admissionId
            ? { ...a, status: 'Discharged', dischargeDate: action.payload.createdAt }
            : a
        ),
      };

    default:
      return state;
  }
}

// ─── Context & Provider ───────────────────────────────────────────────────────
const HMSContext = createContext();

export function HMSProvider({ children }) {
  const [state, dispatch] = useReducer(hmsReducer, initialState);
  return (
    <HMSContext.Provider value={{ state, dispatch }}>
      {children}
    </HMSContext.Provider>
  );
}

export function useHMS() {
  return useContext(HMSContext);
}