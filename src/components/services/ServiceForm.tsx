import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useSettingsStore } from '@/store/settings-store';
import type { Service, PriceType } from '@/types';
import { AddonManager } from './AddonManager';

const DURATIONS = [15, 30, 45, 60, 90, 120];
const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#6366f1',
];

interface ServiceFormProps {
  service: Service | null;
  onClose: () => void;
}

export function ServiceForm({ service, onClose }: ServiceFormProps) {
  const { createService, updateService } = useServices();
  const provider = useSettingsStore((s) => s.provider);
  const isEditing = !!service;

  const [name, setName] = useState(service?.name ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [duration, setDuration] = useState(service?.duration ?? 60);
  const [price, setPrice] = useState(service?.price ?? 0);
  const [priceType, setPriceType] = useState<PriceType>(service?.priceType ?? 'fixed');
  const [bufferBefore, setBufferBefore] = useState(service?.bufferBefore ?? 0);
  const [bufferAfter, setBufferAfter] = useState(service?.bufferAfter ?? 15);
  const [capacity, setCapacity] = useState(service?.capacity ?? 1);
  const [category, setCategory] = useState(service?.category ?? '');
  const [color, setColor] = useState(service?.color ?? COLORS[0]!);
  const [isActive, setIsActive] = useState(service?.isActive ?? true);
  const [addons, setAddons] = useState(service?.addons ?? []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      providerId: provider?.id ?? '',
      name,
      description: description || undefined,
      duration,
      bufferBefore,
      bufferAfter,
      price,
      priceType,
      capacity,
      category: category || undefined,
      addons,
      isActive,
      sortOrder: service?.sortOrder ?? 0,
      color,
    };

    if (isEditing && service) {
      updateService.mutate({ ...data, id: service.id });
    } else {
      createService.mutate(data);
    }

    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="card w-full max-w-lg p-6 my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Service bearbeiten' : 'Neuer Service'}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="svc-name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              id="svc-name"
              type="text"
              required
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Haarschnitt"
            />
          </div>

          <div>
            <label htmlFor="svc-desc" className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea
              id="svc-desc"
              className="input-field min-h-[60px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung des Services..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
            <input
              type="text"
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="z.B. Haarschnitte, Styling..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dauer</label>
              <select
                className="input-field"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} Minuten
                  </option>
                ))}
                <option value={180}>3 Stunden</option>
                <option value={240}>4 Stunden</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kapazität</label>
              <input
                type="number"
                min={1}
                max={100}
                className="input-field"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preistyp</label>
              <select
                className="input-field"
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as PriceType)}
              >
                <option value="fixed">Festpreis</option>
                <option value="from">Ab-Preis</option>
                <option value="free">Kostenlos</option>
                <option value="on-request">Auf Anfrage</option>
              </select>
            </div>

            {priceType !== 'free' && priceType !== 'on-request' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preis (€)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="input-field"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Puffer vorher (Min.)</label>
              <input
                type="number"
                min={0}
                max={60}
                className="input-field"
                value={bufferBefore}
                onChange={(e) => setBufferBefore(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Puffer nachher (Min.)</label>
              <input
                type="number"
                min={0}
                max={60}
                className="input-field"
                value={bufferAfter}
                onChange={(e) => setBufferAfter(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Farbe</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-primary-600 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Addons */}
          <AddonManager addons={addons} onChange={setAddons} />

          {/* Active toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600"
            />
            <span className="text-sm text-gray-700">Service ist aktiv (buchbar)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Abbrechen
            </button>
            <button type="submit" className="btn-primary flex-1">
              {isEditing ? 'Speichern' : 'Erstellen'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
