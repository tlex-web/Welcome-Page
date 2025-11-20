# 🚀 Setup & Deployment Guide

## Quick Start (Local Development)

1. **Open the project**
   - Simply open `index.html` in your web browser
   - No build process or server required!

2. **Upload your images**
   - Click the images icon (📷) in the top left
   - Select "Upload Images"
   - Choose your landscape photos (recommended: 1920x1080 or higher)
   - Your images are stored locally in browser localStorage

3. **Customize**
   - Click your name to edit it
   - Click the gear icon (⚙️) for settings
   - Click the refresh icon (🔄) for a new motivational quote

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

### Microsoft Outlook/Teams Calendar

**Prerequisites:**
- Microsoft 365 account or Outlook.com account
- Azure AD access (for app registration)

**Steps:**

1. **Register Application in Azure**
   ```
   1. Go to https://portal.azure.com
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
- Motivational quotes (20+ quotes)
- Editable name (persisted)
- 3D parallax effect
- Image upload & management
- Settings customization
- Responsive design
- All data stored locally

### 🔧 Requires Setup
- Microsoft Outlook/Teams calendar integration
- Google Calendar integration
- Custom domain (optional)

## Troubleshooting

### Images Not Showing?
- **Check file size:** Keep images under 5MB each
- **Check format:** Use JPG, PNG, or WebP
- **Storage limit:** Browser localStorage has ~5-10MB total limit
- **Clear cache:** Try clearing browser cache and re-uploading

### Parallax Not Working?
- **Check settings:** Ensure parallax is enabled in Settings
- **Browser support:** Some older browsers don't support CSS transform-3d
- **File protocol:** Parallax works better on deployed sites (not file://)

### Calendar Won't Connect?
- **Check credentials:** Verify Client ID and API keys are correct
- **Check redirect URI:** Must match exactly (including https://)
- **Check permissions:** Ensure you granted necessary permissions
- **Console errors:** Open browser DevTools (F12) and check Console tab

### LocalStorage Full?
```javascript
// Check storage usage in browser console:
console.log('LocalStorage size:', 
    JSON.stringify(localStorage).length / 1024 / 1024, 'MB');

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
