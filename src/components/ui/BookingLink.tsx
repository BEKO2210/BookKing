import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useSettingsStore } from '@/store/settings-store';

export function BookingLink() {
  const provider = useSettingsStore((s) => s.provider);
  const [copied, setCopied] = useState(false);

  if (!provider) return null;

  const bookingUrl = `${window.location.origin}${window.location.pathname}#/book/${provider.bookingSlug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Buchungslink</h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={bookingUrl}
          className="input-field text-sm flex-1 bg-gray-50"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={handleCopy}
          className="btn-secondary flex items-center gap-1.5 shrink-0"
          aria-label="Link kopieren"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Kopiert!' : 'Kopieren'}
        </button>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary shrink-0"
          aria-label="Buchungsseite öffnen"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
