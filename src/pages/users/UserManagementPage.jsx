import React, { useState } from 'react';
import { 
  UserPlus, 
  Shield, 
  Check, 
  X, 
  Mail, 
  Power, 
  Trash2, 
  Loader2, 
  Search, 
  AlertCircle,
  Users as UsersIcon,
  UserCheck,
  UserX,
  ShieldAlert
} from 'lucide-react';
import { userApi } from '../../api/userApi';
import { authApi } from '../../api/authApi';
import { UserAvatar } from '../../components/UserAvatar';

export function UserManagementPage({ allUsers = [], onUpdateUser, onAddUser, currentUser }) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('ROLE_TEAM_MEMBER');
  const [inviteDepartment, setInviteDepartment] = useState('Engineering');
  const [invitePassword, setInvitePassword] = useState('Password@123');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, ACTIVE, DEACTIVATED

  // Action status tracking
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Deactivate confirmation modal
  const [userToConfirmToggle, setUserToConfirmToggle] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 6000);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setInviteLoading(true);
    setInviteError('');

    try {
      let createdUser;
      try {
        createdUser = await userApi.createUser({
          fullName: inviteName.trim(),
          email: inviteEmail.trim(),
          password: invitePassword || 'Password@123',
          role: inviteRole,
          department: inviteDepartment.trim() || 'Engineering'
        });
      } catch (apiErr) {
        // Fallback to authApi.register if dedicated user endpoint fails
        const res = await authApi.register({
          fullName: inviteName.trim(),
          email: inviteEmail.trim(),
          password: invitePassword || 'Password@123',
          role: inviteRole
        });
        createdUser = {
          id: res?.id || Date.now(),
          fullName: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
          roleName: inviteRole === 'ROLE_ADMIN' ? 'Admin' : inviteRole === 'ROLE_MANAGER' ? 'Manager' : 'Team Member',
          isActive: true,
          department: inviteDepartment.trim() || 'Engineering'
        };
      }

      if (onAddUser && createdUser) {
        onAddUser(createdUser);
      }

      setShowInviteModal(false);
      setInviteName('');
      setInviteEmail('');
      setInviteDepartment('Engineering');
      setInvitePassword('Password@123');
      showToast(`User ${createdUser.fullName || inviteName} invited successfully!`);
    } catch (err) {
      console.error('Failed to create user:', err);
      setInviteError(err.message || 'Failed to create new user on server.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    if (user.id === currentUser?.id) {
      showError("You cannot modify your own administrative role.");
      return;
    }

    setActionLoadingId(user.id);
    try {
      const updated = await userApi.updateUserRole(user.id, newRole);
      const roleDisplayName = newRole === 'ROLE_ADMIN' ? 'Admin' : newRole === 'ROLE_MANAGER' ? 'Manager' : 'Team Member';
      
      const updatedUserObj = {
        ...user,
        role: newRole,
        roleName: roleDisplayName
      };

      if (onUpdateUser) {
        onUpdateUser(updatedUserObj);
      }
      showToast(`Updated ${user.fullName}'s role to ${roleDisplayName}.`);
    } catch (err) {
      console.error('Failed to update role:', err);
      showError(err.message || 'Failed to update user role on server.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const confirmToggleStatus = async () => {
    if (!userToConfirmToggle) return;
    const user = userToConfirmToggle;
    setUserToConfirmToggle(null);

    if (user.id === currentUser?.id) {
      showError("You cannot deactivate your own active admin account.");
      return;
    }

    setActionLoadingId(user.id);
    const newStatus = !user.isActive;

    try {
      await userApi.updateUserStatus(user.id, newStatus);
      const updatedUserObj = {
        ...user,
        isActive: newStatus
      };

      if (onUpdateUser) {
        onUpdateUser(updatedUserObj);
      }

      if (!newStatus) {
        showToast(`Account for ${user.fullName} deactivated. They can no longer log in or access the system.`);
      } else {
        showToast(`Account for ${user.fullName} reactivated successfully.`);
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
      showError(err.message || 'Failed to update user account status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleClick = (user) => {
    if (user.id === currentUser?.id) {
      showError("You cannot deactivate your own active admin account.");
      return;
    }
    // If deactivating, show prompt modal
    if (user.isActive) {
      setUserToConfirmToggle(user);
    } else {
      // If activating, do directly
      setUserToConfirmToggle(user);
    }
  };

  // Filtered users
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'ACTIVE') return u.isActive === true;
    if (filterStatus === 'DEACTIVATED') return u.isActive === false;
    return true;
  });

  const totalCount = allUsers.length;
  const activeCount = allUsers.filter(u => u.isActive !== false).length;
  const deactivatedCount = allUsers.filter(u => u.isActive === false).length;
  const adminManagerCount = allUsers.filter(u => u.role === 'ROLE_ADMIN' || u.role === 'ROLE_MANAGER').length;

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#065f46',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: 500,
          animation: 'fadeIn 0.2s ease-in'
        }}>
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#991b1b',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User & Role Management</h1>
          <p className="page-subtitle">
            Admin console for provisioning team members, modifying permissions, and managing active directory status.
          </p>
        </div>

        <button onClick={() => setShowInviteModal(true)} className="btn btn-primary">
          <UserPlus size={16} /> Invite New User
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <UsersIcon size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Accounts</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{totalCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Active Users</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#047857' }}>{activeCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#fef2f2', color: '#dc2626' }}>
            <UserX size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Deactivated</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#b91c1c' }}>{deactivatedCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Admins & Managers</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6d28d9' }}>{adminManagerCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '420px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
              placeholder="Search user by name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Filter Status:</span>
            <div className="tabs-nav" style={{ margin: 0 }}>
              <button
                className={`tab-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                onClick={() => setFilterStatus('ALL')}
              >
                All ({totalCount})
              </button>
              <button
                className={`tab-btn ${filterStatus === 'ACTIVE' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                onClick={() => setFilterStatus('ACTIVE')}
              >
                Active ({activeCount})
              </button>
              <button
                className={`tab-btn ${filterStatus === 'DEACTIVATED' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                onClick={() => setFilterStatus('DEACTIVATED')}
              >
                Deactivated ({deactivatedCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Department</th>
                <th>Assigned Role</th>
                <th>Account Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    {allUsers.length === 0 ? 'No team members found in the database.' : 'No users match the search/filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isDeactivated = u.isActive === false;
                  const isSelf = u.id === currentUser?.id;
                  const isLoading = actionLoadingId === u.id;

                  return (
                    <tr 
                      key={u.id} 
                      style={{ 
                        opacity: isDeactivated ? 0.7 : 1,
                        backgroundColor: isDeactivated ? '#fcf8f8' : 'transparent',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <UserAvatar name={u.fullName} size={38} />
                          <div>
                            <div style={{ fontWeight: 600, color: isDeactivated ? '#64748b' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ textDecoration: isDeactivated ? 'line-through' : 'none' }}>
                                {u.fullName}
                              </span>
                              {isSelf && (
                                <span style={{ 
                                  fontSize: '0.675rem', 
                                  fontWeight: 700, 
                                  padding: '1px 6px', 
                                  borderRadius: '9999px', 
                                  backgroundColor: '#eff6ff', 
                                  color: '#2563eb',
                                  border: '1px solid #bfdbfe'
                                }}>
                                  You (Active Admin)
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.8125rem', color: '#334155' }}>
                          {u.department || 'Engineering'}
                        </span>
                      </td>

                      <td>
                        <select
                          className="form-select"
                          style={{ width: 'auto', padding: '5px 10px', fontSize: '0.75rem', fontWeight: 600 }}
                          value={u.role || 'ROLE_TEAM_MEMBER'}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          disabled={isSelf || isDeactivated || isLoading}
                          title={isSelf ? 'You cannot alter your own admin role' : isDeactivated ? 'Activate account before modifying role' : 'Change assigned role'}
                        >
                          <option value="ROLE_ADMIN">ROLE_ADMIN (Admin)</option>
                          <option value="ROLE_MANAGER">ROLE_MANAGER (Manager)</option>
                          <option value="ROLE_TEAM_MEMBER">ROLE_TEAM_MEMBER (Member)</option>
                        </select>
                      </td>

                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          backgroundColor: !isDeactivated ? '#ecfdf5' : '#fef2f2',
                          color: !isDeactivated ? '#047857' : '#b91c1c',
                          border: `1px solid ${!isDeactivated ? '#a7f3d0' : '#fecaca'}`
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: !isDeactivated ? '#10b981' : '#ef4444'
                          }} />
                          {!isDeactivated ? 'Active' : 'Deactivated'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleClick(u)}
                          className={`btn btn-sm ${!isDeactivated ? 'btn-secondary' : 'btn-primary'}`}
                          style={{
                            color: isSelf ? '#94a3b8' : !isDeactivated ? '#dc2626' : '#ffffff',
                            backgroundColor: !isDeactivated ? '#ffffff' : '#059669',
                            borderColor: !isDeactivated ? '#fecaca' : '#059669',
                            cursor: isSelf || isLoading ? 'not-allowed' : 'pointer'
                          }}
                          disabled={isSelf || isLoading}
                          title={
                            isSelf 
                              ? 'You cannot deactivate your own account' 
                              : !isDeactivated 
                                ? 'Deactivate account (blocks login and all access)' 
                                : 'Reactivate account'
                          }
                        >
                          {isLoading ? (
                            <Loader2 size={13} className="spin" />
                          ) : (
                            <Power size={13} />
                          )}
                          <span>
                            {isLoading 
                              ? 'Updating...' 
                              : !isDeactivated 
                                ? 'Deactivate' 
                                : 'Activate'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Deactivation / Activation */}
      {userToConfirmToggle && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} style={{ color: userToConfirmToggle.isActive ? '#dc2626' : '#059669' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  {userToConfirmToggle.isActive ? 'Deactivate User Account?' : 'Reactivate User Account?'}
                </h3>
              </div>
              <button
                onClick={() => setUserToConfirmToggle(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {userToConfirmToggle.isActive ? (
                <div>
                  <p style={{ color: '#334155', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    Are you sure you want to deactivate <strong>{userToConfirmToggle.fullName}</strong> (<em>{userToConfirmToggle.email}</em>)?
                  </p>
                  <div className="alert alert-warning" style={{ fontSize: '0.8125rem', padding: '10px 12px' }}>
                    <strong>Security Policy:</strong> Once deactivated, this user will immediately be blocked from logging in, and any existing session or API access will be terminated.
                  </div>
                </div>
              ) : (
                <p style={{ color: '#334155', fontSize: '0.875rem' }}>
                  Are you sure you want to reactivate <strong>{userToConfirmToggle.fullName}</strong>? They will be able to log in and access assigned projects and reports again.
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setUserToConfirmToggle(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmToggleStatus}
                className="btn"
                style={{
                  backgroundColor: userToConfirmToggle.isActive ? '#dc2626' : '#059669',
                  color: '#ffffff',
                  borderColor: userToConfirmToggle.isActive ? '#dc2626' : '#059669'
                }}
              >
                {userToConfirmToggle.isActive ? 'Yes, Deactivate Account' : 'Yes, Reactivate Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
                Invite New Team Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInvite}>
              <div className="modal-body">
                {inviteError && (
                  <div className="alert alert-warning" style={{ marginBottom: '1rem', fontSize: '0.8125rem' }}>
                    {inviteError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sahan Wickramasinghe"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. sahan@sisenco.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Password</label>
                  <input
                    type="text"
                    className="form-input"
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    placeholder="Password@123"
                  />
                  <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                    Default initial password for first-time login.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="ROLE_TEAM_MEMBER">Team Member (Submits weekly reports)</option>
                    <option value="ROLE_MANAGER">Manager (Reviews & dashboards)</option>
                    <option value="ROLE_ADMIN">Admin (Full administrative control)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Backend Platform / QA"
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn btn-secondary"
                  disabled={inviteLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={inviteLoading}>
                  {inviteLoading ? (
                    <>
                      <Loader2 size={15} className="spin" />
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    'Provision User Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
