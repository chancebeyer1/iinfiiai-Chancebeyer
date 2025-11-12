Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const VAPI_API_KEY = Deno.env.get("VAPI_PRIVATE_KEY");
    
    console.log('🔑 API Key exists:', !!VAPI_API_KEY);
    console.log('🔑 API Key length:', VAPI_API_KEY?.length);
    
    if (!VAPI_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Vapi API key not configured. Please add VAPI_PRIVATE_KEY to secrets.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Parse request body
    const body = await req.json();
    console.log('📥 Received request body:', body);
    
    const { phoneNumber, assistantId, scenarioName } = body;

    if (!phoneNumber || !assistantId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Phone number and assistant ID are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    console.log(`📞 Initiating call to ${phoneNumber} for ${scenarioName}`);
    console.log(`🤖 Using assistant ID: ${assistantId}`);

    // Get the Vapi phone number ID from environment
    const VAPI_PHONE_NUMBER_ID = Deno.env.get("VAPI_PHONE_NUMBER_ID");
    
    if (!VAPI_PHONE_NUMBER_ID) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Vapi Phone Number ID not configured. Please add VAPI_PHONE_NUMBER_ID to secrets.'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const vapiPayload = {
      assistantId: assistantId,
      phoneNumberId: VAPI_PHONE_NUMBER_ID,
      customer: {
        number: phoneNumber,
      }
    };
    
    console.log('📤 Vapi API payload:', JSON.stringify(vapiPayload));

    // Call Vapi API to create outbound call
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vapiPayload),
    });

    const responseText = await response.text();
    console.log('📥 Vapi API raw response:', responseText);
    console.log('📊 Vapi API status:', response.status);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse Vapi response:', e);
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error('❌ Vapi API error:', data);
      return new Response(JSON.stringify({
        success: false,
        error: data.message || data.error || 'Failed to initiate call',
        details: data
      }), {
        status: 200, // Return 200 so frontend can read the error
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    console.log(`✅ Call initiated successfully:`, data);

    return new Response(JSON.stringify({
      success: true,
      callId: data.id,
      message: 'Call initiated successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('❌ Error initiating call:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to initiate call',
      stack: error.stack
    }), {
      status: 200, // Return 200 so frontend can read the error
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});