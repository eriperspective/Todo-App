import Link from "next/link";
import { useState } from "react";

export default function BottomNav() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { 
      label: "Home", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ), 
      path: "/dashboard" 
    },
    { 
      label: "Calendar", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ), 
      path: "/calendar" 
    },
    { 
      label: "Profile", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ), 
      path: "/profile" 
    },
    { 
      label: "Affirmations", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ), 
      path: "/affirmations" 
    },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link 
          key={item.label} 
          href={item.path} 
          className="nav-item" 
          title={item.label}
          style={{
            color: hoveredItem === item.label ? "#20B2AA" : "var(--color-text-secondary)",
            transition: "all 0.3s ease",
            fontFamily: "'Playfair Display', serif",
            fontStyle: "normal"
          }}
          onMouseEnter={() => setHoveredItem(item.label)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <span 
            className="nav-item-icon"
            style={{
              color: hoveredItem === item.label ? "#20B2AA" : "currentColor",
              transition: "color 0.3s ease"
            }}
          >
            {item.icon}
          </span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
  