import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { login } from '../services/authApi';

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Validation ─────────────────────────────────────────────
  function validate() {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Enter a valid email address.';
    if (!form.password) errors.password = 'Password is required.';
    return errors;
  }

  // ── Handlers ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on edit
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* ── Header badge ── */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FF3CAC',
              border: '3px solid #0A0A0A',
              borderRadius: '14px',
              boxShadow: '5px 5px 0 #0A0A0A',
              padding: '8px 20px',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '1.4rem',
                color: 'white',
                letterSpacing: '-1px',
              }}
            >
              SUDO
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '1.4rem',
                color: '#FFD60A',
                letterSpacing: '-1px',
              }}
            >
              KU
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
              margin: '0 0 6px',
            }}
          >
            Welcome Back! 👋
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px', margin: 0 }}>
            Sign in to continue your puzzle journey.
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className="neo-card"
          style={{ padding: '32px 28px' }}
        >

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: '#FEE2E2',
                border: '3px solid #EF4444',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '4px 4px 0 #EF4444',
                fontWeight: 600,
                fontSize: '14px',
              }}
              className="animate-shake"
            >
              <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{error}</span>
              <button
                onClick={() => setError(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '16px' }}
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="login-email"
                style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}
              >
                📧 Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: fieldErrors.email ? '#EF4444' : '#6B7280',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    border: `3px solid ${fieldErrors.email ? '#EF4444' : '#0A0A0A'}`,
                    borderRadius: '10px',
                    boxShadow: fieldErrors.email ? '4px 4px 0 #EF4444' : '4px 4px 0 #0A0A0A',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: '15px',
                    outline: 'none',
                    background: 'white',
                    boxSizing: 'border-box',
                    transition: 'box-shadow 0.1s, border-color 0.1s',
                  }}
                  onFocus={(e) => {
                    if (!fieldErrors.email) {
                      e.target.style.borderColor = '#FF3CAC';
                      e.target.style.boxShadow = '4px 4px 0 #FF3CAC';
                    }
                  }}
                  onBlur={(e) => {
                    if (!fieldErrors.email) {
                      e.target.style.borderColor = '#0A0A0A';
                      e.target.style.boxShadow = '4px 4px 0 #0A0A0A';
                    }
                  }}
                />
              </div>
              {fieldErrors.email && (
                <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: 600, marginTop: '5px' }}>
                  ⚠ {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label
                htmlFor="login-password"
                style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}
              >
                🔐 Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: fieldErrors.password ? '#EF4444' : '#6B7280',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 38px',
                    border: `3px solid ${fieldErrors.password ? '#EF4444' : '#0A0A0A'}`,
                    borderRadius: '10px',
                    boxShadow: fieldErrors.password ? '4px 4px 0 #EF4444' : '4px 4px 0 #0A0A0A',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: '15px',
                    outline: 'none',
                    background: 'white',
                    boxSizing: 'border-box',
                    transition: 'box-shadow 0.1s, border-color 0.1s',
                  }}
                  onFocus={(e) => {
                    if (!fieldErrors.password) {
                      e.target.style.borderColor = '#FF3CAC';
                      e.target.style.boxShadow = '4px 4px 0 #FF3CAC';
                    }
                  }}
                  onBlur={(e) => {
                    if (!fieldErrors.password) {
                      e.target.style.borderColor = '#0A0A0A';
                      e.target.style.boxShadow = '4px 4px 0 #0A0A0A';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: 600, marginTop: '5px' }}>
                  ⚠ {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                border: '3px solid #0A0A0A',
                borderRadius: '10px',
                background: loading ? '#6B7280' : '#FF3CAC',
                color: 'white',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: '16px',
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '5px 5px 0 #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translate(-2px,-2px)';
                  e.currentTarget.style.boxShadow = '7px 7px 0 #0A0A0A';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0,0)';
                e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
              }}
              onMouseDown={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translate(2px,2px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0 #0A0A0A';
                }
              }}
              onMouseUp={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translate(-2px,-2px)';
                  e.currentTarget.style.boxShadow = '7px 7px 0 #0A0A0A';
                }
              }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* ── Footer link ── */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', fontWeight: 600 }}>
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#FF3CAC',
              fontWeight: 800,
              textDecoration: 'none',
              borderBottom: '2px solid #FF3CAC',
            }}
          >
            Sign Up →
          </Link>
        </p>
      </div>
    </main>
  );
}
