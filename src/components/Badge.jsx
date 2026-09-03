import React from 'react';

export function StatusBadge({ status }) {
  const normalized = status ? status.toUpperCase() : 'NOT_STARTED';

  const config = {
    DRAFT: { label: 'Draft', class: 'badge-draft' },
    SUBMITTED: { label: 'Submitted', class: 'badge-submitted' },
    NEEDS_CORRECTION: { label: 'Needs Correction', class: 'badge-correction' },
    APPROVED: { label: 'Approved', class: 'badge-approved' },
    NOT_STARTED: { label: 'Not Started', class: 'badge-notstarted' }
  }[normalized] || { label: normalized, class: 'badge-draft' };

  return (
    <span className={`badge ${config.class}`}>
      <span className="badge-dot" />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const normalized = priority ? priority.toUpperCase() : 'MEDIUM';

  const config = {
    HIGH: { label: 'High', class: 'badge-priority-high' },
    MEDIUM: { label: 'Medium', class: 'badge-priority-medium' },
    LOW: { label: 'Low', class: 'badge-priority-low' }
  }[normalized] || { label: normalized, class: 'badge-priority-low' };

  return (
    <span className={`badge ${config.class}`}>
      {config.label}
    </span>
  );
}

export function TaskStatusBadge({ status }) {
  const normalized = status ? status.toUpperCase() : 'IN_PROGRESS';
  
  const map = {
    DONE: { label: 'Done', bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
    IN_PROGRESS: { label: 'In Progress', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    NOT_STARTED: { label: 'Not Started', bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
    BLOCKED: { label: 'Blocked', bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' }
  }[normalized] || { label: normalized, bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: map.bg,
      color: map.text,
      border: `1px solid ${map.border}`
    }}>
      {map.label}
    </span>
  );
}
