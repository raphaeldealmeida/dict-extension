function removeTooltip() {
    const oldTooltip = document.getElementById("dict-trans-tooltip");
    if (oldTooltip) oldTooltip.remove();
}

function showTooltip(text, x, y, autoDismiss = true) {
    removeTooltip();

    const tooltip = document.createElement("div");
    tooltip.id = "dict-trans-tooltip";
    tooltip.innerText = text;

    tooltip.style.position = "absolute";
    tooltip.style.top = `${y + 10}px`;
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.zIndex = "99999";
    tooltip.style.background = "#f9f9f9";
    tooltip.style.border = "1px solid #ccc";
    tooltip.style.borderRadius = "5px";
    tooltip.style.padding = "10px 30px 10px 10px";
    tooltip.style.fontSize = "14px";
    tooltip.style.maxWidth = "300px";
    tooltip.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    tooltip.style.whiteSpace = "pre-wrap";
    tooltip.style.fontFamily = "Arial, sans-serif";

    // Botão de fechar
    const closeBtn = document.createElement("div");
    closeBtn.innerText = "✖";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "5px";
    closeBtn.style.right = "8px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "12px";
    closeBtn.style.color = "#888";
    closeBtn.addEventListener("click", removeTooltip);

    tooltip.appendChild(closeBtn);
    document.body.appendChild(tooltip);

    if (autoDismiss) {
        setTimeout(removeTooltip, 15000);
    }

    return tooltip;
}

// Função para tradução com MyMemory API
async function translateWithMyMemory(text) {
    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`
        );
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (err) {
        return null;
    }
}

document.addEventListener("mouseup", async (event) => {
    const selection = window.getSelection().toString().trim();
    if (!selection || !event.ctrlKey) return;

    const x = event.pageX;
    const y = event.pageY;

    // Palavra única → definição offline
    if (selection.split(" ").length === 1) {
        try {
            const response = await fetch(chrome.runtime.getURL("dictionary.json"));
            const dict = await response.json();
            const word = selection.toLowerCase();
            if (dict[word]) {
                const entry = dict[word];
                const text = `[${entry.part_of_speech}] ${word}: ${entry.definition}\nExample: ${entry.example}`;
                showTooltip(text, x, y, true);
            } else {
                showTooltip(`Word "${selection}" not found in dictionary.`, x, y, true);
            }
        } catch (err) {
            showTooltip("Error loading dictionary.", x, y, true);
        }
    } else {
        // Frase → traduzir com MyMemory, sem timeout
        const tooltip = showTooltip(`"${selection}"\n\nTraduzindo...`, x, y, false);
        const translated = await translateWithMyMemory(selection);
        if (translated) {
            tooltip.firstChild.nodeValue = `"${selection}"\n\nTradução: ${translated}`;
        } else {
            tooltip.firstChild.nodeValue = `"${selection}"\n\nErro na tradução.`;
        }
    }
});
