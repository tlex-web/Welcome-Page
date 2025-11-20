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
        currentImage: 'welcomePage_currentImage'
    },
    defaultSettings: {
        parallaxEnabled: true,
        changeInterval: 10,
        timeFormat24: true,
        showSeconds: true
    },
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
    settings: JSON.parse(localStorage.getItem(CONFIG.storageKeys.settings)) || CONFIG.defaultSettings,
    currentImageIndex: parseInt(localStorage.getItem(CONFIG.storageKeys.currentImage)) || 0,
    mousePosition: { x: 0, y: 0 },
    calendarConnected: false
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
function loadBackgroundImage() {
    if (state.images.length === 0) {
        // Load default gradient if no images
        setDefaultBackground();
        return;
    }
    
    const currentImage = state.images[state.currentImageIndex];
    elements.parallaxLayers.forEach((layer, index) => {
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
    if (state.images.length === 0) return;
    
    state.currentImageIndex = (state.currentImageIndex + 1) % state.images.length;
    localStorage.setItem(CONFIG.storageKeys.currentImage, state.currentImageIndex);
    loadBackgroundImage();
}

function addImage(dataUrl) {
    // Estimate total size after adding new image
    const SIZE_LIMIT = 5000000; // 5MB
    const currentSize = JSON.stringify(state.images).length;
    const newSize = currentSize + dataUrl.length;
    if (newSize > SIZE_LIMIT) {
        alert('Storage limit reached. Please delete some images before adding new ones.');
        return;
    }
    state.images.push(dataUrl);
    saveImages();
    renderGallery();
    
    if (state.images.length === 1) {
        loadBackgroundImage();
    }
}

function deleteImage(index) {
    state.images.splice(index, 1);
    
    if (state.currentImageIndex >= state.images.length) {
        state.currentImageIndex = Math.max(0, state.images.length - 1);
    }
    
    saveImages();
    renderGallery();
    loadBackgroundImage();
}

        elements.galleryGrid.innerHTML = '<p class="gallery-empty-state">No images uploaded yet. Upload your landscape photos to get started!</p>';
    localStorage.setItem(CONFIG.storageKeys.images, JSON.stringify(state.images));


function renderGallery() {
    elements.galleryGrid.innerHTML = '';
    
    if (state.images.length === 0) {
        elements.galleryGrid.innerHTML = '<p style="grid-column: 1/-1; opacity: 0.7; padding: 2rem;">No images uploaded yet. Upload your landscape photos to get started!</p>';
        return;
    }
    
    state.images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        if (index === state.currentImageIndex) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <img src="${image}" alt="Background ${index + 1}">
            <button class="delete-btn" data-index="${index}" title="Delete">
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
            if (confirm('Delete this image?')) {
                deleteImage(index);
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
    elements.refreshQuoteBtn.addEventListener('click', displayRandomQuote);
    
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
    displayRandomQuote();
    loadBackgroundImage();
    renderGallery();
    initParallax();
    initCalendar();
    
    // Start intervals
    setInterval(updateTime, 1000);
    setInterval(updateGreeting, 60000); // Check greeting every minute
    
    // Auto-cycle backgrounds
    if (state.images.length > 1) {
        setInterval(cycleBackground, state.settings.changeInterval * 60 * 1000);
    }
    
    // Setup event listeners
    initEventListeners();
    
    // Hide loading screen
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
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
    cycleBackground,
    displayRandomQuote
};
