import React, { useState } from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  MessageSquare, 
  AlertCircle, 
  FileText, 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Check
} from 'lucide-react';
import { StatusBadge, PriorityBadge, TaskStatusBadge } from '../components/Badge';

export function ManagerReviewPage({ 
  report, 
  reports, 
  onSelectReport, 
  onApprove, 
  onRequestChanges, 
  onBackToDashboard 
}) {
  const [comment, setComment] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [successToast, setSuccessToast] = useState(null);

  // If no specific report is opened, show list of submitted reports awaiting manager review
  const pendingReports = reports.filter(r => r.status === 'SUBMITTED');

  const handleApprove = () => {
    if (!report) return;
    onApprove(report.id);
    setSuccessToast(`Report for ${report.userName} has been Approved!`);
    setTimeout(() => {
      setSuccessToast(null);
      if (onBackToDashboard) onBackToDashboard();
    }, 1600);
  };

  const handleRequestChangesSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setCommentError('A general feedback comment explaining what needs correction is mandatory.');
      return;
    }
    onRequestChanges(report.id, comment.trim());
    setShowCorrectionModal(false);
    setComment('');
    setSuccessToast(`Requested changes from ${report.userName}. Status changed to NEEDS_CORRECTION.`);
    setTimeout(() => {
      setSuccessToast(null);
      if (onBackToDashboard) onBackToDashboard();
    }, 1800);
  };

  if (!report) {
    return (
      <div className="app-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Manager Review Queue</h1>
            <p className="page-subtitle">
              Inspect submitted reports and approve or request revisions.
            </p>
          </div>
          <span style={{
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.8125rem',
            fontWeight: 600
          }}>
            {pendingReports.length} report(s) awaiting review
          </span>
        </div>

        <div className="card" style={{ padding: 0 }}>
          {pendingReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <CheckCircle2 size={40} style={{ color: '#10b981', marginBottom: '8px' }} />
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#0f172a' }}>
                All Caught Up!
              </div>
              <p style={{ fontSize: '0.875rem', marginTop: '4px', maxWidth: '360px', margin: '4px auto 16px auto' }}>
                There are no submitted reports currently pending your review.
              </p>
              <button onClick={onBackToDashboard} className="btn btn-secondary btn-sm">
                Back to Team Dashboard
              </button>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Team Member</th>
                    <th>Week Range</th>
                    <th>Project</th>
                    <th>Tasks</th>
                    <th>Hours</th>
                    <th>Submitted At</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReports.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img 
                            src={r.userAvatar} 
                            alt={r.userName} 
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.userName}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{r.userTitle || 'Engineer'}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 500 }}>{r.weekStart} → {r.weekEnd}</span>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>v{r.currentVersionNo || 1}</div>
                      </td>

                      <td>{r.projectName}</td>
                      <td>{r.taskEntries?.length || 0} tasks</td>
                      <td><strong style={{ color: '#2563eb' }}>{r.totalHours || 32}h</strong></td>
                      <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.submittedAt}</td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => onSelectReport(r)}
                          className="btn btn-primary btn-sm"
                        >
                          Review Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active Report Review Inspection View
  const keyIssue = report.blockers?.find(b => b.isKeyIssue);
  const keyAchieve = report.achievements?.find(a => a.isKeyAchievement);
  const totalHours = report.hoursBreakdowns?.reduce((s, h) => s + (Number(h.hours) || 0), 0) || report.totalHours || 0;

  return (
    <div className="app-container">
      {/* Top Review Bar */}
      <div className="page-header">
        <div>
          <button 
            onClick={onBackToDashboard} 
            className="btn btn-secondary btn-sm" 
            style={{ marginBottom: '8px' }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">
              Manager Review: {report.userName}
            </h1>
            <StatusBadge status={report.status} />
          </div>
          <p className="page-subtitle">
            Week of {report.weekStart} to {report.weekEnd} • Submitted on {report.submittedAt || 'Recent'}
          </p>
        </div>

        {/* Manager Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowCorrectionModal(true)}
            className="btn btn-outline-danger"
          >
            <RotateCcw size={16} /> Request Changes
          </button>

          <button
            type="button"
            onClick={handleApprove}
            className="btn btn-success btn-lg"
          >
            <Check size={18} /> Approve Report
          </button>
        </div>
      </div>

      {successToast && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Report Review Overview */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={report.userAvatar} 
              alt={report.userName} 
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Team Member</div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{report.userName}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{report.userEmail}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Project</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{report.projectName}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Report Version</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>
              Snapshot v{report.currentVersionNo || 1}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Total Time Tracked</div>
            <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.1rem' }}>
              {totalHours} Hours
            </div>
          </div>
        </div>
      </div>

      {/* Task-level review table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Completed Tasks & Deliverables</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Verify planned vs actual output
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

        {/* Next week plan */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tasks Planned for Next Week</h3>
          </div>
          <div style={{ color: '#334155', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {report.tasksPlannedNextWeek}
          </div>
        </div>

        {/* Blockers & Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ color: '#dc2626' }}>
                Blockers & Challenges
              </h3>
            </div>
            {report.blockers?.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No blockers reported.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {report.blockers?.map(b => (
                  <div key={b.id} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: b.isKeyIssue ? '#fef2f2' : '#f8fafc', border: `1px solid ${b.isKeyIssue ? '#fecaca' : '#e2e8f0'}` }}>
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

          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ color: '#16a34a' }}>
                Achievements & Highlights
              </h3>
            </div>
            {report.achievements?.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No achievements recorded.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {report.achievements?.map(a => (
                  <div key={a.id} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: a.isKeyAchievement ? '#f0fdf4' : '#f8fafc', border: `1px solid ${a.isKeyAchievement ? '#bbf7d0' : '#e2e8f0'}` }}>
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
      </div>

      {/* Request Changes Modal */}
      {showCorrectionModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} style={{ color: '#d97706' }} />
                Request Changes from {report.userName}
              </h3>
            </div>

            <form onSubmit={handleRequestChangesSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem' }}>
                  The report status will change to <strong>NEEDS_CORRECTION</strong>. The team member will see your feedback comment directly at the top of their form and be able to edit and resubmit.
                </p>

                {commentError && (
                  <div className="alert alert-warning" style={{ padding: '8px 12px', fontSize: '0.8125rem' }}>
                    {commentError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    Mandatory Feedback / Correction Instructions *
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="e.g. Please clarify the deliverable for the database indexing task and update the hours breakdown for testing."
                    value={comment}
                    onChange={(e) => { setComment(e.target.value); setCommentError(''); }}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                >
                  Send Back for Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
