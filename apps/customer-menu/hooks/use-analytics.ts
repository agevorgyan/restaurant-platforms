import { useCallback } from "react";

export interface AnalyticsEvent {
  event: string;
  timestamp: string;
  itemId?: string;
  itemName?: string;
  category?: string;
  value?: number;
}

/**
 * Custom hook for logging and tracking user actions.
 * Dispatches a custom event 'restaurant_analytics' for potential integration
 * with telemetry systems and records them in session storage for debug verification.
 */
export function useAnalytics() {
  const logEvent = useCallback((event: string, metadata: Omit<AnalyticsEvent, "event" | "timestamp"> = {}) => {
    if (typeof window === "undefined") return;

    const payload: AnalyticsEvent = {
      event,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    // Dispatch a standard custom event that external monitoring scripts can subscribe to
    const customEvent = new CustomEvent("restaurant_analytics", { detail: payload });
    window.dispatchEvent(customEvent);

    // Save to session storage for diagnostic audit checks
    try {
      const historyJson = sessionStorage.getItem("analytics_history");
      const history: AnalyticsEvent[] = historyJson ? JSON.parse(historyJson) : [];
      history.push(payload);
      // Cap history at 100 events
      if (history.length > 100) {
        history.shift();
      }
      sessionStorage.setItem("analytics_history", JSON.stringify(history));
    } catch {
      // Fail silently in environments with restricted session storage
    }
  }, []);

  return { logEvent };
}
