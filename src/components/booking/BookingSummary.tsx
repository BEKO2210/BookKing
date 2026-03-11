import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, CreditCard } from 'lucide-react';
import { useBookingStore, calculateTotalPrice, calculateTotalDuration } from '@/store/booking-store';
import { useCreateBooking } from '@/hooks/useBookings';
import { formatDate, formatPrice, formatDuration, formatTime } from '@/lib/utils';
import { useLicense } from '@/hooks/useLicense';
import { UpgradeBanner, UpgradeModal } from '@/components/license/UpgradeBanner';

export function BookingSummary() {
  const store = useBookingStore();
  const {
    selectedService,
    selectedStaff,
    selectedDate,
    selectedTime,
    selectedAddons,
    formData,
    isSubmitting,
    prevStep,
    setSubmitting,
    confirmBooking,
  } = store;

  const createBooking = useCreateBooking();
  const { canBook, needsUpgrade, almostAtLimit } = useLicense();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const totalPrice = calculateTotalPrice(store);
  const totalDuration = calculateTotalDuration(store);

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !formData.email) return;

    // Check license before booking
    if (!canBook) {
      setShowUpgradeModal(true);
      return;
    }

    setSubmitting(true);

    try {
      const result = await createBooking.mutateAsync({
        formData: {
          serviceId: selectedService.id,
          staffId: selectedStaff?.id,
          date: selectedDate,
          time: selectedTime,
          addons: selectedAddons.map((a) => a.id),
          firstName: formData.firstName ?? '',
          lastName: formData.lastName ?? '',
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
        },
        serviceDuration: totalDuration,
        totalPrice,
      });

      confirmBooking(result.booking.confirmationToken);
    } catch (error) {
      setSubmitting(false);
      if (error instanceof Error && error.message === 'BOOKING_LIMIT_REACHED') {
        setShowUpgradeModal(true);
      }
    }
  };

  if (!selectedService || !selectedDate || !selectedTime) return null;

  return (
    <div>
      <button
        onClick={prevStep}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Zurück
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Zusammenfassung</h2>
      <p className="text-gray-500 mb-6">Bitte überprüfen Sie Ihre Buchung.</p>

      {(needsUpgrade || almostAtLimit) && <UpgradeBanner />}
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

      <div className="card p-5 space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: selectedService.color + '20' }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedService.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedService.name}</h3>
            {selectedService.description && (
              <p className="text-sm text-gray-500">{selectedService.description}</p>
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">
              {formatDate(selectedDate)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">
              {formatTime(selectedTime)} · {formatDuration(totalDuration)}
            </span>
          </div>

          {selectedStaff && (
            <div className="flex items-center gap-3 text-sm">
              <User size={16} className="text-gray-400" />
              <span className="text-gray-900 font-medium">
                {selectedStaff.name}
              </span>
            </div>
          )}
        </div>

        {selectedAddons.length > 0 && (
          <>
            <hr className="border-gray-100" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Zusatzoptionen
              </p>
              {selectedAddons.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{addon.name}</span>
                  <span className="text-gray-500">+{addon.price.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </>
        )}

        <hr className="border-gray-100" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-gray-400" />
            <span className="font-semibold text-gray-900">Gesamt</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(totalPrice, selectedService.priceType)}
          </span>
        </div>
      </div>

      {/* Contact info summary */}
      <div className="card p-4 mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
          Kontaktdaten
        </p>
        <p className="text-sm text-gray-900 font-medium">
          {formData.firstName} {formData.lastName}
        </p>
        <p className="text-sm text-gray-500">{formData.email}</p>
        {formData.phone && (
          <p className="text-sm text-gray-500">{formData.phone}</p>
        )}
        {formData.notes && (
          <p className="text-sm text-gray-500 mt-2 italic">"{formData.notes}"</p>
        )}
      </div>

      {/* Trust elements */}
      <div className="text-center text-xs text-gray-400 mb-4">
        Kostenlose Stornierung bis 24h vor dem Termin
      </div>

      <button
        onClick={handleConfirm}
        disabled={isSubmitting}
        className={`w-full text-base py-3 ${
          needsUpgrade
            ? 'btn-primary bg-amber-500 hover:bg-amber-600'
            : 'btn-primary'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Wird gebucht...
          </span>
        ) : needsUpgrade ? (
          'Upgrade erforderlich — Plan wählen'
        ) : (
          'Termin verbindlich buchen'
        )}
      </button>
    </div>
  );
}
