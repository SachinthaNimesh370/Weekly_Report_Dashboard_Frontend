import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  FolderKanban, 
  History, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  MessageSquare
} from 'lucide-react';
import { StatusBadge, PriorityBadge, TaskStatusBadge } from '../components/Badge';
import { REPORT_VERSIONS } from '../data/mockData';

export function ReportDetailPage({ report, onBack, currentUser, onNavigateToReview }) {
  const [activeVersion, setActiveVersion] = useState(null);
  
  if (!report) return null;

  const versions = REPORT_VERSIONS[report.id] || [];
  const keyIssue = report.blockers?.find(b => b.isKeyIssue);
  const keyAchieve = report.achievements?.find(a => a.isKeyAchievement);
  const isManagerOrAdmin = currentUser.role === 'ROLE_MANAGER' || currentUser.role === 'ROLE_ADMIN';

  return (
    <div className="app-container">
      {/* Top action header */}
      <div className="page-header">
        <div>
          <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ marginBottom: '8px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">
              Weekly Report: {report.userName}
            </h1>
            <StatusBadge status={report.status} />
          </div>
          <p className="page-subtitle">
            Week of {report.weekStart} to {report.weekEnd} • Version {report.currentVersionNo || 1}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isManagerOrAdmin && report.status === 'SUBMITTED' && (
            <button
              onClick={() => onNavigateToReview(report)}
              className="btn btn-primary"
            >
              Review & Take Action
            </button>
          )}
        </div>
      </div>

      {/* Meta Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={report.userAvatar} 
              alt={report.userName}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }}
            />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Submitted By</div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{report.userName}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{report.userTitle || 'Team Member'}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Project / Category</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{report.projectName}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Submission Date</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>
              {report.submittedAt || 'Draft (Not yet submitted)'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Hours Logged</div>
            <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.05rem' }}>
              {report.hoursBreakdowns?.reduce((s, h) => s + (Number(h.hours) || 0), 0) || report.totalHours || 0} Hours
            </div>
          </div>
        </div>
      </div>

      {/* Review Comments / Feedback Log */}
      {report.reviewComments && report.reviewComments.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #2563eb' }}>
          <div className="card-header" style={{ marginBottom: '0.75rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} style={{ color: '#2563eb' }} />
              Review Feedback History
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {report.reviewComments.length} review comment(s)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {report.reviewComments.map((rev) => (
              <div 
                key={rev.id} 
                style={{ 
                  padding: '10px 14px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0f172a' }}>
                      {rev.reviewerName}
                    </span>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                      (against version v{rev.againstVersionNo})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>{rev.createdAt}</span>
                </div>
                <div style={{ color: '#334155', fontSize: '0.875rem' }}>
                  "{rev.comment}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Version History Drawer / Banner (Bonus Requirement) */}
      {versions.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div className="card-header" style={{ borderColor: '#dcfce7', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={16} style={{ color: '#16a34a' }} />
              <h3 className="card-title" style={{ color: '#15803d' }}>
                Report Version Snapshots (Bonus)
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#15803d' }}>
              {versions.length} past version snapshot(s) archived
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveVersion(null)}
              className={`btn btn-sm ${activeVersion === null ? 'btn-primary' : 'btn-secondary'}`}
            >
              Current Version (v{report.currentVersionNo || 1})
            </button>
            {versions.map((ver) => (
              <button
                key={ver.versionNo}
                onClick={() => setActiveVersion(ver)}
                className={`btn btn-sm ${activeVersion?.versionNo === ver.versionNo ? 'btn-primary' : 'btn-secondary'}`}
              >
                Snapshot v{ver.versionNo} ({ver.submittedAt})
              </button>
            ))}
          </div>

          {activeVersion && (
            <div style={{ marginTop: '12px', padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #86efac' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#15803d', marginBottom: '4px' }}>
                Viewing Snapshot: Version {activeVersion.versionNo}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#334155' }}>
                Submitted: {activeVersion.submittedAt} • Status at snapshot: <strong>{activeVersion.status}</strong> • Total Hours: {activeVersion.totalHours}h
              </div>
              {activeVersion.reviewerComment && (
                <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#b45309' }}>
                  Correction feedback: "{activeVersion.reviewerComment}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* 1. Tasks Completed Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Completed Tasks</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {report.taskEntries?.length || 0} task(s) recorded
            </span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Priority</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Hours (Plan/Spent)</th>
                  <th>Deliverable Produced</th>
                </tr>
              </thead>
              <tbody>
                {report.taskEntries?.map(task => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{task.taskName}</td>
                    <td><PriorityBadge priority={task.priority} /></td>
                    <td style={{ minWidth: '120px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '3px' }}>
                        {task.actualPct}% / {task.plannedPct}%
                      </div>
                      <div className="progress-bar-track">
                        <div 
                          className="progress-bar-fill" 
                          style={{ 
                            width: `${Math.min(task.actualPct, 100)}%`,
                            backgroundColor: task.actualPct >= 100 ? '#10b981' : '#2563eb'
                          }} 
                        />
                      </div>
                    </td>
                    <td><TaskStatusBadge status={task.status} /></td>
                    <td>{task.timePlannedHrs}h / <strong>{task.timeSpentHrs}h</strong></td>
                    <td style={{ color: '#334155' }}>{task.outputDeliverable || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Tasks Planned Next Week */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tasks Planned for Next Week</h3>
          </div>
          <div style={{ padding: '0.5rem 0', color: '#334155', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {report.tasksPlannedNextWeek || 'No planned tasks specified.'}
          </div>
        </div>

        {/* 3. Blockers & Achievements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Blockers */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} style={{ color: '#dc2626' }} />
                Blockers & Challenges
              </h3>
            </div>
            {report.blockers?.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
                No blockers encountered.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {report.blockers?.map(b => (
                  <div 
                    key={b.id} 
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: b.isKeyIssue ? '#fef2f2' : '#f8fafc',
                      border: `1px solid ${b.isKeyIssue ? '#fecaca' : '#e2e8f0'}`
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>{b.description}</div>
                    {b.isKeyIssue && (
                      <span style={{ fontSize: '0.7rem', color: '#b91c1c', fontWeight: 700, display: 'inline-block', marginTop: '3px' }}>
                        ★ Key Issue of the Week
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} style={{ color: '#16a34a' }} />
                Achievements & Highlights
              </h3>
            </div>
            {report.achievements?.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
                No highlights recorded.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {report.achievements?.map(a => (
                  <div 
                    key={a.id} 
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: a.isKeyAchievement ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${a.isKeyAchievement ? '#bbf7d0' : '#e2e8f0'}`
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>{a.description}</div>
                    {a.isKeyAchievement && (
                      <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700, display: 'inline-block', marginTop: '3px' }}>
                        ★ Key Achievement of the Week
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Hours Worked Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Hours Worked Breakdown</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
            {report.hoursBreakdowns?.map((h, i) => (
              <div key={i} style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'capitalize' }}>
                  {h.taskType.toLowerCase()}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                  {h.hours}h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Notes */}
        {report.notes && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Notes & Links</h3>
            </div>
            <div style={{ color: '#334155', fontSize: '0.875rem' }}>
              {report.notes}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
