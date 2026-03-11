import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Scissors, Users, BarChart3 } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/calendar', icon: Calendar, label: 'Kalender' },
  { to: '/services', icon: Scissors, label: 'Services' },
  { to: '/customers', icon: Users, label: 'Kunden' },
  { to: '/analytics', icon: BarChart3, label: 'Statistik' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-400 active:text-gray-600'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
