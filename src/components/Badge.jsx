import React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

export function StatusBadge({ status }) {
  const normalized = status ? status.toUpperCase() : 'NOT_STARTED';

  const config = {
    DRAFT: { label: 'Draft', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', dot: '#64748b' },
    SUBMITTED: { label: 'Submitted', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#2563eb' },
    NEEDS_CORRECTION: { label: 'Needs Correction', bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#d97706' },
    APPROVED: { label: 'Approved', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', dot: '#10b981' },
    NOT_STARTED: { label: 'Not Started', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', dot: '#ef4444' }
  }[normalized] || { label: normalized, bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', dot: '#64748b' };

  return (
    <Chip
      size="small"
      icon={
        <Box 
          component="span" 
          sx={{ 
            width: 6, 
            height: 6, 
            borderRadius: '50%', 
            bgcolor: config.dot,
            ml: 1
          }} 
        />
      }
      label={config.label}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontSize: '0.75rem',
        fontWeight: 600,
        height: '24px'
      }}
    />
  );
}

export function PriorityBadge({ priority }) {
  const normalized = priority ? priority.toUpperCase() : 'MEDIUM';

  const config = {
    HIGH: { label: 'High', bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
    MEDIUM: { label: 'Medium', bg: '#fefce8', color: '#854d0e', border: '#fef08a' },
    LOW: { label: 'Low', bg: '#f8fafc', color: '#475569', border: '#e2e8f0' }
  }[normalized] || { label: normalized, bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };

  return (
    <Chip
      size="small"
      label={config.label}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontSize: '0.75rem',
        fontWeight: 600,
        height: '22px'
      }}
    />
  );
}

export function TaskStatusBadge({ status }) {
  const normalized = status ? status.toUpperCase() : 'IN_PROGRESS';
  
  const map = {
    DONE: { label: 'Done', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
    IN_PROGRESS: { label: 'In Progress', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    NOT_STARTED: { label: 'Not Started', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
    BLOCKED: { label: 'Blocked', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' }
  }[normalized] || { label: normalized, bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };

  return (
    <Chip
      size="small"
      label={map.label}
      sx={{
        bgcolor: map.bg,
        color: map.color,
        border: `1px solid ${map.border}`,
        fontSize: '0.75rem',
        fontWeight: 600,
        height: '22px'
      }}
    />
  );
}
