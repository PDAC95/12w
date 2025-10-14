# Child Items Visual Design Guide

## Design Philosophy: Nested Cards (Option A)

This guide illustrates the visual hierarchy and structure of the redesigned child items.

---

## Desktop Layout (1024px+)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Housing                                    CAD 1500.00 / CAD 1200.00   [+]   │ ← PARENT CARD
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ (Prominent, bold)
│ Progress: ████████████████████░░░░ 80%                                          │ (bg-white/80)
│                                                                                  │
│   ─────────────────────── Sub-Categories ────────────────────────              │ ← Section Divider
│                                                                                  │
│   ┌───────────────────────────────────────────────────────────────────────┐    │
│   │ 🔌 Electricity     Budget: CAD 100    Spent: CAD 80    Progress: 80%  │    │ ← CHILD CARD 1
│   │                                                        [✏] [🗑]        │    │ (Nested, lighter)
│   └───────────────────────────────────────────────────────────────────────┘    │ (bg-white/60)
│                                                                                  │
│   ┌───────────────────────────────────────────────────────────────────────┐    │
│   │ 💧 Water           Budget: CAD 60     Spent: CAD 55    Progress: 92%  │    │ ← CHILD CARD 2
│   │                                                        [✏] [🗑]        │    │
│   └───────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│   ┌───────────────────────────────────────────────────────────────────────┐    │
│   │ 🌐 Internet        Budget: CAD 70     Spent: CAD 70    Progress: 100% │    │ ← CHILD CARD 3
│   │                                                        [✏] [🗑]        │    │
│   └───────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Visual Elements:

**Parent Card:**
- Large size (full width)
- High opacity (80%)
- Bold text
- Prominent shadows
- Complete financial summary

**Child Container:**
- Padding: 24px (top) + 16px (left/right) + 16px (bottom)
- Clean section divider
- Grouped child cards

**Child Cards:**
- Smaller than parent
- Lower opacity (60%)
- Lighter shadows
- Nested appearance through padding
- All data in single row

---

## Tablet Layout (768px - 1023px)

```
┌──────────────────────────────────────────────────────┐
│ 🏠 Housing                        CAD 1500.00  [+]   │ ← PARENT CARD
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ████████████████████░░░░ 80%                        │
│                                                      │
│   ────────── Sub-Categories ───────────             │
│                                                      │
│   ┌────────────────────────────────────────────┐    │
│   │ 🔌 Electricity              [ 80% ]        │    │ ← CHILD CARD
│   │                                            │    │ (2-row layout)
│   │ Budget: CAD 100  Spent: CAD 80   [✏] [🗑] │    │
│   │ ████████████████░░ 80%                     │    │
│   └────────────────────────────────────────────┘    │
│                                                      │
│   ┌────────────────────────────────────────────┐    │
│   │ 💧 Water                    [ 92% ]        │    │
│   │ Budget: CAD 60   Spent: CAD 55   [✏] [🗑] │    │
│   │ ██████████████████░ 92%                    │    │
│   └────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### Tablet Optimizations:
- Compact 2-row layout per child
- Progress badge on top row (right)
- Financial data + actions on second row
- Progress bar below
- Icon buttons only (no text labels)

---

## Mobile Layout (<768px)

```
┌──────────────────────────────────────┐
│ 🏠 Housing       CAD 1500.00   [+]   │ ← PARENT
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ██████████████░░░ 80%                │
│                                      │
│   ──── Sub-Categories ────           │
│                                      │
│   ┌────────────────────────────┐    │
│   │ 🔌 Electricity      [ 80% ]│    │ ← CHILD CARD
│   │                            │    │ (Vertical stack)
│   │ Budget        Spent        │    │
│   │ CAD 100       CAD 80       │    │
│   │                            │    │
│   │ ████████████████░░ 80%     │    │
│   │                            │    │
│   │ ┌──────────┬─────────────┐ │    │
│   │ │ ✏ Edit   │  🗑 Delete  │ │    │ ← Full-width buttons
│   │ └──────────┴─────────────┘ │    │
│   └────────────────────────────┘    │
│                                      │
│   ┌────────────────────────────┐    │
│   │ 💧 Water            [ 92% ]│    │
│   │ Budget        Spent        │    │
│   │ CAD 60        CAD 55       │    │
│   │ ██████████████████░ 92%    │    │
│   │ ┌──────────┬─────────────┐ │    │
│   │ │ ✏ Edit   │  🗑 Delete  │ │    │
│   │ └──────────┴─────────────┘ │    │
│   └────────────────────────────┘    │
└──────────────────────────────────────┘
```

### Mobile Optimizations:
- Vertical stacking
- Touch-friendly buttons (min 44px height)
- Full-width action buttons with icons + text
- Large progress badge
- Clear financial info columns

---

## Color & Opacity Hierarchy

### Parent Card
```css
background: bg-white/80              /* 80% opacity - PROMINENT */
backdrop-filter: backdrop-blur-xl    /* Strong blur */
border: border-gray-200/50           /* Visible border */
shadow: shadow-xl                    /* Large shadow */
```

### Child Cards
```css
background: bg-white/60              /* 60% opacity - SUBTLE */
backdrop-filter: backdrop-blur-sm    /* Light blur */
border: border-gray-200/30           /* Subtle border */
shadow: hover:shadow-md              /* Hover shadow only */
```

### Visual Weight
```
Parent:   ████████ (80% opacity, large, bold)
Children: ██████   (60% opacity, smaller, regular)
```

---

## Spacing System

### Container Padding
```
Mobile:   px-4 (16px left/right)
Tablet+:  px-6 (24px left/right)
Top:      mt-6 (24px)
Bottom:   pb-4 (16px)
```

### Child Card Spacing
```
Between Cards:  space-y-3 (12px gap)
Internal:       p-4 (16px all sides)
```

### Visual Nesting
```
Parent Edge
│
├── 24px padding (creates nesting effect)
│   │
│   ├── Child Card 1
│   │   └── 16px internal padding
│   │
│   ├── 12px gap
│   │
│   ├── Child Card 2
│   │   └── 16px internal padding
│   │
│   └── ...
```

---

## Interactive States

### Default State
```
Child Card: bg-white/60, border-gray-200/30, shadow-none
Button:     bg-white/80, border-gray-300/50
```

### Hover State
```
Child Card: bg-white/80, border-gray-300/50, shadow-md
Edit:       bg-teal-50, border-teal-400
Delete:     bg-red-50, border-red-400
```

### Visual Feedback
- Smooth transitions (duration-200)
- Subtle color shifts
- Shadow appears on hover
- Border becomes more visible

---

## Progress Indicators

### Color States

**Normal (0-89%)**
```
Badge: bg-gray-100, text-gray-700
Bar:   Gradient from color config (teal/blue/green)
```

**Warning (90-100%)**
```
Badge: bg-yellow-100, text-yellow-700
Bar:   Yellow gradient
```

**Over Budget (>100%)**
```
Badge: bg-red-100, text-red-700
Bar:   Red gradient (from-red-400 via-red-500 to-red-600)
Text:  text-red-600
```

---

## Typography Hierarchy

### Parent Card
```
Category Name:  text-lg font-bold        (18px, bold)
Description:    text-sm text-gray-600    (14px, regular)
Financial Data: text-base font-semibold  (16px, semibold)
```

### Child Cards
```
Category Name:  text-sm font-semibold    (14px, semibold)
Description:    text-xs text-gray-500    (12px, regular)
Financial Data: text-xs font-semibold    (12px, semibold)
Labels:         text-xs text-gray-400    (12px, light)
```

### Size Comparison
```
Parent Title:    18px  ████████████████
Child Title:     14px  ████████████
Parent Amount:   16px  ██████████████
Child Amount:    12px  ██████████
```

---

## Accessibility Features

### Color Contrast
- Gray text: #4B5563 (gray-700) on white - WCAG AA ✓
- Teal buttons: #0D9488 (teal-600) - WCAG AA ✓
- Red buttons: #DC2626 (red-600) - WCAG AA ✓

### Touch Targets (Mobile)
```
Minimum Size: 44px × 44px
Button Height: py-2 (min 44px total)
Button Width: flex-1 (responsive, adequate)
```

### Semantic HTML
```html
<h4>Category Name</h4>           <!-- Proper heading -->
<p>Financial data</p>            <!-- Descriptive text -->
<button aria-label="Edit">...</button>  <!-- Accessible button -->
```

---

## Design Tokens

### Borders
```
Parent:   border border-gray-200/50
Child:    border border-gray-200/30
Divider:  h-px bg-gradient-to-r from-gray-300/50 via-gray-200/80
```

### Rounded Corners
```
Parent:   rounded-2xl (16px)
Child:    rounded-xl  (12px)
Buttons:  rounded-lg  (8px)
Badges:   rounded-full
```

### Shadows
```
Parent:   shadow-xl
Child:    shadow-sm (hover: shadow-md)
Buttons:  shadow-sm
```

---

## Animation & Transitions

### Entrance Animation
```tsx
className="animate-fadeInSlideUp"
style={{ animationDelay: `${childIndex * 50}ms` }}
```
- Staggered appearance
- 50ms delay between children
- Smooth fade + slide effect

### Hover Transitions
```css
transition-all duration-200
```
- Quick, responsive feedback
- Smooth color/shadow changes

---

## Comparison Table

| Aspect | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Visual Clarity** | Tree lines, connectors | Clean nesting with padding | ✅ Much clearer |
| **Scannability** | Cluttered, hard to scan | Clean cards, easy to scan | ✅ Significantly better |
| **Parent-Child Relation** | Unclear, complex | Obvious through nesting | ✅ Immediately clear |
| **Visual Noise** | High (borders, lines) | Low (minimal decoration) | ✅ Much cleaner |
| **Touch Targets** | Small buttons | Large, touch-friendly | ✅ Better usability |
| **Responsive** | 2 layouts | 3 layouts (mobile/tablet/desktop) | ✅ More adaptive |
| **Code Complexity** | High (absolute positioning) | Low (flexbox) | ✅ More maintainable |

---

## Implementation Summary

### What Was Removed
- ❌ Vertical tree-line connectors
- ❌ Horizontal connector lines
- ❌ Child indicator dots
- ❌ Complex absolute positioning
- ❌ Border-left-4 colored borders
- ❌ ml-6 sm:ml-10 offset positioning
- ❌ Gradient backgrounds on connectors

### What Was Added
- ✅ Clean section divider ("Sub-Categories")
- ✅ Padding-based visual nesting
- ✅ Simplified card backgrounds
- ✅ Tablet-specific layout
- ✅ Better hover states
- ✅ Improved button layouts
- ✅ Semantic HTML structure
- ✅ Proper ARIA labels

---

## Usage Guidelines

### When to Use This Design

**Appropriate for:**
- Parent-child category relationships
- Nested budget items
- Hierarchical data display
- Financial breakdowns
- Grouped information

**Best Practices:**
- Keep children limited (3-8 per parent)
- Ensure child names are descriptive
- Use icons consistently
- Maintain color consistency

### Customization Options

**Colors:**
- Adjust opacity values for different backgrounds
- Change progress bar gradients per category
- Customize border colors

**Spacing:**
- Modify padding for denser/looser layouts
- Adjust gaps between cards
- Change container padding

**Features:**
- Add collapse/expand functionality
- Implement drag-and-drop reordering
- Add inline editing
- Include batch actions

---

**Visual Guide Version**: 1.0
**Last Updated**: 2025-10-14
**Design System**: Glassmorphism + Modern Minimalism
