import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookingFlow } from '@/components/booking/BookingFlow';
import { useBookingStore } from '@/store/booking-store';
import { useSettingsStore, DEMO_PROVIDER } from '@/store/settings-store';

export function PublicBookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { setProvider, provider } = useSettingsStore();
  const { reset } = useBookingStore();

  // In production, fetch provider by slug from Supabase
  useEffect(() => {
    if (!provider) {
      setProvider(DEMO_PROVIDER);
    }
    return () => {
      reset();
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      {/* Provider header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
            {provider?.businessName?.charAt(0) ?? 'B'}
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">
              {provider?.businessName ?? 'Buchung'}
            </h1>
            <p className="text-xs text-gray-500">Online Terminbuchung</p>
          </div>
        </div>
      </header>

      <BookingFlow />
    </div>
  );
}
