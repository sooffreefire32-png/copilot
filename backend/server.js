const express = require("express");
const cors = require("cors");
const { runAI } = require("./ai");
const { pushFile, getFileContent } = require("../github");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 MAIN COPILOT ROUTE
app.post("/api/copilot", async (req, res) => {
    const { command, repo, filePath, content } = req.body;

    if (!command) {
        return res.status(400).json({ error: "Command is required" });
    }

    try {
        console.log(`Processing command: ${command}`);

        // 1. Check if it's a direct GitHub fix command
        if (command.toLowerCase().startsWith("fix")) {
            const parts = command.split(" ");
            const targetFilePath = parts[1]; // e.g., "fix backend/server.js"
            const targetRepo = repo || "sooffreefire32-png/copilot";

            if (!targetFilePath) {
                return res.json({ result: "Please specify a file path. Example: fix backend/server.js" });
            }

            // Read the file first
            const originalContent = await getFileContent(targetRepo, targetFilePath);
            
            // Ask AI to fix it
            const fixedContent = await runAI(`Fix this code and return ONLY the full corrected code:\n\n${originalContent}`);
            
            // Push back to GitHub
            const githubResult = await pushFile(targetRepo, targetFilePath, fixedContent, `AI Fix: ${targetFilePath}`);
            
            return res.json({ 
                success: true, 
                result: `I've analyzed and fixed ${targetFilePath}. Changes have been pushed to GitHub.`,
                github: githubResult 
            });
        }

        // 2. Direct Push command
        if (command.toLowerCase().startsWith("push")) {
            if (!repo || !filePath || !content) {
                return res.json({ result: "I need repo, filePath, and content to push." });
            }
            const githubResult = await pushFile(repo, filePath, content);
            return res.json({ success: true, result: `Pushed to ${filePath}.` });
        }

        // 2. Otherwise, let AI handle the command
        const aiResult = await runAI(command, content ? `File: ${filePath}\nContent: ${content}` : "");
        
        res.json({
            success: true,
            result: aiResult
        });

    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Copilot Backend running on port ${PORT}`);
});
