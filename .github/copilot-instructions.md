# Copilot Instructions - Modern Welcome Dashboard

## Project Overview
A vanilla JavaScript browser homepage with glassmorphism UI, 3D parallax backgrounds, and localStorage persistence. Static site deployed to Netlify with serverless functions for secure API integration - no build process required.

## Architecture & Key Files

### Core Structure
- **`index.html`** - Single-page app with three overlays (images, calendar, settings)
- **`js/app.js`** - Modular vanilla JS (no framework). Exports `window.WelcomeDashboard` API
- **`css/style.css`** - CSS custom properties (`:root` variables), glassmorphism effects
- **`netlify/functions/`** - Serverless functions for secure API proxying (weather, quotes, facts, jokes, word-of-day, ical-proxy)

### State Management
All state lives in `localStorage` with namespaced keys (`welcomePage_*`):
- `userName` - Editable greeting name
- `selectedImages` - Array of preset image paths from `img/` folder
- `settings` - Parallax toggle, auto-cycle interval, time format
- `currentImage` - Active background index
- `lastWeather`, `lastQuote`, `lastFact`, `lastJoke`, `wordOfDay` - Cached API responses
- `contentType` - Current content type (quote/fact/joke/word)
- `calendarUrl` - ICS calendar feed URL
- `calendarEvents` - Cached calendar events (JSON array)
- `calendarTimestamp` - Last calendar fetch timestamp

State object in `app.js` mirrors localStorage and is single source of truth.

## Development Workflows

### Local Testing
```powershell
# IMPORTANT: Must use Netlify Dev server for API features
netlify dev
# Then open http://localhost:8888

# For static HTML only (no weather/quotes):
start index.html
```

**Note**: Weather widget and dynamic content (quotes/facts/jokes/words) require Netlify Functions. Always use `netlify dev` for full feature testing.

### Deployment
Deploys to Netlify via Git push (connected to GitHub). Configuration in `netlify.toml`:
- Publish directory: `.` (root)
- Functions directory: `netlify/functions` (auto-detected)
- No build command
- Headers for caching and security
- SPA redirect: `/* → /index.html`

**Environment Variables** (set in Netlify dashboard):
- `WEATHER_API_KEY` - OpenWeatherMap API key
- `WEATHER_UNITS` - `metric` or `imperial`
- `API_NINJAS_KEY` - API Ninjas key for quotes/facts/jokes/words

See `NETLIFY_SECURITY.md` for detailed deployment instructions.

### Adding Features
1. Update DOM in `index.html` overlay sections
2. Add corresponding `elements` reference in `app.js` line 66-110
3. Wire event listener in `initEventListeners()` function (line 410+)
4. Implement feature logic following module pattern (separate functions)

## Code Conventions

### JavaScript Patterns
- **Module structure**: Constants → State → Data → DOM refs → Functions → Event listeners → Init
- **Naming**: `camelCase` for functions/vars, `UPPER_SNAKE` for CONFIG constants
- **Storage**: Always sync `state` object to localStorage after mutations
- **DOM updates**: Direct manipulation (no virtual DOM), batch reads before writes

### CSS Architecture
- Use existing CSS variables in `:root` - never hardcode colors
- Glassmorphism: `var(--glass-bg)` + `backdrop-filter: blur(20px)`
- Parallax layers have `data-depth` attribute (0.1-0.3) for 3D effect intensity
- All animations use `var(--transition)` for consistency

### Image Handling
**Images are NOT stored as base64 in localStorage** (removed due to 5MB quota issues). Instead:

```javascript
// Images stored as file paths in CONFIG.presetImages
presetImages: [
    'img/0.jpg',
    'img/1.jpg',
    'img/2.jpg'
]

// User selects which preset images to use
function selectPresetImage(path) {
    if (!state.selectedImages.includes(path)) {
        state.selectedImages.push(path); // Store path only
        saveSelectedImages();
    }
}
```

**To add images**: Place files in `img/` folder and add paths to `CONFIG.presetImages` array. No upload feature - prevents localStorage quota errors.

## Integration Points

### Weather Widget Implementation
Real-time weather using OpenWeatherMap API via Netlify Function:

```javascript
// In CONFIG object
weather: {
    apiKey: '', // Empty in frontend - stored in Netlify env vars
    useNetlifyFunction: true, // Always true for production
    units: 'metric', // or 'imperial'
    updateInterval: 30 // minutes
}

// Fetch weather via Netlify Function
async function updateWeather() {
    const position = await getCurrentPosition(); // Geolocation API
    
    // Fallback chain: Geolocation → IP-based → Default (Zurich)
    if (!position) {
        const ipData = await fetch('https://ipapi.co/json/').then(r => r.json());
        position = { latitude: ipData.latitude, longitude: ipData.longitude };
    }
    
    const response = await fetch(
        `/.netlify/functions/weather?lat=${position.latitude}&lon=${position.longitude}`
    );
    const data = await response.json();
    displayWeather(data);
}
```

Weather function at `netlify/functions/weather.js` proxies OpenWeatherMap API. API key stored in Netlify environment variables. Implements caching with 30-minute intervals.

### Dynamic Content System
Four content types with API Ninjas and Quotable integration:

**Content Types**:
1. **Quotes** - Inspirational quotes (API Ninjas + Quotable fallback)
2. **Facts** - Random interesting facts (API Ninjas)
3. **Jokes** - Clean jokes (API Ninjas)
4. **Word of the Day** - Random word with definition (API Ninjas Dictionary + RandomWord)

```javascript
// Content selector UI in navbar
<div class="content-selector">
    <button class="content-btn active" data-content="quote">
        <i class="fas fa-quote-right"></i>
    </button>
    <button class="content-btn" data-content="fact">
        <i class="fas fa-lightbulb"></i>
    </button>
    <button class="content-btn" data-content="joke">
        <i class="fas fa-laugh"></i>
    </button>
    <button class="content-btn" data-content="word">
        <i class="fas fa-book"></i>
    </button>
</div>

// Fetch functions
async function fetchQuote() {
    const category = CONFIG.apiNinjas.categories[Math.floor(Math.random() * CONFIG.apiNinjas.categories.length)];
    const response = await fetch(`/.netlify/functions/api-ninjas-quote?category=${category}`);
    const data = await response.json();
    localStorage.setItem(CONFIG.storageKeys.lastQuote, JSON.stringify(data));
    displayContent('quote', data);
}

async function fetchFact() {
    const response = await fetch('/.netlify/functions/fact');
    const data = await response.json();
    displayContent('fact', data);
}

// Display with appropriate icon
function displayContent(type, data) {
    switch(type) {
        case 'quote':
            elements.motivation.innerHTML = `<i class="fas fa-quote-left quote-icon"></i> "${data.text}" — ${data.author}`;
            break;
        case 'fact':
            elements.motivation.innerHTML = `<i class="fas fa-lightbulb quote-icon"></i> ${data.text}`;
            break;
        case 'joke':
            elements.motivation.innerHTML = `<i class="fas fa-laugh quote-icon"></i> ${data.text}`;
            break;
        case 'word':
            elements.motivation.innerHTML = `<i class="fas fa-book quote-icon"></i> <strong>${data.word}</strong>: ${data.definition}`;
            break;
    }
}
```

**Netlify Functions**:
- `netlify/functions/api-ninjas-quote.js` - Quotes with categories
- `netlify/functions/fact.js` - Random facts
- `netlify/functions/joke.js` - Clean jokes
- `netlify/functions/word-of-day.js` - Word + definition (2-step API call)

All content cached in localStorage with fallback to hardcoded defaults. Content type persists across page refreshes.

### Image Management Solution

**Current Implementation**: Preset images from `img/` folder only (no upload feature)

```javascript
// CONFIG setup
presetImages: [
    'img/0.jpg',
    'img/1.jpg',
    'img/2.jpg',
    // Add more paths here
]

// Gallery renders preset images with select/deselect buttons
function renderPresetGallery() {
    CONFIG.presetImages.forEach((path, index) => {
        const isSelected = state.selectedImages.includes(path);
        const item = document.createElement('div');
        item.className = 'gallery-item preset-item';
        if (isSelected) item.classList.add('selected');
        
        item.innerHTML = `
            <img src="${path}" alt="Preset ${index + 1}">
            <button class="select-btn ${isSelected ? 'selected' : ''}" data-path="${path}">
                <i class="fas fa-${isSelected ? 'check' : 'plus'}"></i>
            </button>
        `;
        
        // Click handler for select/deselect
        selectBtn.addEventListener('click', () => {
            isSelected ? deselectPresetImage(path) : selectPresetImage(path);
        });
    });
}

// Store paths only (not base64)
function selectPresetImage(path) {
    if (!state.selectedImages.includes(path)) {
        state.selectedImages.push(path);
        localStorage.setItem(CONFIG.storageKeys.selectedImages, JSON.stringify(state.selectedImages));
    }
}
```

**Benefits**:
- ✅ No localStorage limits
- ✅ No base64 encoding overhead
- ✅ Better performance
- ✅ Simple to add images (just drop files in `img/` folder and update CONFIG)

**To add images**:
1. Place image files in `img/` folder
2. Add paths to `CONFIG.presetImages` array in `js/app.js`
3. Refresh page

**Upload feature removed** to prevent QuotaExceededError. See `STORAGE_CLEANUP.md` for migration instructions.

### Calendar Integration - iCal Feed Implementation

**Current Implementation**: Simple iCal feed approach (no authentication required)

Perfect for university/school Outlook accounts without admin permissions. No Microsoft Graph API needed!

**Architecture**:
```javascript
// 1. User gets ICS URL from Outlook Web (Settings → Shared calendars → Publish)
// 2. User pastes URL in dashboard
// 3. URL stored in localStorage: 'welcomePage_calendarUrl'
// 4. Netlify Function proxies iCal feed to avoid CORS
// 5. iCal.js library parses events
// 6. Display next 5 upcoming events
```

**Backend - Netlify Function** (`netlify/functions/ical-proxy.js`):
```javascript
exports.handler = async (event) => {
    const url = event.queryStringParameters?.url;
    
    // Validate URL is from allowed domains
    const allowedDomains = ['outlook.office365.com', 'outlook.office.com', 'outlook.live.com'];
    const urlObj = new URL(url);
    if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
        return { statusCode: 403, body: 'Domain not allowed' };
    }
    
    // Fetch iCal data
    const response = await fetch(url);
    const icalData = await response.text();
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/calendar',
            'Cache-Control': 'public, max-age=300' // 5-minute cache
        },
        body: icalData
    };
};
```

**Frontend - JavaScript Functions** (`js/app.js`):
```javascript
async function connectCalendar() {
    const icalUrl = elements.icalUrlInput.value.trim();
    
    // Validate URL
    if (!icalUrl || !icalUrl.startsWith('https://')) {
        alert('Please enter a valid ICS URL');
        return;
    }
    
    // Save URL to localStorage
    localStorage.setItem(CONFIG.storageKeys.calendarUrl, icalUrl);
    state.calendarConnected = true;
    
    // Show connected view
    elements.calendarAuth.style.display = 'none';
    elements.calendarConnected.style.display = 'block';
    
    // Load events
    await loadCalendarEvents();
}

async function loadCalendarEvents() {
    const icalUrl = localStorage.getItem(CONFIG.storageKeys.calendarUrl);
    if (!icalUrl) return;
    
    try {
        // Fetch via Netlify proxy
        const response = await fetch(`/.netlify/functions/ical-proxy?url=${encodeURIComponent(icalUrl)}`);
        const icalData = await response.text();
        
        // Parse with iCal.js
        const jcalData = ICAL.parse(icalData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');
        
        // Convert to event objects
        const now = new Date();
        const events = vevents
            .map(vevent => {
                const event = new ICAL.Event(vevent);
                return {
                    title: event.summary,
                    start: event.startDate.toJSDate(),
                    end: event.endDate.toJSDate(),
                    location: event.location
                };
            })
            .filter(event => event.start >= now) // Only upcoming
            .sort((a, b) => a.start - b.start) // Sort by date
            .slice(0, 5); // Next 5 events
        
        // Cache events (5-minute TTL)
        localStorage.setItem(CONFIG.storageKeys.calendarEvents, JSON.stringify(events));
        localStorage.setItem(CONFIG.storageKeys.calendarTimestamp, Date.now().toString());
        
        displayEvents(events);
    } catch (error) {
        console.error('Calendar error:', error);
        // Show error UI
    }
}

function displayEvents(events) {
    if (!events.length) {
        elements.eventsList.innerHTML = '<p>No upcoming events</p>';
        return;
    }
    
    elements.eventsList.innerHTML = events.map(event => {
        const startDate = new Date(event.start);
        const dateStr = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const timeStr = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        
        return `
            <div class="event-card glass-card">
                <div class="event-date">${startDate.getDate()}</div>
                <div class="event-details">
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">${timeStr}</div>
                    ${event.location ? `<div class="event-location">${event.location}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function checkCalendarConnection() {
    const icalUrl = localStorage.getItem(CONFIG.storageKeys.calendarUrl);
    if (icalUrl) {
        state.calendarConnected = true;
        elements.calendarAuth.style.display = 'none';
        elements.calendarConnected.style.display = 'block';
        
        // Load cached events or fetch fresh
        const cachedEvents = localStorage.getItem(CONFIG.storageKeys.calendarEvents);
        const timestamp = localStorage.getItem(CONFIG.storageKeys.calendarTimestamp);
        
        if (cachedEvents && timestamp && (Date.now() - parseInt(timestamp)) < 5 * 60 * 1000) {
            displayEvents(JSON.parse(cachedEvents));
        } else {
            loadCalendarEvents();
        }
    }
}
```

**HTML Structure** (`index.html`):
```html
<div class="calendar-auth" id="calendar-auth">
    <h3>Connect Your Outlook Calendar</h3>
    <ol class="auth-steps">
        <li>Open Outlook Web and sign in</li>
        <li>Settings → View all Outlook settings</li>
        <li>Calendar → Shared calendars</li>
        <li>Publish a calendar → Copy ICS link</li>
    </ol>
    <input type="url" id="ical-url-input" placeholder="Paste ICS URL here...">
    <button id="connect-calendar-btn">Connect</button>
</div>

<div class="calendar-connected" id="calendar-connected" style="display: none;">
    <button id="disconnect-calendar-btn">Disconnect</button>
    <button id="refresh-calendar-btn">Refresh Events</button>
    <div id="events-list"></div>
</div>
```

**Dependencies**:
- iCal.js library (CDN): `<script src="https://cdn.jsdelivr.net/npm/ical.js@1.5.0/build/ical.min.js"></script>`

**localStorage Keys**:
- `welcomePage_calendarUrl` - ICS feed URL
- `welcomePage_calendarEvents` - Cached event array (JSON)
- `welcomePage_calendarTimestamp` - Cache timestamp

**Benefits**:
- ✅ No API keys required
- ✅ No admin permissions needed (perfect for university accounts)
- ✅ No OAuth flow complexity
- ✅ Read-only access (secure)
- ✅ Works with personal, Office 365, and university Outlook accounts
- ✅ Simple user experience (just paste URL)
- ✅ Privacy-friendly (URL stored locally only)

**Alternative Approaches (Not Implemented)**:

**Microsoft Graph API (Requires Admin)**:
```javascript
// Requires Azure AD app registration + admin consent
// Good for: Enterprise apps with IT support
// Bad for: University accounts, personal projects

### Useful Third-Party APIs

**News Headlines**: NewsAPI.org (free tier)
```javascript
fetch(`https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEY}`)
```

**Time Zone**: WorldTimeAPI.org (no auth)
```javascript
fetch('https://worldtimeapi.org/api/timezone/America/New_York')
```

**Cryptocurrency Prices**: CoinGecko API (no auth)
```javascript
fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
```

**Stock Prices**: Alpha Vantage API (free key)
```javascript
fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=${API_KEY}`)
```

**IP Geolocation**: ipapi.co (no auth, rate limited)
```javascript
fetch('https://ipapi.co/json/') // Auto-detect user location
```

All API integrations should:
1. Store API keys in `CONFIG` object (never commit keys to Git - use `.env` locally, Netlify env vars in production)
2. Implement error handling with fallback to cached data
3. Respect rate limits via localStorage timestamps
4. Show loading states in UI

### Parallax System
3D effect driven by mouse position or device orientation:
- `mousemove` → updates `state.mousePosition` → `updateParallax()` transforms layers
- Each `.parallax-layer` translates based on `data-depth * mousePosition * 50px`
- Toggle via `state.settings.parallaxEnabled`

## Important Constraints

### Browser localStorage Limits
- ~5-10MB total per origin (browser-dependent)
- **Solution implemented**: Removed base64 image uploads, use preset image paths from `img/` folder
- Only lightweight data stored: settings (~1KB), selected image paths (~500 bytes), cached API responses (~5KB total)
- Total localStorage usage: < 50KB (vs 5MB+ with base64 images)

```javascript
// Check storage size
function checkStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += (localStorage[key].length + key.length) * 2; // UTF-16 encoding
        }
    }
    return total / 1024 / 1024; // MB
}
```

If users have old base64 data, instruct them to run: `localStorage.removeItem('welcomePage_images')`. See `STORAGE_CLEANUP.md` for details.

### No Build Process
- Cannot use imports/exports beyond native ES modules
- No transpilation - use browser-compatible JS only
- No preprocessors - plain CSS with native custom properties
- CDN dependencies (Font Awesome, Google Fonts) in `index.html`
- **API Keys**: Use Netlify Functions for secure API key management:
  1. Create functions in `netlify/functions/` directory
  2. Add environment variables in Netlify dashboard (Site settings → Environment variables → Add a variable)
  3. Functions access keys via `process.env.VARIABLE_NAME`
  4. Frontend calls `/.netlify/functions/function-name` instead of external APIs
  5. Example functions: `weather.js`, `api-ninjas-quote.js`, `fact.js`, `joke.js`, `word-of-day.js`
  6. See `NETLIFY_SECURITY.md` for complete implementation guide
  7. See `API_KEYS_GUIDE.md` for getting API keys
  8. See `DEPLOYMENT_CHECKLIST.md` for testing checklist

### Performance Considerations
- Parallax runs on `mousemove` - already throttled via CSS `transition: 0.1s`
- Auto-cycle interval configurable (default 10 min) to avoid excessive reflows
- Background images applied to 3 layers simultaneously - avoid large files

## Testing Checklist
When modifying:
1. Test overlay open/close (ESC key, backdrop click, close button)
2. Verify localStorage persistence (refresh page)
3. Check mobile responsive behavior (overlays should be scrollable)
4. Test with no images selected (default gradient)
5. Validate settings sync between UI controls and localStorage
6. Test all content types (quote/fact/joke/word) with refresh button
7. Verify weather widget displays with geolocation (or IP fallback)
8. Check that Netlify Functions work via `netlify dev` (not direct file:// opening)
9. Verify content type persists across page refreshes
10. Test preset image selection/deselection
11. **Test calendar integration:**
    - Connect with valid Outlook ICS URL
    - Verify events display (next 5 upcoming)
    - Test refresh events button
    - Test disconnect button
    - Verify calendar reconnects on page reload
    - Test with invalid URL (should show error)
    - Check 5-minute caching works

## Key Files Reference
- `NETLIFY_SECURITY.md` - Deployment and API key security guide
- `API_KEYS_GUIDE.md` - Step-by-step API key signup instructions
- `DEPLOYMENT_CHECKLIST.md` - Complete deployment and testing checklist
- `STORAGE_CLEANUP.md` - Instructions for clearing old localStorage data
- `TESTING_LOCALLY.md` - Local development with `netlify dev`
- `.env.example` - Template for local environment variables
