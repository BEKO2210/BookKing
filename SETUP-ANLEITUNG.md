# BookKing — Komplette Setup-Anleitung

> Schritt für Schritt: Von Null bis zur fertigen, funktionierenden Buchungs-App.

---

## Inhaltsverzeichnis

1. [Voraussetzungen](#1-voraussetzungen)
2. [Projekt lokal starten (Entwicklung)](#2-projekt-lokal-starten)
3. [Supabase einrichten (Datenbank & Backend)](#3-supabase-einrichten)
4. [Umgebungsvariablen konfigurieren (.env)](#4-umgebungsvariablen-konfigurieren)
5. [Supabase-Datenbank-Tabellen anlegen](#5-supabase-datenbank-tabellen-anlegen)
6. [Geschäftsdaten anpassen](#6-geschäftsdaten-anpassen)
7. [Zahlungen einrichten (Optional: Stripe / PayPal)](#7-zahlungen-einrichten)
8. [E-Mail-Benachrichtigungen einrichten](#8-e-mail-benachrichtigungen-einrichten)
9. [Push-Benachrichtigungen](#9-push-benachrichtigungen)
10. [App deployen (Online stellen)](#10-app-deployen)
11. [PWA installieren](#11-pwa-installieren)
12. [Eigene Domain verbinden](#12-eigene-domain-verbinden)
13. [Fehlerbehebung](#13-fehlerbehebung)

---

## 1. Voraussetzungen

Was Sie brauchen, bevor Sie anfangen:

| Was | Wo bekommen | Kostet? |
|-----|-------------|---------|
| **Node.js** (Version 18+) | [nodejs.org](https://nodejs.org) | Kostenlos |
| **npm** (kommt mit Node.js) | Automatisch mit Node.js | Kostenlos |
| **Git** | [git-scm.com](https://git-scm.com) | Kostenlos |
| **Code-Editor** | [VS Code](https://code.visualstudio.com) empfohlen | Kostenlos |
| **Supabase-Konto** | [supabase.com](https://supabase.com) | Kostenlos (Free Tier) |
| **GitHub-Konto** (optional, für Hosting) | [github.com](https://github.com) | Kostenlos |

### Version prüfen

Öffnen Sie ein Terminal und prüfen Sie:

```bash
node --version    # Sollte v18.x.x oder höher zeigen
npm --version     # Sollte 9.x.x oder höher zeigen
git --version     # Sollte git version 2.x.x zeigen
```

---

## 2. Projekt lokal starten

### 2.1 Repository klonen

```bash
git clone https://github.com/IHR-USERNAME/BookKing.git
cd BookKing
```

### 2.2 Abhängigkeiten installieren

```bash
npm install
```

> Das lädt alle benötigten Pakete herunter. Dauert ca. 1-2 Minuten.

### 2.3 Entwicklungsserver starten

```bash
npm run dev
```

> Die App läuft jetzt unter `http://localhost:5173/BookKing/`
> Im Demo-Modus funktioniert alles lokal — keine Datenbank nötig.

### 2.4 Produktions-Build erstellen

```bash
npm run build
```

> Erstellt einen optimierten Build im `dist/`-Ordner.

### 2.5 Build lokal testen

```bash
npm run preview
```

---

## 3. Supabase einrichten

Supabase ist Ihre Datenbank und Ihr Backend. Hier werden alle Buchungen, Kunden und Services gespeichert.

### 3.1 Konto erstellen

1. Gehen Sie zu **[supabase.com](https://supabase.com)**
2. Klicken Sie auf **"Start your project"**
3. Melden Sie sich mit **GitHub** an (empfohlen) oder erstellen Sie ein Konto mit E-Mail
4. Bestätigen Sie Ihre E-Mail-Adresse

### 3.2 Neues Projekt anlegen

1. Klicken Sie auf **"New Project"**
2. Füllen Sie aus:

| Feld | Was eintragen | Beispiel |
|------|---------------|----------|
| **Name** | Name Ihres Projekts | `bookking-mein-salon` |
| **Database Password** | Ein starkes Passwort (AUFSCHREIBEN!) | `MeinSuperSicheresPasswort123!` |
| **Region** | Wählen Sie die nächste Region | `EU West (Frankfurt)` empfohlen für DE |
| **Plan** | Free Tier reicht zum Start | `Free` |

3. Klicken Sie auf **"Create new project"**
4. Warten Sie 1-2 Minuten, bis das Projekt erstellt ist

### 3.3 API-Schlüssel finden

Nach der Erstellung:

1. Gehen Sie zu **Project Settings** (Zahnrad-Symbol links unten)
2. Klicken Sie auf **"API"** im Menü links
3. Sie sehen zwei wichtige Werte:

| Wert | Wo finden | Wofür |
|------|-----------|-------|
| **Project URL** | Unter "Project URL" | `VITE_SUPABASE_URL` |
| **anon public key** | Unter "Project API keys" → `anon` `public` | `VITE_SUPABASE_ANON_KEY` |

> **WICHTIG:** Den `anon public` Key verwenden, NICHT den `service_role` Key!
> Der `service_role` Key hat volle Admin-Rechte und darf NIEMALS im Frontend verwendet werden.

Die Werte sehen so aus:
- **URL:** `https://abcdefghij.supabase.co`
- **Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ...` (langer Text)

---

## 4. Umgebungsvariablen konfigurieren

### 4.1 .env-Datei erstellen

Erstellen Sie im Hauptverzeichnis des Projekts eine Datei namens `.env`:

```bash
cp .env.example .env
```

### 4.2 Werte eintragen

Öffnen Sie die `.env`-Datei und tragen Sie Ihre Supabase-Werte ein:

```env
# ═══════════════════════════════════════
# SUPABASE (Pflicht)
# ═══════════════════════════════════════

# Ihre Supabase-Projekt-URL
# Wo finden: supabase.com → Ihr Projekt → Settings → API → Project URL
VITE_SUPABASE_URL=https://IHRE-PROJEKT-ID.supabase.co

# Ihr öffentlicher API-Schlüssel (anon key)
# Wo finden: supabase.com → Ihr Projekt → Settings → API → Project API keys → anon public
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.IHR_KEY_HIER
```

> **Tipp:** Nach dem Ändern der `.env`-Datei müssen Sie den Dev-Server neu starten (`Ctrl+C`, dann `npm run dev`).

---

## 5. Supabase-Datenbank-Tabellen anlegen

### 5.1 SQL-Editor öffnen

1. In Supabase: Klicken Sie links auf **"SQL Editor"** (das Datenbank-Symbol)
2. Klicken Sie auf **"New query"**

### 5.2 Tabellen erstellen

Kopieren Sie das folgende SQL und führen Sie es aus (Klick auf **"Run"**):

```sql
-- ═══════════════════════════════════════
-- BookKing — Datenbank-Schema
-- ═══════════════════════════════════════

-- 1. PROVIDERS (Geschäftsinhaber / Ihr Account)
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'generisch',
  logo TEXT,
  booking_slug TEXT UNIQUE NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/Berlin',
  currency TEXT NOT NULL DEFAULT 'EUR',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. STAFF (Mitarbeiter)
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'staff',
  avatar TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  service_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SERVICES (Dienstleistungen)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 30,
  buffer_before INTEGER NOT NULL DEFAULT 0,
  buffer_after INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_type TEXT NOT NULL DEFAULT 'fixed',
  currency TEXT NOT NULL DEFAULT 'EUR',
  color TEXT NOT NULL DEFAULT '#3b82f6',
  category TEXT,
  capacity INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  staff_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. AVAILABILITY (Arbeitszeiten)
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  staff_id TEXT,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. BLOCKERS (Gesperrte Zeiten)
CREATE TABLE IF NOT EXISTS blockers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  staff_id TEXT,
  title TEXT NOT NULL DEFAULT 'Gesperrt',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  all_day BOOLEAN NOT NULL DEFAULT false,
  recurring TEXT
);

-- 6. BOOKINGS (Buchungen)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL,
  staff_id TEXT,
  customer_id TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  confirmation_token TEXT UNIQUE,
  payment_status TEXT DEFAULT 'unpaid',
  payment_id TEXT,
  cancellation_reason TEXT,
  source TEXT NOT NULL DEFAULT 'online',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. CUSTOMERS (Kunden)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  booking_count INTEGER NOT NULL DEFAULT 0,
  no_show_count INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(10,2) NOT NULL DEFAULT 0,
  last_booking_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. NOTIFICATIONS (E-Mail-Templates)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. WAITLIST (Warteliste)
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  preferred_date TEXT,
  preferred_time TEXT,
  status TEXT NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════
-- Indizes für schnelle Abfragen
-- ═══════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_provider ON customers(provider_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_availability_provider ON availability(provider_id);
CREATE INDEX IF NOT EXISTS idx_staff_provider ON staff(provider_id);
CREATE INDEX IF NOT EXISTS idx_blockers_provider ON blockers(provider_id);

-- ═══════════════════════════════════════
-- Row Level Security (RLS) — Datenschutz
-- ═══════════════════════════════════════

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Öffentliche Leseberechtigung für Buchungsseite
-- (Services und Availability müssen für Kunden lesbar sein)
CREATE POLICY "Services sind öffentlich lesbar"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Verfügbarkeiten sind öffentlich lesbar"
  ON availability FOR SELECT
  USING (is_active = true);

CREATE POLICY "Provider-Info ist öffentlich lesbar"
  ON providers FOR SELECT
  USING (true);

-- Buchungen dürfen von Kunden erstellt werden
CREATE POLICY "Kunden können Buchungen erstellen"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Kunden dürfen erstellt werden
CREATE POLICY "Kunden können sich registrieren"
  ON customers FOR INSERT
  WITH CHECK (true);

-- Warteliste darf von jedem erstellt werden
CREATE POLICY "Warteliste ist öffentlich"
  ON waitlist FOR INSERT
  WITH CHECK (true);
```

3. Klicken Sie auf **"Run"** — Alle Tabellen werden erstellt.

> **Hinweis:** Für eine produktive App sollten Sie die RLS-Policies noch verfeinern
> (z.B. mit Supabase Auth, damit Provider nur ihre eigenen Daten sehen).

---

## 6. Geschäftsdaten anpassen

### 6.1 Demo-Provider durch Ihre Daten ersetzen

Datei: `src/store/settings-store.ts`

Ändern Sie den `DEMO_PROVIDER` mit Ihren Daten:

```typescript
export const DEMO_PROVIDER: Provider = {
  id: 'demo-provider-001',           // Wird in Produktion durch Supabase ID ersetzt
  name: 'Ihr Name',                  // Ihr vollständiger Name
  email: 'ihre@email.de',            // Ihre E-Mail-Adresse
  businessName: 'Ihr Geschäftsname', // Z.B. "Salon Anna", "Praxis Dr. Weber"
  businessType: 'friseur',           // Optionen: 'friseur', 'coach', 'arztpraxis',
                                     //           'fitness', 'agentur', 'generisch'
  bookingSlug: 'ihr-slug',           // URL-Name (z.B. 'salon-anna')
                                     // → Buchungslink wird: /book/salon-anna
  timezone: 'Europe/Berlin',         // Ihre Zeitzone
  currency: 'EUR',                   // 'EUR', 'USD' oder 'CHF'
  settings: DEFAULT_PROVIDER_SETTINGS,
  createdAt: new Date().toISOString(),
};
```

### 6.2 Standard-Einstellungen anpassen

Datei: `src/store/settings-store.ts`

```typescript
export const DEFAULT_PROVIDER_SETTINGS: ProviderSettings = {
  minLeadTime: 2,              // Min. Vorlaufzeit in STUNDEN
                                // → "2" = Kunden müssen mind. 2h vorher buchen
  maxLeadTime: 30,             // Max. Vorlaufzeit in TAGEN
                                // → "30" = Kunden können max. 30 Tage voraus buchen
  cancellationWindow: 24,      // Stornierungsfrist in STUNDEN
                                // → "24" = Stornierung bis 24h vor Termin möglich
  noShowFee: undefined,        // No-Show-Gebühr in EUR (z.B. 25)
                                // → undefined = keine Gebühr
  depositPercent: undefined,   // Anzahlung in Prozent (z.B. 50)
                                // → undefined = keine Anzahlung
  reminderTimes: [1440, 120],  // Erinnerungen in MINUTEN vor dem Termin
                                // → 1440 = 1 Tag vorher, 120 = 2 Stunden vorher
  slotInterval: 30,            // Zeitslot-Intervall in MINUTEN
                                // → "30" = Termine alle 30 Min. (9:00, 9:30, 10:00...)
                                // → "15" = Termine alle 15 Min.
                                // → "60" = Termine jede Stunde
  locale: 'de',                // Sprache (de = Deutsch)
  colorScheme: 'service',      // Kalender-Farben: 'service' oder 'status'
};
```

### 6.3 Base-URL anpassen

Datei: `vite.config.ts`

```typescript
export default defineConfig({
  base: '/BookKing/',    // ← Ändern Sie das zu Ihrer gewünschten URL
                          //    '/' für Root-Domain
                          //    '/buchung/' für Subdirectory
  // ...
});
```

> **Wenn Sie eine eigene Domain nutzen:** Setzen Sie `base: '/'`

---

## 7. Zahlungen einrichten

### Option A: Ohne Zahlung (Standard)

Standardmäßig sind keine Zahlungen aktiviert. Kunden buchen und zahlen vor Ort.
**→ Sie müssen nichts tun.**

### Option B: Stripe einrichten

1. **Konto erstellen:** Gehen Sie zu [stripe.com](https://stripe.com) und erstellen Sie ein Konto
2. **Geschäftsdaten:** Füllen Sie Ihr Geschäftsprofil aus
3. **API-Key finden:**
   - Dashboard → Developers → API keys
   - Kopieren Sie den **Publishable key** (beginnt mit `pk_live_` oder `pk_test_`)

4. **In BookKing aktivieren:**

Datei: `src/lib/payment.ts` — Ändern Sie die Konfiguration:

```typescript
const config: PaymentConfig = {
  provider: 'stripe',                              // 'none' → 'stripe'
  stripePublishableKey: 'pk_live_IHR_KEY_HIER',   // Ihren Stripe Key eintragen
  currency: 'EUR',
  depositPercent: 50,                              // Optional: 50% Anzahlung
};
```

> **WICHTIG:** Für Stripe brauchen Sie auch ein Backend (Supabase Edge Function),
> das den Payment Intent erstellt. Die Funktionen in `payment.ts` sind vorbereitet
> aber loggen aktuell nur in die Konsole.

### Option C: PayPal einrichten

1. **Konto erstellen:** [developer.paypal.com](https://developer.paypal.com)
2. **App erstellen:** Dashboard → My Apps → Create App
3. **Client ID kopieren**

4. **In BookKing aktivieren:**

```typescript
const config: PaymentConfig = {
  provider: 'paypal',
  paypalClientId: 'IHRE_CLIENT_ID_HIER',
  currency: 'EUR',
};
```

---

## 8. E-Mail-Benachrichtigungen einrichten

BookKing hat fertige E-Mail-Templates für:
- Buchungsbestätigung
- Termin-Erinnerung
- Stornierungsbestätigung

### 8.1 E-Mail-Provider wählen

Empfohlene Dienste:

| Dienst | Free Tier | Anmeldung |
|--------|-----------|-----------|
| **Resend** | 3.000 E-Mails/Monat | [resend.com](https://resend.com) |
| **SendGrid** | 100 E-Mails/Tag | [sendgrid.com](https://sendgrid.com) |
| **Mailgun** | 5.000 E-Mails/Monat | [mailgun.com](https://mailgun.com) |

### 8.2 Supabase Edge Function erstellen

1. Installieren Sie die Supabase CLI:
```bash
npm install -g supabase
```

2. Initialisieren Sie Supabase lokal:
```bash
supabase init
```

3. Erstellen Sie eine Edge Function:
```bash
supabase functions new send-notification
```

4. Bearbeiten Sie `supabase/functions/send-notification/index.ts`:

```typescript
// Beispiel mit Resend
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { to, subject, html } = await req.json()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'BookKing <noreply@ihre-domain.de>',
      to: [to],
      subject,
      html,
    }),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

5. Setzen Sie den API-Key als Secret:
```bash
supabase secrets set RESEND_API_KEY=re_XXXXXXXX
```

6. Deployen Sie die Funktion:
```bash
supabase functions deploy send-notification
```

7. **In BookKing aktivieren** — Datei `src/lib/notifications.ts`:

Entkommentieren Sie in `sendNotification()`:
```typescript
export async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  // Diese Zeilen entkommentieren:
  const { error } = await supabase.functions.invoke('send-notification', {
    body: payload,
  });
  return !error;
}
```

---

## 9. Push-Benachrichtigungen

Push-Benachrichtigungen funktionieren **sofort** im Browser — ohne zusätzliche Einrichtung.

### So funktioniert es:

1. Beim ersten Besuch fragt die App: "Benachrichtigungen erlauben?"
2. Wenn der Nutzer "Erlauben" klickt → Push-Notifications sind aktiv
3. Bei jeder neuen Buchung oder Stornierung erscheint eine Benachrichtigung

### Einschränkungen:

- Funktioniert nur wenn die App **geöffnet** ist (oder als PWA installiert)
- Für Hintergrund-Push (wenn App geschlossen) bräuchten Sie Firebase Cloud Messaging
- iOS Safari unterstützt Web Push erst ab iOS 16.4+

---

## 10. App deployen

### Option A: GitHub Pages (Kostenlos, empfohlen)

1. **Repository auf GitHub pushen:**
```bash
git remote add origin https://github.com/IHR-USERNAME/BookKing.git
git push -u origin main
```

2. **GitHub Pages aktivieren:**
   - Repository → Settings → Pages
   - Source: **"GitHub Actions"** auswählen

3. **GitHub Action erstellen:**

Erstellen Sie die Datei `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - uses: actions/deploy-pages@v4
```

4. **Secrets hinzufügen:**
   - Repository → Settings → Secrets and variables → Actions
   - **New repository secret:**
     - Name: `VITE_SUPABASE_URL` → Wert: Ihre Supabase-URL
     - Name: `VITE_SUPABASE_ANON_KEY` → Wert: Ihr Supabase anon Key

5. **Pushen → Automatisch deployed!**
   - App läuft unter: `https://IHR-USERNAME.github.io/BookKing/`

### Option B: Vercel (Kostenlos, einfach)

1. Gehen Sie zu [vercel.com](https://vercel.com)
2. "Import Project" → GitHub Repository auswählen
3. **Environment Variables** hinzufügen:
   - `VITE_SUPABASE_URL` = Ihre URL
   - `VITE_SUPABASE_ANON_KEY` = Ihr Key
4. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - In `vite.config.ts`: `base: '/'` setzen (statt `/BookKing/`)
5. Deploy klicken → Fertig!

### Option C: Netlify (Kostenlos)

1. Gehen Sie zu [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. GitHub verbinden → Repository wählen
4. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Environment Variables** unter Site Settings → Environment hinzufügen
6. In `vite.config.ts`: `base: '/'` setzen
7. Deploy!

---

## 11. PWA installieren

BookKing ist eine Progressive Web App — sie kann wie eine echte App installiert werden.

### Auf dem Handy (Android):

1. Öffnen Sie die BookKing-URL in Chrome
2. Es erscheint ein Banner: "Zum Startbildschirm hinzufügen"
3. Tippen Sie auf "Installieren"
4. Die App erscheint auf Ihrem Homescreen

### Auf dem Handy (iPhone/iPad):

1. Öffnen Sie die BookKing-URL in Safari
2. Tippen Sie auf das **Teilen-Symbol** (Quadrat mit Pfeil nach oben)
3. Scrollen Sie nach unten und tippen Sie auf **"Zum Home-Bildschirm"**
4. Tippen Sie auf **"Hinzufügen"**

### Auf dem Desktop (Chrome):

1. Öffnen Sie die BookKing-URL
2. In der Adressleiste erscheint ein **Install-Symbol** (Monitor mit Pfeil)
3. Klicken Sie darauf → "Installieren"

---

## 12. Eigene Domain verbinden

### Bei Vercel:
1. Settings → Domains → "Add"
2. Domain eingeben (z.B. `buchung.mein-salon.de`)
3. DNS-Einträge bei Ihrem Domain-Provider setzen:
   - CNAME: `buchung` → `cname.vercel-dns.com`

### Bei Netlify:
1. Domain Management → Add custom domain
2. DNS-Einträge setzen

### Bei GitHub Pages:
1. Settings → Pages → Custom domain
2. CNAME-Datei im `public/`-Ordner erstellen
3. DNS-Einträge setzen

---

## 13. Fehlerbehebung

### "Die App zeigt nur Demo-Daten"

→ Das ist normal, solange keine `.env`-Datei mit Supabase-Werten vorhanden ist.
Die App fällt automatisch auf lokale Demo-Daten zurück.

### "Supabase-Verbindung schlägt fehl"

1. Prüfen Sie, ob `.env`-Werte korrekt sind (keine Leerzeichen, keine Anführungszeichen)
2. Prüfen Sie, ob das Supabase-Projekt läuft (supabase.com → Dashboard)
3. Prüfen Sie die Browser-Konsole (F12 → Console) für Fehlermeldungen

### "Build schlägt fehl"

```bash
# TypeScript-Fehler prüfen:
npm run typecheck

# Alles neu installieren:
rm -rf node_modules
npm install
npm run build
```

### "Push-Benachrichtigungen funktionieren nicht"

1. Prüfen Sie: Wurde die Berechtigung erteilt? (Browser-Einstellungen → Benachrichtigungen)
2. HTTPS ist erforderlich (funktioniert nicht auf `http://localhost`, außer `localhost` selbst)
3. iOS: Nur ab iOS 16.4+ und nur wenn als PWA installiert

### "Zahlungen funktionieren nicht"

→ Stripe/PayPal braucht ein Backend. Die Frontend-Funktionen sind Platzhalter.
Sie müssen eine Supabase Edge Function erstellen (siehe Abschnitt 7).

---

## Schnellstart-Checkliste

- [ ] Node.js installiert (`node --version`)
- [ ] `npm install` ausgeführt
- [ ] `npm run dev` funktioniert
- [ ] Supabase-Konto erstellt
- [ ] Supabase-Projekt angelegt
- [ ] `.env`-Datei mit URL und Key erstellt
- [ ] Datenbank-Tabellen mit SQL erstellt
- [ ] Geschäftsdaten in `settings-store.ts` angepasst
- [ ] `npm run build` erfolgreich
- [ ] App deployed (GitHub Pages / Vercel / Netlify)
- [ ] Buchungsseite getestet
- [ ] PWA auf Handy installiert

---

## Dateien-Übersicht: Was ist wo?

| Datei | Was wird dort eingestellt |
|-------|--------------------------|
| `.env` | Supabase URL + API Key |
| `vite.config.ts` | Base-URL, PWA-Einstellungen |
| `src/store/settings-store.ts` | Geschäftsname, Slug, Standard-Einstellungen |
| `src/lib/payment.ts` | Zahlungs-Provider (Stripe/PayPal) |
| `src/lib/notifications.ts` | E-Mail-Versand aktivieren |
| `src/lib/email-templates.ts` | E-Mail-Texte anpassen |
| `index.html` | Meta-Tags, Seitentitel, Beschreibung |

---

*Erstellt für BookKing v1.0.0 — Stand: März 2026*
