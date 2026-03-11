import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { useSlotCalculator } from '@/hooks/useSlotCalculator';
import { formatTime } from '@/lib/utils';

export function TimeSlotGrid() {
  const { selectedDate, selectedService, selectedStaff, selectedTime, selectTime, nextStep } =
    useBookingStore();
  const { slots, isLoading } = useSlotCalculator(
    selectedDate,
    selectedService,
    selectedStaff?.id,
  );

  if (!selectedDate) return null;

  const handleSelect = (time: string) => {
    selectTime(time);
    nextStep(); // → details
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Clock size={20} />
        Verfügbare Zeiten
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-11 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">
            Keine Termine an diesem Tag verfügbar.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Bitte wählen Sie ein anderes Datum.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot, i) => (
            <motion.button
              key={slot.time}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => handleSelect(slot.time)}
              className={`
                py-2.5 px-3 rounded-xl text-sm font-medium transition-all
                ${
                  selectedTime === slot.time
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100'
                }
              `}
            >
              {slot.time}
              {slot.spotsLeft !== undefined && (
                <span className="block text-[10px] opacity-75">
                  {slot.spotsLeft} {slot.spotsLeft === 1 ? 'Platz' : 'Plätze'}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
