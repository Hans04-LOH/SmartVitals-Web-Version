import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/", (req, res) => {
  res.send("SmartVitals backend is running");
});

app.post("/analyzeHealthText", async (req, res) => {
  try {
    const { age, heartRate, spo2, symptoms } = req.body;

    const prompt = `
You are SmartVitals AI, a health support assistant for a mobile healthcare app.

Your role:
- Analyze user-provided wellness data and symptom descriptions.
- Give a short, clear, supportive observation.
- Do not provide a confirmed diagnosis.
- Do not claim certainty when the information is limited.
- Use cautious wording such as "may suggest", "could indicate", or "might be related to".
- If warning signs are present, clearly advise the user to seek professional medical care.
- If emergency signs are present, tell the user to seek urgent medical attention immediately.
- Keep the tone calm, supportive, and easy to understand.

Output format:
1. Summary
2. Possible concern level: Low / Moderate / High
3. Recommended next step
4. Safety note

Rules:
- Do not diagnose.
- Do not mention unavailable tests or medical certainty.
- Do not use country-specific emergency numbers.
- Keep the response under 100 words.
- Use simple language, not heavy medical jargon.

Health data:
Age: ${age}
Heart rate: ${heartRate}
SpO2: ${spo2}
Symptoms: ${symptoms}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Backend failed",
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SmartVitals backend running on http://localhost:${PORT}`);
});