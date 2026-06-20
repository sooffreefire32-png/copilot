const axios = require("axios");
const fs = require("fs");

const TOKEN = process.env.GITHUB_TOKEN;
const API = "https://api.github.com";

async function pushFile(repo, filePath, content) {

    await axios.put(
        `${API}/repos/${repo}/contents/${filePath}`,
        {
            message: "AI auto fix",
            content: Buffer.from(content).toString("base64")
        },
        {
            headers: {
                Authorization: `token ${TOKEN}`
            }
        }
    );
}

module.exports = { pushFile };