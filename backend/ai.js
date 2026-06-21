const axios = require("axios");

const GH_API = process.env.GH_API;
const GH_TOKEN = process.env.GH_TOKEN;

async function runAI(prompt, context = "") {
    try {
        const response = await axios.post(
            GH_API,
            {
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an AI Copilot. Your goal is to help users with their code, fix bugs, and execute commands. 
                        You can provide code fixes, explanations, and suggest GitHub operations. 
                        When providing code fixes, return the full corrected code. 
                        If the user asks to 'push' or 'fix' a file, indicate that you are preparing a GitHub update.
                        Current context: ${context}`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${GH_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("AI Error:", error.message);
        throw new Error("AI Assistant is currently unavailable.");
    }
}

module.exports = { runAI };
