import React from 'react';
import { 
  FileText, 
  LayoutDashboard, 
  History, 
  FolderKanban, 
  Users, 
  UserCheck, 
  LogOut, 
  CheckSquare, 
  Shield, 
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

export function Navbar({ 
  currentUser, 
  activeView, 
  onNavigate, 
  onSwitchUser, 
  onLogout,
  allUsers,
  pendingReviewCount = 0
}) {
  const isMember = currentUser.role === 'ROLE_TEAM_MEMBER';
  const isManager = currentUser.role === 'ROLE_MANAGER';
  const isAdmin = currentUser.role === 'ROLE_ADMIN';

  return (
    <header style={{ 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)'
    }}>
      {/* Top Demo Helper Bar: 1-Click Role Switcher */}
      <div className="role-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRightLeft size={15} style={{ color: '#2563eb' }} />
          <span style={{ fontWeight: 600 }}>Demo Persona Switcher:</span>
          <span style={{ color: '#64748b' }}>Quickly switch perspective to test RBAC & workflows:</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {allUsers.filter(u => [1, 2, 3].includes(u.id)).map(u => {
            const isActive = currentUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => onSwitchUser(u)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#2563eb' : '#ffffff',
                  color: isActive ? '#ffffff' : '#334155',
                  border: `1px solid ${isActive ? '#2563eb' : '#cbd5e1'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: isActive ? '0 1px 2px rgba(37,99,235,0.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{u.roleName}: {u.fullName.split(' ')[0]}</span>
                {isActive && <span style={{ fontSize: '10px' }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate(isMember ? 'my-report' : 'dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 2px 4px rgba(37,99,235,0.25)'
          }}>
            S
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
              Sisenco Weekly Report
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
              Report Generator & Team Dashboard
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Links based on Role */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isMember && (
            <>
              <button
                className={`btn btn-sm ${activeView === 'my-report' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('my-report')}
              >
                <FileText size={15} />
                My Weekly Report
              </button>
              <button
                className={`btn btn-sm ${activeView === 'history' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('history')}
              >
                <History size={15} />
                Report History
              </button>
            </>
          )}

          {(isManager || isAdmin) && (
            <>
              <button
                className={`btn btn-sm ${activeView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('dashboard')}
              >
                <LayoutDashboard size={15} />
                Team Dashboard
              </button>
              <button
                className={`btn btn-sm ${activeView === 'review-list' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('review-list')}
                style={{ position: 'relative' }}
              >
                <CheckSquare size={15} />
                Review Workflow
                {pendingReviewCount > 0 && (
                  <span style={{
                    marginLeft: '4px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px'
                  }}>
                    {pendingReviewCount}
                  </span>
                )}
              </button>
              <button
                className={`btn btn-sm ${activeView === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('projects')}
              >
                <FolderKanban size={15} />
                Projects
              </button>
            </>
          )}

          {isAdmin && (
            <button
              className={`btn btn-sm ${activeView === 'users' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onNavigate('users')}
            >
              <Shield size={15} />
              User Management
            </button>
          )}
        </nav>

        {/* User Badge & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', textAlign: 'right' }}>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.fullName} 
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0f172a' }}>
                {currentUser.fullName}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {currentUser.roleName} • {currentUser.email.split('@')[0]}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log out"
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 8px',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
