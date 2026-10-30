require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const AI_URL = "https://api.groq.com/openai/v1/chat/completions";
const AI_KEY = process.env.GROQ_API_KEY;
const AI_MODEL = "openai/gpt-oss-120b";

app.post("/api/read-cv", async (req, res) => {
  const response = await fetch(AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Read the CV and answer as JSON with the candidate's name, skills, years_experience, contact (email and phone) and a one-sentence summary. Only use facts written in the CV.",
        },
        { role: "user", content: req.body.cv },
      ],
      max_completion_tokens: 1000,
    }),
  });

  if (!response.ok) {
    return res.status(502).json({ error: "The AI is unavailable, try again" });
  }
  const data = await response.json();
  res.json({ content: data.choices[0].message.content });
});

app.listen(3000, () => console.log("Server on port 3000"));
