# BookKing — Termine buchen. Kunden begeistern. Einfach.

Production-ready PWA booking system — a Calendly-killer as a white-label Progressive Web App.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + Vite 6 |
| Language | TypeScript 5.7 strict |
| Styling | Tailwind CSS v4 + shadcn-inspired components |
| State | Zustand v5 (client) + TanStack Query v5 (server) |
| Database | Supabase (primary) + Dexie.js (offline cache) |
| Calendar | date-fns v3 + custom slot engine |
| Animations | Framer Motion |
| Charts | Recharts |
| PWA | vite-plugin-pwa (Workbox 7) |
| Deployment | Vercel / Cloudflare Pages / Netlify |

## Features

- **Public Booking Page** — Mobile-optimized 4-step booking flow
- **Service Management** — Services, categories, addons, buffer times, capacity
- **Calendar Views** — Day/Week/Month with drag & drop
- **Customer CRM** — Contact management, tags, notes, booking history
- **Analytics Dashboard** — KPIs, revenue charts, occupancy, popular times heatmap
- **Notifications** — Push notifications + email templates
- **Embeddable Widget** — Web Component for any website
- **PWA** — Installable, offline-capable for providers
- **iCal Sync** — Export bookings to Google Calendar / Apple Calendar
- **Payment Ready** — Stripe + PayPal integration prepared
- **Multi-language** — German (default), extensible

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build

# Build widget
npm run build:widget
```

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

Create the following tables in your Supabase project:

```sql
-- Providers
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'generisch',
  logo TEXT,
  booking_slug TEXT UNIQUE NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/Berlin',
  currency TEXT NOT NULL DEFAULT 'EUR',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 60,
  buffer_before INTEGER NOT NULL DEFAULT 0,
  buffer_after INTEGER NOT NULL DEFAULT 0,
  price NUMERIC NOT NULL DEFAULT 0,
  price_type TEXT NOT NULL DEFAULT 'fixed',
  capacity INTEGER NOT NULL DEFAULT 1,
  category TEXT,
  addons JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#3b82f6'
);

-- Availability
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  staff_id UUID,
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL DEFAULT '09:00',
  end_time TEXT NOT NULL DEFAULT '18:00',
  breaks JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Blockers
CREATE TABLE blockers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  staff_id UUID,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  reason TEXT,
  is_all_day BOOLEAN NOT NULL DEFAULT false
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  staff_id UUID,
  customer_id UUID REFERENCES customers(id),
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  addons JSONB NOT NULL DEFAULT '[]',
  total_price NUMERIC NOT NULL DEFAULT 0,
  deposit_paid NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  confirmation_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tags JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  no_show_count INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  first_booking_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_booking_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Staff Members
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  specialties JSONB NOT NULL DEFAULT '[]',
  service_ids JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Row Level Security (enable for production)
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
```

## Widget Integration

### Web Component (recommended)

```html
<script src="https://your-domain.com/widget/book-me-widget.js" defer></script>
<book-me-widget
  provider="your-slug"
  color="#2563eb"
  lang="de"
  height="700"
></book-me-widget>
```

### iframe Fallback

```html
<iframe
  src="https://your-domain.com/book/your-slug?embed=true"
  width="100%"
  height="700"
  style="border: none; max-width: 480px;"
  title="Terminbuchung"
></iframe>
```

## Project Structure

```
src/
├── components/
│   ├── booking/        # Public booking flow (ServiceSelector, DatePicker, etc.)
│   ├── calendar/       # Provider calendar (Day/Week/Month views)
│   ├── services/       # Service management
│   ├── customers/      # Customer CRM
│   ├── dashboard/      # Analytics & KPIs
│   ├── notifications/  # Email templates & notification settings
│   └── ui/             # Shared UI (Sidebar, BottomNav)
├── hooks/              # Custom React hooks
├── lib/                # Core utilities (slot-engine, ical, email, holidays)
├── store/              # Zustand stores
├── types/              # TypeScript types
└── pages/              # Route pages
```

## Slot Engine Algorithm

The core booking availability algorithm in `src/lib/slot-engine.ts`:

1. Load availability rules for the day of week
2. Generate all possible start times at configured intervals
3. Filter out: outside working hours, breaks, blockers, overlapping bookings + buffers, insufficient lead time
4. Check capacity for group bookings
5. Return array of `{ time, staffId, spotsLeft }`

## License

Private — All rights reserved.
