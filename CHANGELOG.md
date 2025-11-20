# Changelog

All notable changes to the Welcome Dashboard project.

## [2.3.0] - 2025-11-20

### 📅 Calendar Integration
- **NEW:** Outlook calendar integration via iCal feeds
- **NEW:** `netlify/functions/ical-proxy.js` - CORS proxy for calendar feeds
- **NEW:** iCal.js library integration for parsing calendar data
- **NEW:** Simple setup - no API keys or admin permissions required
- **NEW:** Display next 5 upcoming events with date, time, location
- **NEW:** 5-minute event caching with manual refresh option
- **NEW:** Calendar URL persistence in localStorage
- **NEW:** Glassmorphism event cards matching app design
- **NEW:** Connect/disconnect calendar functionality
- **NEW:** Auto-reconnect on page load
- **IMPROVED:** Perfect for university/school accounts without Graph API access

### 🖼️ Image Management Simplified
- **CHANGED:** Removed upload feature to prevent localStorage quota errors
- **IMPROVED:** Preset images only - use file paths from `img/` folder
- **REMOVED:** Image upload input and functionality
- **REMOVED:** Uploaded images tab from gallery
- **REMOVED:** Storage size warnings (no longer needed)
- **IMPROVED:** No localStorage limits for images
- **IMPROVED:** Faster page loads with direct file references

### 🐛 Bug Fixes
- **FIXED:** Null reference errors in production (added null checks to all display functions)
- **FIXED:** Weather widget not appearing (geolocation fallback chain)
- **FIXED:** QuotaExceededError when uploading images (feature removed)
- **FIXED:** Quote icon appearing on all content types (now dynamic per type)
- **FIXED:** Quote text wrapping (increased card width to 1200px)

### 📖 Documentation
- **UPDATED:** README.md with calendar setup instructions
- **UPDATED:** SETUP.md with iCal feed guide
- **UPDATED:** CHANGELOG.md with all recent changes
- **UPDATED:** copilot-instructions.md with calendar implementation

## [2.2.0] - 2025-11-20

### 🌟 API Ninjas Integration
- **NEW:** API Ninjas integration for multiple content types
- **NEW:** `netlify/functions/api-ninjas-quote.js` - Quotes with 5 categories
- **NEW:** `netlify/functions/fact.js` - Random interesting facts
- **NEW:** `netlify/functions/joke.js` - Clean jokes
- **NEW:** `netlify/functions/word-of-day.js` - Random words with definitions
- **NEW:** Content selector UI with 4 icon buttons (quote/fact/joke/word)
- **NEW:** Content type persistence across page refreshes
- **NEW:** Smart caching for all content types
- **NEW:** Fallback to hardcoded content when API unavailable
- **NEW:** Dynamic icons per content type (quote, lightbulb, laugh, book)

### 🌧️ Weather Widget Enhancements
- **IMPROVED:** 3-level fallback chain (geolocation → IP-based → default location)
- **IMPROVED:** IP geolocation via ipapi.co when GPS denied/unavailable
- **IMPROVED:** Default to Zurich coordinates as last resort
- **FIXED:** Weather not appearing when Netlify Functions enabled
- **FIXED:** Geolocation permission handling

## [2.1.0] - 2025-11-20

### 🔐 Security Enhancements
- **NEW:** Netlify Functions for secure API key management
- **NEW:** `netlify/functions/weather.js` - Server-side weather API proxy
- **NEW:** `netlify/functions/quote.js` - Server-side quote API proxy
- **NEW:** Automatic detection of Netlify environment for function usage
- **NEW:** `NETLIFY_SECURITY.md` - Comprehensive security setup guide
- **NEW:** `.env.example` - Template for local development
- **IMPROVED:** API keys never exposed to browser
- **IMPROVED:** Functions use environment variables from Netlify dashboard

### 🌤️ Weather Widget
- **NEW:** Real-time weather display with OpenWeatherMap API integration
- **NEW:** Automatic geolocation detection
- **NEW:** Temperature, condition, and location display
- **NEW:** Animated weather icons
- **NEW:** Smart caching (updates every 30 minutes)
- **NEW:** Configurable temperature units (Celsius/Fahrenheit)
- **NEW:** Graceful fallback when API unavailable

### 💬 Quote API Integration
- **NEW:** Live inspirational quotes from Quotable API
- **NEW:** Automatic caching to localStorage for offline use
- **NEW:** Three-tier fallback system (API → Cached → Hardcoded)
- **NEW:** Better variety with thousands of quotes available

### 🖼️ Enhanced Image Management
- **NEW:** Dual image sources: Uploaded + Preset images
- **NEW:** Tabbed gallery interface (Uploaded/Preset tabs)
- **NEW:** Preset images use `img/` folder paths (no localStorage limits!)
- **NEW:** Select/deselect preset images with visual indicators
- **NEW:** Real-time storage monitor with warning at 80% capacity
- **NEW:** Storage size calculator function
- **NEW:** Lazy loading for gallery images
- **NEW:** Better handling of mixed image sources

### 🔧 Technical Improvements
- **IMPROVED:** localStorage management with namespaced keys
- **IMPROVED:** API error handling and fallback mechanisms
- **IMPROVED:** Gallery rendering performance with lazy loading
- **IMPROVED:** State management for multiple image sources
- **IMPROVED:** CSS organization with new utility classes
- **FIXED:** Gallery tab switching functionality
- **FIXED:** Background cycling with mixed image sources
- **FIXED:** Image index tracking across preset and uploaded images

### 📚 Documentation
- **NEW:** Comprehensive Copilot instructions with API integration guides
- **NEW:** Weather API setup instructions
- **NEW:** Preset image configuration guide
- **NEW:** Storage management best practices
- **UPDATED:** README with new features and configuration options

## [2.0.0] - 2025-11-20

### 🎨 Complete Redesign
- **NEW:** Modern glassmorphism UI design with frosted glass effects
- **NEW:** Gradient background overlays with backdrop blur
- **NEW:** Smooth animations and transitions throughout
- **NEW:** Fully responsive design for all screen sizes

### ✨ New Features

#### Image Management
- **NEW:** Upload your own background images
- **NEW:** Visual gallery with thumbnail previews
- **NEW:** Click to select active background
- **NEW:** Delete images individually
- **NEW:** Auto-cycling between images (configurable interval)
- **NEW:** Images stored in browser localStorage (persistent)
- **NEW:** Support for multiple image uploads at once

#### 3D Parallax Effect
- **NEW:** Mouse-tracking parallax background
- **NEW:** Multi-layer depth effect
- **NEW:** Configurable parallax intensity (3 layers with different depths)
- **NEW:** Mobile device orientation support
- **NEW:** Toggle parallax on/off in settings

#### Enhanced Time & Greetings
- **NEW:** Larger, more prominent clock display
- **NEW:** Full date with day of week
- **NEW:** Configurable time format (12/24 hour)
- **NEW:** Toggle seconds display
- **NEW:** Gradient text effects

#### Motivational Quotes
- **NEW:** 20+ inspirational quotes built-in
- **NEW:** Refresh button for instant new quote
- **NEW:** Beautiful typography with glass card
- **NEW:** Quote icon decoration

#### Calendar Integration (Ready)
- **NEW:** Microsoft Outlook/Teams calendar support structure
- **NEW:** Google Calendar integration structure
- **NEW:** Setup instructions in-app
- **NEW:** Events and tasks display UI
- **NEW:** OAuth authentication ready
- **REQUIRES:** API credentials configuration (see SETUP.md)

#### Settings Panel
- **NEW:** Dedicated settings overlay
- **NEW:** Parallax effect toggle
- **NEW:** Background change interval configuration
- **NEW:** Time format preferences
- **NEW:** Show/hide seconds
- **NEW:** Reset to defaults button
- **NEW:** All settings persisted in localStorage

#### Navigation
- **NEW:** Modern navigation bar with icons
- **NEW:** Quick access to all features
- **NEW:** Smooth overlay transitions
- **NEW:** Keyboard shortcuts (ESC to close overlays)

### 🗑️ Removed
- **REMOVED:** Legacy JavaScript files:
  - `greeting.js` (consolidated into app.js)
  - `helpers.js` (consolidated into app.js)
  - `main.js` (consolidated into app.js)
  - `motivation.js` (consolidated into app.js)
  - `projects.js` (removed - replaced with calendar)
  - `year.js` (consolidated into app.js)
- **REMOVED:** Project selection overlay (replaced with calendar feature)
- **REMOVED:** Old footer with credits
- **REMOVED:** External quote API dependency (now uses local quotes)

### 🔧 Technical Improvements
- **NEW:** Single modular JavaScript file (`app.js`)
- **NEW:** ES6+ modern JavaScript syntax
- **NEW:** CSS custom properties (CSS variables)
- **NEW:** Better performance with optimized animations
- **NEW:** Improved localStorage management
- **NEW:** Better error handling
- **NEW:** Code comments and documentation
- **NEW:** Netlify configuration file
- **NEW:** .gitignore file
- **NEW:** VS Code extensions recommendations

### 📚 Documentation
- **NEW:** Comprehensive README.md with features overview
- **NEW:** SETUP.md with detailed deployment instructions
- **NEW:** Calendar integration setup guides
- **NEW:** Troubleshooting section
- **NEW:** Code examples for customization
- **NEW:** Browser compatibility information

### 🎯 Design System
- **NEW:** Consistent color scheme with CSS variables
- **NEW:** Inter font family throughout
- **NEW:** Font Awesome 6 icons
- **NEW:** Glass morphism design pattern
- **NEW:** Consistent spacing and sizing
- **NEW:** Hover states and feedback
- **NEW:** Loading screen with animation

### 📱 Responsive Design
- **NEW:** Mobile-first approach
- **NEW:** Tablet optimization
- **NEW:** Desktop enhancements
- **NEW:** Touch-friendly controls
- **NEW:** Adaptive layouts

### 🔒 Security & Best Practices
- **NEW:** Content Security Policy headers (in netlify.toml)
- **NEW:** Secure API credential handling instructions
- **NEW:** localStorage data encapsulation
- **NEW:** Input validation for file uploads

### ⚡ Performance
- **NEW:** CSS animations using transform (GPU accelerated)
- **NEW:** Optimized image loading
- **NEW:** Lazy initialization
- **NEW:** Efficient event listeners
- **NEW:** Browser caching headers

## [1.0.0] - Previous Version

### Features (Legacy)
- Basic clock display
- Time-based greeting
- Random background from 17 preset images
- External motivational quotes API
- Project selection overlay
- Static footer with credits
- Basic CSS styling

---

## Migration Guide (1.0 → 2.0)

### What You Need to Do:

1. **Images:**
   - Old images (0.jpg - 16.jpg) in `/img/` folder can be kept or removed
   - Upload your images through the new gallery interface
   - They'll be stored in browser localStorage

2. **Name:**
   - Your saved name from before should carry over automatically
   - If not, just click to edit it again

3. **No Action Required:**
   - All new features work immediately
   - No database or server setup needed
   - Just open index.html or deploy to Netlify

4. **Optional Setup:**
   - Configure calendar integration if desired (see SETUP.md)
   - Customize colors in CSS variables
   - Adjust parallax settings

### Breaking Changes:
- Old JavaScript files no longer used (removed)
- Project overlay replaced with calendar feature
- Quote API changed from external to internal
- Different localStorage keys (old data won't carry over except name)

---

**Note:** This is a complete rewrite with modern web technologies and design patterns.
