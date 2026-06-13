const express = require("express");
const router  = express.Router();

// POST /api/chatbot/message
router.post("/message", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const response = await fetch("http://localhost:11434/api/chat", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model:    "llama3.2",   // keep consistent with ai.js
        stream:   false,
        messages: [
          {
            role: "system",
            content: `You are EmmanStore's friendly AI shopping assistant.
Help customers with:
- Finding products
- Order tracking & status
- Shipping & return policies
- Product recommendations
- General store queries
Be concise, helpful, and friendly. Keep replies short and clear.`,
          },
          ...history,
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
    const data = await response.json();

    res.json({
      reply:   data.message?.content || "Sorry, I could not process that!",
      success: true,
    });
  } catch (err) {
    console.error("Chatbot error:", err.message);
    res.status(500).json({
      reply:   "AI is offline right now. Start with: ollama run llama3.2",
      success: false,
    });
  }
});

module.exports = router;