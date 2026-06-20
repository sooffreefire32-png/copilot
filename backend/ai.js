const axios = require("axios");
const fs = require("fs");

const token = process.env.GITHUB_TOKEN;

async function analyzeProblem(message, imagePath) {

    let imageBase64 = null;

    if (imagePath) {
        imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
    }

    const prompt = `
You are a senior software engineer.

User problem:
${message}

If image is provided, analyze error from screenshot.

Return response strictly in JSON:

{
  "file_path": "path/to/file",
  "fixed_code": "FULL CODE HERE",
  "explanation": "short explanation"
}
`;

    const res = await axios.post(
        "https://models.github.ai/inference/chat/completions",
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
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const output = res.data.choices[0].message.content;

    try {
        return JSON.parse(output);
    } catch {
        return { raw: output };
    }
}

module.exports = { analyzeProblem };