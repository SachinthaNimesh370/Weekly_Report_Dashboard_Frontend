import React from 'react';

const PALETTES = [
  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' }, // Blue
  { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' }, // Green
  { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' }, // Purple
  { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' }, // Orange
  { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' }, // Pink
  { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' }, // Teal
  { bg: '#f8fafc', text: '#334155', border: '#cbd5e1' }  // Slate
];

function getInitials(name = '') {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getPalette(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

export function UserAvatar({ name = '', size = 34, fontSize, style = {} }) {
  const initials = getInitials(name);
  const palette = getPalette(name);
  const computedFontSize = fontSize || `${Math.max(10, Math.round(size * 0.38))}px`;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        backgroundColor: palette.bg,
        color: palette.text,
        border: `1.5px solid ${palette.border}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: computedFontSize,
        letterSpacing: '0.02em',
        userSelect: 'none',
        flexShrink: 0,
        ...style
      }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

export default UserAvatar;
