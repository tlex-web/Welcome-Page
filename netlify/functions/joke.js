// Netlify serverless function to fetch jokes from API Ninjas
// Returns clean, appropriate jokes for the dashboard

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

    try {
        // Fetch random joke from API Ninjas
        const response = await fetch('https://api.api-ninjas.com/v1/jokes?limit=1', {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`API Ninjas error: ${response.status}`);
        }

        const data = await response.json();

        // API Ninjas returns an array, get first joke
        if (data && data.length > 0) {
            const joke = {
                text: data[0].joke
            };

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=1800' // Cache for 30 minutes
                },
                body: JSON.stringify(joke)
            };
        } else {
            throw new Error('No joke returned from API');
        }
    } catch (error) {
        console.error('API Ninjas joke function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch joke' })
        };
    }
};
