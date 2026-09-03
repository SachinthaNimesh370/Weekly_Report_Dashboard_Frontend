import React, { useState } from 'react';
import { Lock, Mail, User, Shield, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { authApi } from '../../api/authApi';

export function AuthPage({ onLogin, allUsers }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('member@weeklyreport.com');
  const [password, setPassword] = useState('Member@123');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('ROLE_TEAM_MEMBER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        const data = await authApi.register({
          fullName: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
          role
        });
        const loggedInUser = {
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          roleName: data.role === 'ROLE_ADMIN' ? 'Admin' : data.role === 'ROLE_MANAGER' ? 'Manager' : 'Team Member',
          token: data.token,
          isActive: true,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
        };
        onLogin(loggedInUser);
      } else {
        const data = await authApi.login({
          email: email.trim(),
          password: password.trim()
        });
        const loggedInUser = {
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          roleName: data.role === 'ROLE_ADMIN' ? 'Admin' : data.role === 'ROLE_MANAGER' ? 'Manager' : 'Team Member',
          token: data.token,
          isActive: true,
          avatar: data.role === 'ROLE_ADMIN' 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
            : data.role === 'ROLE_MANAGER'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
        };
        onLogin(loggedInUser);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetEmail, targetPassword) => {
    setError('');
    setEmail(targetEmail);
    setPassword(targetPassword);
    setLoading(true);

    try {
      const data = await authApi.login({ email: targetEmail, password: targetPassword });
      const loggedInUser = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        roleName: data.role === 'ROLE_ADMIN' ? 'Admin' : data.role === 'ROLE_MANAGER' ? 'Manager' : 'Team Member',
        token: data.token,
        isActive: true,
        avatar: data.role === 'ROLE_ADMIN' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
          : data.role === 'ROLE_MANAGER'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      };
      onLogin(loggedInUser);
    } catch (err) {
      console.error('Quick login error:', err);
      setError(err.message || 'Failed to authenticate seed account.');
    } finally {
      setLoading(false);
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
              onClick={() => handleQuickLogin('member@weeklyreport.com', 'Member@123')}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '8px 12px' }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>John Developer (Member)</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '6px' }}>ROLE_TEAM_MEMBER</span>
              </div>
              <ArrowRight size={14} style={{ color: '#2563eb' }} />
            </button>

            <button
              onClick={() => handleQuickLogin('manager@weeklyreport.com', 'Manager@123')}
              disabled={loading}
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
              onClick={() => handleQuickLogin('admin@weeklyreport.com', 'Admin@123')}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '8px 12px' }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>System Administrator</span>
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
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading ? (
                <>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  {isRegister ? 'Registering...' : 'Signing In...'}
                </>
              ) : (
                isRegister ? 'Register & Continue' : 'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
