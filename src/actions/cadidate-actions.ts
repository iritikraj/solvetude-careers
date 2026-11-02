/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import nodemailer from 'nodemailer';

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function submitCandidateApplication(formData: FormData, formSchema: any[]) {
  try {
    const jobId = formData.get('jobId') as string;

    // 1. Separate standard fields from dynamic answers
    const standardFields = ['firstName', 'lastName', 'email', 'linkedinUrl', 'resume'];
    const dynamicAnswers: Record<string, any> = {};

    // Extract standard text fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const linkedinUrl = formData.get('linkedinUrl') as string;

    // Extract dynamic AI-generated fields
    formSchema.forEach((field) => {
      if (!standardFields.includes(field.id)) {
        dynamicAnswers[field.id] = formData.get(field.id);
      }
    });

    // 2. Extract and Upload the Resume to Strapi Media Library
    const resumeFile = formData.get('resume') as File;
    let resumeId = null;

    if (resumeFile && resumeFile.size > 0) {
      const uploadData = new FormData();
      uploadData.append('files', resumeFile);

      const uploadRes = await fetch(`${process.env.STRAPI_API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
          // CRITICAL: Do not manually set Content-Type. 
          // Fetch automatically sets the correct multipart/form-data boundary.
        },
        body: uploadData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(`File upload failed: ${JSON.stringify(err)}`);
      }

      const uploadedFiles = await uploadRes.json();
      resumeId = uploadedFiles[0].id; // Strapi returns an array of uploaded files
    }

    // 3. Save the Candidate Profile
    const candidatePayload = {
      data: {
        firstName,
        lastName,
        email,
        linkedinUrl,
        dynamicAnswers,
        candidateStatus: 'New',
        source: 'Portal',
        job_posts: [parseInt(jobId)], // Strapi Many-to-Many relations require an array of IDs
        resume: resumeId // Attach the uploaded file ID
      }
    };

    const candidateRes = await fetch(`${process.env.STRAPI_API_URL}/api/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(candidatePayload),
    });

    if (!candidateRes.ok) {
      const err = await candidateRes.json();
      throw new Error(`Candidate save failed: ${JSON.stringify(err)}`);
    }

    return { success: true };

  } catch (error) {
    console.error("Application Submission Error:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }
}

export async function updateCandidateStatus(
  documentId: string,
  newStatus: string,
  candidateInfo: { firstName: string; email: string; appliedRole: string }
) {
  try {
    // 1. Update the Candidate in Strapi
    const updateRes = await fetch(`${process.env.STRAPI_API_URL}/api/candidates/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: { candidateStatus: newStatus }
      }),
    });

    if (!updateRes.ok) throw new Error('Failed to update Strapi');

    // 2. Trigger Automated Emails based on the new status
    if (newStatus === 'Shortlisted' || newStatus === 'Rejected') {
      const htmlContent = getPremiumEmailTemplate(candidateInfo.firstName, candidateInfo.appliedRole, newStatus);

      await transporter.sendMail({
        from: `"Solvetude Careers" <${process.env.SMTP_USER}>`,
        to: candidateInfo.email,
        subject: `Update on your application for ${candidateInfo.appliedRole} at Solvetude`,
        html: htmlContent,
      });
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Status Update Error:", error);
    return { success: false, error: "Failed to update status." };
  }
}

// Add this helper function at the top or bottom of your file
function getPremiumEmailTemplate(firstName: string, appliedRole: string, status: 'Shortlisted' | 'Rejected') {
  const isShortlisted = status === 'Shortlisted';

  const headline = isShortlisted
    ? 'Application Update: Shortlisted'
    : 'Update on your Application';

  const mainMessage = isShortlisted
    ? `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #565C6B; font-weight: 300;">Great news. Your application for the <strong style="color: #14181F; font-weight: 500;">${appliedRole}</strong> position stood out to our recruitment team, and you have been shortlisted.</p>
       <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #565C6B; font-weight: 300;">We are currently reviewing our interview schedules. A member of our team will be in touch shortly with the next steps regarding your technical and cultural alignment discussions.</p>`
    : `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #565C6B; font-weight: 300;">Thank you for taking the time to apply for the <strong style="color: #14181F; font-weight: 500;">${appliedRole}</strong> role and sharing your credentials with us.</p>
       <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #565C6B; font-weight: 300;">While we were impressed by your background and experience, we have decided to move forward with other candidates whose profiles more closely align with the immediate architectural needs of this specific role.</p>
       <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #565C6B; font-weight: 300;">We will retain your profile in our talent network and will reach out if a position opens up that matches your skill set.</p>`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Solvetude Careers</title>
      <!-- Attempt to load Jost for clients that support web fonts (Apple Mail, iOS) -->
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: 'Jost', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7fb; padding: 40px 20px;">
        <tr>
          <td align="center">
            
            <!-- Main Email Container -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 40px -12px rgba(0,0,0,0.08);">
              
              <!-- Premium Dark Header -->
              <tr>
                <td style="background-color: #0f2953; padding: 40px 40px 30px 40px; text-align: center; border-bottom: 4px solid #9C7A3C;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase;">
                    SOLVETUDE
                  </h1>
                  <p style="margin: 8px 0 0 0; color: #9C7A3C; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">
                    Careers & Talent
                  </p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 48px 40px;">
                  <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 400; color: #14181F; letter-spacing: -0.5px;">
                    Dear ${firstName},
                  </h2>
                  
                  ${mainMessage}

                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
                  
                  <p style="margin: 0; font-size: 14px; color: #14181F; font-weight: 500;">
                    Regards,<br>
                    <span style="color: #565C6B; font-weight: 300;">Solvetude Talent Team</span>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f4f7fb; padding: 32px 40px; text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #565C6B; font-weight: 400; line-height: 1.6;">
                    You are receiving this email because you recently applied for a position at Solvetude.
                    <br>This is an automated operational update. Please do not reply directly to this inbox.
                  </p>
                </td>
              </tr>

            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}