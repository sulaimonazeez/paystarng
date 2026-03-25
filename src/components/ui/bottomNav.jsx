import React from "react";
import { Home, User, Headset, History, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { id: "home",    label: "Home",    icon: Home,          nav: "/app" },
  { id: "history", label: "History", icon: History,       nav: "/history" },
  { id: "support", label: "Support", icon: Headset,       nav: "/support" },
  { id: "profile", label: "Profile", icon: User,          nav: "/profile" }
];

const BottomNav = () => {
  const { pathname } = useLocation();

  const isActive = (nav) => {
    if (nav === "/app") return pathname === "/app";
    return pathname.startsWith(nav);
  };

  return (
    <div className="bottom-nav">
      {navItems.map(({ id, label, icon: Icon, nav }) => {
        const active = isActive(nav);
        return (
          <Link
            key={id}
            to={nav}
            className={`nav-tab${active ? " active" : ""}`}
          >
            <div className="nav-icon">
              <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
            </div>
            <span style={{
              fontSize: "0.65rem",
              fontWeight: active ? 700 : 500,
              color: active ? "var(--primary)" : "var(--text3)",
              fontFamily: "var(--font-body)",
            }}>
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
