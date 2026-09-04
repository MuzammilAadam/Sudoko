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

  const isLeaderboardActive = pathname === '/leaderboard';

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

        {/* ── Left: Brand Logo ── */}
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <div
            style={{
              background: '#FF3CAC',
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              boxShadow: '3px 3px 0 #0A0A0A',
              padding: '5px 12px',
              transition: 'transform 0.1s ease',
            }}
            className="group-hover:translate-x-[-1px] group-hover:translate-y-[-1px]"
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                fontSize: '1.3rem',
                color: 'white',
                letterSpacing: '-1px',
              }}
            >
              SUDO
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                fontSize: '1.3rem',
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
              padding: '2px 8px',
              boxShadow: '2px 2px 0 #0A0A0A',
              display: 'none',
            }}
            className="sm:inline-block"
          >
            ★ GAME PLATFORM
          </span>
        </Link>

        {/* ── Desktop Navigation ── */}
        <div className="hidden md:flex items-center gap-4">

          {/* Leaderboard Item */}
          <Link
            to="/leaderboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              border: '2.5px solid #0A0A0A',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '14px',
              textDecoration: 'none',
              color: '#0A0A0A',
              background: isLeaderboardActive ? '#FFD60A' : 'white',
              boxShadow: isLeaderboardActive ? '4px 4px 0 #0A0A0A' : '3px 3px 0 #0A0A0A',
              transition: 'all 0.1s ease',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!isLeaderboardActive) {
                e.currentTarget.style.background = '#FFD60A';
                e.currentTarget.style.transform = 'translate(-2px,-2px)';
                e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLeaderboardActive) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translate(0,0)';
                e.currentTarget.style.boxShadow = '3px 3px 0 #0A0A0A';
              }
            }}
          >
            <Trophy size={18} color="#0A0A0A" />
            <span>Leaderboard</span>
          </Link>

          {/* User Profile Dropdown */}
          {authenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                id="user-profile-menu-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  background: dropdownOpen ? '#FF3CAC' : '#F5EED8',
                  color: dropdownOpen ? 'white' : '#0A0A0A',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  transition: 'all 0.1s ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!dropdownOpen) {
                    e.currentTarget.style.transform = 'translate(-2px,-2px)';
                    e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
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
                    borderRadius: '50%',
                    border: '2px solid #0A0A0A',
                    background: '#FFD60A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={14} color="#0A0A0A" />
                </div>
                <span> {username}</span>
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
                    width: '240px',
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
                        borderRadius: '50%',
                        border: '2px solid #0A0A0A',
                        background: '#FFD60A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                      }}
                    >
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#0A0A0A', lineHeight: '1.2' }}>
                        {username}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>
                        Sudoku Player
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link
                      to="/my-scores"
                      style={dropdownLinkStyle(pathname === '/my-scores')}
                    >
                      <BarChart3 size={16} color="#0A0A0A" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/my-scores"
                      style={dropdownLinkStyle(false)}
                    >
                      <Target size={16} color="#0A0A0A" />
                      <span> My Scores</span>
                    </Link>

                    <Link
                      to="/awards"
                      style={dropdownLinkStyle(pathname === '/awards')}
                    >
                      <Award size={16} color="#0A0A0A" />
                      <span> Achievements</span>
                    </Link>

                    <Link
                      to="/rules"
                      style={dropdownLinkStyle(pathname === '/rules')}
                    >
                      <BookOpen size={16} color="#0A0A0A" />
                      <span> How to Play & Rules</span>
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
                      <LogOut size={16} color="#EF4444" />
                      <span style={{ fontWeight: 800 }}>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            style={{
              padding: '8px',
              border: '2.5px solid #0A0A0A',
              borderRadius: '8px',
              background: '#FFD60A',
              boxShadow: '2px 2px 0 #0A0A0A',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={22} color="#0A0A0A" /> : <Menu size={22} color="#0A0A0A" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '3px solid #0A0A0A',
            background: 'white',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
          className="md:hidden"
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
              <User size={20} color="#0A0A0A" />
              <span style={{ fontWeight: 800, fontSize: '15px' }}>👤 {username}</span>
            </div>
          )}

          {/* Navigation Items */}
          <Link
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            style={mobileLinkStyle(pathname === '/leaderboard')}
          >
            <Trophy size={18} />
            <span> Leaderboard</span>
          </Link>

          {authenticated && (
            <>
              <Link
                to="/my-scores"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(pathname === '/my-scores')}
              >
                <BarChart3 size={18} />
                <span>📊 My Profile & Scores</span>
              </Link>

              <Link
                to="/awards"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(pathname === '/awards')}
              >
                <Award size={18} />
                <span> Achievements</span>
              </Link>

              <Link
                to="/rules"
                onClick={() => setMobileMenuOpen(false)}
                style={mobileLinkStyle(pathname === '/rules')}
              >
                <BookOpen size={18} />
                <span>📖 Rules & Guide</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  ...mobileLinkStyle(false),
                  background: '#FEE2E2',
                  color: '#EF4444',
                  cursor: 'pointer',
                  border: '2.5px solid #0A0A0A',
                  marginTop: '6px',
                }}
              >
                <LogOut size={18} color="#EF4444" />
                <span style={{ fontWeight: 800 }}>🚪 Logout</span>
              </button>
            </>
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
    fontWeight: 700,
    fontSize: '13.5px',
    textDecoration: 'none',
    color: '#0A0A0A',
    background: isActive ? '#FFD60A' : 'transparent',
    border: isActive ? '2px solid #0A0A0A' : '2px solid transparent',
    transition: 'all 0.1s ease',
    fontFamily: "'Space Grotesk', sans-serif",
  };
}

function mobileLinkStyle(isActive) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    border: '2.5px solid #0A0A0A',
    borderRadius: '10px',
    fontWeight: 800,
    fontSize: '15px',
    textDecoration: 'none',
    color: '#0A0A0A',
    background: isActive ? '#FFD60A' : '#FFFBF0',
    boxShadow: '3px 3px 0 #0A0A0A',
    fontFamily: "'Space Grotesk', sans-serif",
  };
}

