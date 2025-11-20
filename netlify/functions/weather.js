// Netlify serverless function to proxy weather API requests
// This keeps your API key secure on the server side

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Get parameters from query string
    const { lat, lon } = event.queryStringParameters || {};

    if (!lat || !lon) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing lat or lon parameters' })
        };
    }

    // Get API key from environment variable (set in Netlify dashboard)
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Weather API key not configured' })
        };
    }

    try {
        // Fetch weather data from OpenWeatherMap
        const units = process.env.WEATHER_UNITS || 'metric';
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=1800' // Cache for 30 minutes
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Weather function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch weather data' })
        };
    }
};
