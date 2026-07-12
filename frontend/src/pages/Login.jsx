import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import "../styles/Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '', role: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const validate = () => {
    const errors = { email: '', password: '', role: '' };
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

    if (!form.role.trim()) {
      errors.role = 'Role is required';
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
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password, role: form.role });
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
        <div style={{ fontSize: 12, color: '#64748b' }}>TRANSITOPS © 2026 • Secure Access</div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Sign in to your account</h2>
          <p className="sub">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} noValidate>
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

            <label>Role</label>
            <select
              className={fieldErrors.role ? 'input-error' : ''}
              value={form.role}
              onChange={(e) => {
                setForm({ ...form, role: e.target.value });
                if (fieldErrors.role) setFieldErrors({ ...fieldErrors, role: '' });
              }}
            >
              <option value="">Select a role</option>
              <option value="Fleet Manager">Fleet Manager</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="Safety Officer">Safety Officer</option>
              <option value="Financial Analyst">Financial Analyst</option>
            </select>
            {fieldErrors.role && <p className="error-text">{fieldErrors.role}</p>}

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