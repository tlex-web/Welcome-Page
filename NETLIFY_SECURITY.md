# Netlify Deployment with Secure API Keys

This guide explains how to deploy your Welcome Dashboard to Netlify with secure API key management using serverless functions.

## 🔐 Why Use Netlify Functions?

**Problem**: Storing API keys in frontend JavaScript exposes them to anyone who views your page source, allowing unauthorized use and potential abuse.

**Solution**: Netlify Functions are serverless functions that run on the server side, keeping your API keys secure and hidden from the browser.

## 📋 Prerequisites

1. A [Netlify](https://netlify.com) account (free tier works!)
2. Your code in a Git repository (GitHub, GitLab, or Bitbucket)
3. An OpenWeatherMap API key (get one free at [openweathermap.org/api](https://openweathermap.org/api))

## 🚀 Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

```powershell
cd "c:\Users\tim\MyDocuments\Programming\my_welcome_page"
git add .
git commit -m "Add Netlify Functions for secure API integration"
git push origin master
```

### Step 2: Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub)
4. Select your `Welcome-Page` repository
5. Configure build settings:
   - **Build command**: Leave empty (static site)
   - **Publish directory**: `.` (root)
   - **Functions directory**: `netlify/functions` (auto-detected)
6. Click **"Deploy site"**

### Step 3: Configure Environment Variables

This is where you securely store your API keys!

1. In your Netlify site dashboard, go to **Site settings**
2. Navigate to **Environment variables** (under "Build & deploy")
3. Click **"Add a variable"**
4. Add the following variables:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `WEATHER_API_KEY` | `your_openweathermap_key` | Your OpenWeatherMap API key |
   | `WEATHER_UNITS` | `metric` or `imperial` | Temperature units (optional) |

5. Click **"Save"**

### Step 4: Redeploy Your Site

After adding environment variables:

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for deployment to complete (~30 seconds)

### Step 5: Test Your Deployment

Visit your Netlify URL (e.g., `https://your-site.netlify.app`) and:

1. ✅ Check if the weather widget appears (allow location access)
2. ✅ Click the refresh quote button to test quote API
3. ✅ Open browser DevTools → Network tab to verify requests go to `/.netlify/functions/weather` instead of external APIs

## 🔍 How It Works

### Architecture Diagram

```
Browser (Frontend)
    ↓ (HTTPS request)
    ↓ /.netlify/functions/weather?lat=40&lon=-74
    ↓
Netlify Function (Server-side)
    ↓ (uses process.env.WEATHER_API_KEY)
    ↓ Hidden from browser
    ↓
OpenWeatherMap API
    ↓
    ↓ (weather data)
    ↓
Browser receives data (no API key visible!)
```

### What Happens in Production

1. **Browser calls Netlify Function**: `fetch('/.netlify/functions/weather?lat=40&lon=-74')`
2. **Netlify Function runs server-side**: Accesses `process.env.WEATHER_API_KEY`
3. **Function calls real API**: Uses the secure API key
4. **Returns data to browser**: Only the weather data is sent, not the key

### Local Development

For local testing, you have two options:

**Option 1: Use Direct API Calls (Temporary)**
- Set `CONFIG.weather.apiKey` in `app.js`
- Keep `CONFIG.weather.useNetlifyFunction = false`
- ⚠️ Never commit your API key to Git!

**Option 2: Use Netlify CLI**
```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Run dev server with functions
netlify dev
```

Then visit `http://localhost:8888` to test with local functions.

## 📁 Project Structure

```
my_welcome_page/
├── netlify/
│   └── functions/
│       ├── weather.js    ← Proxies OpenWeatherMap API
│       └── quote.js      ← Proxies Quotable API
├── netlify.toml          ← Netlify configuration
├── index.html
├── js/
│   └── app.js           ← Updated to use functions
└── css/
    └── style.css
```

## 🛡️ Security Benefits

✅ **API keys never exposed** - Not in HTML, not in JavaScript, not in browser DevTools  
✅ **Rate limiting** - Add custom rate limiting in functions  
✅ **Domain restrictions** - Only your Netlify domain can call the functions  
✅ **Request filtering** - Validate inputs before calling external APIs  
✅ **Error handling** - Don't leak sensitive error messages to users  

## 🔄 Updating API Keys

To update your API key:

1. Go to Netlify dashboard → **Site settings** → **Environment variables**
2. Click the **edit** icon next to `WEATHER_API_KEY`
3. Update the value
4. Redeploy your site (automatic if you have auto-deploy enabled)

**Note**: Changes to environment variables require a redeploy to take effect.

## 🐛 Troubleshooting

### Weather widget not showing
1. Check browser console for errors
2. Verify `WEATHER_API_KEY` is set in Netlify
3. Ensure you've allowed location access
4. Check function logs in Netlify dashboard → **Functions** tab

### Function errors
1. Go to Netlify dashboard → **Functions** tab
2. Click on the function name to see logs
3. Common issues:
   - Missing environment variable
   - Invalid API key
   - CORS issues (shouldn't happen with functions)

### "Function not found" error
1. Verify `netlify/functions/` directory exists
2. Check that functions are JavaScript files (`.js`)
3. Ensure you've redeployed after adding functions

## 📚 Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

## 💡 Pro Tips

1. **Use different keys for dev/prod**: Create separate API keys for development and production
2. **Monitor API usage**: Check OpenWeatherMap dashboard to track your API calls
3. **Add caching**: Functions already cache responses (see `Cache-Control` headers)
4. **Add more functions**: Create functions for any API that requires authentication

## 🎉 You're Done!

Your Welcome Dashboard is now deployed with secure API key management. Your API keys are safe, and users can enjoy all features without security concerns!
