import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import "../styles/Topbar.css";

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="topbar">
      <input placeholder="Search..." />
      <div className="user-block">
        <div>
          <div className="user-name">{user?.name}</div>
          <div className="user-role">{user?.role}</div>
        </div>
        <div className="avatar">{initials}</div>
        <button className="logout" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
      </div>
    </div>
  );
}