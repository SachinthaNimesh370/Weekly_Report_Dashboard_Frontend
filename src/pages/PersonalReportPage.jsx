import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Save, 
  Send, 
  Clock, 
  Flag, 
  Award, 
  FolderKanban,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { StatusBadge, PriorityBadge, TaskStatusBadge } from '../components/Badge';

export function PersonalReportPage({ 
  reportToEdit, 
  currentUser, 
  projects, 
  onSaveDraft, 
  onSubmitReport, 
  onBackToHistory 
}) {
  // Initialize form state
  const isEditing = Boolean(reportToEdit && reportToEdit.id);
  const status = reportToEdit ? reportToEdit.status : 'DRAFT';
  const isReadOnly = status === 'SUBMITTED' || status === 'APPROVED';

  const [projectId, setProjectId] = useState(reportToEdit ? reportToEdit.projectId : (projects[0]?.id || 1));
  const [weekStart, setWeekStart] = useState(reportToEdit ? reportToEdit.weekStart : '2026-09-07');
  const [weekEnd, setWeekEnd] = useState(reportToEdit ? reportToEdit.weekEnd : '2026-09-13');
  const [tasksPlannedNextWeek, setTasksPlannedNextWeek] = useState(reportToEdit ? reportToEdit.tasksPlannedNextWeek : '');
  const [notes, setNotes] = useState(reportToEdit ? reportToEdit.notes : '');

  // Task entries
  const [taskEntries, setTaskEntries] = useState(
    reportToEdit?.taskEntries || [
      {
        id: 1,
        taskName: 'Implement core business workflow endpoints',
        priority: 'HIGH',
        plannedPct: 100,
        actualPct: 90,
        status: 'IN_PROGRESS',
        timePlannedHrs: 16.0,
        timeSpentHrs: 15.0,
        outputDeliverable: 'Integration tests passing with mock service layer'
      }
    ]
  );

  // Blockers with isKeyIssue
  const [blockers, setBlockers] = useState(
    reportToEdit?.blockers || [
      { id: 1, description: 'Pending client security approvals for test database credentials', isKeyIssue: true }
    ]
  );

  // Achievements with isKeyAchievement
  const [achievements, setAchievements] = useState(
    reportToEdit?.achievements || [
      { id: 1, description: 'Achieved 95% test coverage on authentication & RBAC filter layer', isKeyAchievement: true }
    ]
  );

  // Hours breakdown
  const [hoursDevelopment, setHoursDevelopment] = useState(
    reportToEdit?.hoursBreakdowns?.find(h => h.taskType === 'DEVELOPMENT')?.hours || 24
  );
  const [hoursTesting, setHoursTesting] = useState(
    reportToEdit?.hoursBreakdowns?.find(h => h.taskType === 'TESTING')?.hours || 6
  );
  const [hoursMeetings, setHoursMeetings] = useState(
    reportToEdit?.hoursBreakdowns?.find(h => h.taskType === 'MEETINGS')?.hours || 4
  );
  const [hoursDocumentation, setHoursDocumentation] = useState(
    reportToEdit?.hoursBreakdowns?.find(h => h.taskType === 'DOCUMENTATION')?.hours || 2
  );
  const [hoursOther, setHoursOther] = useState(
    reportToEdit?.hoursBreakdowns?.find(h => h.taskType === 'OTHER')?.hours || 0
  );

  const [notification, setNotification] = useState(null);

  // Task entries handlers
  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      taskName: '',
      priority: 'MEDIUM',
      plannedPct: 100,
      actualPct: 0,
      status: 'NOT_STARTED',
      timePlannedHrs: 8.0,
      timeSpentHrs: 0.0,
      outputDeliverable: ''
    };
    setTaskEntries([...taskEntries, newTask]);
  };

  const handleUpdateTask = (id, field, value) => {
    setTaskEntries(taskEntries.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleDeleteTask = (id) => {
    if (taskEntries.length === 1) {
      alert('At least one task entry is required in your weekly report.');
      return;
    }
    setTaskEntries(taskEntries.filter(t => t.id !== id));
  };

  // Blockers handlers
  const handleAddBlocker = () => {
    setBlockers([...blockers, { id: Date.now(), description: '', isKeyIssue: blockers.length === 0 }]);
  };

  const handleUpdateBlocker = (id, field, value) => {
    if (field === 'isKeyIssue' && value === true) {
      // Only one blocker can be key issue
      setBlockers(blockers.map(b => ({ ...b, isKeyIssue: b.id === id })));
    } else {
      setBlockers(blockers.map(b => b.id === id ? { ...b, [field]: value } : b));
    }
  };

  const handleDeleteBlocker = (id) => {
    setBlockers(blockers.filter(b => b.id !== id));
  };

  // Achievements handlers
  const handleAddAchievement = () => {
    setAchievements([...achievements, { id: Date.now(), description: '', isKeyAchievement: achievements.length === 0 }]);
  };

  const handleUpdateAchievement = (id, field, value) => {
    if (field === 'isKeyAchievement' && value === true) {
      // Only one achievement can be key
      setAchievements(achievements.map(a => ({ ...a, isKeyAchievement: a.id === id })));
    } else {
      setAchievements(achievements.map(a => a.id === id ? { ...a, [field]: value } : a));
    }
  };

  const handleDeleteAchievement = (id) => {
    setAchievements(achievements.filter(a => a.id !== id));
  };

  // Construct payload
  const buildReportData = (targetStatus) => {
    const selectedProject = projects.find(p => p.id === Number(projectId)) || projects[0];
    const totalHours = Number(hoursDevelopment) + Number(hoursTesting) + Number(hoursMeetings) + Number(hoursDocumentation) + Number(hoursOther);

    return {
      id: reportToEdit?.id || Date.now(),
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      userTitle: currentUser.title || 'Engineer',
      userAvatar: currentUser.avatar,
      projectId: Number(projectId),
      projectName: selectedProject.name,
      weekStart,
      weekEnd,
      status: targetStatus,
      currentVersionNo: (reportToEdit?.currentVersionNo || 0) + (targetStatus === 'SUBMITTED' ? 1 : 0),
      submittedAt: targetStatus === 'SUBMITTED' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : reportToEdit?.submittedAt,
      tasksPlannedNextWeek,
      notes,
      taskEntries,
      blockers,
      achievements,
      hoursBreakdowns: [
        { taskType: 'DEVELOPMENT', hours: Number(hoursDevelopment) },
        { taskType: 'TESTING', hours: Number(hoursTesting) },
        { taskType: 'MEETINGS', hours: Number(hoursMeetings) },
        { taskType: 'DOCUMENTATION', hours: Number(hoursDocumentation) },
        { taskType: 'OTHER', hours: Number(hoursOther) }
      ],
      totalHours,
      reviewComments: reportToEdit?.reviewComments || []
    };
  };

  const onSave = () => {
    const data = buildReportData('DRAFT');
    onSaveDraft(data);
    setNotification('Draft successfully saved.');
    setTimeout(() => setNotification(null), 3500);
  };

  const onSubmit = () => {
    // Basic form validation per assignment guidelines
    if (!tasksPlannedNextWeek.trim()) {
      alert('Please fill in "Tasks Planned for Next Week".');
      return;
    }
    const emptyTask = taskEntries.find(t => !t.taskName.trim());
    if (emptyTask) {
      alert('Please provide a name for all tasks in the table.');
      return;
    }
    const data = buildReportData('SUBMITTED');
    onSubmitReport(data);
  };

  // Recent reviewer comment (if in NEEDS_CORRECTION)
  const latestCorrectionComment = reportToEdit?.reviewComments?.slice(-1)[0];

  return (
    <div className="app-container">
      {/* Back button & page header */}
      <div className="page-header">
        <div>
          {onBackToHistory && (
            <button
              onClick={onBackToHistory}
              className="btn btn-secondary btn-sm"
              style={{ marginBottom: '8px' }}
            >
              <ArrowLeft size={14} /> Back to My Report History
            </button>
          )}
          <h1 className="page-title">
            {isEditing ? `Weekly Report — Week of ${weekStart}` : 'Submit Weekly Report'}
          </h1>
          <p className="page-subtitle">
            Personal fixed-schema report for tracking weekly deliverables, blockers, and team metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <StatusBadge status={status} />
          {reportToEdit?.currentVersionNo && (
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>
              Version {reportToEdit.currentVersionNo}
            </span>
          )}
        </div>
      </div>

      {notification && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Prominent Manager Feedback Alert if in NEEDS_CORRECTION */}
      {status === 'NEEDS_CORRECTION' && latestCorrectionComment && (
        <div className="alert alert-warning" style={{ borderLeftWidth: '5px', borderLeftColor: '#d97706' }}>
          <AlertCircle size={22} style={{ flexShrink: 0, color: '#d97706' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '4px', color: '#92400e' }}>
              Action Required: Manager Requested Corrections
            </div>
            <div style={{ color: '#78350f', fontSize: '0.875rem', lineHeight: '1.45', marginBottom: '6px' }}>
              "{latestCorrectionComment.comment}"
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309' }}>
              Reviewed by <strong>{latestCorrectionComment.reviewerName}</strong> on {latestCorrectionComment.createdAt}
            </div>
          </div>
        </div>
      )}

      {/* Read-Only Notice if SUBMITTED or APPROVED */}
      {isReadOnly && (
        <div className="alert alert-info">
          <CheckCircle size={18} />
          <div>
            <strong>Report is {status}.</strong> Edits are locked while in review or approved state. To modify, a manager must send it back for correction.
          </div>
        </div>
      )}

      {/* Form Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Section 1: Week & Project Header */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">1. Report Period & Project</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Standardized fields for all members</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Week Start Date</label>
              <input
                type="date"
                className="form-input"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Week End Date</label>
              <input
                type="date"
                className="form-input"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Assigned Project / Category</label>
              <select
                className="form-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                disabled={isReadOnly}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.isActive ? '' : '(Inactive)'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Tasks Completed Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">2. Tasks Completed This Week</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                Track deliverables, planned vs actual progress %, and hours spent.
              </p>
            </div>
            {!isReadOnly && (
              <button onClick={handleAddTask} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add Task
              </button>
            )}
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '220px' }}>Task Name</th>
                  <th style={{ width: '110px' }}>Priority</th>
                  <th style={{ width: '130px' }}>Planned % vs Actual</th>
                  <th style={{ width: '130px' }}>Status</th>
                  <th style={{ width: '110px' }}>Planned / Spent</th>
                  <th style={{ minWidth: '220px' }}>Output / Deliverable Produced</th>
                  {!isReadOnly && <th style={{ width: '50px' }}></th>}
                </tr>
              </thead>
              <tbody>
                {taskEntries.map((task) => (
                  <tr key={task.id}>
                    <td>
                      {isReadOnly ? (
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{task.taskName}</div>
                      ) : (
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '0.8125rem' }}
                          value={task.taskName}
                          placeholder="e.g. Implement user auth filters"
                          onChange={(e) => handleUpdateTask(task.id, 'taskName', e.target.value)}
                        />
                      )}
                    </td>

                    <td>
                      {isReadOnly ? (
                        <PriorityBadge priority={task.priority} />
                      ) : (
                        <select
                          className="form-select"
                          style={{ padding: '4px 6px', fontSize: '0.75rem' }}
                          value={task.priority}
                          onChange={(e) => handleUpdateTask(task.id, 'priority', e.target.value)}
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      )}
                    </td>

                    <td>
                      {isReadOnly ? (
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {task.actualPct}% of {task.plannedPct}%
                          </div>
                          <div className="progress-bar-track" style={{ marginTop: '3px' }}>
                            <div 
                              className="progress-bar-fill" 
                              style={{ 
                                width: `${Math.min(task.actualPct, 100)}%`,
                                backgroundColor: task.actualPct >= 100 ? '#10b981' : '#2563eb'
                              }} 
                            />
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-input"
                            style={{ width: '52px', padding: '4px 6px', fontSize: '0.75rem' }}
                            value={task.plannedPct}
                            onChange={(e) => handleUpdateTask(task.id, 'plannedPct', Number(e.target.value))}
                          />
                          <span style={{ color: '#94a3b8' }}>/</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-input"
                            style={{ width: '52px', padding: '4px 6px', fontSize: '0.75rem' }}
                            value={task.actualPct}
                            onChange={(e) => handleUpdateTask(task.id, 'actualPct', Number(e.target.value))}
                          />
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>%</span>
                        </div>
                      )}
                    </td>

                    <td>
                      {isReadOnly ? (
                        <TaskStatusBadge status={task.status} />
                      ) : (
                        <select
                          className="form-select"
                          style={{ padding: '4px 6px', fontSize: '0.75rem' }}
                          value={task.status}
                          onChange={(e) => handleUpdateTask(task.id, 'status', e.target.value)}
                        >
                          <option value="NOT_STARTED">Not Started</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                          <option value="BLOCKED">Blocked</option>
                        </select>
                      )}
                    </td>

                    <td>
                      {isReadOnly ? (
                        <span style={{ fontSize: '0.8125rem' }}>
                          <strong>{task.timeSpentHrs}h</strong> / {task.timePlannedHrs}h
                        </span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <input
                            type="number"
                            step="0.5"
                            className="form-input"
                            style={{ width: '48px', padding: '4px 6px', fontSize: '0.75rem' }}
                            value={task.timePlannedHrs}
                            onChange={(e) => handleUpdateTask(task.id, 'timePlannedHrs', Number(e.target.value))}
                          />
                          <span style={{ color: '#94a3b8' }}>/</span>
                          <input
                            type="number"
                            step="0.5"
                            className="form-input"
                            style={{ width: '48px', padding: '4px 6px', fontSize: '0.75rem' }}
                            value={task.timeSpentHrs}
                            onChange={(e) => handleUpdateTask(task.id, 'timeSpentHrs', Number(e.target.value))}
                          />
                        </div>
                      )}
                    </td>

                    <td>
                      {isReadOnly ? (
                        <span style={{ color: '#334155', fontSize: '0.8125rem' }}>
                          {task.outputDeliverable || '—'}
                        </span>
                      ) : (
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '0.8125rem' }}
                          value={task.outputDeliverable}
                          placeholder="e.g. PR link or merged module"
                          onChange={(e) => handleUpdateTask(task.id, 'outputDeliverable', e.target.value)}
                        />
                      )}
                    </td>

                    {!isReadOnly && (
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          title="Remove task"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Tasks Planned for Next Week */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">3. Tasks Planned for Next Week</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Required</span>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <textarea
              className="form-textarea"
              placeholder="Outline specific objectives, modules, and targets planned for the upcoming week..."
              value={tasksPlannedNextWeek}
              onChange={(e) => setTasksPlannedNextWeek(e.target.value)}
              disabled={isReadOnly}
              rows={3}
            />
          </div>
        </div>

        {/* Section 4 & 5: Blockers & Achievements Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Blockers / Challenges */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flag size={16} style={{ color: '#dc2626' }} />
                  4. Blockers & Challenges
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Flag at most 1 item as Key Issue for the week
                </p>
              </div>
              {!isReadOnly && (
                <button onClick={handleAddBlocker} className="btn btn-secondary btn-sm">
                  <Plus size={13} /> Add
                </button>
              )}
            </div>

            {blockers.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.8125rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
                No blockers recorded for this period.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {blockers.map((b) => (
                  <div 
                    key={b.id} 
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: b.isKeyIssue ? '#fef2f2' : '#f8fafc',
                      border: `1px solid ${b.isKeyIssue ? '#fecaca' : '#e2e8f0'}`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {isReadOnly ? (
                        <div style={{ fontSize: '0.8125rem', color: '#334155' }}>{b.description}</div>
                      ) : (
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '0.8125rem', marginBottom: '4px' }}
                          value={b.description}
                          placeholder="Describe the blocker or bottleneck..."
                          onChange={(e) => handleUpdateBlocker(b.id, 'description', e.target.value)}
                        />
                      )}
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '0.725rem', 
                        fontWeight: 600,
                        color: b.isKeyIssue ? '#b91c1c' : '#64748b',
                        cursor: isReadOnly ? 'default' : 'pointer'
                      }}>
                        <input
                          type="radio"
                          name="keyIssueGroup"
                          checked={b.isKeyIssue}
                          onChange={(e) => handleUpdateBlocker(b.id, 'isKeyIssue', e.target.checked)}
                          disabled={isReadOnly}
                        />
                        <span>Flag as Key Issue for the week</span>
                      </label>
                    </div>

                    {!isReadOnly && (
                      <button
                        onClick={() => handleDeleteBlocker(b.id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements / Highlights */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} style={{ color: '#16a34a' }} />
                  5. Achievements & Highlights
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Flag at most 1 item as Key Achievement
                </p>
              </div>
              {!isReadOnly && (
                <button onClick={handleAddAchievement} className="btn btn-secondary btn-sm">
                  <Plus size={13} /> Add
                </button>
              )}
            </div>

            {achievements.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.8125rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
                No key highlights recorded for this period.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {achievements.map((a) => (
                  <div 
                    key={a.id} 
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: a.isKeyAchievement ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${a.isKeyAchievement ? '#bbf7d0' : '#e2e8f0'}`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {isReadOnly ? (
                        <div style={{ fontSize: '0.8125rem', color: '#334155' }}>{a.description}</div>
                      ) : (
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '0.8125rem', marginBottom: '4px' }}
                          value={a.description}
                          placeholder="Describe milestone, breakthrough, or deliverable..."
                          onChange={(e) => handleUpdateAchievement(a.id, 'description', e.target.value)}
                        />
                      )}
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '0.725rem', 
                        fontWeight: 600,
                        color: a.isKeyAchievement ? '#15803d' : '#64748b',
                        cursor: isReadOnly ? 'default' : 'pointer'
                      }}>
                        <input
                          type="radio"
                          name="keyAchievementGroup"
                          checked={a.isKeyAchievement}
                          onChange={(e) => handleUpdateAchievement(a.id, 'isKeyAchievement', e.target.checked)}
                          disabled={isReadOnly}
                        />
                        <span>Flag as Key Achievement for the week</span>
                      </label>
                    </div>

                    {!isReadOnly && (
                      <button
                        onClick={() => handleDeleteAchievement(a.id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Hours Worked Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">6. Hours Worked Breakdown</h3>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563eb' }}>
              Total: {Number(hoursDevelopment) + Number(hoursTesting) + Number(hoursMeetings) + Number(hoursDocumentation) + Number(hoursOther)} Hours
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Development</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                value={hoursDevelopment}
                onChange={(e) => setHoursDevelopment(e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Testing / QA</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                value={hoursTesting}
                onChange={(e) => setHoursTesting(e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Meetings</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                value={hoursMeetings}
                onChange={(e) => setHoursMeetings(e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Documentation</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                value={hoursDocumentation}
                onChange={(e) => setHoursDocumentation(e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Other</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                value={hoursOther}
                onChange={(e) => setHoursOther(e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        {/* Section 7: Notes & Links */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">7. Notes & References (Optional)</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Documentation links, PRs, or tickets</span>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <textarea
              className="form-textarea"
              placeholder="Add any relevant links, tickets, or references..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isReadOnly}
              rows={2}
            />
          </div>
        </div>

        {/* Action Controls Bar */}
        {!isReadOnly && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '1rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <button
              type="button"
              onClick={onSave}
              className="btn btn-secondary"
            >
              <Save size={16} /> Save as Draft
            </button>

            <button
              type="button"
              onClick={onSubmit}
              className="btn btn-primary btn-lg"
            >
              <Send size={16} /> Submit Report for Review
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
