export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const VAPI_API_KEY = process.env.VAPI_API_KEY;
    
    if (!VAPI_API_KEY) {
      return res.status(500).json({ error: 'VAPI_API_KEY not configured' });
    }

    // Request a client token from Vapi
    const response = await fetch("https://api.vapi.ai/client_tokens", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Optional: pass assistant defaults or metadata
        // assistantId: "asst_XXXX",
        // userId: req.body?.userId,
        // metadata: req.body?.metadata
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vapi token error:', errorText);
      return res.status(response.status).json({ 
        error: 'Failed to create Vapi token',
        details: errorText 
      });
    }

    const data = await response.json();
    // Return the token to the client
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error creating Vapi token:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}