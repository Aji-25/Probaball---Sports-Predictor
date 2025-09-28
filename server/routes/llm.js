/**
 * LLM API integration for sports predictions
 */

const axios = require("axios");

/**
 * Call Gemini LLM API with universal query handling
 */
async function callLLMAPI(query) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing GEMINI_API_KEY in .env");
    return null;
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are a sports prediction and analysis assistant.
The user asks: "${query}"

Your task:
1. Detect whether the query is about teams, players, or general sports analysis.
2. Always return ONLY valid JSON in this format:

{
  "title": "string",
  "probability": { "teamA": number, "draw": number, "teamB": number } | null,
  "stats": { "recentForm": object | null, "avgGoals": object | null },
  "insight": "string",
  "smart_bet": { "recommendation": "string", "confidence": number } | null
}

- If probability or stats are irrelevant, set them to null.
- Ensure numbers are floats between 0 and 1 for probabilities.
- Do NOT add extra text outside JSON.
`
              }
            ]
          }
        ]
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000
      }
    );

    const textResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!textResponse) throw new Error("Empty response from Gemini");

    try {
      // Remove markdown code blocks if present
      let jsonString = textResponse.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      return JSON.parse(jsonString);
    } catch (err) {
      console.error("⚠️ Failed to parse Gemini JSON:", err);
      console.error("Raw response:", textResponse);
      return {
        title: "AI Response",
        probability: null,
        stats: { recentForm: null, avgGoals: null },
        insight: textResponse
      };
    }
  } catch (error) {
    console.error("❌ Gemini API call failed:", error.message);
    return null;
  }
}

/**
 * Process user query (universal)
 */
async function processLLMQuery(req, res) {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Invalid query" });
    }

    // Always call Gemini for any query
    const llmResult = await callLLMAPI(query);

    if (!llmResult) {
      return res.status(500).json({
        error: "AI service unavailable. Please try again later."
      });
    }

    return res.json(llmResult);
  } catch (error) {
    console.error("❌ Error in processLLMQuery:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  processLLMQuery,
  callLLMAPI
};
