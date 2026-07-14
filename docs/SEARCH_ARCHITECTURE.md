# Search Component Architecture

The Search experience is a central discovery mechanism. It must be highly responsive, predictive, and accessible.

## Core Elements

- **Search Input**: A prominent text input, typically featuring a leading search icon (magnifying glass) and a trailing clear button (X) that appears when text is entered.
- **Voice Search Ready**: Includes a trailing microphone icon to trigger native or custom voice-to-text APIs.

## Predictive & Historical States

- **Recent Searches**: Displayed immediately upon focus (before typing). Stored locally (`localStorage` or equivalent) to provide quick resumption of previous intents. Includes options to clear individual terms or the entire history.
- **Popular Searches / Trending**: Displayed alongside or below recent searches to guide discovery when the user has no active query.
- **Suggestions (Autocomplete)**: As the user types, predictive text or exact entity matches (e.g., specific menu items) appear in a dropdown or overlaid list. Must support debounced API fetching.

## Feedback States

- **Loading**: A subtle inline spinner within the input field (replacing the search icon) or a skeleton loader in the suggestions dropdown while debounced queries are resolved.
- **Empty State**: A clear, friendly message ("No results found for '...'") accompanied by an illustration and suggested fallback actions (e.g., "Try popular categories").

## Accessibility (a11y) & Interaction

- **Focus Management**: The suggestions dropdown must be navigable via keyboard (`ArrowUp`, `ArrowDown`, `Enter`). Focus must return to the input if the dropdown is closed via `Escape`.
- **ARIA Attributes**:
  - `role="combobox"` for the input container.
  - `aria-expanded` and `aria-controls` linked to the suggestions listbox.
  - `aria-activedescendant` for keyboard navigation of suggestions.
  - `aria-live="polite"` to announce the number of results found.
- **Clear Button**: Must have a visually hidden `aria-label` (e.g., "Clear search").
