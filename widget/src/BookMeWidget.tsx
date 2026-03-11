/**
 * BookKing Embeddable Widget — Web Component
 *
 * Usage:
 *   <script src="https://your-domain.com/widget/book-me-widget.js"></script>
 *   <book-me-widget provider="your-slug" service="service-id" color="#2563eb"></book-me-widget>
 */

class BookMeWidget extends HTMLElement {
  private shadow: ShadowRoot;
  private iframe: HTMLIFrameElement | null = null;

  static get observedAttributes() {
    return ['provider', 'service', 'color', 'lang', 'height'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private getBaseUrl(): string {
    // Detect the origin from the script tag or use a default
    const scripts = document.querySelectorAll('script[src*="book-me-widget"]');
    if (scripts.length > 0) {
      const src = scripts[0]!.getAttribute('src') ?? '';
      try {
        const url = new URL(src, window.location.origin);
        return url.origin;
      } catch {
        // Fall through
      }
    }
    return window.location.origin;
  }

  private render() {
    const provider = this.getAttribute('provider') ?? '';
    const service = this.getAttribute('service') ?? '';
    const color = this.getAttribute('color') ?? '#2563eb';
    const lang = this.getAttribute('lang') ?? 'de';
    const height = this.getAttribute('height') ?? '700';

    const baseUrl = this.getBaseUrl();
    const params = new URLSearchParams();
    if (service) params.set('service', service);
    if (color) params.set('color', color);
    if (lang) params.set('lang', lang);
    params.set('embed', 'true');

    const bookingUrl = `${baseUrl}/book/${provider}?${params.toString()}`;

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          --widget-color: ${color};
        }

        .widget-container {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          background: #ffffff;
        }

        .widget-header {
          background: var(--widget-color);
          color: white;
          padding: 16px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .widget-header svg {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }

        iframe {
          width: 100%;
          height: ${height}px;
          border: none;
          display: block;
        }

        .widget-footer {
          background: #f9fafb;
          padding: 8px 16px;
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 11px;
          color: #9ca3af;
          border-top: 1px solid #f3f4f6;
        }

        .widget-footer a {
          color: #6b7280;
          text-decoration: none;
        }

        .widget-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 500px) {
          :host {
            max-width: 100%;
          }
          .widget-container {
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      </style>

      <div class="widget-container">
        <div class="widget-header">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Online Termin buchen
        </div>
        <iframe
          src="${bookingUrl}"
          title="Terminbuchung"
          loading="lazy"
          allow="payment"
        ></iframe>
        <div class="widget-footer">
          Powered by <a href="${baseUrl}" target="_blank" rel="noopener">BookKing</a>
        </div>
      </div>
    `;
  }
}

// Register the custom element
if (!customElements.get('book-me-widget')) {
  customElements.define('book-me-widget', BookMeWidget);
}

export { BookMeWidget };
