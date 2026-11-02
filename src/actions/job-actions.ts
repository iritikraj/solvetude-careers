'use server'

import { GoogleGenAI, Type } from '@google/genai';
import { revalidatePath } from 'next/cache';

// Initialize the new Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function createJobPostWithAI(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const department = formData.get('department') as string;
    const type = formData.get('type') as string;
    const experience = formData.get('experience') as string;
    const rawQuestions = formData.get('rawQuestions') as string;
    const jobDescription = formData.get('jobDescription') as string;

    // 1. Generate a URL-safe slug (e.g., "senior-frontend-engineer-8f2a")
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    // 2. The Prompt & Structured Output Schema
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Job Title: ${title}
        Job Type: ${type}
        Job Experience: ${experience}
        Job Description: ${jobDescription}
        HR's Raw Questions: ${rawQuestions}

        Generate the form fields needed for this application. 
        Always include "firstName", "lastName", "email", "linkedinUrl", "noticePeriod" and "resume" (type: file) as the first 5 fields, required.
        ${rawQuestions.trim() 
        ? "Then, translate the HR's raw questions into professional form fields." 
        : "Since no raw questions were provided, output ONLY the 6 mandatory fields."}
      `,
      config: {
        systemInstruction: "You are an expert HR form architect.",
        responseMimeType: 'application/json',
        // Force Gemini to strictly adhere to your UI's expected format
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "camelCase identifier, e.g., 'noticePeriod'" },
              type: { type: Type.STRING, enum: ["text", "email", "url", "textarea", "select", "file"] },
              label: { type: Type.STRING, description: "Professional Question Label" },
              required: { type: Type.BOOLEAN },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Only include an array of strings if type is 'select'"
              }
            },
            required: ["id", "type", "label", "required"]
          }
        }
      }
    });

    // 3. Parse the securely formatted JSON
    const formSchema = JSON.parse(response.text || "[]");

    // 4. Save to Strapi securely
    const strapiPayload = {
      data: {
        title,
        slug,
        department,
        type,
        experience,
        jobDescription,
        rawQuestions,
        formSchema,
        postStatus: 'Published'
      }
    };

    const strapiRes = await fetch(`${process.env.STRAPI_API_URL}/api/job-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(strapiPayload),
    });

    if (!strapiRes.ok) {
      const errorData = await strapiRes.json();
      throw new Error(`Strapi Error: ${JSON.stringify(errorData)}`);
    }

    const savedJob = await strapiRes.json();

    // 5. Instantly bust the cache for the careers page so the new job appears immediately
    revalidatePath('/careers');

    return {
      success: true,
      data: savedJob
    };
  } catch (error) {
    console.error("Failed to create Job Post:", error);
    return { success: false, error: "Failed to generate and save job post." };
  }
}