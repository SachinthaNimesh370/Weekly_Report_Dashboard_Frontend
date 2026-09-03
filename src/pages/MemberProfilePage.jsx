import React from 'react';
import { ArrowLeft, Mail, Calendar, Clock, CheckCircle2, FileText, Eye, FolderKanban, Shield } from 'lucide-react';
import { StatusBadge } from '../components/Badge';

export function MemberProfilePage({ member, reports, projects, onBack, onViewReport }) {
  if (!member) return null;

  // Filter reports submitted by this member
  const memberReports = reports.filter(r => r.userId === member.id);

  // Stats calculation
  const totalSubmissions = memberReports.filter(r => r.status === 'SUBMITTED' || r.status === 'APPROVED').length;
  const totalHours = memberReports.reduce((sum, r) => {
    const repHours = r.hoursBreakdowns?.reduce((s, h) => s + (Number(h.hours) || 0), 0) || r.totalHours || 0;
    return sum + repHours;
  }, 0);
  const totalTasks = memberReports.reduce((sum, r) => sum + (r.taskEntries?.length || 0), 0);
  const approvedCount = memberReports.filter(r => r.status === 'APPROVED').length;
  const complianceRate = memberReports.length > 0 ? Math.round((approvedCount / memberReports.length) * 100) : 100;

  // Assigned projects
  const assignedProjects = projects.filter(p => p.memberIds?.includes(member.id));

  return (
    <div className="app-container">
      {/* Back button & header */}
      <div className="page-header">
        <div>
          <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ marginBottom: '8px' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="page-title">Team Member Profile</h1>
          <p className="page-subtitle">Productivity profile, project assignments, and historical submissions.</p>
        </div>
      </div>

      {/* Member Profile Summary Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={member.avatar}
              alt={member.fullName}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{member.fullName}</h2>
                <span className="badge badge-submitted">{member.roleName}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>
                {member.title} • {member.department}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8125rem', marginTop: '4px' }}>
                <Mail size={13} />
                <span>{member.email}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {assignedProjects.map(p => (
              <span
                key={p.id}
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FolderKanban size={13} style={{ color: p.color || '#2563eb' }} />
                {p.name.split('—')[0].trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Basic Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Reports Filed
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
            {memberReports.length}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#2563eb' }}>
            {totalSubmissions} submitted/approved
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Hours Logged
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#2563eb', marginTop: '4px' }}>
            {totalHours}h
          </div>
          <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
            Across all reporting cycles
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Tasks Completed
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#059669', marginTop: '4px' }}>
            {totalTasks}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
            Work items tracked
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Approval Ratio
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
            {complianceRate}%
          </div>
          <div style={{ fontSize: '0.725rem', color: '#16a34a' }}>
            {approvedCount} of {memberReports.length} approved
          </div>
        </div>
      </div>

      {/* Member Report History Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="card-header" style={{ padding: '1rem 1.25rem' }}>
          <h3 className="card-title">Submission History for {member.fullName}</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {memberReports.length} report(s) found
          </span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Week Range</th>
                <th>Project</th>
                <th>Tasks</th>
                <th>Hours</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>View Report</th>
              </tr>
            </thead>
            <tbody>
              {memberReports.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No reports submitted yet by this member.
                  </td>
                </tr>
              ) : (
                memberReports.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.weekStart} → {r.weekEnd}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>v{r.currentVersionNo || 1}</div>
                    </td>
                    <td>{r.projectName}</td>
                    <td>{r.taskEntries?.length || 0} tasks</td>
                    <td><strong style={{ color: '#2563eb' }}>{r.totalHours || 32}h</strong></td>
                    <td><StatusBadge status={r.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => onViewReport(r)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
