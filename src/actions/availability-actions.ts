'use server'

export async function updateAvailability(token: string, isAvailable: boolean) {
  try {
    // 1. Find the candidate matching this exact token
    const findRes = await fetch(`${process.env.STRAPI_API_URL}/api/candidates?filters[magicToken][$eq]=${token}`, {
      headers: { 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}` },
      cache: 'no-store'
    });

    const { data } = await findRes.json();
    if (!data || data.length === 0) {
      return { success: false, error: "Invalid or expired link." };
    }

    const candidateId = data[0].id;
    const today = new Date().toISOString().split('T')[0];

    // 2. Update their status, wipe the token (so it can't be reused), and log the date
    const updateRes = await fetch(`${process.env.STRAPI_API_URL}/api/candidates/${candidateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          isAvailable,
          magicToken: null, // Invalidate the link
          lastContactedDate: today
        }
      }),
    });

    if (!updateRes.ok) throw new Error('Failed to update availability');

    return { success: true };
  } catch (error) {
    console.error("Availability Update Error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}