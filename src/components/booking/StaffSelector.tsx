import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { getInitials, stringToColor, getContrastColor } from '@/lib/utils';

// Demo staff for development — in production, loaded from Supabase
const DEMO_STAFF = [
  {
    id: 'staff-1',
    providerId: 'demo-provider-001',
    name: 'Maria Schmidt',
    email: 'maria@demo.de',
    specialties: ['Haarschnitt', 'Färben'],
    serviceIds: [],
    isActive: true,
  },
  {
    id: 'staff-2',
    providerId: 'demo-provider-001',
    name: 'Thomas Weber',
    email: 'thomas@demo.de',
    specialties: ['Styling', 'Bartpflege'],
    serviceIds: [],
    isActive: true,
  },
];

export function StaffSelector() {
  const { selectStaff, nextStep, prevStep } = useBookingStore();

  const handleSelect = (staff: (typeof DEMO_STAFF)[number] | null) => {
    selectStaff(
      staff
        ? { ...staff, avatar: undefined }
        : null,
    );
    nextStep(); // → datetime
  };

  return (
    <div>
      <button
        onClick={prevStep}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Zurück
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Mitarbeiter wählen
      </h2>
      <p className="text-gray-500 mb-6">
        Bei wem möchten Sie Ihren Termin buchen?
      </p>

      <div className="space-y-3">
        {/* "Anyone" option */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => handleSelect(null)}
          className="card w-full p-4 text-left hover:border-primary-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
              ?
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Egal / Nächster freier</h4>
              <p className="text-sm text-gray-500">Frühestmöglicher Termin</p>
            </div>
            <ChevronRight
              size={20}
              className="text-gray-300 group-hover:text-primary-500 transition-colors"
            />
          </div>
        </motion.button>

        {DEMO_STAFF.map((staff, i) => {
          const nameParts = staff.name.split(' ');
          const initials = getInitials(nameParts[0] ?? '', nameParts[1] ?? '');
          const bgColor = stringToColor(staff.name);
          const textColor = getContrastColor(bgColor);

          return (
            <motion.button
              key={staff.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 1) * 0.05 }}
              onClick={() => handleSelect(staff)}
              className="card w-full p-4 text-left hover:border-primary-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  {initials}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                  <p className="text-sm text-gray-500">
                    {staff.specialties.join(' · ')}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-300 group-hover:text-primary-500 transition-colors"
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
