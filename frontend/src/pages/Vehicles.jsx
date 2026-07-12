import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import StatusBadge from '../components/StatusBadge';
import "../styles/Shared.css";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ registrationNumber: '', name: '', type: '', maxLoadCapacity: '', odometer: 0, acquisitionCost: '' });
  const [error, setError] = useState('');
  const user = useAuthStore((s) => s.user);

  // Filters
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const load = () => {
    const params = {};
    if (typeFilter !== 'All') params.type = typeFilter;
    if (statusFilter !== 'All') params.status = statusFilter;

    api.get('/vehicles', { params }).then((res) => setVehicles(res.data)).catch(console.error);
  };

  useEffect(() => { load(); }, [typeFilter, statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/vehicles', form);
      setShowModal(false);
      setForm({ registrationNumber: '', name: '', type: '', maxLoadCapacity: '', odometer: 0, acquisitionCost: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create vehicle');
    }
  };

  // Registration number search applied client-side on top of server-side type/status filters
  const filteredVehicles = vehicles.filter((v) =>
    v.registrationNumber.toLowerCase().includes(search.toLowerCase())
  );

  // Distinct vehicle types pulled from current data, for the Type dropdown
  const vehicleTypes = [...new Set(vehicles.map((v) => v.type))];

  return (
    <div className="page">
     
      <div className="filters-bar">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="All">Type: All</option>
          {vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">Status: All</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="In Shop">In Shop</option>
          <option value="Retired">Retired</option>
        </select>

        <input
          type="text"
          placeholder="Search reg. no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

         {user?.role === 'Fleet Manager' && (
          <button className="btn" onClick={() => setShowModal(true)}>+ Add Vehicle</button>
        )}
      </div>

      <table>
        <thead>
          <tr><th>Reg No</th><th>Name</th><th>Type</th><th>Capacity (kg)</th><th>Odometer</th><th>Status</th></tr>
        </thead>
        <tbody>
          {filteredVehicles.length === 0 && (
            <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>No vehicles found</td></tr>
          )}
          {filteredVehicles.map((v) => (
            <tr key={v.id}>
              <td>{v.registrationNumber}</td>
              <td>{v.name}</td>
              <td>{v.type}</td>
              <td>{v.maxLoadCapacity}</td>
              <td>{v.odometer}</td>
              <td><StatusBadge status={v.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Vehicle</h3>
            <form onSubmit={handleCreate}>
              <label>Registration Number</label>
              <input required value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
              <label>Name / Model</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <label>Type</label>
              <input required placeholder="Van, Truck, Bike" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              <label>Max Load Capacity (kg)</label>
              <input required type="number" value={form.maxLoadCapacity} onChange={(e) => setForm({ ...form, maxLoadCapacity: e.target.value })} />
              <label>Odometer</label>
              <input type="number" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} />
              <label>Acquisition Cost</label>
              <input required type="number" value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} />
              {error && <p className="error-text">{error}</p>}
              <div className="modal-actions">
                <button type="submit" className="btn">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}