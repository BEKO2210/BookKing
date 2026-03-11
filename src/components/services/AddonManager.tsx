import { Plus, Trash2 } from 'lucide-react';
import type { ServiceAddon } from '@/types';
import { generateId } from '@/lib/utils';

interface AddonManagerProps {
  addons: ServiceAddon[];
  onChange: (addons: ServiceAddon[]) => void;
}

export function AddonManager({ addons, onChange }: AddonManagerProps) {
  const handleAdd = () => {
    onChange([...addons, { id: generateId(), name: '', duration: 15, price: 0 }]);
  };

  const handleRemove = (id: string) => {
    onChange(addons.filter((a) => a.id !== id));
  };

  const handleUpdate = (id: string, field: keyof ServiceAddon, value: string | number) => {
    onChange(
      addons.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Zusatzoptionen</label>
        <button
          type="button"
          onClick={handleAdd}
          className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <Plus size={12} />
          Hinzufügen
        </button>
      </div>

      {addons.length === 0 && (
        <p className="text-xs text-gray-400">Keine Zusatzoptionen</p>
      )}

      <div className="space-y-2">
        {addons.map((addon) => (
          <div key={addon.id} className="flex items-center gap-2">
            <input
              type="text"
              className="input-field text-sm flex-1"
              value={addon.name}
              onChange={(e) => handleUpdate(addon.id, 'name', e.target.value)}
              placeholder="Name"
            />
            <input
              type="number"
              className="input-field text-sm w-20"
              value={addon.duration}
              onChange={(e) => handleUpdate(addon.id, 'duration', Number(e.target.value))}
              placeholder="Min."
              min={0}
            />
            <input
              type="number"
              className="input-field text-sm w-20"
              value={addon.price}
              onChange={(e) => handleUpdate(addon.id, 'price', Number(e.target.value))}
              placeholder="€"
              min={0}
              step={0.01}
            />
            <button
              type="button"
              onClick={() => handleRemove(addon.id)}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
