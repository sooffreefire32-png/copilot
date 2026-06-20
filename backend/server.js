const express = require("express");
const { runAI } = require("./ai");

const app = express();

app.use(express.json());

// 🧠 MAIN AI ROUTE
app.post("/api/ai", async (req, res) => {
    try {

        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).json({
                error: "Prompt missing"
            });
        }

        // 🤖 AI CALL (from ai.js)
        const result = await runAI(prompt);

        // 📤 RESPONSE BACK TO FRONTEND
        res.json({
            success: true,
            result: result
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// 🚀 SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});