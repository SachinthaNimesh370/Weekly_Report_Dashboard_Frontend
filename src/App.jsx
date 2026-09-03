import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AiChatWidget } from './components/AiChatWidget';
import { AuthPage } from './pages/AuthPage';
import { PersonalReportPage } from './pages/PersonalReportPage';
import { ReportHistoryPage } from './pages/ReportHistoryPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { ManagerReviewPage } from './pages/ManagerReviewPage';
import { TeamDashboardPage } from './pages/TeamDashboardPage';
import { MemberProfilePage } from './pages/MemberProfilePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { UserManagementPage } from './pages/UserManagementPage';

import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_REPORTS, 
  REPORT_VERSIONS, 
  ACTIVITY_FEED 
} from './data/mockData';

export function App() {
  // Global State
  const [users, setUsers] = useState(INITIAL_USERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[2]); // Default: Alex Chen (Team Member)
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Navigation & Active items
  const [activeView, setActiveView] = useState('my-report'); // 'my-report' | 'history' | 'detail' | 'dashboard' | 'review-list' | 'profile' | 'projects' | 'users'
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

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
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    if (user.role === 'ROLE_TEAM_MEMBER') {
      setActiveView('my-report');
      setSelectedReport(null);
    } else {
      setActiveView('dashboard');
    }
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
    return <AuthPage onLogin={handleLogin} allUsers={users} />;
  }

  // Count pending reviews for badge in navbar
  const pendingReviewCount = reports.filter(r => r.status === 'SUBMITTED').length;

  return (
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
  );
}

export default App;
