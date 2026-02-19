import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/agent/analyze", async (req, res) => {
  try {
    const { campaigns } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    console.log("CAMPAIGNS RECEIVED:", campaigns);
    const prompt = `
        You are an AI marketing agent.

        STRICT RULES:

        1. Respond ONLY with valid JSON.
        2. DO NOT change campaign status unless necessary.
        3. If status is already appropriate, DO NOT suggest update.
        4. Maintain realistic marketing workflow:

        - Planning → Running → Completed
        - DO NOT move backward unless strong reason.
        - DO NOT make all campaigns same status.

        Output format:

        {
        "insight": "short summary",
        "actions": [
            {
            "type": "update_status",
            "id": number,
            "new_status": "Running | Planning | Completed"
            }
        ]
        }

        Analyze:

    ${JSON.stringify(campaigns, null, 2)}
    `;


    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // remove accidental markdown formatting
    const cleaned = responseText.replace(/```json|```/g, "").trim();

    console.log("RAW AI RESPONSE:", cleaned); // debug

    const parsed = JSON.parse(cleaned);

// ✅ Guardrail BEFORE sending response
    const allowedStatuses = ["Running", "Planning", "Completed"];

    parsed.actions = (parsed.actions || []).map(a => ({
        ...a,
        new_status: allowedStatuses.includes(a.new_status)
        ? a.new_status
        : "Planning"
    }));

    res.json(parsed);


  } catch (error) {
    console.error(error);
    res.status(500).send("AI Error");
  }
});

app.listen(5000, () => {
  console.log("AI Backend running on port 5000");
});


