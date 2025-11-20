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

### Calendar APIs (Stub Implementation)
- **Microsoft**: `CONFIG.calendar.microsoft` requires Azure AD app registration
- **Google**: `CONFIG.calendar.google` requires OAuth credentials
- Current code shows setup instructions - actual auth not implemented
- To implement: Add MSAL.js or Google API client library, update `initCalendar()` function

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
- Consider implementing size check before `addImage()`

### No Build Process
- Cannot use imports/exports beyond native ES modules
- No transpilation - use browser-compatible JS only
- No preprocessors - plain CSS with native custom properties
- CDN dependencies (Font Awesome, Google Fonts) in `index.html`

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
