import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Filter, 
  Calendar, 
  FolderKanban, 
  Eye, 
  CheckSquare, 
  Columns, 
  Activity,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { StatusBadge } from '../../components/Badge';
import { getPastWeeks } from '../../utils/dateUtils';
import { dashboardApi } from '../../api/dashboardApi';
import { reportApi } from '../../api/reportApi';
import { UserAvatar } from '../../components/UserAvatar';

const pastWeeks = getPastWeeks(8);

export function TeamDashboardPage({ 
  reports: parentReports = [], 
  allUsers = [], 
  projects = [], 
  onReviewReport, 
  onViewReport, 
  onViewMemberProfile 
}) {
  const [selectedWeek, setSelectedWeek] = useState(pastWeeks[0].start);
  const [filterMember, setFilterMember] = useState('ALL');
  const [filterProject, setFilterProject] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sideBySideModal, setSideBySideModal] = useState(null); // 'blockers' | 'achievements' | null

  // API state - pure database data
  const [summary, setSummary] = useState(null);
  const [memberStatusList, setMemberStatusList] = useState([]);
  const [tasksTrend, setTasksTrend] = useState([]);
  const [timeDistribution, setTimeDistribution] = useState([]);
  const [projectWorkload, setProjectWorkload] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [weekReports, setWeekReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedWeek]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all dashboard data from EC2 backend
      const [summaryRes, memberStatusRes, tasksTrendRes, timeDistRes, projectWorkloadRes, activityRes, reportsRes] = await Promise.allSettled([
        dashboardApi.getSummary(selectedWeek),
        dashboardApi.getMemberStatus(selectedWeek),
        dashboardApi.getTasksTrend(6),
        dashboardApi.getTimeDistribution(selectedWeek),
        dashboardApi.getProjectWorkload(selectedWeek),
        dashboardApi.getRecentActivity(10),
        reportApi.getManagerReports({ page: 0, size: 100 })
      ]);

      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
      if (memberStatusRes.status === 'fulfilled') setMemberStatusList(Array.isArray(memberStatusRes.value) ? memberStatusRes.value : []);
      if (tasksTrendRes.status === 'fulfilled') setTasksTrend(Array.isArray(tasksTrendRes.value) ? tasksTrendRes.value : []);
      if (timeDistRes.status === 'fulfilled') setTimeDistribution(Array.isArray(timeDistRes.value) ? timeDistRes.value : []);
      if (projectWorkloadRes.status === 'fulfilled') setProjectWorkload(Array.isArray(projectWorkloadRes.value) ? projectWorkloadRes.value : []);
      if (activityRes.status === 'fulfilled') setActivityFeed(Array.isArray(activityRes.value) ? activityRes.value : []);
      if (reportsRes.status === 'fulfilled') {
        const list = reportsRes.value?.content ?? reportsRes.value ?? [];
        setWeekReports(list.filter(r => r.weekStart === selectedWeek));
      }
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // KPI metrics: pure live summary from API or reports
  const kpiTotalMembers = summary?.totalActiveMembers ?? memberStatusList.length;
  const kpiSubmittedCount = summary?.totalReportsSubmitted ?? weekReports.filter(r => r.status === 'SUBMITTED' || r.status === 'APPROVED').length;
  const kpiComplianceRate = summary?.complianceRate != null ? Math.round(summary.complianceRate) : (kpiTotalMembers > 0 ? Math.round((kpiSubmittedCount / kpiTotalMembers) * 100) : 0);
  const kpiNeedsCorrection = summary?.needsCorrectionCount ?? weekReports.filter(r => r.status === 'NEEDS_CORRECTION').length;
  const kpiOpenBlockers = summary?.openBlockersCount ?? weekReports.reduce((count, r) => count + (r.blockers?.length || 0), 0);

  const TASK_TYPE_COLORS = {
    DEVELOPMENT: '#2563eb',
    TESTING: '#10b981',
    MEETINGS: '#f59e0b',
    DOCUMENTATION: '#8b5cf6',
    OTHER: '#64748b'
  };

  const teamMembers = memberStatusList.length > 0 
    ? memberStatusList.map(ms => ({ id: ms.userId, fullName: ms.fullName })) 
    : allUsers.filter(u => u.role === 'ROLE_TEAM_MEMBER');

  // Build memberReportMap directly from live API memberStatusList
  const memberReportMap = memberStatusList.map(ms => {
    const matchedUser = allUsers.find(u => u.id === ms.userId);
    return {
      member: matchedUser || {
        id: ms.userId,
        fullName: ms.fullName,
        email: ms.email,
        role: 'ROLE_TEAM_MEMBER',
        roleName: 'Team Member',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(ms.fullName || 'Member')}&background=2563eb&color=fff`
      },
      report: weekReports.find(r => r.userId === ms.userId),
      derivedStatus: ms.status || ms.reportStatus || 'NOT_STARTED'
    };
  });

  // Apply dashboard filters
  const filteredMemberRows = memberReportMap.filter(item => {
    if (filterMember !== 'ALL' && item.member.id !== Number(filterMember)) return false;
    if (filterProject !== 'ALL' && item.report?.projectId !== Number(filterProject)) return false;
    if (filterStatus !== 'ALL' && item.derivedStatus !== filterStatus) return false;
    return true;
  });


  return (
    <div className="app-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Productivity Dashboard</h1>
          <p className="page-subtitle">
            Executive overview of team weekly report submissions, workload allocation, and blockers.
          </p>
        </div>

        {/* Side-by-side Comparison Bonus Action */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setSideBySideModal('blockers')}
            className="btn btn-secondary btn-sm"
          >
            <Columns size={14} /> Compare Blockers Side-by-Side
          </button>
          <button 
            onClick={() => setSideBySideModal('achievements')}
            className="btn btn-secondary btn-sm"
          >
            <Columns size={14} /> Compare Highlights
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* Card 1 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Reports Submitted
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
              {kpiSubmittedCount} / {kpiTotalMembers}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#16a34a' }}>
              {kpiTotalMembers - kpiSubmittedCount === 0 ? 'All reports filed' : `${kpiTotalMembers - kpiSubmittedCount} pending/draft`}
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Compliance Rate
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
              {kpiComplianceRate}%
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
              Target: 80%+ on-time
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#fffbeb',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Needs Correction
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
              {kpiNeedsCorrection}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#d97706' }}>
              Requires member resubmit
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Open Blockers
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
              {kpiOpenBlockers}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#dc2626' }}>
              Across team projects
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid (4 Visual Charts / Data Visualizations) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        {/* Chart 1: Tasks Completed Trend over Time */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} style={{ color: '#2563eb' }} />
                Tasks Completed Trend (Recent Weeks)
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Planned vs Completed output velocity</p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>Live DB Metrics</span>
          </div>

          {tasksTrend.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              No tasks trend history recorded in the database yet.
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1.5rem', paddingBottom: '0.5rem', gap: '12px' }}>
              {tasksTrend.map((d, i) => {
                const maxVal = Math.max(10, ...tasksTrend.map(t => t.totalTasks || 0));
                const plannedHeight = ((d.totalTasks || 0) / maxVal) * 140;
                const compHeight = ((d.completedTasks || 0) / maxVal) * 140;

                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '140px' }}>
                      {/* Total tasks bar */}
                      <div 
                        style={{
                          width: '14px',
                          height: `${Math.max(4, plannedHeight)}px`,
                          backgroundColor: '#e2e8f0',
                          borderRadius: '3px 3px 0 0'
                        }}
                        title={`Total Tasks: ${d.totalTasks || 0}`}
                      />
                      {/* Completed bar */}
                      <div 
                        style={{
                          width: '18px',
                          height: `${Math.max(compHeight > 0 ? 4 : 0, compHeight)}px`,
                          backgroundColor: i === tasksTrend.length - 1 ? '#2563eb' : '#3b82f6',
                          borderRadius: '3px 3px 0 0'
                        }}
                        title={`Completed: ${d.completedTasks || 0}`}
                      />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{d.label || d.weekStart}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '8px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
              <span style={{ color: '#64748b' }}>Total Tasks</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#2563eb', borderRadius: '2px' }} />
              <span style={{ color: '#0f172a', fontWeight: 600 }}>Completed Tasks</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Time Distribution by Task Type */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} style={{ color: '#059669' }} />
                Team Time Allocation by Activity
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Total {timeDistribution.reduce((sum, t) => sum + (Number(t.totalHours) || 0), 0)} hours recorded this week
              </p>
            </div>
          </div>

          {timeDistribution.length === 0 || timeDistribution.every(t => (Number(t.totalHours) || 0) === 0) ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              No hours recorded for this week yet.
            </div>
          ) : (
            <>
              {/* Stacked bar visualization */}
              <div style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ height: '28px', width: '100%', display: 'flex', borderRadius: '8px', overflow: 'hidden' }}>
                  {timeDistribution.map((t, i) => (
                    <div 
                      key={i}
                      style={{
                        width: `${t.percentage || 0}%`,
                        backgroundColor: TASK_TYPE_COLORS[t.taskType] || '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '0.725rem',
                        fontWeight: 600
                      }}
                      title={`${t.label || t.taskType}: ${t.totalHours}h (${t.percentage || 0}%)`}
                    >
                      {(t.percentage || 0) > 10 ? `${t.percentage}%` : ''}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {timeDistribution.map((item, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: TASK_TYPE_COLORS[item.taskType] || '#2563eb' }} />
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#334155' }}>{item.label || item.taskType}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                      {item.totalHours || 0}h <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.725rem' }}>({item.percentage || 0}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Chart 3: Workload Distribution by Project */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FolderKanban size={16} style={{ color: '#7c3aed' }} />
                Workload & Task Distribution by Project
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Active resource intensity</p>
            </div>
          </div>

          {projectWorkload.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              No project workload recorded for this week yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '0.5rem' }}>
              {projectWorkload.map((p, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{p.projectName || p.name || `Project #${p.projectId}`}</span>
                    <span style={{ color: '#64748b' }}>{p.tasks || 0} tasks • {p.totalHours || 0}h ({p.percentage || 0}%)</span>
                  </div>
                  <div className="progress-bar-track" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${p.percentage || 0}%`, backgroundColor: p.color || '#2563eb' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart 4: Recent Review & Submission Activity Feed */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={16} style={{ color: '#2563eb' }} />
                Recent Review & Submission Feed
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Audit log of workflow events</p>
            </div>
          </div>

          {activityFeed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              No recent activity recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activityFeed.map((act) => (
                <div 
                  key={act.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '8px 10px', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: act.type === 'APPROVED' ? '#10b981' : act.type === 'CORRECTION_REQUESTED' ? '#f59e0b' : '#2563eb'
                    }} />
                    <div>
                      <div style={{ fontSize: '0.8125rem', color: '#0f172a' }}>
                        <strong>{act.user || act.userName}</strong> {act.action || act.description}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {act.project || act.projectName} • {act.time || act.timestamp}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const r = weekReports.find(item => item.id === act.reportId) || parentReports.find(item => item.id === act.reportId);
                      if (r) onViewReport(r);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Team Member Reports Table with Filters */}
      <div className="card" style={{ padding: 0 }}>
        {/* Filters Header Bar */}
        <div style={{ 
          padding: '1rem 1.25rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#fafafa'
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
              Team Submissions & Review Tracker
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Includes all active members and dynamically tracks missing submissions as 'Not Started'.
            </p>
          </div>

          {/* Filter Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Week selector */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8125rem' }}
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              {pastWeeks.map(w => (
                <option key={w.start} value={w.start}>{w.label}</option>
              ))}
            </select>

            {/* Member filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8125rem' }}
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
            >
              <option value="ALL">All Members</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>{m.fullName}</option>
              ))}
            </select>

            {/* Project filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8125rem' }}
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="ALL">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8125rem' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="NEEDS_CORRECTION">Needs Correction</option>
              <option value="APPROVED">Approved</option>
              <option value="DRAFT">Draft</option>
              <option value="NOT_STARTED">Not Started</option>
            </select>
          </div>
        </div>

        {/* Submissions Data Table */}
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Project Assigned</th>
                <th>Tasks Completed</th>
                <th>Logged Hours</th>
                <th>Key Issue (Blocker)</th>
                <th>Key Achievement</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Review Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMemberRows.map(({ member, report, derivedStatus }) => {
                const keyIssue = report?.blockers?.find(b => b.isKeyIssue);
                const keyAchieve = report?.achievements?.find(a => a.isKeyAchievement);
                const totalHours = report?.hoursBreakdowns?.reduce((s, h) => s + (Number(h.hours) || 0), 0) || report?.totalHours || 0;

                return (
                  <tr key={member.id}>
                    {/* Member Info & Profile link */}
                    <td>
                      <div 
                        onClick={() => onViewMemberProfile(member)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        title="Click to view full member profile"
                      >
                        <UserAvatar name={member.fullName} size={34} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>{member.fullName}</span>
                            <ArrowRight size={11} style={{ color: '#94a3b8' }} />
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{member.title}</div>
                        </div>
                      </div>
                    </td>

                    {/* Project */}
                    <td>
                      <span style={{ fontWeight: 500 }}>
                        {report ? report.projectName : '—'}
                      </span>
                    </td>

                    {/* Tasks */}
                    <td>
                      {report ? (
                        <span>{report.taskEntries?.length || 0} tasks</span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>

                    {/* Hours */}
                    <td>
                      {report ? (
                        <strong style={{ color: '#2563eb' }}>{totalHours}h</strong>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>0h</span>
                      )}
                    </td>

                    {/* Key Issue */}
                    <td style={{ maxWidth: '200px' }}>
                      {keyIssue ? (
                        <span style={{ color: '#b91c1c', fontSize: '0.75rem', fontWeight: 500 }} title={keyIssue.description}>
                          ⚠️ {keyIssue.description.substring(0, 38)}...
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>None</span>
                      )}
                    </td>

                    {/* Key Achievement */}
                    <td style={{ maxWidth: '200px' }}>
                      {keyAchieve ? (
                        <span style={{ color: '#15803d', fontSize: '0.75rem', fontWeight: 500 }} title={keyAchieve.description}>
                          ⭐ {keyAchieve.description.substring(0, 38)}...
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>None</span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td>
                      <StatusBadge status={derivedStatus} />
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      {report ? (
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => onViewReport(report)}
                            className="btn btn-secondary btn-sm"
                            title="View report"
                          >
                            <Eye size={13} /> View
                          </button>

                          {report.status === 'SUBMITTED' && (
                            <button
                              onClick={() => onReviewReport(report)}
                              className="btn btn-primary btn-sm"
                              title="Review & take action"
                            >
                              <CheckSquare size={13} /> Review
                            </button>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#dc2626', fontStyle: 'italic' }}>
                          No submission
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal (Bonus Feature) */}
      {sideBySideModal && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '840px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Columns size={18} style={{ color: '#2563eb' }} />
                Side-by-Side Comparison: {sideBySideModal === 'blockers' ? 'Blockers & Impediments' : 'Weekly Key Highlights'}
              </h3>
            </div>

            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Comparing <strong>{sideBySideModal === 'blockers' ? 'blockers' : 'achievements'}</strong> across all team members for Week of {selectedWeek}:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {weekReports.map(rep => {
                  const items = sideBySideModal === 'blockers' ? rep.blockers : rep.achievements;
                  return (
                    <div 
                      key={rep.id} 
                      style={{ 
                        border: '1px solid #e2e8f0', 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '12px',
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <UserAvatar name={rep.userName} size={28} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0f172a' }}>{rep.userName}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{rep.projectName}</div>
                        </div>
                      </div>

                      {items?.length === 0 ? (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          No {sideBySideModal} recorded.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {items?.map((item) => (
                            <div 
                              key={item.id} 
                              style={{ 
                                padding: '6px 8px', 
                                backgroundColor: '#ffffff', 
                                borderRadius: '4px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.75rem',
                                color: '#334155'
                              }}
                            >
                              {(item.isKeyIssue || item.isKeyAchievement) && (
                                <span style={{ 
                                  fontWeight: 700, 
                                  color: item.isKeyIssue ? '#dc2626' : '#16a34a',
                                  display: 'block',
                                  marginBottom: '2px'
                                }}>
                                  {item.isKeyIssue ? '★ KEY ISSUE:' : '★ KEY HIGHLIGHT:'}
                                </span>
                              )}
                              {item.description}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setSideBySideModal(null)} 
                className="btn btn-secondary"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
