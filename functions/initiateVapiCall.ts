/**
 * Initiates an outbound call using Vapi
 */
export default async function initiateVapiCall({ phoneNumber, assistantId, scenarioName }, { secrets }) {
  try {
    const VAPI_API_KEY = secrets.VAPI_PRIVATE_KEY;
    
    if (!VAPI_API_KEY) {
      throw new Error('Vapi API key not configured. Please add VAPI_PRIVATE_KEY to secrets.');
    }

    if (!phoneNumber || !assistantId) {
      throw new Error('Phone number and assistant ID are required');
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
      console.error('Vapi API error:', data);
      throw new Error(data.message || 'Failed to initiate call');
    }

    console.log(`✅ Call initiated successfully:`, data);

    return {
      success: true,
      callId: data.id,
      message: 'Call initiated successfully'
    };

  } catch (error) {
    console.error('❌ Error initiating call:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to initiate call'
    };
  }
}