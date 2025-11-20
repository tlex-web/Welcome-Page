/* ==========================================
   MODERN WELCOME DASHBOARD - JavaScript
   Main application module with all features
   ========================================== */

// ===== Configuration =====
const CONFIG = {
    storageKeys: {
        name: 'welcomePage_userName',
        images: 'welcomePage_images',
        settings: 'welcomePage_settings',
        currentImage: 'welcomePage_currentImage',
        lastQuote: 'welcomePage_lastQuote',
        lastWeather: 'welcomePage_lastWeather',
        weatherTimestamp: 'welcomePage_weatherTimestamp',
        selectedImages: 'welcomePage_selectedImages'
    },
    defaultSettings: {
        parallaxEnabled: true,
        changeInterval: 10,
        timeFormat24: true,
        showSeconds: true
    },
    weather: {
        apiKey: '', // For local dev only - use Netlify Functions in production
        useNetlifyFunction: true, // Set to true when deployed to Netlify
        units: 'metric', // or 'imperial'
        updateInterval: 30 // minutes
    },
    presetImages: [
        // Add paths to images in img/ folder here
        // Example: 'img/background1.jpg', 'img/background2.jpg'
        'img/0.jpg',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg',
        'img/11.jpg',
        'img/12.jpg',
        'img/13.jpg',
        'img/14.jpg',
        'img/15.jpg',
        'img/16.jpg',
    ],
    calendar: {
        // Microsoft Graph API (Outlook/Teams)
        microsoft: {
            clientId: '', // Add your Azure AD App Client ID
            redirectUri: window.location.origin,
            scopes: ['Calendars.Read', 'Tasks.Read']
        },
        // Google Calendar API
        google: {
            apiKey: '', // Add your Google API key
            clientId: '', // Add your Google Client ID
            scopes: 'https://www.googleapis.com/auth/calendar.readonly'
        }
    }
};

// ===== State Management =====
const state = {
    userName: localStorage.getItem(CONFIG.storageKeys.name) || 'Tim',
    images: JSON.parse(localStorage.getItem(CONFIG.storageKeys.images)) || [],
    selectedImages: JSON.parse(localStorage.getItem(CONFIG.storageKeys.selectedImages)) || [],
    settings: JSON.parse(localStorage.getItem(CONFIG.storageKeys.settings)) || CONFIG.defaultSettings,
    currentImageIndex: parseInt(localStorage.getItem(CONFIG.storageKeys.currentImage)) || 0,
    mousePosition: { x: 0, y: 0 },
    calendarConnected: false,
    lastWeatherUpdate: parseInt(localStorage.getItem(CONFIG.storageKeys.weatherTimestamp)) || 0
};

// ===== Motivational Quotes =====
const motivationalQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
    { text: "Little things make big days.", author: "Unknown" }
];

// ===== DOM Elements =====
const elements = {
    time: document.getElementById('time'),
    date: document.getElementById('date'),
    greeting: document.getElementById('greeting'),
    name: document.getElementById('name'),
    motivation: document.getElementById('motivation'),
    parallaxLayers: document.querySelectorAll('.parallax-layer'),
    loadingScreen: document.getElementById('loading-screen'),
    
    // Weather widget
    weatherCard: document.getElementById('weather-card'),
    weatherTemp: document.getElementById('weather-temp'),
    weatherCondition: document.getElementById('weather-condition'),
    weatherIcon: document.getElementById('weather-icon'),
    weatherLocation: document.getElementById('weather-location'),
    
    // Navigation buttons
    imagesBtn: document.getElementById('images-btn'),
    calendarBtn: document.getElementById('calendar-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    refreshQuoteBtn: document.getElementById('refresh-quote-btn'),
    
    // Overlays
    imagesOverlay: document.getElementById('images-overlay'),
    calendarOverlay: document.getElementById('calendar-overlay'),
    settingsOverlay: document.getElementById('settings-overlay'),
    
    // Image management
    imageUpload: document.getElementById('image-upload'),
    galleryGrid: document.getElementById('gallery-grid'),
    galleryTabs: document.getElementById('gallery-tabs'),
    uploadedTab: document.getElementById('uploaded-tab'),
    presetTab: document.getElementById('preset-tab'),
    uploadedGallery: document.getElementById('uploaded-gallery'),
    presetGallery: document.getElementById('preset-gallery'),
    storageWarning: document.getElementById('storage-warning'),
    
    // Calendar
    calendarAuth: document.getElementById('calendar-auth'),
    calendarConnected: document.getElementById('calendar-connected'),
    connectCalendarBtn: document.getElementById('connect-calendar-btn'),
    eventsList: document.getElementById('events-list'),
    tasksList: document.getElementById('tasks-list'),
    
    // Settings
    parallaxToggle: document.getElementById('parallax-toggle'),
    changeInterval: document.getElementById('change-interval'),
    timeFormatToggle: document.getElementById('time-format-toggle'),
    showSecondsToggle: document.getElementById('show-seconds-toggle'),
    resetBtn: document.getElementById('reset-btn')
};

// ===== Time & Date Functions =====
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    if (!state.settings.timeFormat24) {
        hours = hours % 12 || 12;
    }
    
    const timeString = state.settings.showSeconds 
        ? `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
        : `${padZero(hours)}:${padZero(minutes)}`;
    
    elements.time.textContent = timeString;
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.date.textContent = now.toLocaleDateString('en-US', options);
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

// ===== Greeting Function =====
function updateGreeting() {
    const hour = new Date().getHours();
    let greetingText = '';
    
    if (hour >= 0 && hour < 6) {
        greetingText = 'Good Night';
    } else if (hour >= 6 && hour < 12) {
        greetingText = 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
        greetingText = 'Good Afternoon';
    } else {
        greetingText = 'Good Evening';
    }
    
    elements.greeting.textContent = `${greetingText},`;
}

// ===== Motivational Quote =====
async function fetchQuote() {
    try {
        // Use Netlify Function if available, otherwise direct API
        const endpoint = window.location.hostname.includes('netlify.app') || window.location.hostname !== 'localhost'
            ? '/.netlify/functions/quote'
            : 'https://api.quotable.io/random?tags=inspirational';
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        
        // Handle both API formats (direct Quotable API and our function)
        const quoteData = data.text ? data : { text: data.content, author: data.author };
        
        // Cache to localStorage
        localStorage.setItem(CONFIG.storageKeys.lastQuote, JSON.stringify(quoteData));
        
        // Display the quote
        elements.motivation.textContent = `"${quoteData.text}" — ${quoteData.author}`;
    } catch (error) {
        console.warn('Failed to fetch quote from API, using cached/fallback', error);
        displayCachedQuote();
    }
}

function displayCachedQuote() {
    // Try cached quote first
    const cached = localStorage.getItem(CONFIG.storageKeys.lastQuote);
    if (cached) {
        const quote = JSON.parse(cached);
        elements.motivation.textContent = `"${quote.text}" — ${quote.author}`;
    } else {
        // Ultimate fallback to hardcoded array
        displayRandomQuote();
    }
}

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[randomIndex];
    elements.motivation.textContent = `"${quote.text}" — ${quote.author}`;
}

// ===== Name Management =====
function saveName() {
    state.userName = elements.name.textContent.trim() || 'Friend';
    localStorage.setItem(CONFIG.storageKeys.name, state.userName);
}

function loadName() {
    elements.name.textContent = state.userName;
}

// ===== Weather Functions =====
async function updateWeather() {
    // Check if API key is configured
    if (!CONFIG.weather.apiKey) {
        console.warn('Weather API key not configured');
        if (elements.weatherCard) {
            elements.weatherCard.style.display = 'none';
        }
        return;
    }
    
    // Check if we need to update (based on interval)
    const now = Date.now();
    const timeSinceUpdate = (now - state.lastWeatherUpdate) / 1000 / 60; // minutes
    
    if (timeSinceUpdate < CONFIG.weather.updateInterval) {
        // Load cached weather
        const cached = localStorage.getItem(CONFIG.storageKeys.lastWeather);
        if (cached) {
            displayWeather(JSON.parse(cached));
            return;
        }
    }
    
    try {
        // Get user's position
        const position = await getCurrentPosition();
        
        // Determine if we should use Netlify Function or direct API
        const useNetlifyFunction = CONFIG.weather.useNetlifyFunction && 
            (window.location.hostname.includes('netlify.app') || window.location.hostname !== 'localhost');
        
        let response;
        if (useNetlifyFunction) {
            // Use Netlify Function (API key is secure on server)
            response = await fetch(
                `/.netlify/functions/weather?lat=${position.latitude}&lon=${position.longitude}`
            );
        } else {
            // Use direct API (for local development)
            if (!CONFIG.weather.apiKey) {
                throw new Error('Weather API key not configured for local development');
            }
            response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&units=${CONFIG.weather.units}&appid=${CONFIG.weather.apiKey}`
            );
        }
        
        if (!response.ok) throw new Error('Weather API request failed');
        
        const data = await response.json();
        
        // Cache the data
        localStorage.setItem(CONFIG.storageKeys.lastWeather, JSON.stringify(data));
        localStorage.setItem(CONFIG.storageKeys.weatherTimestamp, now.toString());
        state.lastWeatherUpdate = now;
        
        // Display weather
        displayWeather(data);
    } catch (error) {
        console.error('Failed to fetch weather:', error);
        // Try to load cached data
        const cached = localStorage.getItem(CONFIG.storageKeys.lastWeather);
        if (cached) {
            displayWeather(JSON.parse(cached));
        } else if (elements.weatherCard) {
            elements.weatherCard.style.display = 'none';
        }
    }
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }),
            (error) => reject(error),
            { timeout: 10000 }
        );
    });
}

function displayWeather(data) {
    if (!elements.weatherCard) return;
    
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].description;
    const icon = data.weather[0].icon;
    const location = data.name;
    
    elements.weatherTemp.textContent = `${temp}°${CONFIG.weather.units === 'metric' ? 'C' : 'F'}`;
    elements.weatherCondition.textContent = condition.charAt(0).toUpperCase() + condition.slice(1);
    elements.weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}">`;
    elements.weatherLocation.textContent = location;
    
    elements.weatherCard.style.display = 'block';
}

// ===== 3D Parallax Effect =====
function initParallax() {
    if (!state.settings.parallaxEnabled) return;
    
    document.addEventListener('mousemove', (e) => {
        state.mousePosition.x = (e.clientX / window.innerWidth - 0.5) * 2;
        state.mousePosition.y = (e.clientY / window.innerHeight - 0.5) * 2;
        updateParallax();
    });
    
    // Mobile device orientation
    if (window.DeviceOrientationEvent) {
        // iOS 13+ requires permission for device orientation events
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then((response) => {
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', (e) => {
                            state.mousePosition.x = (e.gamma / 45) || 0;
                            state.mousePosition.y = (e.beta / 90) || 0;
                            updateParallax();
                        });
                    }
                })
                .catch(() => {
                    // Permission denied or error; do not add listener
                });
        } else {
            window.addEventListener('deviceorientation', (e) => {
                state.mousePosition.x = (e.gamma / 45) || 0;
                state.mousePosition.y = (e.beta / 90) || 0;
                updateParallax();
            });
        }
    }
}

function updateParallax() {
    if (!state.settings.parallaxEnabled) return;
    
    elements.parallaxLayers.forEach((layer, index) => {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
        const moveX = state.mousePosition.x * depth * 50;
        const moveY = state.mousePosition.y * depth * 50;
        
        layer.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
    });
}

// ===== Image Management =====
function getAllImages() {
    // Combine preset images (paths) and uploaded images (base64)
    return [...state.selectedImages, ...state.images];
}

function loadBackgroundImage() {
    const allImages = getAllImages();
    
    if (allImages.length === 0) {
        // Load default gradient if no images
        setDefaultBackground();
        return;
    }
    
    const currentImage = allImages[state.currentImageIndex];
    elements.parallaxLayers.forEach((layer) => {
        layer.style.backgroundImage = `url(${currentImage})`;
        layer.style.backgroundSize = 'cover';
        layer.style.backgroundPosition = 'center';
    });
}

function setDefaultBackground() {
    elements.parallaxLayers.forEach(layer => {
        layer.style.backgroundImage = '';
        layer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    });
}

function cycleBackground() {
    const allImages = getAllImages();
    if (allImages.length === 0) return;
    
    state.currentImageIndex = (state.currentImageIndex + 1) % allImages.length;
    localStorage.setItem(CONFIG.storageKeys.currentImage, state.currentImageIndex);
    loadBackgroundImage();
}

function checkStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += (localStorage[key].length + key.length) * 2; // UTF-16 encoding
        }
    }
    return total / 1024 / 1024; // Return size in MB
}

function updateStorageWarning() {
    if (!elements.storageWarning) return;
    
    const sizeMB = checkStorageSize();
    if (sizeMB > 4) { // Warning at 4MB (80% of 5MB limit)
        elements.storageWarning.style.display = 'block';
        elements.storageWarning.textContent = `⚠️ Storage: ${sizeMB.toFixed(2)}MB / ~5MB. Consider using preset images or deleting uploads.`;
    } else {
        elements.storageWarning.style.display = 'none';
    }
}

function addImage(dataUrl) {
    state.images.push(dataUrl);
    saveImages();
    renderGallery();
    updateStorageWarning();
    
    if (getAllImages().length === 1) {
        loadBackgroundImage();
    }
}

function selectPresetImage(path) {
    if (!state.selectedImages.includes(path)) {
        state.selectedImages.push(path);
        saveSelectedImages();
        renderGallery();
        
        if (getAllImages().length === 1) {
            loadBackgroundImage();
        }
    }
}

function deselectPresetImage(path) {
    const index = state.selectedImages.indexOf(path);
    if (index > -1) {
        state.selectedImages.splice(index, 1);
        
        const allImages = getAllImages();
        if (state.currentImageIndex >= allImages.length) {
            state.currentImageIndex = Math.max(0, allImages.length - 1);
        }
        
        saveSelectedImages();
        renderGallery();
        loadBackgroundImage();
    }
}

function deleteImage(index) {
    state.images.splice(index, 1);
    
    const allImages = getAllImages();
    if (state.currentImageIndex >= allImages.length) {
        state.currentImageIndex = Math.max(0, allImages.length - 1);
    }
    
    saveImages();
    renderGallery();
    loadBackgroundImage();
    updateStorageWarning();
}

function saveImages() {
    localStorage.setItem(CONFIG.storageKeys.images, JSON.stringify(state.images));
}

function saveSelectedImages() {
    localStorage.setItem(CONFIG.storageKeys.selectedImages, JSON.stringify(state.selectedImages));
}

function renderGallery() {
    // Check if we have tab-based gallery or legacy single gallery
    if (elements.uploadedGallery && elements.presetGallery) {
        renderUploadedGallery();
        renderPresetGallery();
    } else {
        renderLegacyGallery();
    }
    updateStorageWarning();
}

function renderUploadedGallery() {
    elements.uploadedGallery.innerHTML = '';
    
    if (state.images.length === 0) {
        elements.uploadedGallery.innerHTML = '<p class="empty-message">No uploaded images yet. Upload your landscape photos to get started!</p>';
        return;
    }
    
    const allImages = getAllImages();
    
    state.images.forEach((image, index) => {
        const actualIndex = state.selectedImages.length + index;
        const item = document.createElement('div');
        item.className = 'gallery-item';
        if (actualIndex === state.currentImageIndex) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <img src="${image}" alt="Uploaded ${index + 1}" loading="lazy">
            <button class="delete-btn" data-index="${index}" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-btn')) {
                state.currentImageIndex = actualIndex;
                localStorage.setItem(CONFIG.storageKeys.currentImage, actualIndex);
                loadBackgroundImage();
                renderGallery();
            }
        });
        
        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Delete this image?')) {
                deleteImage(index);
            }
        });
        
        elements.uploadedGallery.appendChild(item);
    });
}

function renderPresetGallery() {
    elements.presetGallery.innerHTML = '';
    
    if (CONFIG.presetImages.length === 0) {
        elements.presetGallery.innerHTML = '<p class="empty-message">No preset images configured. Add image paths to CONFIG.presetImages in js/app.js</p>';
        return;
    }
    
    CONFIG.presetImages.forEach((path, index) => {
        const isSelected = state.selectedImages.includes(path);
        const actualIndex = state.selectedImages.indexOf(path);
        const item = document.createElement('div');
        item.className = 'gallery-item preset-item';
        if (isSelected && actualIndex === state.currentImageIndex) {
            item.classList.add('active');
        }
        if (isSelected) {
            item.classList.add('selected');
        }
        
        item.innerHTML = `
            <img src="${path}" alt="Preset ${index + 1}" loading="lazy">
            <button class="select-btn ${isSelected ? 'selected' : ''}" data-path="${path}" title="${isSelected ? 'Deselect' : 'Select'}">
                <i class="fas fa-${isSelected ? 'check' : 'plus'}"></i>
            </button>
        `;
        
        const selectBtn = item.querySelector('.select-btn');
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isSelected) {
                deselectPresetImage(path);
            } else {
                selectPresetImage(path);
            }
        });
        
        if (isSelected) {
            item.addEventListener('click', () => {
                state.currentImageIndex = actualIndex;
                localStorage.setItem(CONFIG.storageKeys.currentImage, actualIndex);
                loadBackgroundImage();
                renderGallery();
            });
        }
        
        elements.presetGallery.appendChild(item);
    });
}

function renderLegacyGallery() {
    elements.galleryGrid.innerHTML = '';
    
    const allImages = getAllImages();
    
    if (allImages.length === 0) {
        elements.galleryGrid.innerHTML = '<p style="grid-column: 1/-1; opacity: 0.7; padding: 2rem;">No images selected yet. Upload your landscape photos to get started!</p>';
        return;
    }
    
    allImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        if (index === state.currentImageIndex) {
            item.classList.add('active');
        }
        
        const isPreset = index < state.selectedImages.length;
        
        item.innerHTML = `
            <img src="${image}" alt="Background ${index + 1}" loading="lazy">
            <button class="delete-btn" data-index="${index}" data-type="${isPreset ? 'preset' : 'uploaded'}" title="Remove">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-btn')) {
                state.currentImageIndex = index;
                localStorage.setItem(CONFIG.storageKeys.currentImage, index);
                loadBackgroundImage();
                renderGallery();
            }
        });
        
        elements.galleryGrid.appendChild(item);
    });
    
    // Attach delete handlers
    document.querySelectorAll('.gallery-item .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.getAttribute('data-index'));
            const type = btn.getAttribute('data-type');
            
            if (confirm('Remove this image?')) {
                if (type === 'preset') {
                    const path = state.selectedImages[index];
                    deselectPresetImage(path);
                } else {
                    const uploadedIndex = index - state.selectedImages.length;
                    deleteImage(uploadedIndex);
                }
            }
        });
    });
}

// ===== Image Upload Handler =====
function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            addImage(event.target.result);
        };
        reader.onerror = () => {
            alert('Failed to load image. Please try another file.');
        };
        reader.readAsDataURL(file);
    });
    
    e.target.value = ''; // Reset input
}

// ===== Calendar Integration =====
function initCalendar() {
    // Check if credentials are configured
    const hasConfig = CONFIG.calendar.microsoft.clientId || CONFIG.calendar.google.clientId;
    
    if (!hasConfig) {
        showCalendarSetup();
    }
}

function showCalendarSetup() {
    elements.calendarAuth.style.display = 'block';
    elements.calendarConnected.style.display = 'none';
}

function connectCalendar() {
    alert('Calendar Integration Setup:\n\n' +
          '1. For Microsoft Outlook/Teams:\n' +
          '   - Go to Azure Portal (portal.azure.com)\n' +
          '   - Register a new app in Azure AD\n' +
          '   - Add "Calendars.Read" and "Tasks.Read" permissions\n' +
          '   - Copy Client ID to js/app.js CONFIG.calendar.microsoft.clientId\n\n' +
          '2. For Google Calendar:\n' +
          '   - Go to Google Cloud Console\n' +
          '   - Enable Calendar API\n' +
          '   - Create OAuth credentials\n' +
          '   - Copy credentials to js/app.js CONFIG.calendar.google\n\n' +
          'After configuration, redeploy to Netlify.');
}

// ===== Settings Management =====
function loadSettings() {
    elements.parallaxToggle.checked = state.settings.parallaxEnabled;
    elements.changeInterval.value = state.settings.changeInterval;
    elements.timeFormatToggle.checked = state.settings.timeFormat24;
    elements.showSecondsToggle.checked = state.settings.showSeconds;
}

function saveSettings() {
    state.settings = {
        parallaxEnabled: elements.parallaxToggle.checked,
        changeInterval: parseInt(elements.changeInterval.value) || 10,
        timeFormat24: elements.timeFormatToggle.checked,
        showSeconds: elements.showSecondsToggle.checked
    };
    
    localStorage.setItem(CONFIG.storageKeys.settings, JSON.stringify(state.settings));
    
    // Apply settings
    if (!state.settings.parallaxEnabled) {
        elements.parallaxLayers.forEach(layer => {
            layer.style.transform = 'none';
        });
    } else {
        initParallax();
    }
}

function resetSettings() {
    if (confirm('Reset all settings to defaults? This will not delete your images.')) {
        state.settings = { ...CONFIG.defaultSettings };
        localStorage.setItem(CONFIG.storageKeys.settings, JSON.stringify(state.settings));
        loadSettings();
        saveSettings();
    }
}

// ===== Overlay Management =====
function openOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.classList.add('active');
    }
}

function closeOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ===== Event Listeners =====
function initEventListeners() {
    // Navigation buttons
    elements.imagesBtn.addEventListener('click', () => openOverlay('images-overlay'));
    elements.calendarBtn.addEventListener('click', () => openOverlay('calendar-overlay'));
    elements.settingsBtn.addEventListener('click', () => openOverlay('settings-overlay'));
    elements.refreshQuoteBtn.addEventListener('click', fetchQuote); // Use fetchQuote instead of displayRandomQuote
    
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlayId = btn.getAttribute('data-overlay');
            closeOverlay(overlayId);
        });
    });
    
    // Close overlay on background click
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
    
    // Name editing
    elements.name.addEventListener('blur', saveName);
    elements.name.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            elements.name.blur();
        }
    });
    
    // Image upload
    elements.imageUpload.addEventListener('change', handleImageUpload);
    
    // Gallery tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Update active tab button
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active content
            document.querySelectorAll('.tab-content').forEach(content => {
                if (content.getAttribute('data-content') === tabName) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
    
    // Calendar
    elements.connectCalendarBtn.addEventListener('click', connectCalendar);
    
    // Settings
    elements.parallaxToggle.addEventListener('change', saveSettings);
    elements.changeInterval.addEventListener('change', saveSettings);
    elements.timeFormatToggle.addEventListener('change', () => {
        saveSettings();
        updateTime();
    });
    elements.showSecondsToggle.addEventListener('change', () => {
        saveSettings();
        updateTime();
    });
    elements.resetBtn.addEventListener('click', resetSettings);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.overlay.active').forEach(overlay => {
                overlay.classList.remove('active');
            });
        }
    });
}

// ===== Initialization =====
function init() {
    // Load user data
    loadName();
    loadSettings();
    
    // Initialize features
    updateTime();
    updateGreeting();
    fetchQuote(); // Use API for quotes
    loadBackgroundImage();
    renderGallery();
    initParallax();
    initCalendar();
    updateWeather(); // Initialize weather widget
    
    // Start intervals
    setInterval(updateTime, 1000);
    setInterval(updateGreeting, 60000); // Check greeting every minute
    
    // Update weather every configured interval
    if (CONFIG.weather.apiKey) {
        setInterval(updateWeather, CONFIG.weather.updateInterval * 60 * 1000);
    }
    
    // Auto-cycle backgrounds
    const allImages = getAllImages();
    if (allImages.length > 1) {
        setInterval(cycleBackground, state.settings.changeInterval * 60 * 1000);
    }
    
    // Setup event listeners
    initEventListeners();
    
    // Hide loading screen
    setTimeout(() => {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
        }
    }, 500);
}

// Start the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== Export for potential extensions =====
window.WelcomeDashboard = {
    state,
    CONFIG,
    addImage,
    deleteImage,
    selectPresetImage,
    deselectPresetImage,
    cycleBackground,
    fetchQuote,
    displayRandomQuote,
    updateWeather,
    checkStorageSize
};
