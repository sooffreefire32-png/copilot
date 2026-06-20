const express = require("express");
const { runAI } = require("./ai");

const app = express();
app.use(express.json());

app.post("/api/ai", async (req, res) => {
    try {
        const result = await runAI(req.body.prompt);
        res.json({ result });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server running");
});