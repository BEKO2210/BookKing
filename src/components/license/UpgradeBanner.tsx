import { useState } from 'react';
import { AlertTriangle, Crown, X, Zap, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLicense } from '@/hooks/useLicense';
import { LICENSE_TIERS } from '@/types';
import type { LicenseTier } from '@/types';

/**
 * Banner that shows when booking limit is almost reached or exceeded.
 * Displays inline in the dashboard or booking flow.
 */
export function UpgradeBanner() {
  const { almostAtLimit, needsUpgrade, remaining, license, tierConfig } = useLicense();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!almostAtLimit && !needsUpgrade)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-xl p-4 mb-4 flex items-start gap-3 ${
        needsUpgrade
          ? 'bg-red-50 border border-red-200'
          : 'bg-amber-50 border border-amber-200'
      }`}
    >
      <div className={`mt-0.5 ${needsUpgrade ? 'text-red-500' : 'text-amber-500'}`}>
        {needsUpgrade ? <AlertTriangle size={20} /> : <Zap size={20} />}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${needsUpgrade ? 'text-red-800' : 'text-amber-800'}`}>
          {needsUpgrade
            ? 'Buchungslimit erreicht'
            : `Nur noch ${remaining} Buchung${remaining === 1 ? '' : 'en'} verfügbar`}
        </p>
        <p className={`text-xs mt-1 ${needsUpgrade ? 'text-red-600' : 'text-amber-600'}`}>
          {needsUpgrade
            ? `Ihr ${tierConfig.name}-Plan erlaubt ${license.bookingsLimit} Buchungen. Upgraden Sie für weitere Buchungen.`
            : `Sie haben ${license.bookingsUsed} von ${license.bookingsLimit} Buchungen in Ihrem ${tierConfig.name}-Plan verwendet.`}
        </p>
      </div>
      {!needsUpgrade && (
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400 hover:text-amber-600"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
}

/**
 * Full-screen upgrade modal when booking limit is hit.
 */
export function UpgradeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { license, upgradeTier } = useLicense();

  const upgradeTiers: LicenseTier[] = (['starter', 'professional', 'business'] as const).filter(
    (t) => {
      const tierOrder: Record<LicenseTier, number> = { free: 0, starter: 1, professional: 2, business: 3 };
      return tierOrder[t] > tierOrder[license.tier];
    },
  );

  const handleUpgrade = (tier: LicenseTier) => {
    upgradeTier(tier);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Crown size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Upgrade erforderlich</h2>
                  <p className="text-sm text-gray-500">
                    Sie haben {license.bookingsUsed} von {license.bookingsLimit} Buchungen verwendet
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all"
                  style={{ width: '100%' }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {license.bookingsUsed}/{license.bookingsLimit} Buchungen verbraucht
              </p>
            </div>

            {/* Upgrade options */}
            <div className="space-y-4">
              {upgradeTiers.map((tierKey) => {
                const tier = LICENSE_TIERS[tierKey];
                const isRecommended = tierKey === 'professional';

                return (
                  <div
                    key={tierKey}
                    className={`rounded-xl border-2 p-5 transition-colors ${
                      isRecommended
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                          {isRecommended && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              Empfohlen
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {tier.bookingsLimit === -1 ? 'Unbegrenzte' : tier.bookingsLimit} Buchungen
                          {tier.bookingsLimit !== -1 ? '/Monat' : ''} · Bis {tier.staffLimit} Mitarbeiter
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{tier.price}€</span>
                        <span className="text-sm text-gray-400">/Monat</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 mb-4">
                      {tier.features.slice(0, 4).map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Check size={12} className="text-green-500 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleUpgrade(tierKey)}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                        isRecommended
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Auf {tier.name} upgraden
                      <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              Alle Preise zzgl. MwSt. · Jederzeit kündbar · 14 Tage kostenlos testen
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Compact license status widget for the dashboard sidebar.
 */
export function LicenseStatusWidget() {
  const { license, tierConfig, isUnlimited, remaining, usagePercent } = useLicense();
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <>
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">{tierConfig.name}-Plan</span>
          </div>
          {license.tier !== 'business' && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Upgraden
            </button>
          )}
        </div>

        {!isUnlimited && (
          <>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent >= 100
                    ? 'bg-red-500'
                    : usagePercent >= 70
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {license.bookingsUsed} / {license.bookingsLimit} Buchungen
              {remaining > 0 && ` · ${remaining} verbleibend`}
            </p>
          </>
        )}

        {isUnlimited && (
          <p className="text-xs text-gray-500">
            {license.bookingsUsed} Buchungen · Unbegrenzt
          </p>
        )}
      </div>

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
