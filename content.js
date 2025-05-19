function removeTooltip() {
    const oldTooltip = document.getElementById("dict-trans-tooltip");
    if (oldTooltip) oldTooltip.remove();
}

function speakText(text, lang = 'en-US') {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

function createSpeakerButton() {
    const button = document.createElement('div');
    button.innerText = '🔊';
    button.style.position = 'absolute';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    return button;
}

function showTooltip(text, x, y, autoDismiss = true, translation = null) {
    removeTooltip();

    const tooltip = document.createElement("div");
    tooltip.id = "dict-trans-tooltip";
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

    const contentDiv = document.createElement('div');
    contentDiv.style.position = 'relative';
    contentDiv.style.paddingRight = '25px';
    
    if (translation) {
        const originalTextDiv = document.createElement('div');
        originalTextDiv.textContent = `"${text}"`;
        
        const translationDiv = document.createElement('div');
        translationDiv.style.marginTop = '10px';
        translationDiv.textContent = `Tradução: ${translation}`;

        const origSpeaker = createSpeakerButton();
        origSpeaker.style.right = '25px';
        origSpeaker.style.top = '0';
        origSpeaker.addEventListener('click', () => speakText(text, 'en-US'));

        const transSpeaker = createSpeakerButton();
        transSpeaker.style.right = '25px';
        transSpeaker.style.top = '25px';
        transSpeaker.addEventListener('click', () => speakText(translation, 'pt-BR'));

        contentDiv.appendChild(originalTextDiv);
        contentDiv.appendChild(translationDiv);
        contentDiv.appendChild(origSpeaker);
        contentDiv.appendChild(transSpeaker);
    } else {
        contentDiv.textContent = text;
        const speaker = createSpeakerButton();
        speaker.style.right = '25px';
        speaker.style.top = '0';
        speaker.addEventListener('click', () => speakText(text, 'en-US'));
        contentDiv.appendChild(speaker);
    }

    tooltip.appendChild(contentDiv);

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

    // Palavra única → definição via dictionaryapi.dev
    if (selection.split(" ").length === 1) {
        try {
            const word = selection.toLowerCase();
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
            if (!response.ok) {
                showTooltip(`Word "${selection}" not found in dictionary.`, x, y, true);
                return;
            }
            const data = await response.json();
            // Pega a primeira definição e exemplo disponíveis
            const entry = data[0];
            const meaning = entry.meanings && entry.meanings[0];
            const definitionObj = meaning && meaning.definitions && meaning.definitions[0];
            const partOfSpeech = meaning ? meaning.partOfSpeech : '';
            const definition = definitionObj ? definitionObj.definition : 'No definition found.';
            const example = definitionObj && definitionObj.example ? definitionObj.example : '';

            const titleDiv = document.createElement('div');
            titleDiv.style.display = 'flex';
            titleDiv.style.alignItems = 'center';
            titleDiv.style.gap = '5px';
            titleDiv.style.marginBottom = '8px';
            
            const wordTitle = document.createElement('strong');
            wordTitle.textContent = word;
            titleDiv.appendChild(wordTitle);

            const speaker = createSpeakerButton();
            speaker.style.position = 'relative';
            speaker.style.right = 'auto';
            speaker.style.top = 'auto';
            speaker.addEventListener('click', () => speakText(word, 'en-US'));
            titleDiv.appendChild(speaker);

            let text = `[${partOfSpeech}] ${definition}`;
            if (example) text += `\nExample: ${example}`;
            const tooltip = showTooltip(text, x, y, true);
            tooltip.firstChild.insertBefore(titleDiv, tooltip.firstChild.firstChild);
        } catch (err) {
            showTooltip("Error loading dictionary.", x, y, true);
        }
    } else {
        // Frase → traduzir com MyMemory, sem timeout
        const tooltip = showTooltip(selection, x, y, false);
        const translated = await translateWithMyMemory(selection);
        if (translated) {
            tooltip.remove();
            showTooltip(selection, x, y, false, translated);
        } else {
            tooltip.firstChild.nodeValue = `"${selection}"\n\nErro na tradução.`;
        }
    }
});
