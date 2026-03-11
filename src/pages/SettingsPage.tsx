import { useState } from 'react';
import { Settings, User, Clock, CreditCard, Bell, Mail, Globe, Crown, Check, ArrowRight } from 'lucide-react';
import { useSettingsStore } from '@/store/settings-store';
import { AvailabilityEditor } from '@/components/calendar/AvailabilityEditor';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { EmailTemplateEditor } from '@/components/notifications/EmailTemplateEditor';
import { InfoButton } from '@/components/ui/InfoButton';
import { useLicense } from '@/hooks/useLicense';
import { LICENSE_TIERS } from '@/types';
import type { LicenseTier } from '@/types';

type SettingsTab = 'general' | 'availability' | 'notifications' | 'emails' | 'license';

const tabs: { key: SettingsTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: 'general', label: 'Allgemein', icon: Settings },
  { key: 'availability', label: 'Arbeitszeiten', icon: Clock },
  { key: 'notifications', label: 'Benachrichtigungen', icon: Bell },
  { key: 'emails', label: 'E-Mail-Templates', icon: Mail },
  { key: 'license', label: 'Lizenz & Plan', icon: Crown },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const { provider, updateSettings } = useSettingsStore();

  const settings = provider?.settings;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Einstellungen</h1>
        <InfoButton title="Einstellungen">
          <p>Hier verwalten Sie alle Grundeinstellungen Ihres Buchungssystems:</p>
          <ul className="list-disc list-inside space-y-1 ml-1">
            <li><strong>Allgemein</strong> — Geschäftsname, Buchungsregeln und Zahlungsoptionen</li>
            <li><strong>Arbeitszeiten</strong> — Wann können Kunden buchen?</li>
            <li><strong>Benachrichtigungen</strong> — E-Mail- und Push-Einstellungen</li>
            <li><strong>E-Mail-Templates</strong> — Automatische E-Mails anpassen</li>
          </ul>
        </InfoButton>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General settings */}
      {activeTab === 'general' && settings && (
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Geschäftsdaten
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geschäftsname</label>
                <input
                  type="text"
                  className="input-field"
                  defaultValue={provider?.businessName}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buchungs-Slug</label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue={provider?.bookingSlug}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zeitzone</label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue={provider?.timezone}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe size={20} />
              Buchungsregeln
              <InfoButton title="Buchungsregeln">
                <p><strong>Min. Vorlaufzeit:</strong> Wie früh vor dem Termin muss gebucht werden? Z.B. 2 Stunden = Buchung frühestens 2h vorher.</p>
                <p><strong>Max. Vorlaufzeit:</strong> Wie weit im Voraus darf gebucht werden? Z.B. 30 Tage.</p>
                <p><strong>Stornierungsfrist:</strong> Bis wie viele Stunden vor dem Termin darf kostenlos storniert werden?</p>
                <p><strong>Zeitslot-Intervall:</strong> In welchen Abständen werden Termine angeboten (15, 30 oder 60 Minuten)?</p>
              </InfoButton>
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min. Vorlaufzeit (Stunden)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={settings.minLeadTime}
                    onChange={(e) => updateSettings({ minLeadTime: Number(e.target.value) })}
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max. Vorlaufzeit (Tage)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={settings.maxLeadTime}
                    onChange={(e) => updateSettings({ maxLeadTime: Number(e.target.value) })}
                    min={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stornierungsfrist (Stunden)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={settings.cancellationWindow}
                    onChange={(e) => updateSettings({ cancellationWindow: Number(e.target.value) })}
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zeitslot-Intervall (Min.)
                  </label>
                  <select
                    className="input-field"
                    value={settings.slotInterval}
                    onChange={(e) => updateSettings({ slotInterval: Number(e.target.value) })}
                  >
                    <option value={15}>15 Minuten</option>
                    <option value={30}>30 Minuten</option>
                    <option value={60}>60 Minuten</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              Zahlung
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anzahlung (%)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={settings.depositPercent ?? 0}
                    onChange={(e) => updateSettings({ depositPercent: Number(e.target.value) || undefined })}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No-Show Gebühr (€)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={settings.noShowFee ?? 0}
                    onChange={(e) => updateSettings({ noShowFee: Number(e.target.value) || undefined })}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'availability' && <AvailabilityEditor />}
      {activeTab === 'notifications' && <NotificationSettings />}
      {activeTab === 'emails' && <EmailTemplateEditor />}
      {activeTab === 'license' && <LicenseSettings />}
    </div>
  );
}

// ═══════════════════════════════════════════
// License Settings Tab
// ═══════════════════════════════════════════

function LicenseSettings() {
  const { license, tierConfig, isUnlimited, remaining, usagePercent, upgradeTier } = useLicense();

  const allTiers: LicenseTier[] = ['free', 'starter', 'professional', 'business'];
  const tierOrder: Record<LicenseTier, number> = { free: 0, starter: 1, professional: 2, business: 3 };

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <div className="card p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Crown size={20} className="text-blue-600" />
          Aktueller Plan
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Crown size={28} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">{tierConfig.name}</h4>
            <p className="text-sm text-gray-500">
              {tierConfig.price === 0 ? 'Kostenlos' : `${tierConfig.price} €/Monat`}
            </p>
          </div>
        </div>

        {/* Usage bar */}
        {!isUnlimited && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Buchungen verwendet</span>
              <span className="font-semibold text-gray-900">
                {license.bookingsUsed} / {license.bookingsLimit}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
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
            <p className="text-xs text-gray-400 mt-1">
              {remaining > 0
                ? `Noch ${remaining} Buchung${remaining === 1 ? '' : 'en'} verfügbar`
                : 'Limit erreicht — Upgrade erforderlich'}
            </p>
          </div>
        )}

        {isUnlimited && (
          <p className="text-sm text-gray-500 mb-4">
            {license.bookingsUsed} Buchungen erstellt · Unbegrenzt verfügbar
          </p>
        )}

        {/* Features */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Inkludierte Features</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tierConfig.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={14} className="text-green-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All plans */}
      <div className="card p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alle Pläne</h3>
        <div className="space-y-4">
          {allTiers.map((tierKey) => {
            const tier = LICENSE_TIERS[tierKey];
            const isCurrent = tierKey === license.tier;
            const isUpgrade = tierOrder[tierKey] > tierOrder[license.tier];

            return (
              <div
                key={tierKey}
                className={`rounded-xl border-2 p-4 ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                      {isCurrent && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Aktuell
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {tier.bookingsLimit === -1 ? 'Unbegrenzte' : tier.bookingsLimit} Buchungen
                      · Bis {tier.staffLimit} Mitarbeiter
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-xl font-bold text-gray-900">{tier.price}€</span>
                      <span className="text-sm text-gray-400">/Mo</span>
                    </div>
                    {isUpgrade && (
                      <button
                        onClick={() => upgradeTier(tierKey)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-1"
                      >
                        Upgraden <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          Alle Preise zzgl. MwSt. · Jederzeit kündbar · 14 Tage kostenlos testen
        </p>
      </div>
    </div>
  );
}
