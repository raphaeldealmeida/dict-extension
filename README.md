# Inline Dictionary & Translator Chrome Extension

## Overview
The Inline Dictionary & Translator is a Chrome extension that provides instant word definitions and phrase translations directly on any webpage. It combines online dictionary functionality for single words with online translation capabilities for phrases.

## Features

### 1. Word Definitions
- Instantly lookup definitions for single English words
- Shows part of speech, definition, and usage examples
- **Uses [dictionaryapi.dev](https://dictionaryapi.dev/) for online definitions**
- Activated by selecting a word + Ctrl key

### 2. Phrase Translation
- Translates selected phrases from English to Portuguese
- Powered by MyMemory Translation API
- Activated by selecting multiple words + Ctrl key
- Real-time translation display

### 3. User Interface
- Clean, non-intrusive tooltip interface
- Auto-dismissing tooltips after 15 seconds (for definitions)
- Manual close option via 'X' button
- Position-aware tooltip placement

## Installation

1. Clone this repository or download the source code
```bash
git clone [repository-url]
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

## Usage

1. **Word Definition**:
   - Select any single word
   - Hold Ctrl key
   - A tooltip will appear with the definition (fetched online)

2. **Phrase Translation**:
   - Select any phrase or sentence
   - Hold Ctrl key
   - A tooltip will appear with the English text and Portuguese translation

## Technical Requirements

- Google Chrome browser (latest version recommended)
- Internet connection (for both definitions and translations)

## Architecture

### Components
- `manifest.json`: Extension configuration and permissions
- `content.js`: Main functionality and UI implementation
- `background.js`: Background service worker

### Permissions
- `activeTab`: For accessing current page content
- `scripting`: For injecting content scripts

## Development

### Local Development
1. Make changes to the source code
2. Refresh the extension in `chrome://extensions/`
3. Reload the target webpage

## Future Enhancements
- Support for additional languages
- Customizable keyboard shortcuts
- Extended dictionary database
- Offline translation and definition capabilities
- User-defined dictionary entries

## License
This project is available under the MIT License.
