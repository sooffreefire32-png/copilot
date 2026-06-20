const express = require("express");
const multer = require("multer");
const cors = require("cors");

const { analyzeProblem } = require("./ai");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/api/debug", upload.single("image"), async (req, res) => {
    try {
        const message = req.body.message;
        const imagePath = req.file?.path;

        const result = await analyzeProblem(message, imagePath);

        res.json(result);

    } catch (err) {
        res.json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});