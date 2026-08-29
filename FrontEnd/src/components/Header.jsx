import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Grid3x3, Trophy, Award, BookOpen, LogOut, User, BarChart2 } from 'lucide-react';
import { clearAuth, getUsername, isAuthenticated } from '../services/authApi';

const NAV_LINKS = [
  { label: 'Classic', to: '/', icon: <Grid3x3 size={16} /> },
  { label: 'My Scores', to: '/my-scores', icon: <User size={16} /> },
  { label: 'Leaderboard', to: '/leaderboard', icon: <Trophy size={16} /> },
  { label: 'Awards', to: '/awards', icon: <Award size={16} /> },
  { label: 'Rules', to: '/rules', icon: <BookOpen size={16} /> },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const username = getUsername();

  const handleLogout = () => {
    clearAuth();
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header
      style={{
        background: 'white',
        borderBottom: '3px solid #0A0A0A',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 0px #0A0A0A',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div
            style={{
              background: '#FF3CAC',
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              boxShadow: '3px 3px 0 #0A0A0A',
              padding: '4px 10px',
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '1.25rem',
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
                fontSize: '1.25rem',
                color: '#FFD60A',
                letterSpacing: '-1px',
              }}
            >
              KU
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '0.7rem',
              background: '#FFD60A',
              border: '2px solid #0A0A0A',
              borderRadius: '20px',
              padding: '1px 8px',
              boxShadow: '2px 2px 0 #0A0A0A',
              display: 'none',
            }}
            className="sm:block"
          >
            ★ NEO
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  border: '2px solid #0A0A0A',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  color: active ? 'white' : '#0A0A0A',
                  background: active ? '#FF3CAC' : 'transparent',
                  boxShadow: active ? '3px 3px 0 #0A0A0A' : 'none',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = '#FFD60A';
                    e.currentTarget.style.boxShadow = '3px 3px 0 #0A0A0A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}

          {/* Desktop: user info + logout */}
          {authenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              {/* Username badge */}
              <Link
                to="/my-scores"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  border: '2px solid #0A0A0A',
                  borderRadius: '8px',
                  background: pathname === '/my-scores' ? '#FFD60A' : '#F5EED8',
                  fontWeight: 700,
                  fontSize: '13px',
                  boxShadow: '2px 2px 0 #0A0A0A',
                  textDecoration: 'none',
                  color: '#0A0A0A',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  if (pathname !== '/my-scores') e.currentTarget.style.background = '#FFD60A';
                }}
                onMouseLeave={(e) => {
                  if (pathname !== '/my-scores') e.currentTarget.style.background = '#F5EED8';
                }}
              >
                <User size={14} />
                {username}
              </Link>
              {/* Logout button */}
              <button
                id="header-logout-btn"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  border: '2px solid #0A0A0A',
                  borderRadius: '8px',
                  background: '#FFD60A',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  transition: 'all 0.1s ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px,-2px)';
                  e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0,0)';
                  e.currentTarget.style.boxShadow = '3px 3px 0 #0A0A0A';
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden neo-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ padding: '8px' }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            borderTop: '3px solid #0A0A0A',
            background: 'white',
            padding: '12px 16px',
          }}
        >
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  border: '2px solid #0A0A0A',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '15px',
                  textDecoration: 'none',
                  color: active ? 'white' : '#0A0A0A',
                  background: active ? '#FF3CAC' : '#FFFBF0',
                  boxShadow: '3px 3px 0 #0A0A0A',
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}

          {/* Mobile: user info + logout */}
          {authenticated && (
            <>
              {/* Username pill */}
              <Link
                to="/my-scores"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  marginBottom: '8px',
                  marginTop: '4px',
                  border: '2px solid #0A0A0A',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  background: '#F5EED8',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  textDecoration: 'none',
                  color: '#0A0A0A',
                }}
              >
                <User size={16} />
                {username}
              </Link>
              {/* Logout */}
              <button
                id="mobile-logout-btn"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  width: '100%',
                  border: '2px solid #0A0A0A',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  background: '#FFD60A',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
