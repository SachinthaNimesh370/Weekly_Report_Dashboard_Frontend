import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme } from './theme/muiTheme';

import { Navbar } from './components/Navbar';
import { AiChatWidget } from './components/AiChatWidget';
import { AuthPage } from './pages/auth/AuthPage';
import { PersonalReportPage } from './pages/reports/PersonalReportPage';
import { ReportHistoryPage } from './pages/reports/ReportHistoryPage';
import { ReportDetailPage } from './pages/reports/ReportDetailPage';
import { ManagerReviewPage } from './pages/manager/ManagerReviewPage';
import { TeamDashboardPage } from './pages/manager/TeamDashboardPage';
import { MemberProfilePage } from './pages/manager/MemberProfilePage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { UserManagementPage } from './pages/users/UserManagementPage';

import { Power } from 'lucide-react';
import { projectApi } from './api/projectApi';
import { reportApi } from './api/reportApi';
import { dashboardApi } from './api/dashboardApi';
import { userApi } from './api/userApi';

export function App() {
  // Global State - only populated from the database
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);

  // Session state from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token') && localStorage.getItem('user'));
  });

  // Navigation & Active items
  const [activeView, setActiveView] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return u.role === 'ROLE_TEAM_MEMBER' ? 'my-report' : 'dashboard';
      } catch (e) {}
    }
    return 'my-report';
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch real data from database
  const refreshDatabaseData = useCallback(async (userObj) => {
    const user = userObj || currentUser;
    if (!user) return;
    const isManagerOrAdmin = user.role === 'ROLE_MANAGER' || user.role === 'ROLE_ADMIN';

    try {
      // 1. Fetch real projects from DB
      const projectsList = isManagerOrAdmin
        ? await projectApi.getAllProjects()
        : await projectApi.getActiveProjects();
      setProjects(projectsList || []);

      // 2. Fetch real reports from DB
      if (isManagerOrAdmin) {
        const res = await reportApi.getManagerReports({ page: 0, size: 100 });
        const list = res?.content ?? res ?? [];
        setReports(list);

        // Fetch all users for Admin and Manager from dedicated user endpoint
        try {
          const allUsersFromApi = await userApi.getAllUsers();
          if (Array.isArray(allUsersFromApi)) {
            setUsers(allUsersFromApi);
          }
        } catch (err) {
          // Fallback to dashboard member status
          try {
            const statusList = await dashboardApi.getMemberStatus();
            if (Array.isArray(statusList)) {
              const memberUsers = statusList.map(m => ({
                id: m.userId,
                fullName: m.fullName,
                email: m.email,
                role: 'ROLE_TEAM_MEMBER',
                roleName: 'Team Member',
                isActive: true,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName)}&background=2563eb&color=fff`
              }));
              setUsers(memberUsers);
            }
          } catch (fallbackErr) {
            console.warn('Could not fetch members:', fallbackErr);
          }
        }
      } else {
        const res = await reportApi.getMyReports({ page: 0, size: 50 });
        const list = res?.content ?? res ?? [];
        setReports(list);
      }
    } catch (err) {
      console.error('Error refreshing database data:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      refreshDatabaseData(currentUser);
    }
  }, [isAuthenticated, currentUser, refreshDatabaseData]);

  // Listen for account deactivation events from axiosClient
  useEffect(() => {
    const handleDeactivatedEvent = (e) => {
      const msg = e?.detail?.message || 'Your account has been deactivated by an administrator.';
      alert(msg);
      handleLogout();
    };

    window.addEventListener('auth:deactivated', handleDeactivatedEvent);
    return () => {
      window.removeEventListener('auth:deactivated', handleDeactivatedEvent);
    };
  }, []);

  // ==========================================
  // Auth & Persona Handlers
  // ==========================================
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    if (user.role === 'ROLE_TEAM_MEMBER') {
      setActiveView('my-report');
    } else {
      setActiveView('dashboard');
    }
    refreshDatabaseData(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setReports([]);
    setProjects([]);
    setUsers([]);
    setSelectedReport(null);
  };

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    if (user.role === 'ROLE_TEAM_MEMBER') {
      setActiveView('my-report');
      setSelectedReport(null);
    } else {
      setActiveView('dashboard');
    }
    refreshDatabaseData(user);
  };

  // ==========================================
  // Core Report Workflow Handlers
  // ==========================================

  // Save as Draft
  const handleSaveDraft = (reportData) => {
    const existingIndex = reports.findIndex(r => r.id === reportData.id);
    if (existingIndex >= 0) {
      const updated = [...reports];
      updated[existingIndex] = { ...reportData, status: 'DRAFT' };
      setReports(updated);
    } else {
      setReports([reportData, ...reports]);
    }
    // Refresh from DB to get server-canonical state
    refreshDatabaseData();
  };

  // Submit Report for Review
  const handleSubmitReport = (reportData) => {
    const existingIndex = reports.findIndex(r => r.id === reportData.id);
    const versionNo = (reportData.currentVersionNo || 0);

    const submission = {
      ...reportData,
      status: 'SUBMITTED',
      currentVersionNo: versionNo || 1,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    if (existingIndex >= 0) {
      const updated = [...reports];
      updated[existingIndex] = submission;
      setReports(updated);
    } else {
      setReports([submission, ...reports]);
    }

    // Redirect to personal history with confirmation
    setActiveView('history');
    // Refresh from DB to get server-canonical state
    refreshDatabaseData();
  };

  // Manager Approves Report
  const handleApproveReport = (reportId) => {
    setReports(reports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'APPROVED',
          approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          reviewComments: [
            ...(r.reviewComments || []),
            {
              id: Date.now(),
              reviewerName: currentUser.fullName,
              reviewerAvatar: currentUser.avatar,
              comment: 'Approved for weekly release.',
              againstVersionNo: r.currentVersionNo || 1,
              createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          ]
        };
      }
      return r;
    }));
  };

  // Manager Requests Changes
  const handleRequestChanges = (reportId, commentText) => {
    setReports(reports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'NEEDS_CORRECTION',
          reviewComments: [
            ...(r.reviewComments || []),
            {
              id: Date.now(),
              reviewerName: currentUser.fullName,
              reviewerAvatar: currentUser.avatar,
              comment: commentText,
              againstVersionNo: r.currentVersionNo || 1,
              createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          ]
        };
      }
      return r;
    }));
  };

  // ==========================================
  // Project & User Management Handlers
  // ==========================================
  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      const merged = { ...currentUser, ...updatedUser };
      setCurrentUser(merged);
      localStorage.setItem('user', JSON.stringify(merged));
    }
  };

  // ==========================================
  // View Transitions
  // ==========================================
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setActiveView('detail');
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setActiveView('my-report');
  };

  const handleCreateNewReport = () => {
    setSelectedReport(null);
    setActiveView('my-report');
  };

  const handleViewMemberProfile = (member) => {
    setSelectedMember(member);
    setActiveView('profile');
  };

  const handleNavigateToReview = (report) => {
    setSelectedReport(report);
    setActiveView('review-list');
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AuthPage onLogin={handleLogin} allUsers={users} />
      </ThemeProvider>
    );
  }

  // Account deactivation guard - deactivated user cannot do anything
  if (currentUser && currentUser.isActive === false) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem'
        }}>
          <div className="card" style={{ maxWidth: '480px', textAlign: 'center', padding: '2.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <Power size={28} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Account Deactivated
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Your Sisenco account (<strong>{currentUser.email}</strong>) has been deactivated by an administrator. You cannot submit reports, view the dashboard, or perform any actions.
            </p>
            <div className="alert alert-warning" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              If you believe this is in error, please contact your system administrator.
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Count pending reviews for badge in navbar
  const pendingReviewCount = reports.filter(r => r.status === 'SUBMITTED').length;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top App Navbar */}
        <Navbar
          currentUser={currentUser}
          activeView={activeView}
          onNavigate={(view) => {
            if (view === 'my-report') setSelectedReport(null);
            setActiveView(view);
          }}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
          allUsers={users}
          pendingReviewCount={pendingReviewCount}
        />

        {/* Main View Router */}
        <main style={{ flex: 1 }}>
          {activeView === 'my-report' && (
            <PersonalReportPage
              reportToEdit={selectedReport || reports.find(r => r.userId === currentUser.id && (r.status === 'DRAFT' || r.status === 'NEEDS_CORRECTION'))}
              currentUser={currentUser}
              projects={projects}
              onSaveDraft={handleSaveDraft}
              onSubmitReport={handleSubmitReport}
              onBackToHistory={() => setActiveView('history')}
            />
          )}

          {activeView === 'history' && (
            <ReportHistoryPage
              reports={reports}
              currentUser={currentUser}
              onViewReport={handleViewReport}
              onEditReport={handleEditReport}
              onCreateNew={handleCreateNewReport}
            />
          )}

          {activeView === 'detail' && (
            <ReportDetailPage
              report={selectedReport}
              currentUser={currentUser}
              onBack={() => {
                if (currentUser.role === 'ROLE_TEAM_MEMBER') {
                  setActiveView('history');
                } else {
                  setActiveView('dashboard');
                }
              }}
              onNavigateToReview={handleNavigateToReview}
            />
          )}

          {activeView === 'dashboard' && (
            <TeamDashboardPage
              reports={reports}
              allUsers={users}
              projects={projects}
              onReviewReport={handleNavigateToReview}
              onViewReport={handleViewReport}
              onViewMemberProfile={handleViewMemberProfile}
            />
          )}

          {activeView === 'review-list' && (
            <ManagerReviewPage
              report={selectedReport}
              reports={reports}
              onSelectReport={(r) => setSelectedReport(r)}
              onApprove={handleApproveReport}
              onRequestChanges={handleRequestChanges}
              onBackToDashboard={() => {
                setSelectedReport(null);
                setActiveView('dashboard');
              }}
            />
          )}

          {activeView === 'profile' && (
            <MemberProfilePage
              member={selectedMember}
              reports={reports}
              projects={projects}
              onBack={() => setActiveView('dashboard')}
              onViewReport={handleViewReport}
            />
          )}

          {activeView === 'projects' && (
            <ProjectsPage
              projects={projects}
              allUsers={users}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              currentUser={currentUser}
            />
          )}

          {activeView === 'users' && (
            <UserManagementPage
              allUsers={users}
              onUpdateUser={handleUpdateUser}
              onAddUser={handleAddUser}
              currentUser={currentUser}
            />
          )}
        </main>

        {/* Floating AI Chat Assistant Widget (Available for prompt Q&A across the app) */}
        <AiChatWidget currentUser={currentUser} />
      </div>
    </ThemeProvider>
  );
}

export default App;
