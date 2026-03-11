import { create } from 'zustand';
import type { BookingFormData, BookingStep, Service, ServiceAddon, StaffMember } from '@/types';

interface BookingState {
  // Multi-step wizard state
  currentStep: BookingStep;
  selectedService: Service | null;
  selectedStaff: StaffMember | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedAddons: ServiceAddon[];
  formData: Partial<BookingFormData>;
  isSubmitting: boolean;
  bookingConfirmed: boolean;
  confirmationToken: string | null;

  // Actions
  setStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectService: (service: Service) => void;
  selectStaff: (staff: StaffMember | null) => void;
  selectDate: (date: string) => void;
  selectTime: (time: string) => void;
  toggleAddon: (addon: ServiceAddon) => void;
  setFormData: (data: Partial<BookingFormData>) => void;
  setSubmitting: (submitting: boolean) => void;
  confirmBooking: (token: string) => void;
  reset: () => void;
}

const STEP_ORDER: BookingStep[] = [
  'service',
  'staff',
  'datetime',
  'details',
  'summary',
  'confirmation',
];

const initialState = {
  currentStep: 'service' as BookingStep,
  selectedService: null,
  selectedStaff: null,
  selectedDate: null,
  selectedTime: null,
  selectedAddons: [],
  formData: {},
  isSubmitting: false,
  bookingConfirmed: false,
  confirmationToken: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx < STEP_ORDER.length - 1) {
      set({ currentStep: STEP_ORDER[idx + 1] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx > 0) {
      set({ currentStep: STEP_ORDER[idx - 1] });
    }
  },

  selectService: (service) =>
    set({
      selectedService: service,
      selectedAddons: [],
      selectedDate: null,
      selectedTime: null,
    }),

  selectStaff: (staff) =>
    set({ selectedStaff: staff, selectedDate: null, selectedTime: null }),

  selectDate: (date) => set({ selectedDate: date, selectedTime: null }),

  selectTime: (time) => set({ selectedTime: time }),

  toggleAddon: (addon) =>
    set((state) => {
      const exists = state.selectedAddons.find((a) => a.id === addon.id);
      return {
        selectedAddons: exists
          ? state.selectedAddons.filter((a) => a.id !== addon.id)
          : [...state.selectedAddons, addon],
      };
    }),

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  setSubmitting: (submitting) => set({ isSubmitting: submitting }),

  confirmBooking: (token) =>
    set({
      bookingConfirmed: true,
      confirmationToken: token,
      isSubmitting: false,
    }),

  reset: () => set(initialState),
}));

/**
 * Calculate total price from selected service + addons.
 */
export function calculateTotalPrice(state: BookingState): number {
  if (!state.selectedService) return 0;
  const servicePrice =
    state.selectedService.priceType === 'free' ? 0 : state.selectedService.price;
  const addonPrice = state.selectedAddons.reduce((sum, a) => sum + a.price, 0);
  return servicePrice + addonPrice;
}

/**
 * Calculate total duration from selected service + addons.
 */
export function calculateTotalDuration(state: BookingState): number {
  if (!state.selectedService) return 0;
  const serviceDuration = state.selectedService.duration;
  const addonDuration = state.selectedAddons.reduce((sum, a) => sum + a.duration, 0);
  return serviceDuration + addonDuration;
}
