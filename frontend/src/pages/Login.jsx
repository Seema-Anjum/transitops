import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import "../styles/Login.css";

const DEMO_ACCOUNTS = {
  'Fleet Manager': { email: 'fleetmanager@transitops.com', password: 'Test@1234' },
  'Dispatcher': { email: 'dispatcher@transitops.com', password: 'Test@1234' },
  'Safety Officer': { email: 'safety@transitops.com', password: 'Test@1234' },
  'Financial Analyst': { email: 'finance@transitops.com', password: 'Test@1234' },
};

const ROLES = Object.keys(DEMO_ACCOUNTS);

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'Dispatcher' });
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const role = e.target.value;
    const demo = DEMO_ACCOUNTS[role];
    setForm({ role, email: demo.email, password: demo.password });
    setFieldErrors({ email: '', password: '' });
  };

  const validate = () => {
    const errors = { email: '', password: '' };
    let isValid = true;

    if (!form.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address';
      isValid = false;
    }

    if (!form.password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div>
          <h1>TransitOps</h1>
          <p className="tagline">Smart Transport Operations Platform</p>
        </div>
        <ul>
          {ROLES.map((role) => (
            <li key={role}>● {role}</li>
          ))}
        </ul>
        <div style={{ fontSize: 12, color: '#64748b' }}>TRANSITOPS © 2026 • RBAC System</div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Sign in to your account</h2>
          <p className="sub">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} noValidate>
            <label>Quick demo login</label>
            <select value={form.role} onChange={handleRoleChange}>
              {ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <label>Email</label>
            <input
              type="email"
              className={fieldErrors.email ? 'input-error' : ''}
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
              }}
            />
            {fieldErrors.email && <p className="error-text">{fieldErrors.email}</p>}

            <label>Password</label>
            <input
              type="password"
              className={fieldErrors.password ? 'input-error' : ''}
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
              }}
            />
            {fieldErrors.password && <p className="error-text">{fieldErrors.password}</p>}

            {error && <p className="form-error-banner">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}