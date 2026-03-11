import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { formatPrice, formatDuration } from '@/lib/utils';
import { ServiceForm } from './ServiceForm';
import { InfoButton } from '@/components/ui/InfoButton';
import type { Service } from '@/types';

export function ServiceManager() {
  const { services, deleteService } = useServices();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const grouped = new Map<string, Service[]>();
  for (const s of services) {
    const cat = s.category ?? 'Allgemein';
    const arr = grouped.get(cat) ?? [];
    arr.push(s);
    grouped.set(cat, arr);
  }

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Service wirklich löschen?')) {
      deleteService.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Services</h2>
            <p className="text-sm text-gray-500">{services.length} Services</p>
          </div>
          <InfoButton title="Services verwalten">
            <p>Hier verwalten Sie alle Dienstleistungen, die Kunden buchen können:</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li><strong>Name & Preis</strong> — Was kostet der Service?</li>
              <li><strong>Dauer</strong> — Wie lange dauert der Termin?</li>
              <li><strong>Pufferzeit</strong> — Zeit für Vor-/Nachbereitung</li>
              <li><strong>Kapazität</strong> — Für Gruppen: wie viele Plätze?</li>
              <li><strong>Kategorie</strong> — Sortierung auf der Buchungsseite</li>
            </ul>
            <p>Inaktive Services werden auf der Buchungsseite nicht angezeigt.</p>
          </InfoButton>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus size={18} />
          <span className="hidden sm:inline">Neuer Service</span>
          <span className="sm:hidden">Neu</span>
        </button>
      </div>

      {Array.from(grouped.entries()).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {category}
          </h3>
          <div className="space-y-2">
            {items.map((service) => (
              <motion.div
                key={service.id}
                layout
                className="card p-4 flex items-center gap-4"
              >
                <GripVertical size={16} className="text-gray-300 cursor-grab shrink-0" />

                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: service.color }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 truncate">
                      {service.name}
                    </h4>
                    {!service.isActive && (
                      <span className="badge bg-gray-100 text-gray-500">Inaktiv</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDuration(service.duration)} · {formatPrice(service.price, service.priceType)}
                    {service.bufferBefore > 0 || service.bufferAfter > 0
                      ? ` · Puffer: ${service.bufferBefore}/${service.bufferAfter} Min.`
                      : ''}
                    {service.capacity > 1 ? ` · ${service.capacity} Plätze` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label="Bearbeiten"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label="Löschen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Noch keine Services angelegt.</p>
          <button onClick={handleCreate} className="btn-primary">
            Ersten Service erstellen
          </button>
        </div>
      )}

      {/* Service Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ServiceForm
            service={editingService}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
