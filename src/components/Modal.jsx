import { useEffect } from 'react';
import '../css/components/modal.css';

const Modal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={handleOverlayClick}>
      <div className="modal">
        {/* Modal Header */}
        <h2>Book Your Appointment</h2>
        <p>Fill in your details and we'll get back to you within 24 hours.</p>
        {/* Booking Form */}
        <form>
          {/* Name and Phone Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Enter your full name" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="Enter your phone number" />
            </div>
          </div>
          {/* Email and Department Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select id="department">
                <option value="">Select Department</option>
                <option value="cardiology">Cardiology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="neurology">Neurology</option>
                <option value="pulmonology">Pulmonology</option>
                <option value="general">General Medicine</option>
              </select>
            </div>
          </div>
          {/* Message Field */}
          <div className="form-group">
            <label htmlFor="message">Message (Optional)</label>
            <input type="text" id="message" placeholder="Any specific requirements or symptoms" />
          </div>
        </form>
        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={onClose}
            style={{ background: 'var(--deep-teal)', color: 'var(--cream)' }}
          >
            Confirm Booking →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;