import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, UserCheck, Clock, CheckCircle, Smartphone, Bell, Shield, CreditCard } from 'lucide-react';

export function HowItWorksPage() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Calendar,
      title: '1. Service auswählen',
      desc: 'Wählen Sie den gewünschten Service aus der Liste. Sie sehen sofort Preis, Dauer und eine kurze Beschreibung.',
      tip: 'Tipp: Jeder Service zeigt die geschätzte Dauer an, damit Sie besser planen können.',
    },
    {
      icon: UserCheck,
      title: '2. Mitarbeiter wählen',
      desc: 'Wählen Sie Ihren Wunsch-Mitarbeiter oder lassen Sie sich den nächsten freien Termin vorschlagen.',
      tip: 'Sie können auch „Kein Wunsch" auswählen — wir finden den besten verfügbaren Termin.',
    },
    {
      icon: Clock,
      title: '3. Termin & Uhrzeit',
      desc: 'Wählen Sie im Kalender Ihren Wunschtag. Es werden nur verfügbare Zeitslots angezeigt — kein Rätselraten.',
      tip: 'Grüne Slots = viel Auswahl. Graue Slots = bereits belegt.',
    },
    {
      icon: CheckCircle,
      title: '4. Daten eingeben & bestätigen',
      desc: 'Geben Sie Ihren Namen, E-Mail und Telefonnummer ein. Überprüfen Sie die Zusammenfassung und bestätigen Sie.',
      tip: 'Sie erhalten sofort eine Bestätigungs-E-Mail mit allen Details.',
    },
  ];

  const faqs = [
    {
      q: 'Kann ich meinen Termin ändern oder stornieren?',
      a: 'Ja! In Ihrer Bestätigungs-E-Mail finden Sie einen Link zum Ändern oder Stornieren. Bitte beachten Sie die Stornierungsfrist des Anbieters.',
    },
    {
      q: 'Muss ich ein Konto erstellen?',
      a: 'Nein. Sie können direkt buchen, ohne sich registrieren zu müssen. Ihre Daten werden nur für die Terminverwaltung verwendet.',
    },
    {
      q: 'Ist die Buchung verbindlich?',
      a: 'Ja, Ihre Buchung ist verbindlich. Sie erhalten eine Bestätigung per E-Mail. Bei Verhinderung stornieren Sie bitte rechtzeitig.',
    },
    {
      q: 'Welche Zahlungsmethoden gibt es?',
      a: 'Die Zahlung erfolgt in der Regel vor Ort. Manche Anbieter bieten Online-Anzahlung an — das wird Ihnen im Buchungsprozess angezeigt.',
    },
    {
      q: 'Was passiert bei einem No-Show?',
      a: 'Wenn Sie nicht erscheinen und nicht rechtzeitig absagen, kann der Anbieter eine No-Show-Gebühr erheben. Die genauen Konditionen finden Sie in der Buchungsbestätigung.',
    },
    {
      q: 'Kann ich die App auf meinem Handy installieren?',
      a: 'Ja! BookKing ist eine Progressive Web App (PWA). Tippen Sie auf „Zum Startbildschirm hinzufügen" in Ihrem Browser, und die App funktioniert wie eine echte Handy-App — sogar offline!',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            aria-label="Zurück"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold text-gray-900">So funktioniert's</h1>
        </div>
      </header>

      <main id="main-content" className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Online-Termin buchen — einfach erklärt
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Mit BookKing buchen Sie Termine in nur 4 einfachen Schritten.
            Kein Konto nötig, kein Anruf, keine Wartezeiten. Einfach online
            den passenden Termin finden und bestätigen.
          </p>
        </section>

        {/* Steps */}
        <section className="space-y-4">
          {steps.map((step) => (
            <div key={step.title} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <step.icon size={20} className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.desc}</p>
                  <p className="text-xs text-primary-600 bg-primary-50 rounded-lg px-3 py-2">
                    {step.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Extra Features */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Was Sie noch wissen sollten</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Bell, title: 'Erinnerungen', desc: 'Sie erhalten automatische Erinnerungen vor Ihrem Termin per E-Mail.' },
              { icon: Smartphone, title: 'Handy-App', desc: 'Installieren Sie BookKing auf Ihrem Handy — es funktioniert wie eine echte App.' },
              { icon: Shield, title: 'Datenschutz', desc: 'Ihre Daten sind sicher. Wir verwenden sie nur für die Terminverwaltung.' },
              { icon: CreditCard, title: 'Flexible Zahlung', desc: 'Zahlen Sie vor Ort oder nutzen Sie die optionale Online-Anzahlung.' },
            ].map((f) => (
              <div key={f.title} className="card p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-gray-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{f.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Häufige Fragen</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="card group">
                <summary className="p-4 cursor-pointer font-medium text-gray-900 text-sm flex items-center justify-between list-none">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2 shrink-0">
                    ▾
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-8">
          <button
            onClick={() => navigate('/book/demo-salon')}
            className="btn-primary px-8 py-3 text-base"
          >
            Jetzt Termin buchen
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Kostenlos &middot; Kein Konto nötig &middot; In unter 2 Minuten
          </p>
        </section>
      </main>
    </div>
  );
}
