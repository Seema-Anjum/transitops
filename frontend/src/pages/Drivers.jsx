import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import StatusBadge from '../components/StatusBadge';
import "../styles/Shared.css";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '',
  });
  const [error, setError] = useState('');
  const user = useAuthStore((s) => s.user);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const load = () => {
    const params = {};
    if (statusFilter !== 'All') params.status = statusFilter;

    api.get('/drivers', { params }).then((res) => setDrivers(res.data)).catch(console.error);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/drivers', form);
      setShowModal(false);
      setForm({ name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create driver');
    }
  };

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="toolbar">
        <h2>Drivers &amp; Safety</h2>
        {(user?.role === 'Fleet Manager' || user?.role === 'Safety Officer') && (
          <button className="btn" onClick={() => setShowModal(true)}>+ Add Driver</button>
        )}
      </div>

      <div className="filters-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">Status: All</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="Off Duty">Off Duty</option>
          <option value="Suspended">Suspended</option>
        </select>

        <input
          type="text"
          placeholder="Search name or license no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Driver</th>
            <th>License No.</th>
            <th>Category</th>
            <th>Expiry</th>
            <th>Contact</th>
            <th>Safety Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrivers.length === 0 && (
            <tr><td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>No drivers found</td></tr>
          )}
          {filteredDrivers.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.licenseNumber}</td>
              <td>{d.licenseCategory}</td>
              <td>
                {d.licenseExpiryDate}
                {d.licenseExpired && <span style={{ color: '#dc2626', fontSize: 11, marginLeft: 6, fontWeight: 600 }}>EXPIRED</span>}
              </td>
              <td>{d.contactNumber}</td>
              <td>{d.safetyScore}%</td>
              <td><StatusBadge status={d.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Driver</h3>
            <form onSubmit={handleCreate}>
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

              <label>License Number</label>
              <input required value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />

              <label>License Category</label>
              <input required placeholder="LMV, HMV" value={form.licenseCategory} onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })} />

              <label>License Expiry Date</label>
              <input required type="date" value={form.licenseExpiryDate} onChange={(e) => setForm({ ...form, licenseExpiryDate: e.target.value })} />

              <label>Contact Number</label>
              <input required value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />

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