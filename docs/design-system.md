# FileSafe Design System

**Purpose:** A light, clean, iOS-inspired design system optimized for users aged 35-75+.

**Philosophy:**
- **Calm & Trustworthy:** Light backgrounds, subtle shadows, clear hierarchy
- **Highly Readable:** Large text, high contrast, generous spacing
- **Mobile-First:** Touch-friendly targets (min 44px), thumb-friendly layout
- **Accessible:** WCAG AAA contrast ratios, clear focus states

---

## Color Palette

### Light Theme (Primary)

```css
--bg-primary: #FFFFFF         /* Main background */
--bg-secondary: #F8FAFC       /* Secondary surfaces */
--bg-tertiary: #F1F5F9        /* Subtle cards/sections */

--text-primary: #0F172A       /* Main text - slate-900 */
--text-secondary: #475569     /* Secondary text - slate-600 */
--text-tertiary: #94A3B8      /* Tertiary/helper text - slate-400 */

--border-light: #E2E8F0       /* Light borders - slate-200 */
--border-medium: #CBD5E1      /* Medium borders - slate-300 */
--border-heavy: #94A3B8       /* Heavy borders - slate-400 */
```

### Accent Colors

```css
--blue-primary: #3B82F6       /* Primary CTA - blue-500 */
--blue-hover: #2563EB         /* Hover state - blue-600 */
--blue-active: #1D4ED8        /* Active state - blue-700 */
--blue-light: #DBEAFE         /* Light blue bg - blue-100 */
--blue-subtle: #EFF6FF        /* Subtle blue bg - blue-50 */

--red-error: #EF4444          /* Error/destructive - red-500 */
--red-light: #FEE2E2          /* Error bg - red-100 */

--amber-warning: #F59E0B      /* Warning - amber-500 */
--amber-light: #FEF3C7        /* Warning bg - amber-100 */

--green-success: #10B981      /* Success - emerald-500 */
--green-light: #D1FAE5        /* Success bg - emerald-100 */

--gray-subtle: #F8FAFC        /* Subtle backgrounds - slate-50 */
```

### Dark Theme (Legacy - being phased out)
Dark theme remains available for user preference but light is the new default.

---

## Typography Scale

Optimized for middle-to-older users with excellent readability.

```css
--font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text',
               'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;

/* Headings */
--text-4xl: 32px    /* Page titles - H1 */
--text-3xl: 28px    /* Section titles - H2 */
--text-2xl: 24px    /* Sub-sections - H3 */
--text-xl: 20px     /* Large emphasis */

/* Body */
--text-lg: 18px     /* Large body text */
--text-base: 17px   /* Standard body text (iOS standard) */
--text-sm: 15px     /* Small labels */
--text-xs: 13px     /* Captions, helper text */

/* Line heights */
--leading-tight: 1.25
--leading-snug: 1.375
--leading-normal: 1.5
--leading-relaxed: 1.625
--leading-loose: 2.0
```

**Font Weights:**
- Regular: 400 (body text)
- Medium: 500 (labels, subtle emphasis)
- Semibold: 600 (headings, buttons)
- Bold: 700 (page titles, strong emphasis)

---

## Spacing Scale

Based on 4px base unit for consistency.

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
```

**Vertical rhythm:**
- Between form fields: 20px (space-5)
- Between sections: 32px (space-8)
- Between major blocks: 48px (space-12)
- Page padding: 20-24px (space-5 to space-6)

---

## Border Radius

Soft, modern, iOS-inspired rounded corners.

```css
--radius-sm: 8px    /* Small elements (badges, chips) */
--radius-md: 12px   /* Medium elements (inputs, buttons) */
--radius-lg: 16px   /* Large elements (cards) */
--radius-xl: 20px   /* Extra large (modals, dialogs) */
--radius-full: 9999px /* Pills, circular avatars */
```

---

## Shadows

Subtle, layered shadows for depth without heaviness.

```css
/* Card shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 2px 8px 0 rgb(0 0 0 / 0.08)
--shadow-lg: 0 4px 16px 0 rgb(0 0 0 / 0.10)

/* Focus/interaction shadows */
--shadow-focus: 0 0 0 4px rgba(59, 130, 246, 0.15)
```

---

## Button Variants

### Primary Button (Main CTAs)
- **Background:** Blue gradient or solid blue-500
- **Text:** White, semibold (600), 17px
- **Padding:** 14px vertical, 24px horizontal
- **Min-height:** 52px (easy tapping)
- **Border-radius:** 12px
- **Hover:** Darker blue (blue-600)
- **Active:** Scale 0.98, even darker (blue-700)

**Usage:** Save, Continue, Add Document, Verify

### Secondary Button (Less critical actions)
- **Background:** White with border (slate-300)
- **Text:** Slate-700, semibold (600), 17px
- **Padding:** 14px vertical, 24px horizontal
- **Min-height:** 52px
- **Border:** 1.5px solid slate-300
- **Border-radius:** 12px
- **Hover:** Light gray bg (slate-50)

**Usage:** Cancel, Back, Skip

### Tertiary/Ghost Button (Minimal actions)
- **Background:** Transparent
- **Text:** Blue-600, medium (500), 17px
- **Padding:** 12px vertical, 16px horizontal
- **Hover:** Light blue bg (blue-50)
- **Border-radius:** 8px

**Usage:** Links, less prominent actions

### Destructive Button (Dangerous actions)
- **Background:** Red-500
- **Text:** White, semibold (600), 17px
- **Padding:** 14px vertical, 24px horizontal
- **Min-height:** 52px
- **Border-radius:** 12px
- **Hover:** Darker red (red-600)

**Usage:** Delete, Factory Reset, Remove

---

## Card Styles

### Standard Card
- **Background:** White (#FFFFFF)
- **Border:** 1px solid slate-200
- **Border-radius:** 16px (radius-lg)
- **Shadow:** shadow-sm, hover to shadow-md
- **Padding:** 20px
- **Hover:** Subtle lift (translateY -2px), shadow increase

### List Card (Tighter spacing for lists)
- **Background:** White
- **Border:** 1px solid slate-200
- **Border-radius:** 12px (radius-md)
- **Padding:** 16px
- **Gap between cards:** 12px

### Alert/Warning Card
- **Background:** Amber-50 (light warning) or Red-50 (error)
- **Border:** 1.5px solid amber-200 or red-200
- **Border-radius:** 12px
- **Padding:** 16px
- **Icon:** Left-aligned warning/error icon

---

## Input Fields

### Text Input / Select / Textarea
- **Background:** White
- **Border:** 1.5px solid slate-300
- **Border-radius:** 12px (radius-md)
- **Padding:** 14px horizontal, 12px vertical
- **Min-height:** 52px (easy tapping)
- **Font-size:** 17px (iOS standard)
- **Text-color:** Slate-900
- **Placeholder-color:** Slate-400

**Focus state:**
- Border: Blue-500 (2px)
- Shadow: Blue focus ring (shadow-focus)

**Error state:**
- Border: Red-500
- Shadow: Red focus ring

**Disabled state:**
- Background: Slate-50
- Border: Slate-200
- Text: Slate-400

---

## Badge / Status Pills

### Badge Styles
- **Border-radius:** 8px (radius-sm) or 9999px (pills)
- **Padding:** 6px horizontal, 4px vertical
- **Font-size:** 13px (text-xs)
- **Font-weight:** 600 (semibold)
- **Text-transform:** None (natural case)

**Variants:**
- **Success (Valid):** Green-100 bg, green-700 text, green-300 border
- **Warning (Expiring Soon):** Amber-100 bg, amber-700 text, amber-300 border
- **Error (Expired):** Red-100 bg, red-700 text, red-300 border
- **Neutral:** Slate-100 bg, slate-700 text, slate-300 border

---

## Icon Usage

**Source:** Lucide React icons
**Size:** 20px (standard), 24px (large headers), 16px (inline with text)
**Color:** Match text color or use accent colors for emphasis

**Common icons:**
- Add: Plus
- Search: Search
- Settings: Settings
- Back: ChevronLeft
- Document: FileText
- Alert: AlertCircle
- Success: CheckCircle
- Warning: AlertTriangle

---

## Accessibility Requirements

### Contrast Ratios
- **Body text (17px):** Minimum 4.5:1, target 7:1 (WCAG AAA)
- **Large text (20px+):** Minimum 3:1, target 4.5:1
- **Interactive elements:** Minimum 3:1 for borders/icons

### Touch Targets
- **Minimum:** 44px × 44px (Apple HIG standard)
- **Preferred:** 48px × 48px or larger
- **Spacing between targets:** Minimum 8px

### Focus Indicators
- **Visible outline:** 2-3px solid, blue-500
- **Offset:** 2px from element
- **Focus ring:** Blue shadow for soft emphasis

---

## Layout Patterns

### Page Structure
```
┌─────────────────────────────┐
│ Header (sticky)              │ ← White bg, shadow-sm
│ - Back button + Title        │
│ - Optional actions           │
├─────────────────────────────┤
│                              │
│ Content Area                 │ ← Gray-50 bg or white
│ - 20-24px padding            │
│ - Max-width for readability  │
│                              │
└─────────────────────────────┘
```

### Safe Areas (iOS)
- Top: Account for notch with `safe-top` class
- Bottom: Account for home indicator with `safe-bottom` class (24px padding on mobile)

---

## Component Checklist

When building a component, ensure:
- [ ] Minimum 44px × 44px touch targets
- [ ] 17px or larger font sizes for body text
- [ ] High contrast ratios (4.5:1 minimum)
- [ ] Visible focus indicators on all interactive elements
- [ ] Clear visual hierarchy (primary actions stand out)
- [ ] Generous spacing between elements (16-24px)
- [ ] Soft shadows, not harsh borders
- [ ] Rounded corners (12-16px on most elements)
- [ ] Loading states for async actions
- [ ] Error states with clear messaging

---

## Future Features (Do NOT Implement Yet)

These are visible in inspiration designs but marked for future roadmap:

1. **Camera Scanning / OCR**
   - "Scan Doc" button with camera icon
   - Auto-fill from scanned documents

2. **Biometric Lock**
   - Face ID / Touch ID toggle in Settings
   - Lock vault with biometrics

3. **Cloud Backup & Sync**
   - iCloud / Google Drive integration
   - "Backup & Restore" in Settings

4. **Document Sharing**
   - Share document with family members
   - Temporary access links

**Approach:** Where inspiration shows these features, replace with:
- "Scan Doc" → "Add Document" (manual entry)
- "Face ID" toggle → Remove or replace with "Change PIN"
- "Backup & Sync" → Remove or note "Coming Soon"

---

## Migration Notes

**From dark theme to light theme:**
- Replace `bg-slate-900` → `bg-white` or `bg-slate-50`
- Replace `text-white` → `text-slate-900`
- Replace `text-slate-400` → `text-slate-600` (better contrast)
- Replace `border-slate-700` → `border-slate-200`
- Replace gradient buttons → solid blue buttons
- Replace heavy shadows → subtle shadows (shadow-sm, shadow-md)

**Keep existing:**
- Form validation logic
- IndexedDB storage
- Navigation structure
- PIN/recovery flows
- Document management logic
