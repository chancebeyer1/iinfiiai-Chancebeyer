import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify user is authenticated (optional for contact forms)
    // const user = await base44.auth.me();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      return Response.json({
        success: false,
        error: 'Email service not configured'
      }, { status: 500 });
    }

    const { name, email, company, message } = await req.json();

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'iinfii.ai <onboarding@resend.dev>', // You'll change this to your domain later
        to: ['chanceb323@gmail.com', 'billy@vasttrack.ai'],
        subject: `New Contact: ${name} from ${company}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <hr/>
          <h3>Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <hr/>
          <h3>Message</h3>
          <p>${message || 'No message provided'}</p>
        `,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend API error:', result);
      return Response.json({
        success: false,
        error: result.message || 'Failed to send email'
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});