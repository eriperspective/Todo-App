# Affirmations Feature Documentation

## Overview
A new Affirmations page has been added to the Todo App that displays positive spiritual affirmations when users click a worship hands button. This feature replaces the Settings icon in the bottom navigation bar.

## Features Implemented

### 1. **Affirmations Page** (`frontend/pages/affirmations.tsx`)
- **Route**: `/affirmations`
- **Authentication**: Requires user to be logged in (checks localStorage for token)
- **Layout**: Matches existing dashboard layout with header and content area
- **Responsive Design**: Centered content with mobile-friendly responsive styling

### 2. **Affirmation Display**
- **30 Unique Affirmations**: Curated list of positive spiritual affirmations
- **Random Selection**: Each click shows a new random affirmation
- **No Repetition**: Tracks used affirmations to avoid repetition until all have been shown
- **Auto Reset**: Once all 30 affirmations are shown, the list resets for continued use
- **Smooth Animations**: 
  - FadeIn animation on affirmation display
  - Pulse animation on the worship hands emoji
  - Hover effects on the button

### 3. **Affirmation List** (30 total)
```
1. "You are capable of amazing things."
2. "Today is full of possibilities and blessings."
3. "Your potential is limitless."
4. "You are worthy of love and respect."
5. "Every challenge is an opportunity to grow."
6. "You are stronger than you think."
7. "Your dreams are within reach."
8. "You bring light to this world."
9. "You are deserving of success and happiness."
10. "Your voice matters and your presence is valued."
... and 20 more uplifting affirmations
```

### 4. **UI/UX Elements**
- **Worship Hands Icon**: Outlined worship hands (🙏) as emoji in header and button
- **Navigation Icon**: Outlined prayer hands icon in the bottom navigation bar
- **Call-to-Action Button**: "New Affirmation" button with worship hands emoji
- **Styling**:
  - Teal border (#20B2AA) around affirmation display box
  - Responsive font sizing
  - Shadow effects for depth
  - Matches app's Playfair Display font family
  - Works in both light and dark themes

### 5. **Navigation Integration**
- **Bottom Navigation Update**: Replaced Settings icon with Affirmations
- **Navigation Items**:
  - Home (Dashboard)
  - Calendar
  - Profile
  - **Affirmations** (NEW - replaced Settings)

## Technical Implementation

### Files Created
1. **`frontend/pages/affirmations.tsx`**
   - Main affirmations page component
   - Uses React hooks: `useState`, `useEffect`, `useCallback`
   - Responsive CSS styling with animations

### Files Modified
1. **`frontend/components/BottomNav.tsx`**
   - Replaced Settings navigation item with Affirmations
   - Updated icon to worship hands SVG
   - Path changed from `/settings` to `/affirmations`

2. **`frontend/styles/globals.css`**
   - Added `--color-bg-secondary` CSS variable for light mode: `#F0F8F7`
   - Added `--color-bg-secondary` CSS variable for dark mode: `#17253A`
   - Supports theming for the affirmation display box

## Code Structure

### State Management
- `affirmation`: Current displayed affirmation text
- `usedIndices`: Array tracking which affirmations have been shown
- `router`: For navigation and authentication checks

### Key Functions
- `displayNewAffirmation()`: 
  - Selects random affirmation from unused list
  - Tracks used affirmations
  - Resets when all have been shown
  - Wrapped in `useCallback` for memoization

### Animations
- **fadeIn**: Smooth fade-in effect for affirmation text display
- **pulse**: Subtle pulsing animation on the worship hands emoji
- **hover effects**: Button elevates on mouse hover with enhanced shadow

## Theme Support
- **Light Mode**: Teal/green accent colors with white background
- **Dark Mode**: Uses CSS variables for proper dark theme support
- **Consistent Styling**: Matches existing app design patterns

## User Flow
1. User clicks "Affirmations" in bottom navigation
2. Page loads with first random affirmation (if logged in)
3. Affirmation displays in centered card with worship hands emoji
4. User reads and reflects on the affirmation
5. User clicks "New Affirmation" button to get another
6. Process repeats with no duplicates until all 30 are shown
7. Back button navigates to dashboard

## Settings Page
**Note**: The Settings functionality has been moved to its original page at `/settings` but is no longer accessible via bottom navigation. Users can still navigate directly to settings if needed, or this can be accessed through a hamburger menu if implemented.

## Future Enhancements
- Add ability to favorite affirmations
- Create weekly affirmation reminders
- Add more affirmations to the list
- Add sharing functionality for favorite affirmations
- Create affirmation statistics/tracking
- Add text-to-speech capability for accessibility
- Allow users to add custom affirmations

## Testing Checklist
- [x] Affirmations page loads correctly
- [x] Authentication check works (redirects if not logged in)
- [x] Affirmations display randomly
- [x] No duplicate affirmations shown until reset
- [x] Button click triggers new affirmation
- [x] Animations play smoothly
- [x] Responsive design works on mobile
- [x] Works in both light and dark themes
- [x] Bottom navigation icon displays correctly
- [x] Navigation to affirmations page works
- [x] Back button navigates to dashboard
- [x] No TypeScript or ESLint errors
