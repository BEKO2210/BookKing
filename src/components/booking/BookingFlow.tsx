import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/store/booking-store';
import { ServiceSelector } from './ServiceSelector';
import { StaffSelector } from './StaffSelector';
import { DatePicker } from './DatePicker';
import { TimeSlotGrid } from './TimeSlotGrid';
import { BookingForm } from './BookingForm';
import { BookingSummary } from './BookingSummary';
import { BookingConfirmation } from './BookingConfirmation';
import type { BookingStep } from '@/types';

const stepVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const STEPS: { key: BookingStep; label: string }[] = [
  { key: 'service', label: 'Service' },
  { key: 'staff', label: 'Mitarbeiter' },
  { key: 'datetime', label: 'Termin' },
  { key: 'details', label: 'Daten' },
  { key: 'summary', label: 'Bestätigung' },
];

export function BookingFlow() {
  const { currentStep } = useBookingStore();

  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  const isConfirmation = currentStep === 'confirmation';

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress bar */}
        {!isConfirmation && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((step, i) => (
                <div key={step.key} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i <= currentIndex
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-8 sm:w-12 h-0.5 transition-colors ${
                        i < currentIndex ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center">
              {STEPS[currentIndex]?.label}
            </p>
          </div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {currentStep === 'service' && <ServiceSelector />}
            {currentStep === 'staff' && <StaffSelector />}
            {currentStep === 'datetime' && (
              <div className="space-y-6">
                <DatePicker />
                <TimeSlotGrid />
              </div>
            )}
            {currentStep === 'details' && <BookingForm />}
            {currentStep === 'summary' && <BookingSummary />}
            {currentStep === 'confirmation' && <BookingConfirmation />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
