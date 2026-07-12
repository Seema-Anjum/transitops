import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import "../styles/Shared.css";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '', plannedDistance: '',
  });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const columns = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

  const load = () => api.get('/trips').then((res) => setTrips(res.data)).catch(console.error);
  const loadAvailable = () => {
    api.get('/vehicles?status=Available').then((res) => setVehicles(res.data));
    api.get('/drivers?status=Available').then((res) => setDrivers(res.data));
  };

  useEffect(() => { load(); loadAvailable(); }, []);

  // Selected vehicle capacity, used for live inline validation like the wireframe
  const selectedVehicle = vehicles.find((v) => String(v.id) === String(form.vehicleId));
  const cargoExceeds = selectedVehicle && form.cargoWeight && Number(form.cargoWeight) > selectedVehicle.maxLoadCapacity;
  const capacityOverBy = cargoExceeds ? Number(form.cargoWeight) - selectedVehicle.maxLoadCapacity : 0;

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (cargoExceeds) return; // guard, button is disabled anyway
    try {
      await api.post('/trips', form);
      setShowModal(false);
      setForm({ source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '', plannedDistance: '' });
      load();
      loadAvailable();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    }
  };

  const dispatch = async (id) => {
    try { await api.put(`/trips/${id}/dispatch`); load(); loadAvailable(); }
    catch (err) { alert(err.response?.data?.message || 'Dispatch failed'); }
  };

  const complete = async (id) => {
    const finalOdometer = prompt('Final odometer reading:');
    if (finalOdometer === null) return;
    const fuelConsumed = prompt('Fuel consumed (liters):');
    if (fuelConsumed === null || !finalOdometer || !fuelConsumed) return;
    try {
      await api.put(`/trips/${id}/complete`, { finalOdometer: Number(finalOdometer), fuelConsumed: Number(fuelConsumed) });
      load(); loadAvailable();
    } catch (err) { alert(err.response?.data?.message || 'Complete failed'); }
  };

  const cancel = async (id) => {
    if (!window.confirm('Cancel this trip?')) return;
    try { await api.put(`/trips/${id}/cancel`); load(); loadAvailable(); }
    catch (err) { alert(err.response?.data?.message || 'Cancel failed'); }
  };

  const matchesSearch = (t) => {
    const q = search.toLowerCase();
    return (
      t.source?.toLowerCase().includes(q) ||
      t.destination?.toLowerCase().includes(q) ||
      t.Vehicle?.registrationNumber?.toLowerCase().includes(q) ||
      t.Driver?.name?.toLowerCase().includes(q)
    );
  };

  return (
    <div className="page">
      <div className="toolbar">
        <h2>Trip Dispatcher</h2>
        <button className="btn" onClick={() => setShowModal(true)}>+ Create Trip</button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search route, vehicle, or driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="kanban">
        {columns.map((col) => {
          const colTrips = trips.filter((t) => t.status === col && matchesSearch(t));
          return (
            <div className="kanban-col" key={col}>
              <h4>{col} ({colTrips.length})</h4>

              {colTrips.length === 0 && (
                <div style={{ fontSize: 12, color: '#94a3b8', padding: '8px 0' }}>No trips</div>
              )}

              {colTrips.map((t) => (
                <div className="kanban-card" key={t.id}>
                  <div className="trip-id">TR{String(t.id).padStart(3, '0')}</div>
                  <div className="route">{t.source} → {t.destination}</div>
                  <div className="meta">
                    {t.Vehicle?.registrationNumber || 'Unassigned'} / {t.Driver?.name || 'Unassigned'}
                  </div>
                  <div className="meta">Cargo: {t.cargoWeight}kg · Distance: {t.plannedDistance}km</div>
                  {t.status === 'Completed' && (
                    <div className="meta">Odometer: {t.finalOdometer ?? '—'} · Fuel: {t.fuelConsumed ?? '—'}L</div>
                  )}

                  <div className="actions">
                    {t.status === 'Draft' && <button className="btn" onClick={() => dispatch(t.id)}>Dispatch</button>}
                    {t.status === 'Dispatched' && <button className="btn" onClick={() => complete(t.id)}>Complete</button>}
                    {['Draft', 'Dispatched'].includes(t.status) && (
                      <button className="btn btn-secondary" onClick={() => cancel(t.id)}>Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create Trip</h3>
            <form onSubmit={handleCreate}>
              <label>Source</label>
              <input required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />

              <label>Destination</label>
              <input required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />

              <label>Vehicle (Available only)</label>
              <select required value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
                <option value="">Select vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.registrationNumber} — {v.maxLoadCapacity}kg capacity</option>
                ))}
              </select>

              <label>Driver (Available only)</label>
              <select required value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}>
                <option value="">Select driver</option>
                {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <label>Cargo Weight (kg)</label>
              <input
                required
                type="number"
                value={form.cargoWeight}
                onChange={(e) => setForm({ ...form, cargoWeight: e.target.value })}
              />

              {/* Live capacity check, mirrors the wireframe's inline warning */}
              {selectedVehicle && (
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  Vehicle Capacity: {selectedVehicle.maxLoadCapacity} kg
                  {form.cargoWeight && <> · Cargo Weight: {form.cargoWeight} kg</>}
                </div>
              )}
              {cargoExceeds && (
                <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4, fontWeight: 600 }}>
                  ❌ Capacity exceeded by {capacityOverBy} kg — dispatch blocked
                </div>
              )}

              <label>Planned Distance (km)</label>
              <input required type="number" value={form.plannedDistance} onChange={(e) => setForm({ ...form, plannedDistance: e.target.value })} />

              {error && <p className="error-text">{error}</p>}

              <div className="modal-actions">
                <button type="submit" className="btn" disabled={cargoExceeds}>
                  {cargoExceeds ? 'Create (disabled)' : 'Create'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}