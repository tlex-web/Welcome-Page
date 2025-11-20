// Netlify function to proxy iCal/ICS calendar feeds
// Handles CORS issues when fetching calendar data

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Get calendar URL from query parameters
    const { url } = event.queryStringParameters || {};

    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing url parameter' })
        };
    }

    // Validate URL is from Outlook/Office 365
    const allowedDomains = [
        'outlook.office365.com',
        'outlook.office.com',
        'outlook.live.com'
    ];
    
    try {
        const urlObj = new URL(url);
        const isAllowed = allowedDomains.some(domain => urlObj.hostname.includes(domain));
        
        if (!isAllowed) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'URL must be from Outlook/Office 365' })
            };
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid URL format' })
        };
    }

    try {
        // Fetch the iCal data
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Calendar fetch failed: ${response.status}`);
        }

        const icalData = await response.text();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/calendar',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            },
            body: icalData
        };
    } catch (error) {
        console.error('iCal proxy error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to fetch calendar data',
                message: error.message 
            })
        };
    }
};
