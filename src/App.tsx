import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy, useEffect } from 'react';

import { LandingPage } from '@/pages/LandingPage';
import { useSettingsStore, DEMO_PROVIDER } from '@/store/settings-store';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy-load dashboard pages so landing page loads instantly
const PublicBookingPage = lazy(() =>
  import('@/pages/PublicBookingPage').then((m) => ({ default: m.PublicBookingPage })),
);
const Dashboard = lazy(() =>
  import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })),
);
const CalendarPage = lazy(() =>
  import('@/pages/CalendarPage').then((m) => ({ default: m.CalendarPage })),
);
const ServicesPage = lazy(() =>
  import('@/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
);
const CustomersPage = lazy(() =>
  import('@/pages/CustomersPage').then((m) => ({ default: m.CustomersPage })),
);
const AnalyticsPage = lazy(() =>
  import('@/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const HowItWorksPage = lazy(() =>
  import('@/pages/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })),
);
const PrivacyPage = lazy(() =>
  import('@/pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
);
const HelpPage = lazy(() =>
  import('@/pages/HelpPage').then((m) => ({ default: m.HelpPage })),
);

// Lazy-load heavy dashboard layout components
const Sidebar = lazy(() =>
  import('@/components/ui/Sidebar').then((m) => ({ default: m.Sidebar })),
);
const BottomNav = lazy(() =>
  import('@/components/ui/BottomNav').then((m) => ({ default: m.BottomNav })),
);
const OfflineBanner = lazy(() =>
  import('@/components/OfflineBanner').then((m) => ({ default: m.OfflineBanner })),
);
const PWAInstallPrompt = lazy(() =>
  import('@/components/PWAInstallPrompt').then((m) => ({ default: m.PWAInstallPrompt })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  },
});

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Laden...</p>
      </div>
    </div>
  );
}

function DashboardLayout() {
  const { setSidebarOpen } = useSettingsStore();

  return (
    <div className="flex min-h-screen">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      <main className="flex-1 lg:ml-0">
        <Suspense fallback={null}>
          <OfflineBanner />
        </Suspense>

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

        <div id="main-content" className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-6xl">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      <Suspense fallback={null}>
        <BottomNav />
        <PWAInstallPrompt />
      </Suspense>
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
      <HashRouter>
        <Routes>
          {/* Landing Page — loads instantly, no lazy deps */}
          <Route path="/" element={<LandingPage />} />

          {/* Public booking page */}
          <Route
            path="/book/:slug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PublicBookingPage />
              </Suspense>
            }
          />

          {/* Info pages */}
          <Route
            path="/info/how-it-works"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <HowItWorksPage />
              </Suspense>
            }
          />
          <Route
            path="/info/privacy"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PrivacyPage />
              </Suspense>
            }
          />
          <Route
            path="/info/help"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <HelpPage />
              </Suspense>
            }
          />

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}
