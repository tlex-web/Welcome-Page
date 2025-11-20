# Copilot Instructions - Modern Welcome Dashboard

## Project Overview
A vanilla JavaScript browser homepage with glassmorphism UI, 3D parallax backgrounds, and localStorage persistence. Static site deployed to Netlify - no build process or backend.

## Architecture & Key Files

### Core Structure
- **`index.html`** - Single-page app with three overlays (images, calendar, settings)
- **`js/app.js`** - Modular vanilla JS (no framework). Exports `window.WelcomeDashboard` API
- **`css/style.css`** - CSS custom properties (`:root` variables), glassmorphism effects, 773 lines

### State Management
All state lives in `localStorage` with namespaced keys (`welcomePage_*`):
- `userName` - Editable greeting name
- `images` - Array of base64 image data URLs
- `settings` - Parallax toggle, auto-cycle interval, time format
- `currentImage` - Active background index

State object in `app.js` mirrors localStorage and is single source of truth.

## Development Workflows

### Local Testing
```powershell
# Just open in browser - no server needed
start index.html
```

### Deployment
Deploys to Netlify via Git push (connected to GitHub). Configuration in `netlify.toml`:
- Publish directory: `.` (root)
- No build command
- Headers for caching and security
- SPA redirect: `/* → /index.html`

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
Images stored as base64 in localStorage (5MB limit per origin). For new image features:
```javascript
const reader = new FileReader();
reader.onload = (event) => {
    addImage(event.target.result); // Adds to state.images array
};
reader.readAsDataURL(file);
```

## Integration Points

### Weather Widget Implementation
Add real-time weather using OpenWeatherMap API (free tier):

```javascript
// In CONFIG object
weather: {
    apiKey: '', // Get from openweathermap.org/api
    units: 'metric', // or 'imperial'
    updateInterval: 30 // minutes
}

// Fetch weather
async function updateWeather() {
    const position = await getCurrentPosition(); // Use Geolocation API
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&units=${CONFIG.weather.units}&appid=${CONFIG.weather.apiKey}`
    );
    const data = await response.json();
    displayWeather(data); // Update DOM with temp, condition, icon
}
```

Add weather card in `index.html` main content area, use glassmorphism styling. Store last fetch in localStorage with timestamp to avoid excessive API calls.

### Motivational Quotes API
Replace hardcoded array with API integration:

**Option 1: ZenQuotes API** (no auth required)
```javascript
async function fetchQuote() {
    try {
        const response = await fetch('https://zenquotes.io/api/random');
        const [quote] = await response.json();
        elements.motivation.textContent = `"${quote.q}" — ${quote.a}`;
    } catch (error) {
        // Fallback to cached quote from localStorage
        displayCachedQuote();
    }
}
```

**Option 2: Quotable API** (more reliable, CORS-friendly)
```javascript
async function fetchQuote() {
    const response = await fetch('https://api.quotable.io/random?tags=inspirational');
    const quote = await response.json();
    // Cache to localStorage for offline use
    localStorage.setItem('welcomePage_lastQuote', JSON.stringify(quote));
}
```

Always cache last successful quote for offline/rate-limit scenarios.

### Image Management Solutions

**Approach 1: Netlify Large Media (Git LFS)**
Use Netlify Large Media for image transformation and CDN delivery:

1. Install Git LFS: `git lfs install`
2. Configure `.lfsconfig`:
   ```
   [lfs]
   url = https://quizzical-dijkstra-c67ddf.netlify.app/.netlify/large-media
   ```
3. Track images: `git lfs track "img/**"`
4. Reference images in `app.js`:
   ```javascript
   const presetImages = [
       'img/background1.jpg',
       'img/background2.jpg',
       'img/background3.jpg'
   ];
   ```
5. Use Netlify transforms: `img/bg1.jpg?nf_resize=fit&w=1920`

**Approach 2: Local img/ Folder Browser**
Add image selector for files in `img/` directory:

```javascript
// Add to CONFIG
presetImages: [
    'img/background1.jpg',
    'img/background2.jpg',
    // Auto-scan not possible in static site - manually list
]

function renderImageSelector() {
    CONFIG.presetImages.forEach((path, index) => {
        const item = document.createElement('div');
        item.className = 'preset-image-item';
        item.innerHTML = `
            <img src="${path}" alt="Preset ${index + 1}">
            <button class="select-btn" data-path="${path}">Use This</button>
        `;
        elements.presetGallery.appendChild(item);
    });
}

function selectPresetImage(path) {
    if (!state.selectedImages.includes(path)) {
        state.selectedImages.push(path);
        saveSelectedImages(); // Store paths only, not base64
    }
}
```

Update gallery UI to show two tabs: "Uploaded" (base64, size warning) and "Preset" (from img/).

**Approach 3: External Image Hosting**
Use Cloudinary or Imgur for user uploads:

```javascript
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'YOUR_PRESET'); // Unsigned preset
    
    const response = await fetch(
        'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
        { method: 'POST', body: formData }
    );
    const data = await response.json();
    return data.secure_url; // Store URL instead of base64
}
```

Store image URLs in localStorage instead of base64 data.

### Calendar Authentication Patterns

**Microsoft Graph API (Outlook/Teams)**
```javascript
// Add MSAL library to index.html
<script src="https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js"></script>

// Initialize MSAL
const msalConfig = {
    auth: {
        clientId: CONFIG.calendar.microsoft.clientId,
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: window.location.origin
    }
};
const msalInstance = new msal.PublicClientApplication(msalConfig);

async function connectMicrosoftCalendar() {
    const loginRequest = { scopes: ['Calendars.Read', 'Tasks.Read'] };
    const response = await msalInstance.loginPopup(loginRequest);
    const accessToken = response.accessToken;
    
    // Fetch calendar events
    const events = await fetch('https://graph.microsoft.com/v1.0/me/events?$top=5', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    displayEvents(await events.json());
}
```

**Google Calendar API**
```javascript
// Add Google API library
<script src="https://apis.google.com/js/api.js"></script>

function initGoogleCalendar() {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: CONFIG.calendar.google.apiKey,
            clientId: CONFIG.calendar.google.clientId,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: 'https://www.googleapis.com/auth/calendar.readonly'
        });
    });
}

async function connectGoogleCalendar() {
    await gapi.auth2.getAuthInstance().signIn();
    const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
    });
    displayEvents(response.result.items);
}
```

Store OAuth tokens in localStorage with expiry checks. Implement refresh token logic.

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
- Images are base64 (33% larger than binary)
- No warning when approaching limit - fails silently
- **Solution**: Use image URLs (Cloudinary/Netlify Large Media) or local `img/` folder references instead of base64
- If keeping base64, implement size check:
  ```javascript
  function checkStorageSize() {
      let total = 0;
      for (let key in localStorage) {
          total += localStorage[key].length + key.length;
      }
      return (total / 1024 / 1024).toFixed(2); // MB
  }
  ```

### No Build Process
- Cannot use imports/exports beyond native ES modules
- No transpilation - use browser-compatible JS only
- No preprocessors - plain CSS with native custom properties
- CDN dependencies (Font Awesome, Google Fonts) in `index.html`
- **API Keys**: Use Netlify Functions for secure API key management:
  1. Create functions in `netlify/functions/` directory
  2. Add environment variables in Netlify dashboard (Site settings → Environment variables)
  3. Functions access keys via `process.env.VARIABLE_NAME`
  4. Frontend calls `/.netlify/functions/function-name` instead of external APIs
  5. Example: `weather.js` and `quote.js` functions proxy API calls
  6. See `NETLIFY_SECURITY.md` for complete implementation guide

### Performance Considerations
- Parallax runs on `mousemove` - already throttled via CSS `transition: 0.1s`
- Auto-cycle interval configurable (default 10 min) to avoid excessive reflows
- Background images applied to 3 layers simultaneously - avoid large files

## Testing Checklist
When modifying:
1. Test overlay open/close (ESC key, backdrop click, close button)
2. Verify localStorage persistence (refresh page)
3. Check mobile responsive behavior (overlays should be scrollable)
4. Test with no images uploaded (default gradient)
5. Validate settings sync between UI controls and localStorage
