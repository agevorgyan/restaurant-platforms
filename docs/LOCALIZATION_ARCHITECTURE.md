# Localization Architecture (i18n & l10n)

The Localization Architecture ensures the platform is globally accessible, supporting diverse languages, regional formats, and operational contexts (e.g., a Spanish-speaking customer ordering from an English-speaking restaurant).

## Core Concepts

- **Languages & Translation Keys**: Hardcoded UI text is strictly forbidden. All copy uses nested translation keys (e.g., `checkout.button.submit`).
- **Fallback Strategy**: If a translation key is missing in the requested language, the system gracefully falls back to the default language (English). If missing there, it displays the raw key as a last resort.
- **Pluralization**: Full support for complex ICU message formats, handling languages with multiple plural forms (zero, one, two, few, many, other).
- **RTL Ready**: The UI framework and CSS (Tailwind) are configured to support Right-to-Left (RTL) languages (e.g., Arabic, Hebrew) dynamically based on the active locale.

## Regional Formatting

- **Currencies**: Money is stored as integers (cents) in the database but formatted on the client based on the active locale and the Restaurant's official currency (e.g., €1.234,56 vs $1,234.56).
- **Time Zones**: All backend timestamps are strictly UTC. They are converted to the Restaurant's local timezone for operational reports, or the Customer's device timezone for delivery tracking.
- **Date Formats**: Dates are formatted according to the locale's standard (e.g., DD/MM/YYYY vs MM/DD/YYYY).

## Contextual Languages

- **Restaurant Languages**: The default language set by the tenant for their staff, kitchen displays (KDS), and administrative dashboards.
- **Customer Languages**: The language preference negotiated via the customer's browser (`Accept-Language` header), profile settings, or manual language switcher. Customer-facing menus and receipts are translated accordingly, while kitchen tickets remain in the Restaurant's language.
