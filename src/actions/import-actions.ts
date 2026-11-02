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
      // Map LinkedIn's standard CSV export column names to our Strapi schema
      const payload = {
        data: {
          firstName: row['First Name'] || row['first_name'] || 'Unknown',
          lastName: row['Last Name'] || row['last_name'] || '',
          email: row['Email Address'] || row['email'] || '',
          linkedinUrl: row['Member Profile'] || row['Profile URL'] || row['linkedin_url'] || '',
          source: 'Linkedin',
          candidateStatus: 'New',
          job_posts: [parseInt(jobId)],
          // Save the rest of the raw LinkedIn data into the dynamic answers JSON just in case
          dynamicAnswers: {
            headline: row['Headline'] || '',
            location: row['Location'] || '',
            applicationDate: row['Application Date'] || ''
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
        console.error("Failed to import candidate:", await res.json());
      }
    }

    return { success: true, count: importedCount, total: candidates.length };

  } catch (error) {
    console.error("CSV Import Error:", error);
    return { success: false, error: "Failed to parse and import CSV." };
  }
}