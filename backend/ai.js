const axios = require("axios");

const GH_API = process.env.GH_API;     // 👈 secret yahan se
const GH_TOKEN = process.env.GH_TOKEN;

async function runAI(prompt) {

    const response = await axios.post(
        GH_API,
        {
            model: "gpt-4o-mini",
            messages: [
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
}

module.exports = { runAI };