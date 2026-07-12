import "../styles/Shared.css";

const RBAC_MATRIX = [
  { role: 'Fleet Manager', fleet: '✓', drivers: '✓', trips: '✓', maintenance: '✓', fuelExp: '✓', analytics: '✓' },
  { role: 'Driver', fleet: 'view', drivers: 'view', trips: '✓', maintenance: '–', fuelExp: '✓ (log only)', analytics: '–' },
  { role: 'Safety Officer', fleet: '–', drivers: 'view', trips: 'view', maintenance: '–', fuelExp: '–', analytics: '–' },
  { role: 'Financial Analyst', fleet: 'view', drivers: '–', trips: '–', maintenance: '–', fuelExp: 'view', analytics: 'view' },
];

export default function Settings() {
  return (
    <div className="page">
      <h2>Settings &amp; RBAC</h2>

      <h3 style={{ fontSize: 14, color: '#64748b', margin: '20px 0 12px' }}>ROLE-BASED ACCESS (RBAC)</h3>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Fleet</th>
            <th>Drivers</th>
            <th>Trips</th>
            <th>Maintenance</th>
            <th>Fuel/Exp.</th>
            <th>Analytics</th>
          </tr>
        </thead>
        <tbody>
          {RBAC_MATRIX.map((r) => (
            <tr key={r.role}>
              <td><strong>{r.role}</strong></td>
              <td>{r.fleet}</td>
              <td>{r.drivers}</td>
              <td>{r.trips}</td>
              <td>{r.maintenance}</td>
              <td>{r.fuelExp}</td>
              <td>{r.analytics}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
        Access levels are enforced server-side via JWT + role middleware, not just hidden in the UI.
      </p>
    </div>
  );
}