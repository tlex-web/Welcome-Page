[![Netlify Status](https://api.netlify.com/api/v1/badges/3c71ad80-3cdb-4eb2-bf8f-d391ad590222/deploy-status)](https://app.netlify.com/sites/quizzical-dijkstra-c67ddf/deploys)

# 🌟 Modern Welcome Dashboard

A beautiful, modern welcome page with glassmorphism design, 3D parallax effects, and dynamic features. Perfect as a browser homepage or welcome screen.

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Beautiful frosted glass effect cards with backdrop blur
- **3D Parallax Background** - Interactive depth effect that follows mouse movement
- **Smooth Animations** - Elegant transitions and hover effects
- **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices

### ⏰ Time & Greetings
- **Real-time Clock** - Displays current time with configurable format (12/24 hour)
- **Dynamic Greetings** - Context-aware greetings based on time of day
- **Editable Name** - Click to personalize your greeting
- **Current Date** - Full date display with day of the week

### 💡 Motivation
- **Live API Integration** - Fetches inspirational quotes from Quotable API
- **Smart Caching** - Stores quotes locally for offline use
- **Fallback System** - Built-in collection of 20+ quotes if API unavailable
- **Refresh Button** - Get a new quote anytime with one click
- **Beautiful Typography** - Elegant quote presentation with glassmorphism

### 🌤️ Weather Widget
- **Real-time Weather** - Displays current temperature and conditions
- **Auto-location** - Uses geolocation to detect your location
- **Smart Caching** - Updates every 30 minutes to respect API limits
- **Weather Icons** - Beautiful animated weather icons from OpenWeatherMap
- **Configurable Units** - Choose between Celsius and Fahrenheit

### 🖼️ Image Management
- **Two Image Sources**:
  - **Upload Images** - Add your own photos (stored in browser localStorage)
  - **Preset Images** - Select from images in the `img/` folder (lightweight, uses paths)
- **Tabbed Gallery** - Clean interface to manage both uploaded and preset images
- **Storage Monitor** - Real-time warning when approaching localStorage limits
- **Smart Selection** - Click to set as background, select/deselect preset images
- **Auto-Cycling** - Automatically changes background at set intervals
- **3D Parallax Effect** - Each image gets the beautiful depth effect

### 📅 Calendar Integration (Ready for Setup)
- **Microsoft Outlook/Teams** - Ready for Office 365 calendar integration
- **Google Calendar** - Ready for Google Calendar integration
- **Upcoming Events** - View your meetings at a glance
- **Tasks Display** - See your to-do items
- **Setup Instructions** - Clear instructions provided in the app

### ⚙️ Settings
- **Parallax Toggle** - Enable/disable 3D parallax effect
- **Auto-Change Interval** - Configure background rotation timing
- **Time Format** - Switch between 12/24 hour format
- **Show Seconds** - Toggle seconds display
- **Reset to Defaults** - One-click reset option

## 🚀 Getting Started

### Quick Start
1. Clone or download this repository
2. Open `index.html` in your browser
3. **Optional**: Configure API keys (see Configuration below)
4. Upload your landscape images or add preset images to `img/` folder
5. Customize your name and settings

### Configuration

#### Weather Widget Setup (Optional)
To enable the weather widget:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Open `js/app.js`
3. Update the `CONFIG.weather.apiKey` with your key:
   ```javascript
   weather: {
       apiKey: 'your_api_key_here',
       units: 'metric', // or 'imperial' for Fahrenheit
       updateInterval: 30 // minutes
   }
   ```
4. Refresh the page - the weather widget will appear automatically

#### Preset Images Setup
To use local images from the `img/` folder instead of localStorage:

1. Add your images to the `img/` folder
2. Open `js/app.js`
3. Update the `CONFIG.presetImages` array:
   ```javascript
   presetImages: [
       'img/background1.jpg',
       'img/background2.jpg',
       'img/background3.jpg'
   ]
   ```
4. In the gallery, switch to the "Preset" tab to select images

**Benefits**: No localStorage limits, faster loading, better for large image collections!

### Netlify Deployment
This site is optimized for Netlify deployment:

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings: Leave default (static site)
   - Click "Deploy site"

3. **Environment Variables (for API Keys)**
   - In Netlify dashboard, go to Site settings → Environment variables
   - Add `WEATHER_API_KEY` with your OpenWeatherMap key
   - Use Netlify Functions to proxy API calls securely (see instructions file)

4. **Custom Domain (Optional)**
   - In Netlify dashboard, go to Domain settings
   - Add your custom domain
   - Follow DNS configuration instructions

## 📸 Image Recommendations

For best results with the 3D parallax effect:
- **Landscape orientation** images (16:9 or wider)
- **High resolution** (1920x1080 or higher)
- **Scenic photos** - Mountains, beaches, forests, cityscapes
- **Good depth** - Images with foreground/background elements work best
- **File size considerations**:
  - **Uploaded images**: Stored in localStorage (~5MB browser limit total)
  - **Preset images**: Use `img/` folder - no size limits!

## 🔐 Calendar Setup (Optional)

### Microsoft Outlook/Teams Calendar

1. **Register Azure AD Application**
   - Go to [Azure Portal](https://portal.azure.com)
   - Navigate to "Azure Active Directory" → "App registrations"
   - Click "New registration"
   - Name: "Welcome Dashboard Calendar"
   - Redirect URI: Your Netlify URL

2. **Configure Permissions**
   - In your app, go to "API permissions"
   - Add "Microsoft Graph" permissions:
     - `Calendars.Read`
     - `Tasks.Read`
   - Grant admin consent

3. **Get Credentials**
   - Copy "Application (client) ID"
   - Open `js/app.js`
   - Update `CONFIG.calendar.microsoft.clientId` with your Client ID

4. **Implement Authentication**
   - Add MSAL.js library for authentication
   - Update the calendar integration functions
   - See [Microsoft Graph API documentation](https://docs.microsoft.com/en-us/graph/auth-v2-user)

### Google Calendar

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project
   - Enable "Google Calendar API"

2. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Create "OAuth 2.0 Client ID"
   - Application type: Web application
   - Authorized redirect URI: Your Netlify URL

3. **Configure**
   - Copy Client ID and API Key
   - Update `js/app.js`:
     - `CONFIG.calendar.google.clientId`
     - `CONFIG.calendar.google.apiKey`

4. **Implement**
   - Add Google API client library
   - Implement OAuth flow
   - See [Google Calendar API documentation](https://developers.google.com/calendar/api/guides/overview)

## 🎯 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ℹ️ Internet Explorer not supported (uses modern CSS features)

## 🛠️ Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern features (Grid, Flexbox, backdrop-filter)
- **Vanilla JavaScript** - ES6+ modules
- **LocalStorage API** - Client-side data persistence
- **Font Awesome 6** - Icon library
- **Google Fonts** - Inter typeface

## 📁 Project Structure

```
my_welcome_page/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles with glassmorphism
├── js/
│   └── app.js          # Main application logic
├── img/
│   └── favicon.ico     # Site favicon
└── README.md           # This file
```

## 🔧 Customization

### Change Color Scheme
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #667eea;      /* Main gradient start */
    --secondary-color: #764ba2;    /* Main gradient end */
    --accent-color: #f093fb;       /* Accent highlights */
}
```

### Add More Quotes
Edit the `motivationalQuotes` array in `js/app.js`:
```javascript
const motivationalQuotes = [
    { text: "Your quote here", author: "Author Name" },
    // ... add more
];
```

### Modify Parallax Intensity
Adjust the depth values in HTML:
```html
<div class="parallax-layer" data-depth="0.1"></div>  <!-- Less movement -->
<div class="parallax-layer" data-depth="0.5"></div>  <!-- More movement -->
```

## 🐛 Troubleshooting

**Images not uploading?**
- Check browser localStorage quota (usually 5-10MB)
- Try smaller image file sizes
- Clear browser cache and try again

**Parallax not working?**
- Check if "Parallax Effect" is enabled in Settings
- Some browsers limit JavaScript on file:// URLs - deploy to Netlify
- Try a different browser

**Calendar not connecting?**
- Verify API credentials are correctly configured
- Check browser console for error messages
- Ensure redirect URIs match exactly

## 📝 License

All rights reserved © 2025

## 🙏 Credits

- Background photos: Your personal collection
- Icons: [Font Awesome](https://fontawesome.com)
- Font: [Inter by Rasmus Andersson](https://rsms.me/inter/)
- Inspiration: Modern glassmorphism design trends

## 🌐 Live Demo

Visit the live site: [Your Netlify URL]

## 💬 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Enjoy your beautiful new welcome page! 🎉**
