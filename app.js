const input = document.getElementById("command-input");
const terminal = document.getElementById("terminal");

input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const command = input.value.trim();
        if (!command) return;

        // Display command
        appendLine(`copilot@user:~$ ${command}`, "user-command");
        input.value = "";

        // Process special local commands
        if (command.toLowerCase() === "clear") {
            terminal.innerHTML = "";
            return;
        }

        try {
            // Call Backend
            const response = await fetch("http://localhost:3000/api/copilot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ command: command })
            });

            const data = await response.json();

            if (data.success) {
                appendLine(data.result, "ai-response");
            } else {
                appendLine(`Error: ${data.error}`, "error");
            }
        } catch (err) {
            appendLine(`Connection Error: Could not reach backend.`, "error");
        }

        terminal.scrollTop = terminal.scrollHeight;
    }
});

function appendLine(text, className) {
    const div = document.createElement("div");
    div.className = `output ${className}`;
    div.innerText = text;
    terminal.appendChild(div);
}
