import Airtable from 'airtable';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const TABLE_NAME = 'Contact Submissions'; // Name of your Airtable table

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, message } = req.body;

    // Validate required fields
    if (!name || !email || !company) {
      return res.status(400).json({ 
        error: 'Name, email, and company are required' 
      });
    }

    // Save to Airtable
    const records = await base(TABLE_NAME).create([
      {
        fields: {
          'Name': name,
          'Email': email,
          'Company': company,
          'Message': message || '',
          'Submitted At': new Date().toISOString(),
        }
      }
    ]);

    const recordId = records[0].id;

    // Prepare email content
    const emailBody = `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #00D48A;">New Contact Form Submission</h2>
  
  <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
  
  <h3 style="color: #1C1C1C;">📋 Contact Details</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
      <td style="padding: 8px 0;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Email:</td>
      <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #00D48A;">${email}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Company:</td>
      <td style="padding: 8px 0;">${company}</td>
    </tr>
  </table>
  
  <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
  
  <h3 style="color: #1C1C1C;">💬 Message</h3>
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #00D48A;">
    <p style="margin: 0; white-space: pre-wrap;">${message || 'No message provided'}</p>
  </div>
  
  <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
  
  <p style="font-size: 12px; color: #6B7280;">
    This submission has been saved to Airtable (Record ID: ${recordId}).
  </p>
</body>
</html>
    `.trim();

    const subject = `New Contact: ${name} from ${company}`;

    // Send emails to both recipients
    await Promise.all([
      resend.emails.send({
        from: 'iinfii.ai Contact Form <noreply@iinfii.ai>',
        to: 'chance@contentdrip.ai',
        subject: subject,
        html: emailBody,
      }),
      resend.emails.send({
        from: 'iinfii.ai Contact Form <noreply@iinfii.ai>',
        to: 'billy@vasttrack.ai',
        subject: subject,
        html: emailBody,
      }),
    ]);

    return res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully',
      id: recordId
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Handle Airtable-specific errors
    if (error.error) {
      console.error('Airtable error:', error.error);
    }
    
    return res.status(500).json({ 
      error: 'Failed to submit form. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

