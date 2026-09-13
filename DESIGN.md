---
name: AIStack
description: A quiet technical field guide for choosing AI coding stacks
north: "Explain the system. Remove the rest."
references:
  - "Making Software — mechanism-first technical storytelling"
  - "Topfeed — scan-first density and minimal copy"
  - "Apple HIG — clarity, deference, depth"
---

# Design

AIStack should feel like a precise technical field guide—not a SaaS dashboard.

The interface explains relationships, supports a decision, and gets out of the way.

## North

**Explain the system. Remove the rest.**

Three tests govern every screen:

1. Can the user identify the next action in one glance?
2. Can the user understand why the recommendation works?
3. Can anything be removed without harming either answer?

If yes to the third question, remove it.

## Principles

### Clarity

- Give every screen one purpose and one primary action.
- Lead with the answer; reveal evidence on demand.
- Use familiar controls and literal labels.
- Pair every recommendation with one short reason.
- Keep current state, compatibility, and next step visible.

### Deference

- Content leads; chrome stays quiet.
- Use typography, alignment, and whitespace before containers.
- Reserve color for actions, focus, state, and diagram emphasis.
- Never decorate empty space merely to make a page feel complete.

### Depth

- Use progressive disclosure, not visual effects, to create depth.
- Keep the primary path on the surface; place technical detail one step away.
- Preserve spatial context when content expands or changes.
- Elevation is only for temporary surfaces such as menus and dialogs.

### Mechanism first

Borrow the explanatory rhythm of Making Software:

```text
Question → Short answer → Diagram → Action
```

- Every diagram answers one question.
- Label parts directly.
- Highlight one relationship at a time.
- Use figures to replace prose, never to decorate it.
- Number durable explanatory figures as `FIG_001`, `FIG_002`, and so on.

### Scan first

Borrow Topfeed's restraint:

- Prefer lists and rows over card grids.
- Keep titles dominant and metadata quiet.
- Show only information needed to choose.
- Use a consistent reading direction.
- Avoid intros, feature marketing, and repeated category labels.

## Visual language

### Color

The default theme is light and neutral.

| Token | Value | Use |
|---|---:|---|
| `--canvas` | `#F7F7F4` | Page background |
| `--surface` | `#FFFFFF` | Inputs and temporary surfaces |
| `--ink` | `#141414` | Primary text and diagrams |
| `--ink-muted` | `#686868` | Secondary metadata |
| `--line` | `#D8D8D2` | Rules and boundaries |
| `--accent` | `#155EEF` | Links, focus, selected state |
| `--success` | `#18794E` | Verified and successful state |
| `--warning` | `#9A6700` | Stale or uncertain state |
| `--danger` | `#B42318` | Failure and destructive state |

Rules:

- Keep the page monochrome until meaning requires color.
- Use one accent per view.
- Never use gradients, glow, glass, or decorative gold.
- Do not rely on color alone.
- Dark mode is neutral black and gray; it is not a separate brand expression.

### Typography

Use two roles only:

- **Sans:** system UI stack for interface and reading.
- **Mono:** code, commands, versions, dates, and figure labels.

| Role | Size | Line height | Weight |
|---|---:|---:|---:|
| Display | `clamp(2.5rem, 7vw, 5.5rem)` | `0.96` | `600` |
| Title | `2rem` | `1.1` | `600` |
| Heading | `1.25rem` | `1.25` | `600` |
| Body | `1rem` | `1.55` | `400` |
| Meta | `0.75rem` | `1.35` | `500` |
| Code | `0.875rem` | `1.5` | `400` |

- Keep reading lines between `45ch` and `72ch`.
- Use sentence case.
- Avoid thin display faces and tracked uppercase sentences.
- Use tabular numerals for changing values.
- Create hierarchy with size and space before weight or color.

### Spacing

Base unit: `4px`.

Preferred scale: `4, 8, 12, 16, 24, 32, 48, 72, 96`.

- Let major sections breathe.
- Keep related label-value pairs close.
- Use one-pixel rules only when spacing cannot show the grouping.
- Reflow before shrinking.

### Shape and elevation

- Default radius: `6px`.
- Controls may use `8px`; pills are reserved for filters and statuses.
- Avoid nested rounded containers.
- No shadow on persistent content.
- Menus, popovers, and dialogs use one subtle shadow token.

## Layout

### Shell

- Maximum width: `1200px`.
- Reading width: `720px`.
- Explanatory diagrams may extend to the shell width.
- Use a quiet header with product name, search, and at most two global actions.
- Footer contains only source, contribution, and legal links.

### Home

Order:

1. One-line promise.
2. Intent search or task picker.
3. Recommended paths.
4. Compact catalog index.

Remove marketing sections that do not help users choose a stack.

### Catalog

Use a dense row, not a promotional card.

Each row shows:

- Name.
- One-line purpose.
- Compatibility.
- Freshness.
- One meaningful differentiator.

Search and task filters stay visible. Counts are metadata, not feature cards. Emojis are not category icons.

### Detail

Order:

1. Name and one-line verdict.
2. Best for / avoid when.
3. Primary install command.
4. Compatibility.
5. System diagram.
6. Alternatives and trade-offs.
7. Sources, freshness, and full notes.

Do not repeat title, category, rating, and purpose across multiple boxes.

### Setup path

Replace the decorative alternating timeline with a compact ordered sequence:

```text
01 Install agent
02 Select model
03 Add required MCPs
04 Add skills
05 Verify setup
```

Each step has one action, one command, and one completion state. Dependencies appear as connecting rules, not oversized nodes.

## Components

### Button

- One filled primary button per region.
- Secondary actions use text or a quiet outline.
- Height: `40px` minimum; touch target: `44 × 44px` minimum.
- Labels state the outcome: `Copy command`, `Use this stack`, `View source`.

### Link

- Links are identifiable without hover.
- External links include a quiet external indicator.
- Do not use button styling for navigation links.

### Search

- Search accepts products, tasks, and capabilities.
- Placeholder uses a real example: `Try “review a large TypeScript repo”`.
- Results update without moving the input.
- `Esc` clears; `/` focuses when it does not conflict with typing.

### Resource row

Default content density:

```text
Name                  Purpose                 Works with       Updated
Context7              Current library docs    Claude, Codex    3d
```

On small screens, preserve name, purpose, and primary status; move the rest into the detail view.

### Command

- Use a neutral code surface.
- Keep the complete command selectable.
- Put `Copy` at the end of the line.
- Confirm with `Copied`; do not use a toast for this local action.
- Never display fabricated install commands or placeholder secrets as production guidance.

### Status

Use literal states: `Verified`, `Community`, `Stale`, `Experimental`, `Incompatible`.

A star rating is not a substitute for evidence or a use-case recommendation.

### Diagram

- One visual grammar: `2px` lines, simple geometry, direct labels, no 3D.
- Default to black, gray, and one accent.
- Use solid lines for required relationships; dashed lines for optional ones.
- Provide an equivalent text sequence for assistive technology.
- On mobile, stack or scroll with clear affordance; never shrink labels below readable size.

## Motion

Motion explains change or confirms action.

- Common feedback: `120–180ms`.
- Layout transitions: `180–250ms`.
- Animate opacity and transform where possible.
- No autoplay loops, parallax, bounce, hover lift, or ornamental reveals.
- Respect `prefers-reduced-motion` with equivalent instant feedback.

## Content

- Interface language should be consistent within a view.
- Start with the user's goal, not the product taxonomy.
- Keep descriptions to one sentence in indexes.
- Prefer `Best for codebase-wide maintenance` over `Powerful AI solution`.
- Replace `Learn more` with the destination or action.
- Do not use `premium`, `revolutionary`, `ultimate`, or fake technical labels.
- If the same idea appears twice, keep the clearer instance.

## Accessibility

- Meet WCAG 2.2 AA.
- Full keyboard navigation and visible `:focus-visible` states.
- Semantic headings, lists, tables, and controls.
- Support 200% zoom without horizontal page overflow.
- Preserve meaning in reduced motion and high contrast.
- Announce copy, loading, error, and filtering changes appropriately.
- Design loading, empty, error, offline, and stale states for every data view.

## Responsive behavior

- Mobile: single reading column, persistent primary action when useful.
- Tablet: allow two columns only when reading order remains obvious.
- Desktop: use width for comparison and diagrams, not longer lines.
- Do not hide required actions behind hover.
- Test at `320`, `375`, `768`, `1024`, and `1440px`.

## Cut list

Remove:

- Gold lacquer branding.
- Dashboard-like stat cards.
- Emoji category labels.
- Decorative badges and pseudo-specification labels.
- Oversized rounded cards and nested panels.
- Shadows on catalog items.
- Hover translation and scale effects.
- Background gradients and ornamental spine graphics.
- Duplicate copy and metadata.
- Any figure, section, or animation without a written reason.

## Review checklist

Before shipping a screen:

- [ ] The primary action is obvious.
- [ ] The recommendation includes a reason.
- [ ] The page works as a linear reading flow.
- [ ] Essential setup information is copy-ready.
- [ ] Diagrams explain one mechanism each.
- [ ] Color and motion carry meaning.
- [ ] Keyboard, focus, zoom, contrast, and reduced motion pass.
- [ ] Mobile preserves priority and reading order.
- [ ] Every visible element earns attention.
