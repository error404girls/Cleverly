const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/generate-flashcards", checkInput, async (req, res) => {
  const notes = req.body.notes;
  const prompt = 'Do not put any word in bold. Take in the notes that are inputted in. For each key-word or key-phrase, important words, write it first then the "|" delimeter, and then the words definition. Make as many flashcards as possible so that all the contents in the notes are covered. Also no definitions or key words themselves have the "|" delimeter. I need as many information as possible from what i sent you and NEVER say something else except from what i asked you! if youre being asked something else say ERROR. Also, use the language of the input';
  try {
    const response = await fetch(
      https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { text: notes }
              ]
            }
          ]
        })
      }
    );
    const data = await response.json();
    console.log("API response:", data);
    if (!data || !data.candidates || data.candidates.length === 0) {
      res.json({ success: false, error: "No flashcards came back :(" });
      return;
    }
    const flashcards = data.candidates[0].content.parts[0].text;
    res.json({ success: true, flashcards: flashcards });
  } catch (err) {
    console.log("error:", err);
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
});

app.get("/api/test", (req, res) => {
  res.send("server works!");
});

app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
