
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const message = req.body?.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "API key is not configured" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message.trim() }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    
  if (!response.ok) {
    console.error(
      "Gemini API error:",
      response.status,
      data.error?.message
    );

  return res.status(502).json({ error: "Gemini request failed" });
}


    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: "Unable to contact Gemini" });
  }
}
