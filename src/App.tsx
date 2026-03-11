import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

import { Sidebar } from '@/components/ui/Sidebar';
import { BottomNav } from '@/components/ui/BottomNav';
import { OfflineBanner } from '@/components/OfflineBanner';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

import { PublicBookingPage } from '@/pages/PublicBookingPage';
import { Dashboard } from '@/pages/Dashboard';
import { CalendarPage } from '@/pages/CalendarPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { SettingsPage } from '@/pages/SettingsPage';

import { useSettingsStore, DEMO_PROVIDER } from '@/store/settings-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  },
});

function DashboardLayout() {
  const { sidebarOpen, setSidebarOpen } = useSettingsStore();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-0">
        <OfflineBanner />

        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600"
            aria-label="Menü öffnen"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <h1 className="font-bold text-gray-900">BookKing</h1>
          <div className="w-10" />
        </header>

        <div className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-6xl">
          <Outlet />
        </div>
      </main>

      <BottomNav />
      <PWAInstallPrompt />
    </div>
  );
}

export default function App() {
  const { provider, setProvider } = useSettingsStore();

  // Auto-init demo provider for development
  useEffect(() => {
    if (!provider) {
      setProvider(DEMO_PROVIDER);
    }
  }, [provider, setProvider]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public booking page */}
          <Route path="/book/:slug" element={<PublicBookingPage />} />

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
