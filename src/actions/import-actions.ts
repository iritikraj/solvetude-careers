/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import Papa from 'papaparse';

export async function importLinkedInCandidates(formData: FormData) {
  try {
    const file = formData.get('csvFile') as File;
    const jobId = formData.get('jobId') as string;

    if (!file || !jobId) {
      return { success: false, error: "File and Job ID are required." };
    }

    // Convert the uploaded file to a raw text string
    const csvText = await file.text();

    // Parse the CSV, automatically using the first row as object keys
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    const candidates = parsed.data as any[];
    let importedCount = 0;

    // Loop through each row and push to Strapi
    for (const row of candidates) {

      // 1. Handle Name Splitting
      const rawName = (row['Name'] || row['First Name'] || '').trim();
      const nameParts = rawName.split(' ');
      const firstName = nameParts[0] || 'Unknown';
      const lastName = row['Last Name'] || nameParts.slice(1).join(' ') || '';

      // 2. Extract email and LinkedIn URL so they are in scope for error logging
      const email = row['Email'] || row['Email Address'] || '';
      const linkedinUrl = row['LinkedIn'] || row['Member Profile'] || row['Profile URL'] || '';

      // 3. Map payload dynamically
      const payload = {
        data: {
          firstName,
          lastName,
          email,
          linkedinUrl,
          source: 'LinkedIn',
          candidateStatus: 'New',
          job_posts: [parseInt(jobId)],

          // Inject all the rich LinkedIn data into the HR dashboard's dynamic answers view
          dynamicAnswers: {
            Phone: row['Phone'] || 'Not provided',
            Headline: row['Subtitles'] || row['Headline'] || '',
            Current_Role: row['Current Position'] ? `${row['Current Position']} at ${row['Current Company']}` : '',
            Experience_Years: row['Experience Years'] || '',
            Location: row['Location'] || row['Geo Location Name'] || '',
            Education: row['Education'] || '',
            Experience_Details: row['Experience Details'] || '',
            LinkedIn_Resume_Link: row['CV Download URL'] || 'No resume attached in LinkedIn'
          }
        }
      };

      const res = await fetch(`${process.env.STRAPI_API_URL}/api/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        importedCount++;
      } else {
        const errorData = await res.json();
        console.error(`Failed to import candidate ${email}:`, errorData);
      }
    }

    return { success: true, count: importedCount, total: candidates.length };

  } catch (error) {
    console.error("CSV Import Error:", error);
    return { success: false, error: "Failed to parse and import CSV." };
  }
}