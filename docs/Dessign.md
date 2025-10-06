# DESIGN.md - Wallai Design System

## Brand Identity

### Logo Symbolism

The Wallai logo embodies a powerful duality: a wallet that transforms into a heart. This metamorphosis represents our core mission - transforming cold financial management into warm, caring stewardship of family resources. The overlapping geometric shapes create a price tag silhouette, subtly referencing our community-driven price intelligence feature.

### Design Philosophy

"Financial wellness through human connection" - Our design system prioritizes emotional intelligence over corporate sterility. Every interface element should feel approachable, trustworthy, and optimistic, reflecting that managing money is ultimately about caring for the people we love.

### Brand Values Reflected in Design

- **Trust**: Clean, transparent interfaces with clear information hierarchy
- **Intelligence**: Smart defaults and predictive elements that learn from users
- **Community**: Collaborative features emphasized through shared visual language
- **Growth**: Progressive disclosure and gamification elements that celebrate progress
- **Simplicity**: Complex financial concepts made visually digestible

---

## Color Palette System

### Primary Brand Colors

#### Growth Green (#4ADE80)

- **Represents**: Financial growth, prosperity, positive action
- **Usage**: Primary CTAs, success states, positive trends, income indicators
- **Psychology**: Green triggers feelings of safety and growth, reduces anxiety around money
- **Cultural notes**: Universally positive in Western markets; represents prosperity in Asian markets

#### Trust Teal (#14B8A6)

- **Represents**: Stability, trust, intelligence, depth
- **Usage**: Secondary actions, headers, navigation elements, AI assistant accent
- **Psychology**: Combines calming blue with energizing green, promoting confident decision-making
- **Cultural notes**: Associated with technology and innovation globally

#### Gradient Blend (#5EEAD4)

- **Represents**: The intersection of growth and trust, collaboration
- **Usage**: Feature highlights, premium features, collaborative spaces
- **Psychology**: Represents harmony and balance in shared finances
- **Cultural notes**: Softer tone appeals to millennial/Gen Z aesthetics

#### Deep Navy (#2E4057)

- **Represents**: Security, professionalism, depth of insights
- **Usage**: Text, headers, data visualization, dark mode base
- **Psychology**: Conveys authority without intimidation
- **Cultural notes**: Professional across all markets

### Functional Colors

#### Success (#10B981)

- Darker shade of growth green for confirmed actions
- Savings achieved, goals met, positive outcomes

#### Error (#EF4444)

- Warm red for errors and overspending
- Softened to reduce anxiety while maintaining urgency

#### Warning (#F59E0B)

- Amber for approaching limits, attention needed
- High visibility without panic

#### Info (#3B82F6)

- Clear blue for informational messages
- AI suggestions and tips

### Neutral Grays

```css
--gray-900: #111827; /* Primary text */
--gray-700: #374151; /* Secondary text */
--gray-500: #6b7280; /* Muted text */
--gray-400: #9ca3af; /* Placeholder text */
--gray-300: #d1d5db; /* Borders */
--gray-200: #e5e7eb; /* Dividers */
--gray-100: #f3f4f6; /* Backgrounds */
--gray-50: #f9fafb; /* Subtle backgrounds */
```

---

## Gradient Applications

### Primary Gradient - "Growth Flow"

```css
background: linear-gradient(135deg, #4ade80 0%, #5eead4 50%, #14b8a6 100%);
```

- **Usage**: Hero sections, premium feature badges, achievement celebrations
- **Represents**: The journey from saving to prosperity

### Secondary Gradient - "Trust Wave"

```css
background: linear-gradient(90deg, #14b8a6 0%, #3b82f6 100%);
```

- **Usage**: AI assistant backgrounds, insight cards, data visualization accents
- **Represents**: Intelligence and reliability

### Accent Gradient - "Sunrise Savings"

```css
background: linear-gradient(135deg, #fcd34d 0%, #4ade80 100%);
```

- **Usage**: Positive alerts, goal achievements, celebration states
- **Represents**: New beginnings and financial optimism

---

## Color Usage Guidelines

### Do's:

- ✓ Use Growth Green for primary CTAs that advance user goals
- ✓ Apply 60-30-10 rule: 60% neutrals, 30% secondary colors, 10% accent colors
- ✓ Maintain minimum 4.5:1 contrast ratio for all text
- ✓ Use gradients sparingly for emphasis and delight
- ✓ Apply functional colors consistently across all platforms
- ✓ Test color combinations in both light and dark modes
- ✓ Use color to create visual hierarchy and guide user flow

### Don'ts:

- ✗ Don't use pure black (#000000) - use Deep Navy instead
- ✗ Avoid using red for anything except errors and overspending
- ✗ Don't combine Warning amber with Error red (creates panic)
- ✗ Never use color as the only indicator of state
- ✗ Avoid gradients on small text or icons
- ✗ Don't use more than 3 colors in a single component
- ✗ Avoid low contrast color combinations

### 60-30-10 Rule Application

- **60%**: Neutral backgrounds and surfaces (whites, grays)
- **30%**: Brand colors for navigation and structure (Deep Navy, Trust Teal)
- **10%**: Accent colors for CTAs and highlights (Growth Green)

---

## Accessibility Considerations

### Color Contrast Ratios

| Color                  | On White (#FFFFFF) | On Gray-50 (#F9FAFB) | WCAG Rating                   |
| ---------------------- | ------------------ | -------------------- | ----------------------------- |
| Growth Green (#4ADE80) | 2.95:1 ❌          | 2.87:1 ❌            | Use only for large text/icons |
| Trust Teal (#14B8A6)   | 3.15:1 ⚠️          | 3.06:1 ⚠️            | Large text only               |
| Deep Navy (#2E4057)    | 9.73:1 ✅          | 9.45:1 ✅            | AAA compliant                 |
| Gray-900 (#111827)     | 19.30:1 ✅         | 18.73:1 ✅           | AAA compliant                 |
| Gray-700 (#374151)     | 10.89:1 ✅         | 10.56:1 ✅           | AAA compliant                 |

**Note**: For Growth Green and Trust Teal on white backgrounds, always use:

- Minimum 24px font size
- Bold weight (600+)
- Or add Deep Navy outline/shadow

### Color Blind Considerations

- Always pair color indicators with icons or patterns
- Use texture/pattern overlays for charts and graphs
- Implement shape differentiation in data visualizations
- Test with Deuteranopia and Protanopia simulators
- Provide text labels for all color-coded information

---

## Implementation in Code

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        wallai: {
          green: "#4ADE80",
          "green-dark": "#10B981",
          teal: "#14B8A6",
          "teal-light": "#5EEAD4",
          navy: "#2E4057",
          "navy-light": "#3E5368",
        },
        functional: {
          success: "#10B981",
          error: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
        },
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #4ADE80 0%, #5EEAD4 50%, #14B8A6 100%)",
        "gradient-secondary":
          "linear-gradient(90deg, #14B8A6 0%, #3B82F6 100%)",
        "gradient-accent": "linear-gradient(135deg, #FCD34D 0%, #4ADE80 100%)",
      },
    },
  },
};
```

### CSS Variables

```css
:root {
  /* Brand Colors */
  --color-wallai-green: #4ade80;
  --color-wallai-green-dark: #10b981;
  --color-wallai-teal: #14b8a6;
  --color-wallai-teal-light: #5eead4;
  --color-wallai-navy: #2e4057;

  /* Functional Colors */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;

  /* Neutral Grays */
  --color-gray-900: #111827;
  --color-gray-700: #374151;
  --color-gray-500: #6b7280;
  --color-gray-400: #9ca3af;
  --color-gray-300: #d1d5db;
  --color-gray-200: #e5e7eb;
  --color-gray-100: #f3f4f6;
  --color-gray-50: #f9fafb;

  /* Gradients */
  --gradient-primary: linear-gradient(
    135deg,
    #4ade80 0%,
    #5eead4 50%,
    #14b8a6 100%
  );
  --gradient-secondary: linear-gradient(90deg, #14b8a6 0%, #3b82f6 100%);
  --gradient-accent: linear-gradient(135deg, #fcd34d 0%, #4ade80 100%);
}
```

---

## Dark Mode Adaptation

### Adjusted Color Values

```css
[data-theme="dark"] {
  /* Adjusted Brand Colors */
  --color-wallai-green: #5ee08a;
  --color-wallai-teal: #2dd4bf;
  --color-wallai-navy: #e2e8f0;

  /* Dark Backgrounds */
  --color-bg-base: #0f172a;
  --color-bg-elevated: #1e293b;
  --color-bg-overlay: #334155;

  /* Adjusted Neutrals */
  --color-gray-900: #f9fafb;
  --color-gray-700: #e5e7eb;
  --color-gray-500: #9ca3af;
  --color-gray-400: #6b7280;
  --color-gray-300: #4b5563;
  --color-gray-200: #374151;
  --color-gray-100: #1f2937;
  --color-gray-50: #111827;
}
```

### Dark Mode Considerations

- Increase color saturation by 10-15% for better visibility
- Use elevated backgrounds for cards and modals
- Reduce gradient intensity to prevent eye strain
- Maintain 4.5:1 minimum contrast on dark backgrounds

---

## Cultural Color Considerations

### United States & Canada

- **Green**: Strongly positive, associated with money and growth
- **Teal**: Tech-forward, trustworthy, millennial-friendly
- **Navy**: Professional, secure, traditional values
- **Red usage**: Minimize to avoid anxiety around finances

### Latin America (Future Expansion)

- **Green**: Very positive, prosperity and hope
- **Warmer tones**: Consider adding warm accent colors
- **Bright colors**: Higher saturation preferences
- **Gold accents**: Associated with success and wealth

### Europe (Future Expansion)

- **Muted palette**: Preference for sophisticated, understated colors
- **Green**: Environmental consciousness adds positive association
- **Blue tones**: High trust factor
- **Minimal gradients**: Preference for flat design

---

## Emotional Color Mapping

| Emotion/State | Color            | Application                               |
| ------------- | ---------------- | ----------------------------------------- |
| Achievement   | Growth Green     | Goal completion, savings milestones       |
| Trust         | Trust Teal       | AI recommendations, secure actions        |
| Caution       | Warning Amber    | Approaching limits, attention needed      |
| Concern       | Error Red        | Overspending, urgent issues               |
| Intelligence  | Info Blue        | Insights, tips, learning moments          |
| Neutrality    | Gray-500         | Inactive states, disabled elements        |
| Premium       | Gradient Primary | Paid features, special achievements       |
| Celebration   | Gradient Accent  | Major milestones, first-time achievements |

---

## Marketing Color Usage

### App Store & Landing Page

- **Hero Section**: Gradient Primary background with white text
- **CTA Buttons**: Solid Growth Green with white text
- **Feature Sections**: Alternating white and Gray-50 backgrounds
- **Testimonials**: Trust Teal accent borders
- **Pricing Cards**: Gradient borders for premium tiers

### Social Media Guidelines

- **Instagram Posts**: Growth Green overlays at 20% opacity
- **Story Frames**: Gradient Primary borders (10px)
- **Achievement Graphics**: Gradient Accent backgrounds
- **Infographics**: Navy text on light backgrounds
- **Video Thumbnails**: Trust Teal accent elements

---

## Color Testing Checklist

### Device Testing

- [ ] Test on OLED displays (pure blacks)
- [ ] Verify on LCD screens (color accuracy)
- [ ] Check on mobile devices in bright sunlight
- [ ] Test on various brightness settings (25%, 50%, 75%, 100%)
- [ ] Verify on both iOS and Android devices

### Accessibility Validation

- [ ] Run WCAG contrast checker on all text/background combinations
- [ ] Test with Windows High Contrast mode
- [ ] Verify with color blindness simulators
- [ ] Test with screen readers (color descriptions)
- [ ] Validate focus states have sufficient contrast

### Environmental Conditions

- [ ] Dark room testing (dark mode effectiveness)
- [ ] Bright outdoor testing (readability)
- [ ] Blue light filter testing (night mode)
- [ ] Different viewing angles (color shift)

### Cultural Verification

- [ ] Review with target market focus groups
- [ ] Validate color associations in target regions
- [ ] Check for unintended negative connotations
- [ ] Verify holiday/seasonal color conflicts

---

**Document Status:**

- Created: 2025-10-03
- Version: 1.0
- Maintained by: Design Team
- Related: PLANNING.md, PRD.md, CLAUDE.md
