import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Trophy,
  User,
  LogOut,
  ChevronDown,
  Award,
  BookOpen,
  BarChart3,
  Target,
  Menu,
  X,
  Play,
  Users,
  Grid3x3,
  LogIn,
} from 'lucide-react';
import { clearAuth, getUsername, isAuthenticated } from '../services/authApi';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const username = getUsername() || 'Player';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown/menu on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'PLAY', path: '/classic', icon: Play, color: '#FF3CAC' },
    { label: 'MULTIPLAYER', path: '/multiplayer', icon: Users, color: '#FFD60A' },
    { label: 'LEADERBOARD', path: '/leaderboard', icon: Trophy, color: '#2563EB' },
    { label: 'HOW TO PLAY', path: '/rules', icon: BookOpen, color: '#22C55E' },
  ];

  return (
    <header
      style={{
        background: '#FFFBF0',
        borderBottom: '3.5px solid #0A0A0A',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 0px #0A0A0A',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* ── Left: Brand Logo & Icon ── */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div
            style={{
              width: '42px',
              height: '42px',
              background: '#FFD60A',
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              boxShadow: '3px 3px 0 #0A0A0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.1s ease',
            }}
            className="group-hover:translate-x-[-1px] group-hover:translate-y-[-1px]"
          >
            <Grid3x3 size={24} color="#0A0A0A" strokeWidth={2.5} />
          </div>

          <div
            style={{
              background: '#FF3CAC',
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              boxShadow: '3px 3px 0 #0A0A0A',
              padding: '4px 12px',
              transition: 'transform 0.1s ease',
              display: 'flex',
              alignItems: 'center',
            }}
            className="group-hover:translate-x-[-1px] group-hover:translate-y-[-1px]"
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 900,
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
                fontWeight: 900,
                fontSize: '1.25rem',
                color: '#FFD60A',
                letterSpacing: '-1px',
              }}
            >
              KU
            </span>
          </div>
        </Link>

        {/* ── Center/Right Navigation ── */}
        <div className="hidden lg:flex items-center gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 15px',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  letterSpacing: '0.5px',
                  textDecoration: 'none',
                  color: '#0A0A0A',
                  background: isActive ? item.color : 'white',
                  boxShadow: isActive ? '3.5px 3.5px 0 #0A0A0A' : '2.5px 2.5px 0 #0A0A0A',
                  transition: 'all 0.1s ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = item.color;
                    e.currentTarget.style.transform = 'translate(-2px,-2px)';
                    e.currentTarget.style.boxShadow = '4.5px 4.5px 0 #0A0A0A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translate(0,0)';
                    e.currentTarget.style.boxShadow = '2.5px 2.5px 0 #0A0A0A';
                  }
                }}
              >
                <Icon size={16} color="#0A0A0A" strokeWidth={2.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* ── Right Profile / Auth Area ── */}
        <div className="hidden lg:flex items-center gap-3">
          {authenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                id="user-profile-menu-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  background: dropdownOpen ? '#FF3CAC' : '#FFD60A',
                  color: dropdownOpen ? 'white' : '#0A0A0A',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  transition: 'all 0.1s ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!dropdownOpen) {
                    e.currentTarget.style.transform = 'translate(-2px,-2px)';
                    e.currentTarget.style.boxShadow = '4.5px 4.5px 0 #0A0A0A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!dropdownOpen) {
                    e.currentTarget.style.transform = 'translate(0,0)';
                    e.currentTarget.style.boxShadow = '3px 3px 0 #0A0A0A';
                  }
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    border: '2px solid #0A0A0A',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={14} color="#0A0A0A" strokeWidth={2.5} />
                </div>
                <span>{username}</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Dropdown Menu Panel */}
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '230px',
                    background: 'white',
                    border: '3px solid #0A0A0A',
                    borderRadius: '12px',
                    boxShadow: '6px 6px 0 #0A0A0A',
                    padding: '8px',
                    zIndex: 100,
                  }}
                >
                  {/* User Banner Header */}
                  <div
                    style={{
                      padding: '10px 12px',
                      background: '#FFFBF0',
                      border: '2px solid #0A0A0A',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: '2px solid #0A0A0A',
                        background: '#FFD60A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#0A0A0A', lineHeight: '1.2' }}>
                        {username}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700 }}>
                        Sudoku Player
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link to="/my-scores" style={dropdownLinkStyle(pathname === '/my-scores')}>
                      <BarChart3 size={16} color="#0A0A0A" strokeWidth={2.5} />
                      <span>My Profile & Scores</span>
                    </Link>

                    <Link to="/awards" style={dropdownLinkStyle(pathname === '/awards')}>
                      <Award size={16} color="#0A0A0A" strokeWidth={2.5} />
                      <span>Achievements</span>
                    </Link>

                    <Link to="/rules" style={dropdownLinkStyle(pathname === '/rules')}>
                      <BookOpen size={16} color="#0A0A0A" strokeWidth={2.5} />
                      <span>How to Play</span>
                    </Link>

                    <div
                      style={{
                        height: '2px',
                        background: '#0A0A0A',
                        margin: '6px 0',
                        opacity: 0.2,
                      }}
                    />

                    <button
                      id="dropdown-logout-btn"
                      onClick={handleLogout}
                      style={{
                        ...dropdownLinkStyle(false),
                        background: '#FEE2E2',
                        color: '#EF4444',
                        cursor: 'pointer',
                        width: '100%',
                        border: '2px solid #0A0A0A',
                        boxShadow: '2px 2px 0 #0A0A0A',
                      }}
                    >
                      <LogOut size={16} color="#EF4444" strokeWidth={2.5} />
                      <span style={{ fontWeight: 800 }}>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                border: '2.5px solid #0A0A0A',
                borderRadius: '10px',
                background: '#FFD60A',
                color: '#0A0A0A',
                fontWeight: 800,
                fontSize: '13.5px',
                textDecoration: 'none',
                boxShadow: '3px 3px 0 #0A0A0A',
                transition: 'all 0.1s ease',
              }}
            >
              <LogIn size={16} color="#0A0A0A" strokeWidth={2.5} />
              <span>LOG IN</span>
            </Link>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            style={{
              padding: '8px',
              border: '2.5px solid #0A0A0A',
              borderRadius: '8px',
              background: '#FFD60A',
              boxShadow: '2.5px 2.5px 0 #0A0A0A',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={22} color="#0A0A0A" strokeWidth={2.5} /> : <Menu size={22} color="#0A0A0A" strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '3px solid #0A0A0A',
            background: '#FFFBF0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
          className="lg:hidden"
        >
          {/* User Header */}
          {authenticated && (
            <div
              style={{
                padding: '12px',
                background: '#FFD60A',
                border: '2.5px solid #0A0A0A',
                borderRadius: '10px',
                boxShadow: '3px 3px 0 #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '6px',
              }}
            >
              <User size={20} color="#0A0A0A" strokeWidth={2.5} />
              <span style={{ fontWeight: 800, fontSize: '15px' }}>{username}</span>
            </div>
          )}

          {/* Main Navigation Links */}
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(isActive, item.color)}
              >
                <Icon size={18} strokeWidth={2.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {authenticated && (
            <>
              <div style={{ height: '2px', background: '#0A0A0A', margin: '4px 0', opacity: 0.15 }} />

              <Link
                to="/my-scores"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(pathname === '/my-scores', '#60A5FA')}
              >
                <BarChart3 size={18} strokeWidth={2.5} />
                <span>MY PROFILE & SCORES</span>
              </Link>

              <Link
                to="/awards"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(pathname === '/awards', '#FF85D1')}
              >
                <Award size={18} strokeWidth={2.5} />
                <span>ACHIEVEMENTS</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  ...mobileLinkStyle(false, '#FEE2E2'),
                  background: '#FEE2E2',
                  color: '#EF4444',
                  cursor: 'pointer',
                  border: '2.5px solid #0A0A0A',
                  marginTop: '4px',
                }}
              >
                <LogOut size={18} color="#EF4444" strokeWidth={2.5} />
                <span style={{ fontWeight: 800 }}>LOGOUT</span>
              </button>
            </>
          )}

          {!authenticated && (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={mobileLinkStyle(true, '#FFD60A')}
            >
              <LogIn size={18} strokeWidth={2.5} />
              <span>LOG IN / SIGN UP</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

function dropdownLinkStyle(isActive) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    fontWeight: 800,
    fontSize: '13px',
    textDecoration: 'none',
    color: '#0A0A0A',
    background: isActive ? '#FFD60A' : 'transparent',
    border: isActive ? '2px solid #0A0A0A' : '2px solid transparent',
    transition: 'all 0.1s ease',
    fontFamily: "'Space Grotesk', sans-serif",
  };
}

function mobileLinkStyle(isActive, activeBg = '#FFD60A') {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: '2.5px solid #0A0A0A',
    borderRadius: '10px',
    fontWeight: 800,
    fontSize: '14px',
    textDecoration: 'none',
    color: '#0A0A0A',
    background: isActive ? activeBg : 'white',
    boxShadow: '3px 3px 0 #0A0A0A',
    fontFamily: "'Space Grotesk', sans-serif",
  };
}


