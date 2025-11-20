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

### 💡 Dynamic Content
- **Four Content Types**:
  - **Inspirational Quotes** - Wisdom from great thinkers (API Ninjas + Quotable API)
  - **Random Facts** - Learn something new every day (API Ninjas)
  - **Clean Jokes** - Add some humor to your day (API Ninjas)
  - **Word of the Day** - Expand your vocabulary with definitions (API Ninjas)
- **Content Selector** - Easy navigation with icon buttons (quote/fact/joke/word)
- **Smart Caching** - Stores content locally for offline use
- **Refresh Button** - Get new content anytime with one click
- **Persistent Selection** - Remembers your last content type preference
- **Beautiful Typography** - Elegant presentation with glassmorphism

### 🌤️ Weather Widget
- **Real-time Weather** - Displays current temperature and conditions
- **Auto-location** - Uses geolocation to detect your location
- **Smart Caching** - Updates every 30 minutes to respect API limits
- **Weather Icons** - Beautiful animated weather icons from OpenWeatherMap
- **Configurable Units** - Choose between Celsius and Fahrenheit

### 🖼️ Image Management
- **Preset Images** - Select from images in the `img/` folder (no localStorage limits!)
- **Easy Gallery** - Simple interface to select/deselect preset images
- **Smart Selection** - Visual indicators show selected images
- **Auto-Cycling** - Automatically changes background at set intervals (configurable)
- **3D Parallax Effect** - Each image gets the beautiful depth effect
- **Add Your Own** - Just drop image files in `img/` folder and update `CONFIG.presetImages` array

### 📅 Calendar Integration
- **Outlook Calendar** - Connect via iCal feed (no admin permissions needed!)
- **Simple Setup** - Just paste your calendar's ICS URL
- **Upcoming Events** - View next 5 events with date, time, and location
- **Auto-Refresh** - Events cached for 5 minutes, manual refresh available
- **Persistent Connection** - Calendar URL saved locally for automatic reconnection
- **Privacy First** - Calendar URL stored in browser only, never on server
- **Perfect for University Accounts** - Works without Microsoft Graph API admin setup

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
3. **Optional**: Configure API keys for weather and dynamic content (see guides below)
4. Add preset images to `img/` folder and update `CONFIG.presetImages` in `js/app.js`
5. Customize your name and settings
6. **Optional**: Connect Outlook calendar via iCal feed (no API setup required!)

### 📚 Documentation Guides

- **[API Keys Guide](API_KEYS_GUIDE.md)** - Step-by-step instructions to get free API keys for OpenWeatherMap and API Ninjas
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Complete checklist for deploying to Netlify with testing steps
- **[Security Setup](NETLIFY_SECURITY.md)** - How to securely manage API keys with Netlify Functions

### Configuration

#### Weather Widget & Dynamic Content (Recommended)
To enable all features with secure API key management:

1. **Get API Keys** (Free):
   - [OpenWeatherMap API](https://openweathermap.org/api) - For weather widget
   - [API Ninjas](https://api-ninjas.com) - For quotes, facts, jokes, and words
   - See [API_KEYS_GUIDE.md](API_KEYS_GUIDE.md) for detailed instructions

2. **Deploy to Netlify**:
   - Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete setup
   - Add API keys as environment variables (never commit them to code)
   - Netlify Functions will securely proxy API requests

3. **Local Development** (Optional):
   - Create `.env` file in project root (see `.env.example`)
   - Add your API keys to `.env`
   - Use Netlify CLI to test functions locally

#### Alternative: Direct API Configuration (Not Recommended)
If not deploying to Netlify, you can use direct API calls:

1. Open `js/app.js`
2. Update the CONFIG object:
   ```javascript
   weather: {
       apiKey: 'your_openweathermap_key_here',
       units: 'metric', // or 'imperial' for Fahrenheit
       updateInterval: 30, // minutes
       useNetlifyFunction: false // Set to false for direct API
   },
   apiNinjas: {
       apiKey: 'your_api_ninjas_key_here',
       useNetlifyFunction: false // Set to false for direct API
   }
   ```
⚠️ **Warning**: This exposes your API keys in the browser. Only use for local testing.

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
   - **Secure**: Uses Netlify Functions to hide API keys from browser
   - See `NETLIFY_SECURITY.md` for detailed security setup guide

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
- **File size**: No limits! Images stored as file paths, not in localStorage
- **Adding images**: Place files in `img/` folder and add paths to `CONFIG.presetImages` array

## 📅 Calendar Setup (Optional)

### Outlook Calendar via iCal Feed

**No API keys, no admin permissions, no complex setup required!**

1. **Get Your Calendar ICS URL**
   - Open [Outlook Web](https://outlook.office.com)
   - Click Settings ⚙️ → View all Outlook settings
   - Go to Calendar → Shared calendars
   - Under "Publish a calendar", select your calendar
   - Click **Publish** and copy the **ICS link**

2. **Connect in Dashboard**
   - Click the calendar icon in the navigation
   - Paste your ICS URL
   - Click **Connect**

3. **Done!**
   - Your next 5 upcoming events will display
   - Events refresh every 5 minutes automatically
   - URL saved locally in your browser for automatic reconnection
   - Click **Refresh Events** anytime for latest updates

**Works with:**
- Personal Outlook accounts (outlook.com, outlook.live.com)
- Office 365 / Microsoft 365 accounts
- University/School Outlook accounts (no admin needed!)

**Privacy:** Your calendar URL is stored in browser localStorage only - never sent to any server except Outlook to fetch your events.

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
├── index.html                    # Main HTML file
├── css/
│   └── style.css                 # All styles with glassmorphism
├── js/
│   └── app.js                    # Main application logic (~1200 lines)
├── img/
│   ├── 0.jpg - 8.jpg            # Preset background images
│   └── favicon.ico               # Site favicon
├── netlify/
│   └── functions/                # Serverless API proxies
│       ├── weather.js            # OpenWeatherMap proxy
│       ├── api-ninjas-quote.js   # Quotes proxy
│       ├── fact.js               # Facts proxy
│       ├── joke.js               # Jokes proxy
│       ├── word-of-day.js        # Word definitions proxy
│       └── ical-proxy.js         # Calendar feed proxy
├── .github/
│   └── copilot-instructions.md   # AI agent guidance
├── netlify.toml                  # Netlify configuration
├── README.md                     # This file
├── SETUP.md                      # Deployment guide
├── CHANGELOG.md                  # Version history
├── API_KEYS_GUIDE.md            # API key signup instructions
├── DEPLOYMENT_CHECKLIST.md       # Testing checklist
├── NETLIFY_SECURITY.md          # Security best practices
└── STORAGE_CLEANUP.md           # localStorage cleanup guide
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

**Images not showing?**
- Verify image files exist in `img/` folder
- Check paths in `CONFIG.presetImages` array match actual files
- Refresh browser cache (Ctrl+F5)

**Parallax not working?**
- Check if "Parallax Effect" is enabled in Settings
- Some browsers limit JavaScript on file:// URLs - deploy to Netlify
- Try a different browser (Chrome/Edge recommended)

**Calendar not connecting?**
- Verify you copied the **ICS link** (not HTML link) from Outlook
- Ensure URL starts with `https://outlook.office365.com` or similar
- Check browser console (F12) for error messages
- Try refreshing events manually
- Make sure calendar is published in Outlook settings

**Weather/quotes not loading?**
- API keys must be configured in Netlify environment variables
- Test locally with `netlify dev` command
- Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for setup steps

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
