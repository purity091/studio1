import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req: any, res: any) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash", // Updated to a stable, fast model
            contents: `You are a professional marketing copywriter for a financial investment firm called 'AI-Investor'. 
      Create content for a social media poster about this topic: "${topic}".
      The language MUST be Arabic.
      
      Return a JSON object with:
      1. headline: A catchy, short question or statement (max 7 words).
      2. subHeadline: A supporting sentence (max 10 words).
      3. imagePrompt: A visual description to generate an image related to the topic (in English).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        subHeadline: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING }
                    },
                    required: ["headline", "subHeadline", "imagePrompt"]
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No text returned from Gemini");

        const result = JSON.parse(text);
        return res.status(200).json(result);

    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
