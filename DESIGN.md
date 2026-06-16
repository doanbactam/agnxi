<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: AIStack
description: Roadmap.sh for AI coding agents - Neo-Mirai Edition
colors:
  primary: "#d4af37" # Kinpaku Gold
  neutral-bg: "#010101" # Lacquer Ground
  neutral-fg: "#f5f5f5" # Clean White
  border: "oklch(60% 0.12 85 / 0.2)" # Gold hairline border
typography:
  display:
    fontFamily: "Alumni Sans Pinstripe, Alumni Sans, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 300
  body:
    fontFamily: "Albert Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
---

# Design System: AIStack (Neo-Mirai)

## 1. Overview

**Creative North Star: "Neo-Mirai Lacquer & Gold"**

The design is a cyber-minimalist, high-end dashboard layout inspired by Japanese precision. It places deep, solid black spaces (Lacquer Ground) against extremely thin, precise gold dividing lines (Gold Hairlines) and solid gold-leaf-colored action targets (Kinpaku Buttons).

**Key Characteristics:**
- Solid black ground (`#010101`) with no standard grey backgrounds.
- High-contrast typography featuring tall, thin sans-serif display headers.
- Ultra-fine 1px borders in semi-transparent gold/bronze.

## 2. Colors

### Primary
- **Kinpaku Gold** (#d4af37): Represents core action items, buttons, active highlights, and important selectors.

### Neutral
- **Lacquer Ground** (#010101): Deep, solid black background.
- **Clean White** (#f5f5f5): High contrast text for supreme legibility.
- **Gold Hairline** (oklch(60% 0.12 85 / 0.2)): Fine panels boundary lines.

### Named Rules
**The Kinpaku Rule.** Solid gold fill is reserved exclusively for the most critical active state or primary action button. Standard borders and inactive elements must remain thin, wireframe-like, and semi-transparent.

## 3. Typography

**Display Font:** Alumni Sans / Alumni Sans Pinstripe
**Body Font:** Albert Sans

### Hierarchy
- **Display** (300, 2.25rem, 1.1): Tall, thin display headers with slight letter tracking.
- **Headline** (500, 1.25rem, 1.2): Section headings.
- **Body** (400, 0.875rem, 1.5): Main reading text.
- **Label** (600, 0.75rem, 1.2): Uppercase metadata indicators.

## 4. Elevation

Flat by default. Depth is conveyed purely through absolute background contrast (`#010101` vs `#0b0b0b`) and fine gold rules.

### Named Rules
**The Flat Hairline Rule.** No box shadows or blurred layers are allowed. Panels are separated by 1px solid gold hairline borders.

## 5. Components

### Buttons
- **Kinpaku Active Button**: Solid gold fill, black text, rounded 4px.
- **Border Button**: 1px gold hairline border, black background, gold text on hover.

### Containers / Cards
- **Structure**: Sharp corners (rounded 4px), solid black fill, 1px gold hairline border.

## 6. Do's and Don'ts

### Do:
- **Do** use extremely fine, low-opacity gold borders (`oklch(60% 0.12 85 / 0.2)`) for panels.
- **Do** use tall, elegant sans-serif display headings for main screen sections.

### Don't:
- **Don't** use standard neon-purple or blue glow drop-shadows.
- **Don't** use soft grey backgrounds or card borders.
- **Don't** round corners beyond 6px (large border-radius breaks the precision feel).
