const express = require("express");
const router = express.Router();

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-8b-8192";

async function groq(messages) {
  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error: ${err}`);
  }
  const data = await res.json();
  return data.choices[0]?.message?.content || "";
}

// 1. Chatbot — POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const reply = await groq([
      {
        role: "system",
        content: `You are EmmanStore's friendly AI shopping assistant.
Help customers with product recommendations, order tracking, shipping and
return policies, and general store queries.
Be concise, helpful, and friendly. Keep replies short and clear.`,
      },
      ...history,
      { role: "user", content: message },
    ]);

    res.json({ reply, success: true });
  } catch (err) {
    console.error("AI Chat Error:", err.message);
    res.status(500).json({
      reply: "Sorry, AI is offline right now! 😔",
      success: false,
    });
  }
});

// 2. Description — POST /api/ai/description
router.post("/description", async (req, res) => {
  try {
    const { title, category, price } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: "title and category required" });
    }

    const description = await groq([
      {
        role: "user",
        content: `Write a compelling 2-3 sentence product description for an e-commerce website.
Product: ${title}
Category: ${category}${price ? `\nPrice: ₹${price}` : ""}
Make it professional, highlight key benefits, and encourage purchase.
Only return the description text, nothing else.`,
      },
    ]);

    res.json({ description: description.trim() });
  } catch (err) {
    console.error("Description Error:", err.message);
    res.status(500).json({
      description: "Premium quality product at great value.",
    });
  }
});

// 3. Recommendations — POST /api/ai/recommendations
router.post("/recommendations", async (req, res) => {
  try {
    const { currentProduct, allProducts = [] } = req.body;

    const productList = allProducts
      .slice(0, 20)
      .map((p) => `${p._id}:${p.title}:${p.category}:₹${p.price}`)
      .join("\n");

    const reply = await groq([
      {
        role: "user",
        content: `Given this product: "${currentProduct.title}" in category "${currentProduct.category}"
From this list, pick 4 most relevant product IDs to recommend.
Products:
${productList}
Return ONLY a JSON array of 4 product IDs like: ["id1","id2","id3","id4"]
No explanation, just the JSON array.`,
      },
    ]);

    let ids = [];
    try {
      const match = reply.match(/\[.*?\]/s);
      if (match) ids = JSON.parse(match[0]);
    } catch {
      ids = allProducts.slice(0, 4).map((p) => p._id?.toString());
    }

    const recommended = allProducts.filter((p) =>
      ids.includes(p._id?.toString())
    );
    res.json({ recommendations: recommended });
  } catch (err) {
    console.error("Recommendations Error:", err.message);
    res.status(500).json({ recommendations: [] });
  }
});

// 4. Sentiment — POST /api/ai/sentiment
router.post("/sentiment", async (req, res) => {
  try {
    const { review } = req.body;

    const reply = await groq([
      {
        role: "user",
        content: `Analyze the sentiment of this product review:
"${review}"
Reply with ONLY one word: "positive", "negative", or "neutral"`,
      },
    ]);

    const raw = reply.toLowerCase().trim();
    const sentiment = raw.includes("positive")
      ? "Positive"
      : raw.includes("negative")
      ? "Negative"
      : "Neutral";

    res.json({ sentiment });
  } catch (err) {
    res.status(500).json({ sentiment: "Neutral" });
  }
});

module.exports = router;