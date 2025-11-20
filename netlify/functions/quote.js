// Netlify serverless function to proxy quote API requests
// This provides a consistent endpoint and can add caching/rate limiting

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Fetch random inspirational quote from Quotable API
        const response = await fetch('https://api.quotable.io/random?tags=inspirational');

        if (!response.ok) {
            throw new Error(`Quote API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform to our format
        const quote = {
            text: data.content,
            author: data.author
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            },
            body: JSON.stringify(quote)
        };
    } catch (error) {
        console.error('Quote function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch quote' })
        };
    }
};
