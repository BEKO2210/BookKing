import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  Download,
  X,
} from 'lucide-react';
import { useSettingsStore } from '@/store/settings-store';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar', icon: Calendar, label: 'Kalender' },
  { to: '/services', icon: Scissors, label: 'Services' },
  { to: '/customers', icon: Users, label: 'Kunden' },
  { to: '/analytics', icon: BarChart3, label: 'Statistiken' },
  { to: '/settings', icon: Settings, label: 'Einstellungen' },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, provider } = useSettingsStore();
  const { canInstall, install } = usePWAInstall();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isDesktop || sidebarOpen ? 0 : -280 }}
        transition={{ type: 'tween', duration: isDesktop ? 0 : 0.2 }}
        className={`fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-gray-100 z-50 flex flex-col ${isDesktop ? 'static' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h1 className="text-lg font-bold text-gray-900">BookKing</h1>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">
              {provider?.businessName ?? 'Mein Geschäft'}
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
            aria-label="Menü schließen"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => !isDesktop && setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}

          {/* Public booking link */}
          {provider && (
            <a
              href={`/book/${provider.bookingSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ExternalLink size={20} />
              Buchungsseite
            </a>
          )}
        </nav>

        {/* Install prompt */}
        {canInstall && (
          <div className="px-3 pb-4">
            <button
              onClick={install}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
            >
              <Download size={18} />
              App installieren
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}
