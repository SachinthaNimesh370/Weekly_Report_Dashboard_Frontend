import React, { useState } from 'react';
import { UserPlus, Shield, Check, X, Mail, Power, Trash2 } from 'lucide-react';

export function UserManagementPage({ allUsers, onUpdateUser, onAddUser, currentUser }) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('ROLE_TEAM_MEMBER');
  const [inviteDepartment, setInviteDepartment] = useState('Engineering');

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newUser = {
      id: Date.now(),
      fullName: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      roleName: inviteRole === 'ROLE_ADMIN' ? 'Admin' : inviteRole === 'ROLE_MANAGER' ? 'Manager' : 'Team Member',
      isActive: true,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=120&auto=format&fit=crop&q=80`,
      title: 'Engineer',
      department: inviteDepartment
    };

    onAddUser(newUser);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleRoleChange = (user, newRole) => {
    onUpdateUser({
      ...user,
      role: newRole,
      roleName: newRole === 'ROLE_ADMIN' ? 'Admin' : newRole === 'ROLE_MANAGER' ? 'Manager' : 'Team Member'
    });
  };

  const handleToggleStatus = (user) => {
    if (user.id === currentUser.id) {
      alert("You cannot deactivate your own active admin account.");
      return;
    }
    onUpdateUser({
      ...user,
      isActive: !user.isActive
    });
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User & Role Management</h1>
          <p className="page-subtitle">
            Admin console for provisioning team members, modifying permissions, and active directory status.
          </p>
        </div>

        <button onClick={() => setShowInviteModal(true)} className="btn btn-primary">
          <UserPlus size={16} /> Invite New User
        </button>
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
              {allUsers.map((u) => (
                <tr key={u.id} style={{ opacity: u.isActive ? 1 : 0.6 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={u.avatar}
                        alt={u.fullName}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {u.fullName} {u.id === currentUser.id && <span style={{ fontSize: '0.7rem', color: '#2563eb' }}>(You)</span>}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b' }}>{u.email}</div>
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
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600 }}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      disabled={u.id === currentUser.id}
                    >
                      <option value="ROLE_ADMIN">ROLE_ADMIN (Admin)</option>
                      <option value="ROLE_MANAGER">ROLE_MANAGER (Manager)</option>
                      <option value="ROLE_TEAM_MEMBER">ROLE_TEAM_MEMBER (Member)</option>
                    </select>
                  </td>

                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      backgroundColor: u.isActive ? '#ecfdf5' : '#fef2f2',
                      color: u.isActive ? '#047857' : '#b91c1c',
                      border: `1px solid ${u.isActive ? '#a7f3d0' : '#fecaca'}`
                    }}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: u.isActive ? '#dc2626' : '#059669' }}
                      disabled={u.id === currentUser.id}
                      title={u.isActive ? 'Deactivate account' : 'Activate account'}
                    >
                      <Power size={13} />
                      <span>{u.isActive ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
