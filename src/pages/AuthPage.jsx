import React, { useState } from 'react';
import { Lock, Mail, User, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

export function AuthPage({ onLogin, allUsers }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('member@weeklyreport.com');
  const [password, setPassword] = useState('Member@123');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('ROLE_TEAM_MEMBER');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!fullName.trim() || !email.trim()) {
        setError('Please fill in all required fields.');
        return;
      }
      const newUser = {
        id: Date.now(),
        fullName,
        email,
        role,
        roleName: role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_MANAGER' ? 'Manager' : 'Team Member',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        title: 'Software Engineer',
        department: 'Engineering'
      };
      onLogin(newUser);
    } else {
      const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        onLogin(found);
      } else {
        // Fallback default
        onLogin({
          id: 99,
          fullName: email.split('@')[0],
          email,
          role: 'ROLE_TEAM_MEMBER',
          roleName: 'Team Member',
          isActive: true,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
        });
      }
    }
  };

  const handleQuickLogin = (targetEmail) => {
    const user = allUsers.find(u => u.email === targetEmail);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      {/* Brand Heading */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.5rem',
          margin: '0 auto 12px auto',
          boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
        }}>
          S
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
          Sisenco Weekly Report
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
          Weekly Report Generator & Consolidated Team Dashboard
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Quick Demo Logins Helper */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#2563eb',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Shield size={14} />
            Quick Demo Logins (Seed Accounts)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => handleQuickLogin('member@weeklyreport.com')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '8px 12px' }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Alex Chen</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '6px' }}>ROLE_TEAM_MEMBER</span>
              </div>
              <ArrowRight size={14} style={{ color: '#2563eb' }} />
            </button>

            <button
              onClick={() => handleQuickLogin('manager@weeklyreport.com')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '8px 12px' }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Lead Manager</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '6px' }}>ROLE_MANAGER</span>
              </div>
              <ArrowRight size={14} style={{ color: '#2563eb' }} />
            </button>

            <button
              onClick={() => handleQuickLogin('admin@weeklyreport.com')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '8px 12px' }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>System Admin</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '6px' }}>ROLE_ADMIN</span>
              </div>
              <ArrowRight size={14} style={{ color: '#2563eb' }} />
            </button>
          </div>
        </div>

        {/* Auth Form Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div className="tabs-nav" style={{ marginBottom: '1.5rem' }}>
            <button
              className={`tab-btn ${!isRegister ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => { setIsRegister(false); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${isRegister ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => { setIsRegister(true); setError(''); }}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="alert alert-warning" style={{ padding: '8px 12px', fontSize: '0.8125rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sachinthaya Nimesh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@weeklyreport.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isRegister && (
              <div className="form-group">
                <label className="form-label">Assign Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="ROLE_TEAM_MEMBER">Team Member (Create & Submit Reports)</option>
                  <option value="ROLE_MANAGER">Manager (Review & Team Dashboard)</option>
                  <option value="ROLE_ADMIN">Admin (User & Project Management)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {isRegister ? 'Register & Continue' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
