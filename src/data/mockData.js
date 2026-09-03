// Seed and Mock Data for Weekly Report Generator & Team Dashboard
// Designed to match backend entities and seed data from DEVELOPER_GUIDE.md

export const INITIAL_USERS = [
  {
    id: 1,
    fullName: "System Admin",
    email: "admin@weeklyreport.com",
    role: "ROLE_ADMIN",
    roleName: "Admin",
    isActive: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    title: "DevOps & Infrastructure Lead",
    department: "Engineering Ops"
  },
  {
    id: 2,
    fullName: "Lead Manager",
    email: "manager@weeklyreport.com",
    role: "ROLE_MANAGER",
    roleName: "Manager",
    isActive: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    title: "Engineering Manager",
    department: "Software Delivery"
  },
  {
    id: 3,
    fullName: "Alex Chen",
    email: "member@weeklyreport.com",
    role: "ROLE_TEAM_MEMBER",
    roleName: "Team Member",
    isActive: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    title: "Senior Full Stack Engineer",
    department: "Backend Platform"
  },
  {
    id: 4,
    fullName: "Maria Garcia",
    email: "maria.g@weeklyreport.com",
    role: "ROLE_TEAM_MEMBER",
    roleName: "Team Member",
    isActive: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    title: "Frontend Specialist",
    department: "Product UX"
  },
  {
    id: 5,
    fullName: "David Kim",
    email: "david.k@weeklyreport.com",
    role: "ROLE_TEAM_MEMBER",
    roleName: "Team Member",
    isActive: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    title: "Backend Java Engineer",
    department: "Core Services"
  },
  {
    id: 6,
    fullName: "Priya Patel",
    email: "priya.p@weeklyreport.com",
    role: "ROLE_TEAM_MEMBER",
    roleName: "Team Member",
    isActive: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    title: "QA Automation Engineer",
    department: "Quality Assurance"
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 1,
    name: "Client A — FinTech Core Banking",
    category: "Client A",
    description: "High-throughput transaction processor and microservices for tier-1 banking client.",
    isActive: true,
    memberIds: [3, 5, 6],
    memberCount: 3,
    color: "#2563eb"
  },
  {
    id: 2,
    name: "Internal Tooling — Ops Hub",
    category: "Internal Tooling",
    description: "Company-wide internal observability, automated deployments, and employee portals.",
    isActive: true,
    memberIds: [3, 4],
    memberCount: 2,
    color: "#0891b2"
  },
  {
    id: 3,
    name: "R&D — AI Copilot & Search",
    category: "R&D",
    description: "Exploration of localized LLM assistance, weekly synthesis, and RAG knowledge base.",
    isActive: true,
    memberIds: [3, 4, 5],
    memberCount: 3,
    color: "#7c3aed"
  },
  {
    id: 4,
    name: "Marketing Portal & CMS",
    category: "Marketing",
    description: "Next-gen public website redesign, SEO landing pages, and lead capture pipelines.",
    isActive: false,
    memberIds: [4],
    memberCount: 1,
    color: "#d97706"
  }
];

export const CURRENT_WEEK = {
  start: "2026-09-07",
  end: "2026-09-13",
  label: "Week 37 (Sep 07 - Sep 13, 2026)"
};

export const PAST_WEEKS = [
  { start: "2026-09-07", end: "2026-09-13", label: "Week 37 (Sep 07 - Sep 13, 2026)" },
  { start: "2026-08-31", end: "2026-09-06", label: "Week 36 (Aug 31 - Sep 06, 2026)" },
  { start: "2026-08-24", end: "2026-08-30", label: "Week 35 (Aug 24 - Aug 30, 2026)" },
  { start: "2026-08-17", end: "2026-08-23", label: "Week 34 (Aug 17 - Aug 23, 2026)" }
];

export const INITIAL_REPORTS = [
  {
    id: 101,
    userId: 3,
    userName: "Alex Chen",
    userEmail: "member@weeklyreport.com",
    userTitle: "Senior Full Stack Engineer",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    projectId: 1,
    projectName: "Client A — FinTech Core Banking",
    weekStart: "2026-09-07",
    weekEnd: "2026-09-13",
    status: "SUBMITTED",
    currentVersionNo: 1,
    submittedAt: "2026-09-11 16:45",
    tasksPlannedNextWeek: "Complete analytics aggregation queries, load test report generation endpoints, and integrate Redis cache.",
    notes: "Production deployment scheduled for Monday morning. All unit test suites passed with 94% coverage.",
    taskEntries: [
      {
        id: 1,
        taskName: "Implement Auth & Security Layer (JWT + RBAC)",
        priority: "HIGH",
        plannedPct: 100,
        actualPct: 100,
        status: "DONE",
        timePlannedHrs: 12.0,
        timeSpentHrs: 11.5,
        outputDeliverable: "PR #104 merged with passing integration tests"
      },
      {
        id: 2,
        taskName: "Weekly Report Core CRUD APIs & State Machine",
        priority: "HIGH",
        plannedPct: 100,
        actualPct: 90,
        status: "IN_PROGRESS",
        timePlannedHrs: 16.0,
        timeSpentHrs: 15.0,
        outputDeliverable: "Draft, edit, and submit endpoints validated with Postman"
      },
      {
        id: 3,
        taskName: "Database Schema Migrations & Constraints",
        priority: "MEDIUM",
        plannedPct: 100,
        actualPct: 100,
        status: "DONE",
        timePlannedHrs: 6.0,
        timeSpentHrs: 5.5,
        outputDeliverable: "Flyway V1 script with unique weekStart per user constraint"
      }
    ],
    blockers: [
      {
        id: 1,
        description: "Awaiting final approval for staging database replica credentials from client security team.",
        isKeyIssue: true
      }
    ],
    achievements: [
      {
        id: 1,
        description: "Zero security vulnerabilities detected on SonarQube scan across authentication endpoints.",
        isKeyAchievement: true
      }
    ],
    hoursBreakdowns: [
      { taskType: "DEVELOPMENT", hours: 24.0 },
      { taskType: "TESTING", hours: 4.5 },
      { taskType: "MEETINGS", hours: 3.5 }
    ],
    reviewComments: []
  },
  {
    id: 102,
    userId: 4,
    userName: "Maria Garcia",
    userEmail: "maria.g@weeklyreport.com",
    userTitle: "Frontend Specialist",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    projectId: 3,
    projectName: "R&D — AI Copilot & Search",
    weekStart: "2026-09-07",
    weekEnd: "2026-09-13",
    status: "NEEDS_CORRECTION",
    currentVersionNo: 1,
    submittedAt: "2026-09-10 18:20",
    tasksPlannedNextWeek: "Wire up responsive tables for mobile breakpoint and polish side-by-side blocker comparison modal.",
    notes: "Design tokens synced from Figma library v2.1.",
    taskEntries: [
      {
        id: 4,
        taskName: "Build Executive Light Theme Design System",
        priority: "HIGH",
        plannedPct: 100,
        actualPct: 100,
        status: "DONE",
        timePlannedHrs: 14.0,
        timeSpentHrs: 13.0,
        outputDeliverable: "CSS custom properties token system & reusable Badge component"
      },
      {
        id: 5,
        taskName: "Implement Manager Visual Analytics Dashboard",
        priority: "HIGH",
        plannedPct: 100,
        actualPct: 75,
        status: "IN_PROGRESS",
        timePlannedHrs: 16.0,
        timeSpentHrs: 14.0,
        outputDeliverable: "Workload distribution chart and team compliance card"
      }
    ],
    blockers: [
      {
        id: 2,
        description: "Chart library tooltip clipping on smaller laptop viewport sizes.",
        isKeyIssue: true
      }
    ],
    achievements: [
      {
        id: 2,
        description: "Achieved perfect 100 Lighthouse accessibility rating on dashboard components.",
        isKeyAchievement: true
      }
    ],
    hoursBreakdowns: [
      { taskType: "DEVELOPMENT", hours: 22.0 },
      { taskType: "TESTING", hours: 3.0 },
      { taskType: "MEETINGS", hours: 2.0 }
    ],
    reviewComments: [
      {
        id: 1,
        reviewerName: "Lead Manager",
        reviewerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        comment: "Please specify the exact deliverables and time spent breakdown for the analytics charts, and add testing hours documentation.",
        againstVersionNo: 1,
        createdAt: "2026-09-11 11:30"
      }
    ]
  },
  {
    id: 103,
    userId: 5,
    userName: "David Kim",
    userEmail: "david.k@weeklyreport.com",
    userTitle: "Backend Java Engineer",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    projectId: 1,
    projectName: "Client A — FinTech Core Banking",
    weekStart: "2026-09-07",
    weekEnd: "2026-09-13",
    status: "APPROVED",
    currentVersionNo: 2,
    submittedAt: "2026-09-09 17:00",
    approvedAt: "2026-09-10 09:15",
    tasksPlannedNextWeek: "Transition to Phase 4 multi-currency settlement engine modules.",
    notes: "Coordinated with QA team on test cases for high-volume transactions.",
    taskEntries: [
      {
        id: 6,
        taskName: "Database Indexing & Slow Query Optimization",
        priority: "HIGH",
        plannedPct: 100,
        actualPct: 100,
        status: "DONE",
        timePlannedHrs: 10.0,
        timeSpentHrs: 9.0,
        outputDeliverable: "Query latency dropped from 420ms to 45ms"
      },
      {
        id: 7,
        taskName: "Audit Log & Change Tracking Service",
        priority: "MEDIUM",
        plannedPct: 100,
        actualPct: 100,
        status: "DONE",
        timePlannedHrs: 15.0,
        timeSpentHrs: 16.0,
        outputDeliverable: "Spring Data JPA interceptor with timestamped log tables"
      }
    ],
    blockers: [],
    achievements: [
      {
        id: 3,
        description: "Benchmark testing passed 5,000 req/sec sustained throughput without packet loss.",
        isKeyAchievement: true
      }
    ],
    hoursBreakdowns: [
      { taskType: "DEVELOPMENT", hours: 25.0 },
      { taskType: "TESTING", hours: 8.0 },
      { taskType: "MEETINGS", hours: 4.0 },
      { taskType: "DOCUMENTATION", hours: 3.0 }
    ],
    reviewComments: [
      {
        id: 2,
        reviewerName: "Lead Manager",
        reviewerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        comment: "Excellent optimization results. Approved for production.",
        againstVersionNo: 2,
        createdAt: "2026-09-10 09:15"
      }
    ]
  },
  {
    id: 104,
    userId: 6,
    userName: "Priya Patel",
    userEmail: "priya.p@weeklyreport.com",
    userTitle: "QA Automation Engineer",
    userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    projectId: 1,
    projectName: "Client A — FinTech Core Banking",
    weekStart: "2026-09-07",
    weekEnd: "2026-09-13",
    status: "DRAFT",
    currentVersionNo: 1,
    submittedAt: null,
    tasksPlannedNextWeek: "Execute automated regression suite against v2.4 staging release.",
    notes: "Work in progress draft.",
    taskEntries: [
      {
        id: 8,
        taskName: "Playwright E2E Test Suite for Report Submission Workflow",
        priority: "HIGH",
        plannedPct: 100,
        actualPct: 60,
        status: "IN_PROGRESS",
        timePlannedHrs: 18.0,
        timeSpentHrs: 12.0,
        outputDeliverable: "8 core end-to-end specs implemented"
      }
    ],
    blockers: [
      {
        id: 4,
        description: "Test environment flakiness caused by intermittent network timeouts.",
        isKeyIssue: false
      }
    ],
    achievements: [],
    hoursBreakdowns: [
      { taskType: "TESTING", hours: 16.0 },
      { taskType: "MEETINGS", hours: 4.0 }
    ],
    reviewComments: []
  },
  // Past Week 36 Report for Alex Chen to demonstrate historical archive
  {
    id: 95,
    userId: 3,
    userName: "Alex Chen",
    userEmail: "member@weeklyreport.com",
    userTitle: "Senior Full Stack Engineer",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    projectId: 1,
    projectName: "Client A — FinTech Core Banking",
    weekStart: "2026-08-31",
    weekEnd: "2026-09-06",
    status: "APPROVED",
    currentVersionNo: 1,
    submittedAt: "2026-09-04 17:10",
    approvedAt: "2026-09-05 10:00",
    tasksPlannedNextWeek: "Spring Security filter chains and password hashing verification.",
    notes: "Sprint 1 deliverables finished on time.",
    taskEntries: [
      {
        id: 9,
        taskName: "Set up Maven Spring Boot Starter with MySQL",
        priority: "HIGH",
        plannedPct: 100,
        actualPct: 100,
        status: "DONE",
        timePlannedHrs: 10.0,
        timeSpentHrs: 8.5,
        outputDeliverable: "Repository bootstrapped with checkstyle"
      }
    ],
    blockers: [],
    achievements: [
      {
        id: 5,
        description: "Configured CI pipeline with automated build validation in under 4 minutes.",
        isKeyAchievement: true
      }
    ],
    hoursBreakdowns: [
      { taskType: "DEVELOPMENT", hours: 28.0 },
      { taskType: "MEETINGS", hours: 5.0 }
    ],
    reviewComments: [
      {
        id: 3,
        reviewerName: "Lead Manager",
        reviewerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        comment: "Solid kickoff sprint.",
        againstVersionNo: 1,
        createdAt: "2026-09-05 10:00"
      }
    ]
  }
];

// Historical Snapshot Versions for Version History Drawer (Bonus)
export const REPORT_VERSIONS = {
  102: [
    {
      versionNo: 1,
      submittedAt: "2026-09-10 18:20",
      status: "NEEDS_CORRECTION",
      tasksCount: 2,
      totalHours: 27.0,
      reviewerComment: "Please specify the exact deliverables and time spent breakdown for the analytics charts, and add testing hours documentation.",
      tasks: [
        { taskName: "Build Executive Light Theme Design System", status: "DONE", actualPct: 100, timeSpentHrs: 13.0 },
        { taskName: "Implement Manager Visual Analytics Dashboard", status: "IN_PROGRESS", actualPct: 75, timeSpentHrs: 14.0 }
      ]
    }
  ],
  103: [
    {
      versionNo: 1,
      submittedAt: "2026-09-08 14:00",
      status: "NEEDS_CORRECTION",
      tasksCount: 1,
      totalHours: 20.0,
      reviewerComment: "Add deliverable metric on query latency improvement.",
      tasks: [
        { taskName: "Database Indexing & Slow Query Optimization", status: "IN_PROGRESS", actualPct: 80, timeSpentHrs: 12.0 }
      ]
    },
    {
      versionNo: 2,
      submittedAt: "2026-09-09 17:00",
      status: "APPROVED",
      tasksCount: 2,
      totalHours: 40.0,
      reviewerComment: "Excellent optimization results. Approved for production.",
      tasks: [
        { taskName: "Database Indexing & Slow Query Optimization", status: "DONE", actualPct: 100, timeSpentHrs: 9.0 },
        { taskName: "Audit Log & Change Tracking Service", status: "DONE", actualPct: 100, timeSpentHrs: 16.0 }
      ]
    }
  ]
};

// Activity Feed items for Manager Dashboard
export const ACTIVITY_FEED = [
  {
    id: 1,
    type: "SUBMITTED",
    user: "Alex Chen",
    role: "Senior Full Stack Engineer",
    action: "submitted Weekly Report for review",
    project: "Client A — FinTech Core Banking",
    time: "2 hours ago",
    reportId: 101
  },
  {
    id: 2,
    type: "CORRECTION_REQUESTED",
    user: "Lead Manager",
    role: "Engineering Manager",
    action: "requested changes on Maria Garcia's report",
    project: "R&D — AI Copilot & Search",
    time: "4 hours ago",
    reportId: 102
  },
  {
    id: 3,
    type: "APPROVED",
    user: "Lead Manager",
    role: "Engineering Manager",
    action: "approved David Kim's report (v2)",
    project: "Client A — FinTech Core Banking",
    time: "1 day ago",
    reportId: 103
  },
  {
    id: 4,
    type: "DRAFT_SAVED",
    user: "Priya Patel",
    role: "QA Automation Engineer",
    action: "saved a draft report",
    project: "Client A — FinTech Core Banking",
    time: "2 days ago",
    reportId: 104
  }
];

// Tasks Completed Trend data (6 weeks) for manager visual charts
export const TASKS_TREND_DATA = [
  { week: "W32", completed: 14, planned: 16 },
  { week: "W33", completed: 18, planned: 20 },
  { week: "W34", completed: 22, planned: 24 },
  { week: "W35", completed: 25, planned: 26 },
  { week: "W36", completed: 28, planned: 30 },
  { week: "W37 (Now)", completed: 24, planned: 29 }
];

// Team Time Distribution by Task Type
export const TIME_DISTRIBUTION_DATA = [
  { category: "Development", hours: 71.0, percentage: 61, color: "#2563eb" },
  { category: "Testing & QA", hours: 23.5, percentage: 20, color: "#10b981" },
  { category: "Meetings & Sync", hours: 14.5, percentage: 12, color: "#f59e0b" },
  { category: "Documentation", hours: 8.0, percentage: 7, color: "#8b5cf6" }
];

// Project Workload Distribution
export const PROJECT_WORKLOAD_DATA = [
  { project: "Client A (Core Banking)", tasks: 7, totalHours: 68.0, percentage: 58, color: "#2563eb" },
  { project: "R&D AI Copilot", tasks: 4, totalHours: 29.0, percentage: 25, color: "#7c3aed" },
  { project: "Internal Tooling", tasks: 2, totalHours: 14.0, percentage: 12, color: "#0891b2" },
  { project: "Marketing Portal", tasks: 1, totalHours: 6.0, percentage: 5, color: "#d97706" }
];

// AI Copilot predefined responses for suggested manager prompts
export const AI_SUGGESTIONS = [
  {
    query: "What did the backend team work on this week?",
    response: "This week, the backend team (Alex Chen & David Kim) focused on Client A — FinTech Core Banking:\n• Alex implemented the JWT authentication and Spring Security RBAC layer (100% completed) and built Weekly Report core CRUD endpoints.\n• David optimized database indexes, reducing query latency from 420ms to 45ms, and built an JPA audit logging service.\n• Overall backend logged 55.5 hours with high milestone completion."
  },
  {
    query: "Summarize open blockers across all projects",
    response: "Current Open Blockers:\n1. Client A: Staging database replica credentials pending approval from client security team (Flagged as Key Issue by Alex Chen).\n2. R&D AI Lab: Chart library tooltip clipping on compact viewports (Flagged as Key Issue by Maria Garcia).\n3. QA Suite: Test environment flakiness caused by intermittent network timeouts (Reported by Priya Patel)."
  },
  {
    query: "Who hasn't submitted their weekly report yet?",
    response: "Submission Status for Week 37:\n• Priya Patel: Report is in DRAFT status (not yet submitted for manager review).\n• Note: A missing row for a team member automatically derives 'NOT_STARTED' in the compliance calculation."
  }
];
