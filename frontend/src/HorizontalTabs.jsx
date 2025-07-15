import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Diagram' },
  { path: '/cleaner', label: 'Cleaner' },
  { path: '/analyzer', label: 'Analyzer' },
  { path: '/faq', label: 'FAQ' },
];

export default function HorizontalTabs() {
  return (
    <nav
      style={{
        display: 'flex',
        gap: '20px',
        padding: '1px 40px',
        borderBottom: '2px solid #e0e0e0',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {tabs.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          style={({ isActive }) => ({
            padding: '8px 12px',
            fontSize: '16px',
            textDecoration: 'none',
            color: isActive ? '#007bff' : '#333',
            borderBottom: isActive ? '3px solid #007bff' : '3px solid transparent',
            fontWeight: isActive ? '600' : '500',
            transition: 'border-bottom 0.3s ease',
          })}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
