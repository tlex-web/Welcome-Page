// Netlify serverless function to fetch quotes from API Ninjas
// API Ninjas provides high-quality quotes with a single API key

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Get API key from environment variable
    const apiKey = process.env.API_NINJAS_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API Ninjas key not configured' })
        };
    }

    // Get optional category from query params
    const { category } = event.queryStringParameters || {};

    try {
        // Fetch random quote from API Ninjas
        const url = category 
            ? `https://api.api-ninjas.com/v2/quotes?category=${category}`
            : 'https://api.api-ninjas.com/v2/quotes';

        const response = await fetch(url, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`API Ninjas error: ${response.status}`);
        }

        const data = await response.json();

        // API Ninjas returns an array, get first quote
        if (data && data.length > 0) {
            const quote = {
                text: data[0].quote,
                author: data[0].author,
                category: data[0].category
            };

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=1800' // Cache for 30 minutes
                },
                body: JSON.stringify(quote)
            };
        } else {
            throw new Error('No quote returned from API');
        }
    } catch (error) {
        console.error('API Ninjas quote function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch quote' })
        };
    }
};
