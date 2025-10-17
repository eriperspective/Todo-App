import Link from "next/link";
import { useState } from "react";

export default function HamburgerNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { 
      label: "Dashboard", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      path: "/dashboard" 
    },
    { 
      label: "Calendar", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ), 
      path: "/profile" 
    },
    { 
      label: "Settings", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="12" r="5"></circle>
          <g strokeWidth="1.5">
            <line x1="12" y1="2" x2="12" y2="4"></line>
            <line x1="12" y1="20" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="4" y2="12"></line>
            <line x1="20" y1="12" x2="22" y2="12"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="19.78" y1="4.22" x2="18.36" y2="5.64"></line>
            <line x1="5.64" y1="18.36" x2="4.22" y2="19.78"></line>
          </g>
        </svg>
      ), 
      path: "/settings" 
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="hamburger-nav-container">
      {/* Hamburger Button */}
      <button
        className="hamburger-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        title="Navigation Menu"
      >
        <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
      </button>

      {/* Dropdown Menu */}
      <nav className={`hamburger-menu ${isOpen ? "open" : ""}`}>
        <div className="hamburger-menu-items">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="hamburger-menu-item"
              onClick={closeMenu}
            >
              <span className="hamburger-menu-icon">{item.icon}</span>
              <span className="hamburger-menu-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="hamburger-overlay"
          onClick={closeMenu}
        ></div>
      )}
    </div>
  );
}
