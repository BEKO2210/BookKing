import { useState, useMemo } from 'react';
import { Search, Download, Mail, Phone } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { formatDateShort, getInitials, stringToColor, getContrastColor, getTagLabel } from '@/lib/utils';
import { CustomerProfile } from './CustomerProfile';
import type { Customer } from '@/types';

export function CustomerList() {
  const { customers } = useCustomers();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone?.includes(q),
    );
  }, [customers, search]);

  const handleExportCSV = () => {
    const headers = ['Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Tags', 'Umsatz', 'Letzte Buchung'];
    const rows = customers.map((c) => [
      c.firstName,
      c.lastName,
      c.email,
      c.phone ?? '',
      c.tags.join(', '),
      c.totalSpent.toFixed(2),
      formatDateShort(c.lastBookingAt),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kunden-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (selectedCustomer) {
    return (
      <CustomerProfile
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kunden</h2>
          <p className="text-sm text-gray-500">{customers.length} Kunden</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Download size={16} />
          CSV Export
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          className="input-field pl-10"
          placeholder="Kunden suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customer list */}
      <div className="space-y-2">
        {filtered.map((customer) => {
          const initials = getInitials(customer.firstName, customer.lastName);
          const bgColor = stringToColor(customer.email);
          const textColor = getContrastColor(bgColor);

          return (
            <button
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className="card w-full p-4 text-left hover:border-primary-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 truncate">
                      {customer.firstName} {customer.lastName}
                    </h4>
                    {customer.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`badge text-[10px] ${
                          tag === 'vip'
                            ? 'bg-amber-50 text-amber-700'
                            : tag === 'stammkunde'
                              ? 'bg-green-50 text-green-700'
                              : tag === 'problematisch'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {getTagLabel(tag)}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1 truncate">
                      <Mail size={12} />
                      {customer.email}
                    </span>
                    {customer.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {customer.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {customer.totalSpent.toFixed(2)} €
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDateShort(customer.lastBookingAt)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          {search ? 'Keine Kunden gefunden.' : 'Noch keine Kunden.'}
        </div>
      )}
    </div>
  );
}
