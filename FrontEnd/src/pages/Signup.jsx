import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signup } from '../services/authApi';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Validation ─────────────────────────────────────────────
  function validate() {
    const errors = {};
    if (!form.username.trim()) errors.username = 'Username is required.';
    else if (form.username.trim().length < 3)
      errors.username = 'Username must be at least 3 characters.';

    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Enter a valid email address.';

    if (!form.password) errors.password = 'Password is required.';
    else if (form.password.length < 6)
      errors.password = 'Password must be at least 6 characters.';

    if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      errors.confirmPassword = 'Passwords do not match.';

    return errors;
  }

  // ── Handlers ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      await signup(form.username.trim(), form.email.trim(), form.password);
      setSuccess(true);
      // Redirect to login after brief success pause
      setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Field helper: shared input styles ─────────────────────
  function inputStyle(hasError) {
    return {
      width: '100%',
      padding: '12px 12px 12px 38px',
      border: `3px solid ${hasError ? '#EF4444' : '#0A0A0A'}`,
      borderRadius: '10px',
      boxShadow: hasError ? '4px 4px 0 #EF4444' : '4px 4px 0 #0A0A0A',
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 600,
      fontSize: '15px',
      outline: 'none',
      background: 'white',
      boxSizing: 'border-box',
      transition: 'box-shadow 0.1s, border-color 0.1s',
    };
  }

  function handleFocus(e, hasError) {
    if (!hasError) {
      e.target.style.borderColor = '#FF3CAC';
      e.target.style.boxShadow = '4px 4px 0 #FF3CAC';
    }
  }

  function handleBlur(e, hasError) {
    if (!hasError) {
      e.target.style.borderColor = '#0A0A0A';
      e.target.style.boxShadow = '4px 4px 0 #0A0A0A';
    }
  }

  const iconStyle = (hasError) => ({
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: hasError ? '#EF4444' : '#6B7280',
    pointerEvents: 'none',
  });

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
      <div style={{ width: '100%', maxWidth: '460px' }}>

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
            Create Account 🎉
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px', margin: 0 }}>
            Join and start solving puzzles today!
          </p>
        </div>

        {/* ── Card ── */}
        <div className="neo-card" style={{ padding: '32px 28px' }}>

          {/* Success Banner */}
          {success && (
            <div
              style={{
                background: '#DCFCE7',
                border: '3px solid #22C55E',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '4px 4px 0 #22C55E',
                fontWeight: 700,
                fontSize: '15px',
              }}
              className="animate-bounce-in"
            >
              <CheckCircle size={20} color="#22C55E" style={{ flexShrink: 0 }} />
              <span>Account created! Redirecting to login… 🎊</span>
            </div>
          )}

          {/* Error Banner */}
          {error && !success && (
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

            {/* Username */}
            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="signup-username"
                style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}
              >
                👤 Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={iconStyle(!!fieldErrors.username)} />
                <input
                  id="signup-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  style={inputStyle(!!fieldErrors.username)}
                  onFocus={(e) => handleFocus(e, !!fieldErrors.username)}
                  onBlur={(e) => handleBlur(e, !!fieldErrors.username)}
                />
              </div>
              {fieldErrors.username && (
                <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: 600, marginTop: '5px' }}>
                  ⚠ {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="signup-email"
                style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}
              >
                📧 Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={iconStyle(!!fieldErrors.email)} />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={inputStyle(!!fieldErrors.email)}
                  onFocus={(e) => handleFocus(e, !!fieldErrors.email)}
                  onBlur={(e) => handleBlur(e, !!fieldErrors.email)}
                />
              </div>
              {fieldErrors.email && (
                <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: 600, marginTop: '5px' }}>
                  ⚠ {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="signup-password"
                style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}
              >
                🔐 Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle(!!fieldErrors.password)} />
                <input
                  id="signup-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  style={{ ...inputStyle(!!fieldErrors.password), paddingRight: '40px' }}
                  onFocus={(e) => handleFocus(e, !!fieldErrors.password)}
                  onBlur={(e) => handleBlur(e, !!fieldErrors.password)}
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

            {/* Confirm Password */}
            <div style={{ marginBottom: '28px' }}>
              <label
                htmlFor="signup-confirm-password"
                style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}
              >
                🔑 Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle(!!fieldErrors.confirmPassword)} />
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  style={{ ...inputStyle(!!fieldErrors.confirmPassword), paddingRight: '40px' }}
                  onFocus={(e) => handleFocus(e, !!fieldErrors.confirmPassword)}
                  onBlur={(e) => handleBlur(e, !!fieldErrors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((v) => !v)}
                  aria-label={showConfirmPwd ? 'Hide confirm password' : 'Show confirm password'}
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
                  {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: 600, marginTop: '5px' }}>
                  ⚠ {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading || success}
              style={{
                width: '100%',
                padding: '14px',
                border: '3px solid #0A0A0A',
                borderRadius: '10px',
                background: success ? '#22C55E' : loading ? '#6B7280' : '#FFD60A',
                color: '#0A0A0A',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: '16px',
                cursor: loading || success ? 'wait' : 'pointer',
                boxShadow: '5px 5px 0 #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.transform = 'translate(-2px,-2px)';
                  e.currentTarget.style.boxShadow = '7px 7px 0 #0A0A0A';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0,0)';
                e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
              }}
              onMouseDown={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.transform = 'translate(2px,2px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0 #0A0A0A';
                }
              }}
              onMouseUp={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.transform = 'translate(-2px,-2px)';
                  e.currentTarget.style.boxShadow = '7px 7px 0 #0A0A0A';
                }
              }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : success ? (
                <CheckCircle size={18} />
              ) : (
                <UserPlus size={18} />
              )}
              {loading ? 'Creating Account...' : success ? 'Account Created!' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* ── Footer link ── */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', fontWeight: 600 }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#FF3CAC',
              fontWeight: 800,
              textDecoration: 'none',
              borderBottom: '2px solid #FF3CAC',
            }}
          >
            Sign In →
          </Link>
        </p>
      </div>
    </main>
  );
}
