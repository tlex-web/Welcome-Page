# 🚀 Setup & Deployment Guide

## Quick Start (Local Development)

1. **Open the project**
   - Simply open `index.html` in your web browser
   - No build process or server required!
   - For full features (weather, quotes, calendar), use `netlify dev` command

2. **Add preset images**
   - Place your landscape photos in `img/` folder
   - Open `js/app.js` and add paths to `CONFIG.presetImages` array:
     ```javascript
     presetImages: [
         'img/0.jpg',
         'img/1.jpg',
         'img/your-photo.jpg'
     ]
     ```
   - Click images icon (📷) in app to select/deselect images

3. **Customize**
   - Click your name to edit it
   - Click the gear icon (⚙️) for settings
   - Click content selector buttons for different content types
   - Click calendar icon to connect Outlook calendar (optional)

4. **Test with Netlify Dev** (for API features)
   ```powershell
   npm install -g netlify-cli
   cd "c:\Users\tim\MyDocuments\Programming\my_welcome_page"
   netlify dev
   # Open http://localhost:8888
   ```

## Deploying to Netlify

### Method 1: Drag & Drop (Easiest)

1. **Prepare files**
   - Zip your entire project folder
   - Or just drag the folder directly

2. **Deploy**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag your folder or zip file
   - Wait for deployment (usually < 1 minute)
   - Your site is live! 🎉

### Method 2: Git Integration (Recommended)

1. **Initialize Git repository**
   ```powershell
   cd "c:\Users\tim\MyDocuments\Programming\my_welcome_page"
   git init
   git add .
   git commit -m "Initial commit - Modern Welcome Dashboard"
   ```

2. **Create GitHub repository**
   - Go to [GitHub](https://github.com/new)
   - Create new repository: "Welcome-Page"
   - Don't initialize with README (we already have one)

3. **Push to GitHub**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/Welcome-Page.git
   git branch -M master
   git push -u origin master
   ```

4. **Deploy to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize
   - Select your "Welcome-Page" repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `.` (root)
   - Click "Deploy site"

5. **Configure custom domain (optional)**
   - In Netlify dashboard → "Domain settings"
   - Click "Add custom domain"
   - Follow DNS configuration steps

### Method 3: Netlify CLI

1. **Install Netlify CLI**
   ```powershell
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```powershell
   netlify login
   ```

3. **Deploy**
   ```powershell
   cd "c:\Users\tim\MyDocuments\Programming\my_welcome_page"
   netlify deploy --prod
   ```

## Setting Up Calendar Integration

### Outlook Calendar via iCal Feed

**✅ No admin permissions required - perfect for university/school accounts!**

**Prerequisites:**
- Outlook account (personal, Office 365, or university)
- Access to Outlook Web

**Steps:**

1. **Get Your Calendar ICS URL**
   - Open https://outlook.office.com and sign in
   - Click Settings ⚙️ (top right) → **View all Outlook settings**
   - Navigate to **Calendar** → **Shared calendars**
   - Under **Publish a calendar**, select your calendar from dropdown
   - Click **Publish** button
   - Copy the **ICS link** (looks like `https://outlook.office365.com/.../calendar.ics`)
   - ⚠️ Note: Copy the **ICS** link, not the HTML link

2. **Connect in Dashboard**
   - Open your welcome dashboard
   - Click the calendar icon in the navigation bar
   - Paste your ICS URL into the input field
   - Click **Connect** button

3. **Done!**
   - Your next 5 upcoming events will display
   - Events automatically refresh every 5 minutes
   - Calendar URL saved in browser localStorage
   - Click **Refresh Events** anytime for latest updates
   - Click **Disconnect** to remove calendar

**How it works:**
- iCal feed is a standard calendar format (no API required)
- Your calendar URL is stored locally in browser only
- Netlify Function proxies requests to avoid CORS issues
- Events parsed with iCal.js library
- Read-only access (perfect for display purposes)

**Privacy & Security:**
- Calendar URL stored in browser localStorage only
- URL never sent to any server except Outlook (to fetch events)
- No authentication tokens stored
- No server-side storage
- Disconnect anytime to clear URL from browser

**Supported Accounts:**
- Personal Outlook (outlook.com, outlook.live.com)
- Microsoft 365 / Office 365
- University/School Outlook accounts
- Organization Outlook accounts

**Troubleshooting:**
- **"Could not load events"** - Verify you copied the ICS link (not HTML)
- **No events showing** - Ensure calendar is published in Outlook settings
- **Events not updating** - Click "Refresh Events" button manually
- **Invalid URL error** - URL must be from outlook.office365.com or similar domain
## Features Overview

### ✅ Working Out of the Box
   2. Navigate to "Azure Active Directory"
   3. Click "App registrations" → "New registration"
   4. Application name: "Welcome Dashboard"
   5. Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   6. Redirect URI: 
      - Type: Single-page application (SPA)
      - URI: https://your-site.netlify.app (your actual Netlify URL)
   7. Click "Register"
   ```

2. **Configure API Permissions**
   ```
   1. In your app, go to "API permissions"
   2. Click "Add a permission" → "Microsoft Graph"
   3. Select "Delegated permissions"
   4. Add these permissions:
      - Calendars.Read
      - Tasks.Read
      - User.Read
   5. Click "Add permissions"
   6. Click "Grant admin consent" (if available)
   ```

3. **Get Application Credentials**
   ```
   1. Go to "Overview" in your app
   2. Copy "Application (client) ID"
   3. This is your CLIENT_ID
   ```

4. **Update Code**
   - Open `js/app.js`
   - Find line ~13: `CONFIG.calendar.microsoft`
   - Update:
     ```javascript
     microsoft: {
         clientId: 'YOUR_CLIENT_ID_HERE',
         redirectUri: 'https://your-site.netlify.app',
         scopes: ['Calendars.Read', 'Tasks.Read']
     }
     ```

5. **Add MSAL Library**
   - Add to `index.html` before closing `</head>`:
     ```html
     <script src="https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js"></script>
     ```

6. **Implement Authentication** (in `js/app.js`)
   ```javascript
   // After CONFIG definition, add:
   const msalConfig = {
       auth: {
           clientId: CONFIG.calendar.microsoft.clientId,
           authority: 'https://login.microsoftonline.com/common',
           redirectUri: CONFIG.calendar.microsoft.redirectUri
       }
   };
   
   const msalInstance = new msal.PublicClientApplication(msalConfig);
   
   async function connectMicrosoftCalendar() {
       try {
           const loginResponse = await msalInstance.loginPopup({
               scopes: CONFIG.calendar.microsoft.scopes
           });
           
           // Get access token
           const tokenResponse = await msalInstance.acquireTokenSilent({
               scopes: CONFIG.calendar.microsoft.scopes,
               account: loginResponse.account
           });
           
           // Fetch calendar events
           await fetchMicrosoftCalendar(tokenResponse.accessToken);
       } catch (error) {
           console.error('Calendar connection error:', error);
       }
   }
   
   async function fetchMicrosoftCalendar(accessToken) {
       const response = await fetch('https://graph.microsoft.com/v1.0/me/events?$top=10', {
           headers: {
               'Authorization': `Bearer ${accessToken}`
           }
       });
       const data = await response.json();
       displayEvents(data.value);
   }
   ```

### Google Calendar

**Prerequisites:**
- Google account
- Google Cloud Platform access

**Steps:**

1. **Create Google Cloud Project**
   ```
   1. Go to https://console.cloud.google.com
   2. Click "Select a project" → "New Project"
   3. Project name: "Welcome Dashboard"
   4. Click "Create"
   ```

2. **Enable Calendar API**
   ```
   1. In your project, go to "APIs & Services" → "Library"
   2. Search for "Google Calendar API"
   3. Click on it → Click "Enable"
   ```

3. **Create OAuth Credentials**
   ```
   1. Go to "APIs & Services" → "Credentials"
   2. Click "Create Credentials" → "OAuth client ID"
   3. If prompted, configure OAuth consent screen:
      - User Type: External
      - App name: "Welcome Dashboard"
      - Support email: your email
      - Scopes: Add "Google Calendar API" → "../auth/calendar.readonly"
   4. Application type: "Web application"
   5. Name: "Welcome Dashboard Web"
   6. Authorized redirect URIs: https://your-site.netlify.app
   7. Click "Create"
   8. Copy "Client ID" (save this)
   ```

4. **Create API Key**
   ```
   1. Click "Create Credentials" → "API key"
   2. Copy the API key
   3. Click "Restrict Key"
   4. API restrictions → "Restrict key" → Select "Google Calendar API"
   5. Click "Save"
   ```

5. **Update Code**
   - Open `js/app.js`
   - Find line ~20: `CONFIG.calendar.google`
   - Update:
     ```javascript
     google: {
         apiKey: 'YOUR_API_KEY_HERE',
         clientId: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
         scopes: 'https://www.googleapis.com/auth/calendar.readonly'
     }
     ```

6. **Add Google API Library**
   - Add to `index.html` before closing `</head>`:
     ```html
     <script src="https://apis.google.com/js/api.js"></script>
     <script src="https://accounts.google.com/gsi/client"></script>
     ```

## Features Overview

### ✅ Working Out of the Box
- Real-time clock with date
- Dynamic time-based greetings
- Four content types (quotes, facts, jokes, words)
- Editable name (persisted in localStorage)
- 3D parallax effect
- Preset image management
- Settings customization
- Responsive design
- All data stored locally in browser

### 🔧 Requires Setup (Optional)
- Weather widget (needs OpenWeatherMap API key in Netlify)
- Dynamic content (needs API Ninjas key in Netlify)
- Outlook calendar (needs ICS URL from Outlook Web - no API!)
- Custom domain (Netlify feature)

## Troubleshooting

## Troubleshooting

### Images Not Showing?
- **Check file paths:** Verify images exist in `img/` folder
- **Check CONFIG:** Ensure paths in `CONFIG.presetImages` match actual files
- **Check format:** Use JPG, PNG, or WebP formats
- **Clear cache:** Try Ctrl+F5 to hard refresh browser

### Parallax Not Working?
- **Check settings:** Ensure parallax is enabled in Settings overlay
- **Browser support:** Some older browsers don't support CSS 3D transforms
- **File protocol:** Parallax works better on deployed sites (not file://)
- **Try different browser:** Chrome/Edge recommended

### Calendar Won't Connect?
- **Check URL:** Must be ICS link from Outlook (starts with https://outlook.office365.com)
- **Check published:** Ensure calendar is published in Outlook Web settings
- **Check console:** Open DevTools (F12) and check Console tab for errors
- **Try refresh:** Click "Refresh Events" button after connecting
- **Verify domain:** URL must be from allowed domains (outlook.office365.com, outlook.office.com, outlook.live.com)

### Weather/Quotes Not Loading?
- **Check API keys:** Must be configured in Netlify environment variables
- **Test locally:** Use `netlify dev` command to test functions
- **Check console:** Open DevTools (F12) for error messages
- **See docs:** Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for setup

### LocalStorage Issues?
```javascript
// Check storage usage in browser console:
console.log('LocalStorage size:', 
    JSON.stringify(localStorage).length / 1024, 'KB');

// Clear if needed:
localStorage.clear();
```

## Performance Tips

1. **Optimize Images**
   - Use JPG for photos (smaller than PNG)
   - Resize to 1920x1080 before uploading
   - Use tools like TinyPNG to compress

2. **Limit Active Images**
   - Keep 5-15 images for best performance
   - Delete unused images from gallery

3. **Browser Choice**
   - Chrome/Edge recommended for best performance
   - Hardware acceleration should be enabled

## Security Notes

- **API Keys:** Never commit API keys to public repositories
- **localStorage:** Data is accessible to JavaScript - don't store sensitive info
- **HTTPS:** Always use HTTPS in production (Netlify provides this free)
- **CSP:** Consider adding Content Security Policy headers for production

## Updates & Maintenance

### Updating the Site
```powershell
# Make your changes, then:
git add .
git commit -m "Description of changes"
git push

# Netlify will automatically deploy!
```

### Backing Up Images
```javascript
// Export images from browser console:
const images = JSON.parse(localStorage.getItem('welcomePage_images'));
console.log(images); // Copy these data URLs to a file
```

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
- [Google Calendar API](https://developers.google.com/calendar)
- [MDN Web Docs](https://developer.mozilla.org/)

## Support

- **Issues:** Open an issue on GitHub repository
- **Questions:** Check existing issues first
- **Contributions:** Pull requests welcome!

---

**Made with ❤️ for productivity and inspiration**
