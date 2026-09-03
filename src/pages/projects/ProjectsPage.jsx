import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Users, FolderKanban, Check, X, Trash2, Power, RefreshCw, AlertCircle } from 'lucide-react';
import { projectApi } from '../../api/projectApi';

export function ProjectsPage({ projects: mockProjects, allUsers, onAddProject, onUpdateProject, currentUser }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [assigningProject, setAssigningProject] = useState(null);
  const [projects, setProjects] = useState(mockProjects || []);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Client A');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const isManagerOrAdmin = currentUser.role === 'ROLE_MANAGER' || currentUser.role === 'ROLE_ADMIN';
  const teamMembers = allUsers.filter(u => u.role === 'ROLE_TEAM_MEMBER');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = isManagerOrAdmin
        ? await projectApi.getAllProjects()
        : await projectApi.getActiveProjects();
      setProjects(res ?? []);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setFetchError(err.message || 'Could not load projects. Showing local data.');
      setProjects(mockProjects || []);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setName('');
    setCategory('Client A');
    setDescription('');
    setColor('#2563eb');
    setSelectedMemberIds([]);
    setShowAddModal(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setName(proj.name);
    setCategory(proj.category || 'General');
    setDescription(proj.description || '');
    setColor(proj.color || '#2563eb');
  };

  const openAssignModal = (proj) => {
    setAssigningProject(proj);
    setSelectedMemberIds(proj.memberIds || []);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setActionLoading(true);
    try {
      if (editingProject) {
        const updated = await projectApi.updateProject(editingProject.id, { name, description, isActive: editingProject.isActive });
        setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...updated } : p));
        if (onUpdateProject) onUpdateProject({ ...editingProject, name, description });
        setEditingProject(null);
      } else {
        const created = await projectApi.createProject({ name, description });
        setProjects([...projects, created]);
        if (onAddProject) onAddProject(created);
        setShowAddModal(false);
      }
    } catch (err) {
      alert(`Failed to save project: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveAssignments = async () => {
    if (!assigningProject) return;
    setActionLoading(true);
    try {
      await projectApi.assignUsers(assigningProject.id, selectedMemberIds);
      setProjects(projects.map(p => p.id === assigningProject.id
        ? { ...p, memberIds: selectedMemberIds, memberCount: selectedMemberIds.length }
        : p
      ));
      if (onUpdateProject) onUpdateProject({ ...assigningProject, memberIds: selectedMemberIds, memberCount: selectedMemberIds.length });
      setAssigningProject(null);
    } catch (err) {
      alert(`Failed to assign members: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (proj) => {
    setActionLoading(true);
    try {
      await projectApi.updateProject(proj.id, { name: proj.name, description: proj.description, isActive: !proj.isActive });
      setProjects(projects.map(p => p.id === proj.id ? { ...p, isActive: !proj.isActive } : p));
      if (onUpdateProject) onUpdateProject({ ...proj, isActive: !proj.isActive });
    } catch (err) {
      alert(`Failed to update project status: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleMemberSelection = (userId) => {
    if (selectedMemberIds.includes(userId)) {
      setSelectedMemberIds(selectedMemberIds.filter(id => id !== userId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, userId]);
    }
  };

  return (

    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Project & Category Management</h1>
          <p className="page-subtitle">
            Configure work categories, active initiatives, and manage team member assignments.
          </p>
        </div>

        {isManagerOrAdmin && (
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Add New Project
          </button>
        )}
      </div>

      {/* Projects Grid / Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {projects.map((proj) => {
          const assignedMembers = teamMembers.filter(m => proj.memberIds?.includes(m.id));

          return (
            <div 
              key={proj.id} 
              className="card"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                borderLeft: `4px solid ${proj.color || '#2563eb'}` 
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: proj.color || '#2563eb'
                  }}>
                    {proj.category || 'Initiative'}
                  </span>

                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    backgroundColor: proj.isActive ? '#ecfdf5' : '#f1f5f9',
                    color: proj.isActive ? '#059669' : '#64748b',
                    border: `1px solid ${proj.isActive ? '#a7f3d0' : '#cbd5e1'}`
                  }}>
                    {proj.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                  {proj.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: '1.45', marginBottom: '1rem' }}>
                  {proj.description || 'No description provided.'}
                </p>

                {/* Assigned Members Avatars */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '6px', fontWeight: 500 }}>
                    Assigned Team ({assignedMembers.length})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {assignedMembers.length === 0 ? (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        No members assigned yet
                      </span>
                    ) : (
                      assignedMembers.map(m => (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f8fafc', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
                          <img src={m.avatar} alt={m.fullName} style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                          <span style={{ fontSize: '0.725rem', color: '#334155' }}>{m.fullName.split(' ')[0]}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isManagerOrAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <button
                    onClick={() => openAssignModal(proj)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Users size={13} /> Assign Members
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => openEditModal(proj)}
                      className="btn btn-secondary btn-sm"
                      title="Edit project"
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    <button
                      onClick={() => handleToggleActive(proj)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: proj.isActive ? '#dc2626' : '#059669' }}
                      title={proj.isActive ? 'Deactivate Project' : 'Activate Project'}
                    >
                      <Power size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Project Modal */}
      {(showAddModal || editingProject) && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingProject(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Project Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Client A — FinTech Core Banking"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Client A">Client A</option>
                    <option value="Internal Tooling">Internal Tooling</option>
                    <option value="R&D">R&D</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Brief description of goals and scope..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Theme Accent Color</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {['#2563eb', '#0891b2', '#7c3aed', '#d97706', '#059669', '#dc2626'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: c,
                          border: color === c ? '3px solid #0f172a' : '2px solid transparent',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingProject(null); }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Members Modal */}
      {assigningProject && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
                Assign Members to {assigningProject.name}
              </h3>
              <button 
                onClick={() => setAssigningProject(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                Select team members permitted to submit weekly reports under this project:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {teamMembers.map(m => {
                  const isChecked = selectedMemberIds.includes(m.id);
                  return (
                    <label 
                      key={m.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: isChecked ? '#eff6ff' : '#f8fafc',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isChecked ? '#bfdbfe' : '#e2e8f0'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={m.avatar} alt={m.fullName} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0f172a' }}>{m.fullName}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{m.title}</div>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMemberSelection(m.id)}
                        style={{ width: '16px', height: '16px' }}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setAssigningProject(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignments}
                className="btn btn-primary"
              >
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
