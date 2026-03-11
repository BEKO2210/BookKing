# BookKing — Inhalte anpassen

Diese Datei zeigt dir, **wo du was ändern musst**, um BookKing an dein Geschäft anzupassen.

---

## 1. Geschäftsdaten (Name, Slug, Typ)

**Datei:** `src/store/settings-store.ts` — Zeile 82-93

```ts
export const DEMO_PROVIDER: Provider = {
  id: 'demo-provider-001',          // ← Eindeutige ID (z.B. UUID)
  name: 'Max Mustermann',           // ← Dein Name
  email: 'max@bookking.demo',       // ← Deine E-Mail
  businessName: 'BookKing Demo Salon', // ← Geschäftsname
  businessType: 'friseur',          // ← Branche
  bookingSlug: 'demo-salon',        // ← URL-Slug für Buchungsseite (/book/SLUG)
  timezone: ...,                     // ← Wird automatisch erkannt
  currency: 'EUR',                  // ← Währung
  settings: DEFAULT_PROVIDER_SETTINGS,
};
```

**Buchungsregeln** (gleiche Datei, Zeile 67-77):
```ts
export const DEFAULT_PROVIDER_SETTINGS: ProviderSettings = {
  minLeadTime: 2,        // ← Min. Stunden Vorlaufzeit
  maxLeadTime: 30,       // ← Max. Tage im Voraus buchbar
  cancellationWindow: 24, // ← Stornierungsfrist (Stunden)
  slotInterval: 30,      // ← Zeitraster (15/30/60 Min.)
  depositPercent: undefined, // ← Anzahlung in % (z.B. 20)
  noShowFee: undefined,     // ← No-Show Gebühr in € (z.B. 15)
};
```

---

## 2. Services (Dienstleistungen)

**Datei:** `src/lib/demo-data.ts` — Zeile 22-115

Jeder Service hat:
```ts
{
  id: 'svc-1',                   // ← Eindeutige ID
  name: 'Haarschnitt Damen',     // ← Service-Name
  description: 'Waschen, ...',   // ← Beschreibung
  duration: 45,                  // ← Dauer in Minuten
  bufferBefore: 0,               // ← Puffer VOR dem Termin (Min.)
  bufferAfter: 15,               // ← Puffer NACH dem Termin (Min.)
  price: 42,                     // ← Preis in €
  priceType: 'fixed',            // ← 'fixed' | 'from' | 'free'
  category: 'Haarschnitte',      // ← Kategorie (Gruppierung)
  color: '#3b82f6',              // ← Farbe im Kalender
  addons: [                      // ← Zusatzleistungen
    { id: 'addon-1', name: 'Kopfmassage', duration: 10, price: 8 },
  ],
}
```

**Aktuell vorhanden (5 Services):**
| Service | Dauer | Preis | Kategorie |
|---------|-------|-------|-----------|
| Haarschnitt Damen | 45 Min. | 42 € | Haarschnitte |
| Haarschnitt Herren | 30 Min. | 28 € | Haarschnitte |
| Färben & Strähnchen | 120 Min. | ab 89 € | Färben |
| Braut-Styling | 90 Min. | 120 € | Styling |
| Kinderhaarschnitt | 25 Min. | 18 € | Haarschnitte |

---

## 3. Mitarbeiter (Staff)

**Datei:** `src/lib/demo-data.ts` — Zeile 119-147

```ts
{
  id: 'staff-1',
  name: 'Maria Schmidt',           // ← Name
  email: 'maria@demo-salon.de',    // ← E-Mail
  specialties: ['Färben', 'Balayage'], // ← Spezialgebiete (wird angezeigt)
  serviceIds: ['svc-1', 'svc-3'],  // ← Welche Services kann sie? ([] = alle)
  isActive: true,
}
```

**Aktuell vorhanden (3 Mitarbeiter):**
| Name | Spezialgebiete | Services |
|------|---------------|----------|
| Maria Schmidt | Färben, Balayage, Braut-Styling | svc-1, svc-3, svc-4 |
| Thomas Weber | Herrenschnitte, Bartpflege | svc-2, svc-5 |
| Lisa Hoffmann | Styling, Hochsteckfrisuren | svc-1, svc-4, svc-5 |

---

## 4. Arbeitszeiten (Availability)

**Datei:** `src/lib/demo-data.ts` — Zeile 151-172

```ts
{
  dayOfWeek: 1,          // ← 0=So, 1=Mo, 2=Di, ..., 6=Sa
  startTime: '09:00',    // ← Öffnungszeit
  endTime: '18:00',      // ← Schließzeit
  breaks: [              // ← Pausen
    { start: '12:00', end: '13:00' },
  ],
  isActive: true,        // ← Tag aktiv?
}
```

**Aktuell:** Mo-Fr 9:00-18:00 (Pause 12-13), Sa 9:00-14:00, So geschlossen

---

## 5. Kunden (Demo-Daten)

**Datei:** `src/lib/demo-data.ts` — Zeile 176-242

```ts
{
  firstName: 'Anna',
  lastName: 'Müller',
  email: 'anna.mueller@example.de',
  phone: '+49 170 1234567',
  tags: ['stammkunde', 'vip'],    // ← Tags für CRM
  notes: 'Bevorzugt morgens...',  // ← Kundennotizen
  totalSpent: 486,                // ← Bisheriger Umsatz
}
```

---

## 6. Landing Page

**Datei:** `src/pages/LandingPage.tsx`

### 6.1 Navbar & Logo (Zeile ~60-110)
- Logo-Text: Suche nach `BookKing` im Navbar-Bereich
- Navigations-Links: `#features`, `#demo`, `#pricing`

### 6.2 Hero Section (Zeile ~115-210)
- **Headline:** `"Nie wieder Terminchaos."` — Zeile ~150
- **Subline:** `"BookKing ist das intelligente..."` — Zeile ~160
- **CTA Buttons:** "Live Demo Testen" → `/book/demo-salon`, "Kostenlos Starten" → `/dashboard`
- **Badge:** `"Neu: Jetzt mit KI-Terminvorschlägen"` — Zeile ~140

### 6.3 Logo Cloud / Trusted-by (Zeile ~220-280)
- `"Bereits 2.000+ Unternehmen..."` — Zeile ~230
- Firmen-Logos: Aktuell Text-Logos (z.B. "HairArt Studio") — Zeile ~240

### 6.4 Features (Zeile ~290-470)
9 Features mit Icon, Titel, Beschreibung. Suche nach `const features = [` um sie zu ändern.

### 6.5 Booking Flow Demo (Zeile ~480-660)
4-Schritte-Visualisierung des Buchungsprozesses.

### 6.6 Statistiken (Zeile ~700-810)
```
-73% No-Shows | +45% Online-Buchungen | 2.3h Zeitersparnis/Tag | 98.7% Zufriedenheit
```

### 6.7 Preise / Pricing (Zeile ~820-980)
3 Tarife: Starter (0€), Professional (29€), Business (79€)
Suche nach `const plans = [` um Preise und Features zu ändern.

### 6.8 Testimonials (Zeile ~990-1050)
3 Kundenstimmen. Suche nach `const testimonials = [`.

### 6.9 Footer (Zeile ~1090-1130)
Links und Copyright-Text.

---

## 7. E-Mail-Templates

**Datei:** `src/components/notifications/EmailTemplateEditor.tsx`

4 Templates:
- **Buchungsbestätigung** — Zeile 71
- **Terminerinnerung** — Zeile 72
- **Stornierung** — Zeile 73
- **Warteliste** — Zeile 74

Template-Variablen: `{{kundenname}}`, `{{service}}`, `{{datum}}`, `{{uhrzeit}}`, `{{preis}}`, `{{manage_url}}`

Standard-Text (Zeile 111):
```
Hallo {{kundenname}},
Ihr Termin wurde bestätigt!
Service: {{service}}
Datum: {{datum}}
...
```

---

## 8. Benachrichtigungen

**Datei:** `src/components/notifications/NotificationSettings.tsx`

Einstellungen für:
- Push-Benachrichtigungen (Browser)
- E-Mail bei neuer Buchung
- E-Mail bei Stornierung
- Erinnerungszeit (12h, 24h, 48h vorher)

---

## 9. Supabase (Produktiv-Datenbank)

**Datei:** `src/lib/db.ts`

Für den Produktivbetrieb brauchst du eine Supabase-Instanz:

1. Erstelle ein Projekt auf [supabase.com](https://supabase.com)
2. Erstelle eine `.env`-Datei im Projektroot:
```env
VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...DEIN-KEY
```
3. Erstelle folgende Tabellen in Supabase:
   - `services` — Dienstleistungen
   - `staff_members` — Mitarbeiter
   - `availability` — Arbeitszeiten
   - `bookings` — Buchungen
   - `customers` — Kunden
   - `blockers` — Blocker/Urlaub

Solange keine `.env` gesetzt ist, läuft BookKing im **Demo-Modus** mit den Daten aus `src/lib/demo-data.ts`.

---

## 10. PWA / App-Icon / Name

**Datei:** `vite.config.ts` — VitePWA Plugin

```ts
VitePWA({
  manifest: {
    name: 'BookKing',           // ← App-Name
    short_name: 'BookKing',     // ← Kurzname
    description: '...',         // ← Beschreibung
    theme_color: '#2563eb',     // ← Theme-Farbe
    background_color: '#f8fafc',
    icons: [...]                // ← App-Icons (192x192, 512x512)
  },
})
```

---

## 11. Farben / Design

**Datei:** `src/index.css` — Zeile 3-20 (`@theme` Block)

```css
@theme {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;    /* ← Hauptfarbe */
  --color-primary-700: #1d4ed8;
}
```

Ändere die `primary`-Farben, um das gesamte Design anzupassen.

---

## 12. GitHub Pages Deployment

**Datei:** `.github/workflows/deploy.yml`

Das Deployment läuft automatisch bei Push auf `main` oder `claude/pwa-booking-system-d0dgj`.

**URL-Basis:** `vite.config.ts` → `base: '/BookKing/'`
Wenn dein Repo anders heißt, ändere den Wert entsprechend.

---

## Seitenübersicht (alle Routen)

| Route | Seite | Beschreibung |
|-------|-------|-------------|
| `/` | LandingPage | Marketing-Startseite |
| `/book/:slug` | PublicBookingPage | Öffentliche Buchungsseite |
| `/dashboard` | Dashboard | Übersicht (Heute, Statistiken) |
| `/calendar` | CalendarPage | Kalender (Tag/Woche/Monat) |
| `/services` | ServicesPage | Services verwalten |
| `/customers` | CustomersPage | Kundenliste + Profil |
| `/analytics` | AnalyticsPage | Statistiken & Diagramme |
| `/settings` | SettingsPage | Einstellungen (4 Tabs) |

### Settings-Tabs:
| Tab | Inhalt |
|-----|--------|
| Allgemein | Geschäftsdaten, Buchungsregeln, Zahlung |
| Arbeitszeiten | Öffnungszeiten, Pausen pro Wochentag |
| Benachrichtigungen | Push & E-Mail Einstellungen |
| E-Mail-Templates | Vorlagen bearbeiten & Vorschau |
