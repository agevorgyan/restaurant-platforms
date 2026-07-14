# Value Objects & Validation Rules

In Domain-Driven Design (DDD), Value Objects describe characteristics or attributes of entities. They have no conceptual identity and are strictly immutable. Two Value Objects are considered equal if all their properties are identical.

## Core Value Objects & Validation

### Financials
- **Money**: Encapsulates an amount (integer in cents) and a Currency.
  - *Validation*: Amount must be an integer. Cannot mix currencies in arithmetic operations (e.g., adding USD to EUR throws an error).
- **Currency**: Represents an ISO 4217 currency code (e.g., `USD`, `EUR`).
  - *Validation*: Must strictly match the ISO 4217 registry (exactly 3 uppercase letters).
- **Price**: A specific implementation of Money representing the cost of a good.
  - *Validation*: Amount cannot be negative.
- **Tax**: Represents a tax rate applied to an amount.
  - *Validation*: Percentage must be between `0.0` and `100.0`. Type must be valid (e.g., `INCLUSIVE`, `EXCLUSIVE`).
- **Discount**: Represents a reduction in price (Fixed Amount or Percentage).
  - *Validation*: If Percentage, must be `0-100`. If Fixed Amount, cannot exceed the target Price.

### Communications & Identity
- **Email**: Represents an email address.
  - *Validation*: Must match a strict standard RFC 5322 regex. Automatically lowercased and trimmed upon instantiation.
- **Phone**: Represents a phone number.
  - *Validation*: Must conform to E.164 international format (e.g., `+14155552671`).

### Locations
- **Address**: Encapsulates Street, City, State/Province, Zip/Postal Code, and Country.
  - *Validation*: Country must be ISO 3166-1 alpha-2. Zip code format must match the Country's standard.
- **GeoLocation**: Represents physical coordinates.
  - *Validation*: Latitude must be between `-90.0` and `90.0`. Longitude must be between `-180.0` and `180.0`.

### Quantities & Metrics
- **Quantity**: Represents a measurable amount of a Product or Ingredient.
  - *Validation*: Cannot be negative. Must be an integer for discrete items (e.g., Burgers) but can be decimal for weights (e.g., 1.5 kg of Flour).
- **Percentage**: A ratio expressed as a fraction of 100.
  - *Validation*: Typically constrained between `0.0` and `100.0`, though scaling multipliers may exceed `100.0`.
- **Rating**: A customer feedback score.
  - *Validation*: Must be an integer (or specific fractional increment) strictly between `1` and `5`.

### Localization & Scheduling
- **Language**: An IETF BCP 47 language tag (e.g., `en-US`, `fr`).
  - *Validation*: Must match valid registry formats.
- **Working Hours**: Represents a weekly schedule of open/close time windows.
  - *Validation*: Close time must be strictly after Open time. Overlapping time slots on the same day are invalid. Time strings must be ISO 8601 `HH:mm` format.

### UI / Presentation
- **Theme**: Represents the active visual mode.
  - *Validation*: Must be an enum of `LIGHT`, `DARK`, or `SYSTEM`.
- **Color**: Represents a hex code or RGB value.
  - *Validation*: Hex strings must start with `#` followed by 3 or 6 valid hexadecimal characters.
