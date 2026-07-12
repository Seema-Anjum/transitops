import { useEffect, useState } from 'react';
import api from '../api/axios';
import "../styles/Shared.css";

export default function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [fuelForm, setFuelForm] = useState({ vehicleId: '', liters: '', cost: '', date: '' });
  const [expenseForm, setExpenseForm] = useState({ vehicleId: '', type: '', amount: '', date: '', notes: '' });
  const [error, setError] = useState('');

  const loadAll = () => {
    api.get('/fuel').then((res) => setFuelLogs(res.data)).catch(console.error);
    api.get('/expenses').then((res) => setExpenses(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadAll();
    api.get('/vehicles').then((res) => setVehicles(res.data)).catch(console.error);
  }, []);

  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
  const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalOperationalCost = totalFuelCost + totalExpenseCost; // + maintenance handled separately per vehicle in Reports

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/fuel', fuelForm);
      setShowFuelModal(false);
      setFuelForm({ vehicleId: '', liters: '', cost: '', date: '' });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log fuel');
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/expenses', expenseForm);
      setShowExpenseModal(false);
      setExpenseForm({ vehicleId: '', type: '', amount: '', date: '', notes: '' });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log expense');
    }
  };

  return (
    <div className="page">
      <div className="toolbar">
        <h2>Fuel &amp; Expenses</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={() => setShowFuelModal(true)}>+ Log Fuel</button>
          <button className="btn btn-secondary" onClick={() => setShowExpenseModal(true)}>+ Add Expense</button>
        </div>
      </div>

      <h3 style={{ fontSize: 14, color: '#64748b', margin: '20px 0 10px' }}>FUEL LOGS</h3>
      <table>
        <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Fuel Cost</th></tr></thead>
        <tbody>
          {fuelLogs.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: 16 }}>No fuel logs</td></tr>}
          {fuelLogs.map((f) => (
            <tr key={f.id}>
              <td>{vehicles.find((v) => v.id === f.vehicleId)?.registrationNumber || f.vehicleId}</td>
              <td>{f.date}</td>
              <td>{f.liters} L</td>
              <td>₹{f.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ fontSize: 14, color: '#64748b', margin: '24px 0 10px' }}>OTHER EXPENSES (TOLL / MISC)</h3>
      <table>
        <thead><tr><th>Vehicle</th><th>Type</th><th>Amount</th><th>Date</th><th>Notes</th></tr></thead>
        <tbody>
          {expenses.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: 16 }}>No expenses logged</td></tr>}
          {expenses.map((ex) => (
            <tr key={ex.id}>
              <td>{vehicles.find((v) => v.id === ex.vehicleId)?.registrationNumber || ex.vehicleId}</td>
              <td>{ex.type}</td>
              <td>₹{ex.amount}</td>
              <td>{ex.date}</td>
              <td>{ex.notes || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="kpi-card kpi-utilization" style={{ marginTop: 20, display: 'inline-block' }}>
        <div className="kpi-label">Total Operational Cost (Auto) = Fuel + Expenses</div>
        <div className="kpi-value">₹{totalOperationalCost.toLocaleString()}</div>
      </div>

      {showFuelModal && (
        <div className="modal-overlay" onClick={() => setShowFuelModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Log Fuel</h3>
            <form onSubmit={handleFuelSubmit}>
              <label>Vehicle</label>
              <select required value={fuelForm.vehicleId} onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: e.target.value })}>
                <option value="">Select vehicle</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
              </select>
              <label>Liters</label>
              <input required type="number" value={fuelForm.liters} onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })} />
              <label>Cost</label>
              <input required type="number" value={fuelForm.cost} onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })} />
              <label>Date</label>
              <input required type="date" value={fuelForm.date} onChange={(e) => setFuelForm({ ...fuelForm, date: e.target.value })} />
              {error && <p className="error-text">{error}</p>}
              <div className="modal-actions">
                <button type="submit" className="btn">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowFuelModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="modal-overlay" onClick={() => setShowExpenseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Expense</h3>
            <form onSubmit={handleExpenseSubmit}>
              <label>Vehicle</label>
              <select required value={expenseForm.vehicleId} onChange={(e) => setExpenseForm({ ...expenseForm, vehicleId: e.target.value })}>
                <option value="">Select vehicle</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
              </select>
              <label>Type</label>
              <input required placeholder="Toll, Parking, Fine" value={expenseForm.type} onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })} />
              <label>Amount</label>
              <input required type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
              <label>Date</label>
              <input required type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} />
              <label>Notes</label>
              <input value={expenseForm.notes} onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })} />
              {error && <p className="error-text">{error}</p>}
              <div className="modal-actions">
                <button type="submit" className="btn">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}