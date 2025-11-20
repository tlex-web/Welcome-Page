// Netlify serverless function to fetch word of the day from API Ninjas
// Returns a random word with definition to expand vocabulary

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
        // Get a random interesting word
        // We'll use the RandomWord API to get a word, then Dictionary API for definition
        const wordResponse = await fetch('https://api.api-ninjas.com/v1/randomword', {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!wordResponse.ok) {
            throw new Error(`API Ninjas word error: ${wordResponse.status}`);
        }

        const wordData = await wordResponse.json();
        const word = wordData.word;

        // Get definition for the word
        const defResponse = await fetch(`https://api.api-ninjas.com/v1/dictionary?word=${word}`, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!defResponse.ok) {
            throw new Error(`API Ninjas definition error: ${defResponse.status}`);
        }

        const defData = await defResponse.json();

        const result = {
            word: word,
            definition: defData.definition || 'No definition available',
            valid: defData.valid || true
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
            },
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error('API Ninjas word function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch word' })
        };
    }
};
