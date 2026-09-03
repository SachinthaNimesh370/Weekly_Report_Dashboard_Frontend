import React, { useState } from 'react';
import { Plus, Eye, Edit3, Calendar, Folder, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../components/Badge';

export function ReportHistoryPage({ 
  reports, 
  currentUser, 
  onViewReport, 
  onEditReport, 
  onCreateNew 
}) {
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter only current user's reports (RBAC ownership)
  const myReports = reports.filter(r => r.userId === currentUser.id);

  const filteredReports = selectedStatus === 'ALL'
    ? myReports
    : myReports.filter(r => r.status === selectedStatus);

  const statuses = [
    { id: 'ALL', label: 'All Reports', count: myReports.length },
    { id: 'DRAFT', label: 'Drafts', count: myReports.filter(r => r.status === 'DRAFT').length },
    { id: 'SUBMITTED', label: 'Submitted', count: myReports.filter(r => r.status === 'SUBMITTED').length },
    { id: 'NEEDS_CORRECTION', label: 'Needs Correction', count: myReports.filter(r => r.status === 'NEEDS_CORRECTION').length },
    { id: 'APPROVED', label: 'Approved', count: myReports.filter(r => r.status === 'APPROVED').length }
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Report History</h1>
          <p className="page-subtitle">
            Historical archive of all your weekly submissions, review states, and version snapshots.
          </p>
        </div>

        <button onClick={onCreateNew} className="btn btn-primary">
          <Plus size={16} /> New Weekly Report
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="tabs-nav">
        {statuses.map(s => (
          <button
            key={s.id}
            className={`tab-btn ${selectedStatus === s.id ? 'active' : ''}`}
            onClick={() => setSelectedStatus(s.id)}
          >
            <span>{s.label}</span>
            <span style={{
              backgroundColor: selectedStatus === s.id ? '#eff6ff' : '#f1f5f9',
              color: selectedStatus === s.id ? '#2563eb' : '#64748b',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: '9999px'
            }}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Reports Table Card */}
      <div className="card" style={{ padding: 0 }}>
        {filteredReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
            <Calendar size={36} style={{ color: '#cbd5e1', marginBottom: '8px' }} />
            <div style={{ fontWeight: 600, fontSize: '1rem', color: '#0f172a' }}>No reports found</div>
            <p style={{ fontSize: '0.875rem', marginTop: '4px', maxWidth: '340px', margin: '4px auto 16px auto' }}>
              {selectedStatus === 'ALL' 
                ? "You haven't drafted or submitted any weekly reports yet." 
                : `There are no reports matching the "${selectedStatus}" status.`}
            </p>
            <button onClick={onCreateNew} className="btn btn-primary btn-sm">
              <Plus size={14} /> Create Weekly Report
            </button>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reporting Week</th>
                  <th>Project / Category</th>
                  <th>Tasks Tracked</th>
                  <th>Hours Logged</th>
                  <th>Key Highlight / Blocker</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => {
                  const keyIssue = report.blockers?.find(b => b.isKeyIssue);
                  const keyAchieve = report.achievements?.find(a => a.isKeyAchievement);
                  const isEditable = report.status === 'DRAFT' || report.status === 'NEEDS_CORRECTION';
                  const totalHours = report.hoursBreakdowns?.reduce((sum, h) => sum + (Number(h.hours) || 0), 0) || report.totalHours || 0;

                  return (
                    <tr key={report.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {report.weekStart} → {report.weekEnd}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                          v{report.currentVersionNo || 1} • {report.submittedAt ? `Submitted ${report.submittedAt}` : 'Draft (Unsubmitted)'}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 500, color: '#334155' }}>
                          {report.projectName}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                          {report.taskEntries?.length || 0}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '4px' }}>tasks</span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: '#2563eb' }}>
                          {totalHours}h
                        </span>
                      </td>

                      <td style={{ maxWidth: '240px' }}>
                        {keyIssue ? (
                          <div style={{ fontSize: '0.75rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '4px' }} title={keyIssue.description}>
                            <AlertCircle size={12} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {keyIssue.description}
                            </span>
                          </div>
                        ) : keyAchieve ? (
                          <div style={{ fontSize: '0.75rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }} title={keyAchieve.description}>
                            <CheckCircle2 size={12} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {keyAchieve.description}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>None specified</span>
                        )}
                      </td>

                      <td>
                        <StatusBadge status={report.status} />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => onViewReport(report)}
                            className="btn btn-secondary btn-sm"
                            title="View read-only report & versions"
                          >
                            <Eye size={13} /> View
                          </button>

                          {isEditable && (
                            <button
                              onClick={() => onEditReport(report)}
                              className="btn btn-primary btn-sm"
                              title="Edit report"
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
