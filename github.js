const axios = require("axios");

const TOKEN = process.env.GH_TOKEN; // Using the same token name as the user mentioned
const API = "https://api.github.com";

async function getFileSha(repo, filePath) {
    try {
        const response = await axios.get(`${API}/repos/${repo}/contents/${filePath}`, {
            headers: { Authorization: `token ${TOKEN}` }
        });
        return response.data.sha;
    } catch (error) {
        return null; // File might not exist
    }
}

async function getFileContent(repo, filePath) {
    try {
        const response = await axios.get(`${API}/repos/${repo}/contents/${filePath}`, {
            headers: { Authorization: `token ${TOKEN}` }
        });
        return Buffer.from(response.data.content, "base64").toString("utf-8");
    } catch (error) {
        console.error("GitHub Read Error:", error.message);
        throw new Error(`Could not read file ${filePath} from ${repo}.`);
    }
}

async function pushFile(repo, filePath, content, message = "AI auto fix") {
    const sha = await getFileSha(repo, filePath);
    
    try {
        const response = await axios.put(
            `${API}/repos/${repo}/contents/${filePath}`,
            {
                message: message,
                content: Buffer.from(content).toString("base64"),
                sha: sha
            },
            {
                headers: {
                    Authorization: `token ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("GitHub Push Error:", error.response ? error.response.data : error.message);
        throw new Error("Failed to push changes to GitHub.");
    }
}

module.exports = { pushFile, getFileContent };
