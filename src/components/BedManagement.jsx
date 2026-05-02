import React, { useState } from 'react';
import { useHMS } from '../HMSContext';
import { BedDouble, Building2, CheckCircle2, XCircle, Filter } from 'lucide-react';

const ROOM_TYPE_COLORS = {
  General: 'hms-room-general',
  Private: 'hms-room-private',
  ICU: 'hms-room-icu',
};

function BedManagement() {
  const { state, dispatch } = useHMS();
  const [filter, setFilter] = useState('All');

  const filteredRooms = filter === 'All'
    ? state.rooms
    : state.rooms.filter(r => r.status === filter);

  const totalBeds = state.beds.length;
  const occupiedBeds = state.beds.filter(b => b.status === 'Occupied').length;
  const availableBeds = totalBeds - occupiedBeds;

  const toggleBedStatus = (bed) => {
    const newStatus = bed.status === 'Available' ? 'Occupied' : 'Available';
    dispatch({ type: 'UPDATE_BED', payload: { ...bed, status: newStatus } });
    // Also update room status based on its beds
    const roomBeds = state.beds.filter(b => b.roomId === bed.roomId && b.bedId !== bed.bedId);
    const anyOccupied = newStatus === 'Occupied' || roomBeds.some(b => b.status === 'Occupied');
    const room = state.rooms.find(r => r.roomId === bed.roomId);
    if (room) {
      dispatch({ type: 'UPDATE_ROOM', payload: { ...room, status: anyOccupied ? 'Occupied' : 'Available' } });
    }
  };

  return (
    <div className="hms-main">
      {/* Page Header */}
      <section className="hms-page-header">
        <div className="hms-page-copy">
          <span className="hms-page-label">Rooms &amp; Beds Schema</span>
          <h2>Bed Management</h2>
          <p>Visual overview of all rooms and beds. Toggle availability status in real-time.</p>
        </div>
        <div className="hms-page-header-stats">
          <div className="hms-mini-stat hms-mini-stat-green">
            <CheckCircle2 size={18} />
            <div>
              <span>{availableBeds}</span>
              <label>Available</label>
            </div>
          </div>
          <div className="hms-mini-stat hms-mini-stat-red">
            <XCircle size={18} />
            <div>
              <span>{occupiedBeds}</span>
              <label>Occupied</label>
            </div>
          </div>
          <div className="hms-mini-stat hms-mini-stat-blue">
            <BedDouble size={18} />
            <div>
              <span>{totalBeds}</span>
              <label>Total Beds</label>
            </div>
          </div>
        </div>
      </section>

      {/* Capacity Bar */}
      <div className="hms-card hms-capacity-card">
        <div className="hms-capacity-info">
          <span className="hms-capacity-label">Overall Occupancy</span>
          <span className="hms-capacity-pct">{Math.round((occupiedBeds / totalBeds) * 100)}%</span>
        </div>
        <div className="hms-capacity-bar">
          <div
            className="hms-capacity-fill"
            style={{ width: `${(occupiedBeds / totalBeds) * 100}%` }}
          />
        </div>
        <div className="hms-capacity-legend">
          <span><span className="hms-dot hms-dot-red" /> Occupied ({occupiedBeds})</span>
          <span><span className="hms-dot hms-dot-green" /> Available ({availableBeds})</span>
        </div>
      </div>

      {/* Filter */}
      <div className="hms-filter-row">
        <Filter size={16} />
        <span>Filter Rooms:</span>
        {['All', 'Available', 'Occupied'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`hms-filter-btn${filter === f ? ' active' : ''}`}
          >
            {f}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center', fontSize: '0.82rem' }}>
          {['General', 'Private', 'ICU'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={`hms-room-type-dot hms-rtype-${t.toLowerCase()}`} />{t}
            </span>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      <div className="hms-room-grid">
        {filteredRooms.map(room => {
          const roomBeds = state.beds.filter(b => b.roomId === room.roomId);
          const roomOccupied = roomBeds.filter(b => b.status === 'Occupied').length;
          return (
            <div key={room.roomId} className={`hms-room-card ${ROOM_TYPE_COLORS[room.roomType] || ''}`}>
              <div className="hms-room-header">
                <div className="hms-room-number">
                  <Building2 size={16} />
                  Room {room.roomNumber}
                </div>
                <span className={`hms-badge ${room.status === 'Available' ? 'hms-badge-green' : 'hms-badge-red'}`}>
                  {room.status}
                </span>
              </div>
              <div className="hms-room-meta">
                <span className={`hms-room-type-pill hms-rtype-${room.roomType.toLowerCase()}`}>{room.roomType}</span>
                <span className="hms-room-charge">₹{room.chargesPerDay}/day</span>
              </div>
              <p className="hms-room-occupancy">{roomOccupied}/{roomBeds.length} beds occupied</p>

              {/* Beds in this room */}
              <div className="hms-beds-grid">
                {roomBeds.map(bed => (
                  <button
                    key={bed.bedId}
                    onClick={() => toggleBedStatus(bed)}
                    title={`${bed.bedNumber} — Click to toggle`}
                    className={`hms-bed-cell${bed.status === 'Occupied' ? ' occupied' : ' available'}`}
                  >
                    <BedDouble size={18} />
                    <span>{bed.bedNumber}</span>
                    <span className="hms-bed-status-label">{bed.status}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Beds Table */}
      <section className="hms-section" style={{ marginTop: 32 }}>
        <h3 className="hms-section-title">All Beds — Detailed View</h3>
        <div className="hms-table-wrap">
          <table className="hms-table">
            <thead>
              <tr>
                <th>Bed ID</th>
                <th>Bed Number</th>
                <th>Room</th>
                <th>Room Type</th>
                <th>Charges/Day</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.beds.map(bed => {
                const room = state.rooms.find(r => r.roomId === bed.roomId);
                return (
                  <tr key={bed.bedId}>
                    <td><span className="hms-badge hms-badge-info">{bed.bedId}</span></td>
                    <td><strong>{bed.bedNumber}</strong></td>
                    <td>Room {room?.roomNumber}</td>
                    <td><span className={`hms-room-type-pill hms-rtype-${room?.roomType?.toLowerCase()}`}>{room?.roomType}</span></td>
                    <td>₹{room?.chargesPerDay}</td>
                    <td>
                      <span className={`hms-badge ${bed.status === 'Available' ? 'hms-badge-green' : 'hms-badge-red'}`}>
                        {bed.status}
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

export default BedManagement;
