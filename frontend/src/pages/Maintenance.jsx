import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import "../styles/Shared.css";

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ vehicleId: '', description: '', cost: '' });
  const [error, setError] = useState('');

  const load = () => api.get('/maintenance').then((res) => setRecords(res.data)).catch(console.error);
  useEffect(() => {
    load();
    api.get('/vehicles').then((res) => setVehicles(res.data)).catch(console.error);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/maintenance', form);
      setShowModal(false);
      setForm({ vehicleId: '', description: '', cost: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create record');
    }
  };

  const close = async (id) => {
    try { await api.put(`/maintenance/${id}/close`); load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to close record'); }
  };

  return (
    <div className="page">
      <div className="toolbar">
        <h2>Maintenance</h2>
        <button className="btn" onClick={() => setShowModal(true)}>+ Log Service Record</button>
      </div>

      <table>
        <thead>
          <tr><th>Vehicle</th><th>Service</th><th>Cost</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {records.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>No maintenance records</td></tr>
          )}
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.Vehicle?.registrationNumber}</td>
              <td>{r.description}</td>
              <td>₹{r.cost}</td>
              <td><StatusBadge status={r.status === 'Active' ? 'In Shop' : 'Completed'} /></td>
              <td>{r.status === 'Active' && <button className="btn" onClick={() => close(r.id)}>Close</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>
        Note: In Shop vehicles are removed from the dispatch pool.
      </p>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Log Service Record</h3>
            <form onSubmit={handleCreate}>
              <label>Vehicle</label>
              <select required value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
                <option value="">Select vehicle</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
              </select>
              <label>Service Type</label>
              <input required placeholder="Oil Change, Engine Repair..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <label>Cost</label>
              <input required type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
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