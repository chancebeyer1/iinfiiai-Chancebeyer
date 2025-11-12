/**
 * Initiates an outbound call using Vapi
 * 
 * @param {Object} params
 * @param {string} params.phoneNumber - Phone number to call (with country code)
 * @param {string} params.assistantId - Vapi assistant ID
 * @param {string} params.scenarioName - Name of the scenario (for logging)
 * @returns {Object} - Call status
 */
export default async function initiateVapiCall({ phoneNumber, assistantId, scenarioName }, { secrets }) {
  try {
    const VAPI_API_KEY = secrets.VAPI_PRIVATE_KEY;
    
    if (!VAPI_API_KEY) {
      throw new Error('Vapi API key not configured. Please add VAPI_PRIVATE_KEY to secrets.');
    }

    // Validate inputs
    if (!phoneNumber || !assistantId) {
      throw new Error('Phone number and assistant ID are required');
    }

    // Call Vapi API to create outbound call
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId: null, // Use default phone number from Vapi
        customerId: phoneNumber,
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

    console.log(`✅ Call initiated for ${scenarioName} to ${phoneNumber}`, data);

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