// Netlify serverless function to fetch random facts from API Ninjas
// Returns interesting facts to display on the dashboard

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
        // Fetch random fact from API Ninjas
        const response = await fetch('https://api.api-ninjas.com/v1/facts?limit=1', {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`API Ninjas error: ${response.status}`);
        }

        const data = await response.json();

        // API Ninjas returns an array, get first fact
        if (data && data.length > 0) {
            const fact = {
                text: data[0].fact
            };

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
                },
                body: JSON.stringify(fact)
            };
        } else {
            throw new Error('No fact returned from API');
        }
    } catch (error) {
        console.error('API Ninjas fact function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch fact' })
        };
    }
};
