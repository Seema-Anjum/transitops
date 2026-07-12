import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import "../styles/Sidebar.css";


const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vehicles', label: 'Fleet' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/trips', label: 'Trips' },
  { to: '/maintenance', label: 'Maintenance', role: 'Fleet Manager' },
  { to: '/fuel-expenses', label: 'Fuel & Expenses' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">TransitOps</div>
      <div className="sidebar-nav">
        {NAV_ITEMS.filter(item => !item.role || item.role === user?.role).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="sidebar-footer">TRANSITOPS © 2026 · RBAC ENABLED</div>
    </div>
  );
}