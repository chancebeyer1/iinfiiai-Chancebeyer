Deno.serve(async (req) => {
  try {
    const VAPI_API_KEY = Deno.env.get("VAPI_PRIVATE_KEY");
    
    if (!VAPI_API_KEY) {
      return Response.json(
        { success: false, error: 'Vapi API key not configured. Please add VAPI_PRIVATE_KEY to secrets.' },
        { status: 500 }
      );
    }

    // Parse request body
    const { phoneNumber, assistantId, scenarioName } = await req.json();

    if (!phoneNumber || !assistantId) {
      return Response.json(
        { success: false, error: 'Phone number and assistant ID are required' },
        { status: 400 }
      );
    }

    console.log(`📞 Initiating call to ${phoneNumber} for ${scenarioName}`);

    // Call Vapi API to create outbound call
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: assistantId,
        customer: {
          number: phoneNumber,
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Vapi API error:', data);
      return Response.json(
        { success: false, error: data.message || 'Failed to initiate call' },
        { status: response.status }
      );
    }

    console.log(`✅ Call initiated successfully:`, data);

    return Response.json({
      success: true,
      callId: data.id,
      message: 'Call initiated successfully'
    });

  } catch (error) {
    console.error('❌ Error initiating call:', error);
    
    return Response.json(
      { success: false, error: error.message || 'Failed to initiate call' },
      { status: 500 }
    );
  }
});