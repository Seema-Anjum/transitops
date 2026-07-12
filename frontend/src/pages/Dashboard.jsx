import { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((res) => setKpis(res.data)).catch(console.error);
  }, []);

  if (!kpis) return <div className="page">Loading dashboard...</div>;

  return (
    <div className="page">
      <h2>Dashboard</h2>

      <div className="kpi-grid">
        <div className="kpi-card kpi-vehicles">
          <div className="kpi-label">Active Vehicles</div>
          <div className="kpi-value">{kpis.activeVehicles}</div>
        </div>
        <div className="kpi-card kpi-vehicles">
          <div className="kpi-label">Available Vehicles</div>
          <div className="kpi-value">{kpis.availableVehicles}</div>
        </div>
        <div className="kpi-card kpi-vehicles">
          <div className="kpi-label">In Maintenance</div>
          <div className="kpi-value">{kpis.vehiclesInMaintenance}</div>
        </div>

        <div className="kpi-card kpi-trips">
          <div className="kpi-label">Active Trips</div>
          <div className="kpi-value">{kpis.activeTrips}</div>
        </div>
        <div className="kpi-card kpi-trips">
          <div className="kpi-label">Pending Trips</div>
          <div className="kpi-value">{kpis.pendingTrips}</div>
        </div>

        <div className="kpi-card kpi-drivers">
          <div className="kpi-label">Drivers On Duty</div>
          <div className="kpi-value">{kpis.driversOnDuty}</div>
        </div>

        <div className="kpi-card kpi-utilization">
          <div className="kpi-label">Fleet Utilization</div>
          <div className="kpi-value">{kpis.fleetUtilization}</div>
        </div>
      </div>

      <div className="kpi-legend">
        <span><span className="legend-dot dot-vehicles"></span>Vehicles</span>
        <span><span className="legend-dot dot-trips"></span>Trips</span>
        <span><span className="legend-dot dot-drivers"></span>Drivers</span>
        <span><span className="legend-dot dot-utilization"></span>Performance</span>
      </div>
    </div>
  );
}