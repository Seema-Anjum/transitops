import { useEffect, useState } from 'react';
import api from '../api/axios';
import "../styles/Shared.css";
import "../styles/Dashboard.css";

export default function Analytics() {
  const [fleetReport, setFleetReport] = useState([]);
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    api.get('/reports/fleet').then((res) => setFleetReport(res.data)).catch(console.error);
    api.get('/dashboard').then((res) => setKpis(res.data)).catch(console.error);
  }, []);

  const avgFuelEfficiency = (() => {
    const valid = fleetReport.filter((v) => v.fuelEfficiency !== 'N/A');
    if (valid.length === 0) return 'N/A';
    const avg = valid.reduce((sum, v) => sum + parseFloat(v.fuelEfficiency), 0) / valid.length;
    return `${avg.toFixed(1)} km/l`;
  })();

  const totalOperationalCost = fleetReport.reduce((sum, v) => sum + (v.operationalCost || 0), 0);

  const topCostliest = [...fleetReport]
    .sort((a, b) => b.operationalCost - a.operationalCost)
    .slice(0, 5);

  const maxCost = topCostliest[0]?.operationalCost || 1;

  return (
    <div className="page">
      <h2>Analytics</h2>

      <div className="kpi-grid">
        <div className="kpi-card kpi-vehicles">
          <div className="kpi-label">Fuel Efficiency (avg)</div>
          <div className="kpi-value">{avgFuelEfficiency}</div>
        </div>
        <div className="kpi-card kpi-utilization">
          <div className="kpi-label">Fleet Utilization</div>
          <div className="kpi-value">{kpis?.fleetUtilization || '—'}</div>
        </div>
        <div className="kpi-card kpi-trips">
          <div className="kpi-label">Operational Cost</div>
          <div className="kpi-value">₹{totalOperationalCost.toLocaleString()}</div>
        </div>
        <div className="kpi-card kpi-drivers">
          <div className="kpi-label">Vehicles Tracked</div>
          <div className="kpi-value">{fleetReport.length}</div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#94a3b8', margin: '18px 0' }}>
        ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost
      </p>

      <h3 style={{ fontSize: 14, color: '#64748b', margin: '20px 0 12px' }}>TOP COSTLIEST VEHICLES</h3>
      <div style={{ maxWidth: 500 }}>
        {topCostliest.length === 0 && <p style={{ color: '#94a3b8', fontSize: 13 }}>No data yet</p>}
        {topCostliest.map((v, i) => (
          <div key={v.vehicleId} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span>{v.registrationNumber}</span>
              <span style={{ color: '#64748b' }}>₹{v.operationalCost.toLocaleString()}</span>
            </div>
            <div style={{ background: '#e2e8f0', borderRadius: 6, height: 10, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(v.operationalCost / maxCost) * 100}%`,
                  background: i === 0 ? '#ef4444' : i === 1 ? '#f97316' : '#3b82f6',
                  height: '100%',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 14, color: '#64748b', margin: '24px 0 12px' }}>FLEET REPORT</h3>
      <table>
        <thead><tr><th>Vehicle</th><th>Status</th><th>Fuel Efficiency</th><th>Operational Cost</th></tr></thead>
        <tbody>
          {fleetReport.map((v) => (
            <tr key={v.vehicleId}>
              <td>{v.registrationNumber}</td>
              <td>{v.status}</td>
              <td>{v.fuelEfficiency}</td>
              <td>₹{v.operationalCost.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}