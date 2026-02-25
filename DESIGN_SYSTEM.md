# LabLink Design System & Style Guide

This document serves as a reference for maintaining UI consistency across the LabLink application.

## 🎨 Color Palette

### Backgrounds
- **App Background**: `#F8F9FB` (Light grayish-blue, used for screens to make white cards pop)
- **Surface/Card Background**: `#FFFFFF` (Pure white for all elevated containers)

### Primary Colors (Brand)
- **Primary Blue**: `#137FEC` (Main action color for buttons, active tabs, and primary status)
- **Secondary Blue**: `#1E70E8` (Used for larger action buttons and headers)
- **Light Blue Tint**: `#E7F2FD` (Background for primary icons or secondary buttons)

### Accent Colors
- **Purple**: `#8B5CF6` (Used for Business/Lab-specific identifiers)
- **Purple Tint**: `#F5F3FF` (Background for purple-themed icons)
- **Green (Success)**: `#27AE60` (Badge text) / `#E9F7EF` (Badge background)
- **Gold/Amber (Warning)**: `#F59E0B` (Badge text) / `#FFFBEB` (Badge background)

### Typography Colors
- **Heading/Title**: `#111111` (Near black for strong hierarchy)
- **Body Text**: `#5D6575` (Dark gray for readability)
- **Subtext/Muted**: `#6B7280` (Medium gray for descriptions/helpers)
- **Placeholder**: `#9CA3AF` or `#A0AEC0`

---

## 📐 Layout & Spacing

### Border Radius
- **Main Cards**: `16px` (e.g., list items, dashboard cards)
- **Forms/Inputs**: `12px` (e.g., text inputs, smaller cards)
- **Standard Buttons**: `12px`
- **Pills/Chips**: `100px` (Fully rounded)

### Elevation & Shadows
- **Standard Shadow**:
  ```javascript
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
  ```

### Standard Dimensions
- **Button Height**: `54px` to `56px`
- **Input Height**: `52px` (Standard) or `120px` (Multiline)
- **Screen Padding**: `20px` (Horizontal) is the project standard.

---

## 🧱 Components Style

### 1. Primary Button
- **Style**: Rounded corners (`12px`), blue background (`#1E70E8`), white centered text, bold font-weight (`700`).

### 2. Secondary/Back Link
- **Style**: No background, medium-gray text (`#6B7280`), font-weight (`600`).

### 3. Form Inputs
- **Style**: White background, `1px` border (`#E2E8F0`), `12px` radius. Labels are typically `#111` with font-weight `700`.

### 4. Progress Indicators
- **Style**: Thin bar (`8px` height), `#E2E8F0` track, `#137FEC` fill. Usually paired with "Step X of X" and "% Completed" text.

---

## 🧑‍💻 UI Logic Patterns
- **Role Separation**: Students use blue accents predominantly; Businesses/Labs often feature purple/blue combinations or specialized stats dashboards.
- **Empty States**: Use `#D9D9D9` for image/avatar placeholders.
- **Visual Feedback**: Disabled buttons should have `opacity: 0.6`. Active tabs/chips use `#111111` or `#137FEC` for background with white text.

---

## 📁 Suggested Navigation Structure
- `/screens/auth/`: Registry and Identity selection.
- `/screens/student/`: Core student-path screens (Search, Orders, Profile).
- `/screens/business/`: Core business-path screens (Dashboard, Inventory, Lab Profile).
- `/screens/common/`: Shared utilities (Notifications, Messaging, Checkout).
