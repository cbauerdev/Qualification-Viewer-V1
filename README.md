# Qualification Viewer V1.0

## Overview
Qualification Viewer is a browser plugin that allows you to view your and only your personal data on [Stellar.ai](https://joinstellar.ai/home/).
Specifically, it reads your `.json` file and presents relevant information in a user-friendly format.

## Features
With this plugin, you can see:
- Passed Qualifications
- Available Qualifications
- Pending Qualifications
- Projects you're in
- Everything else

Updates the information every 60 seconds.

## Compatibility
This plugin has been tested on:
- **Chromium-based browsers** (e.g., Chrome, Edge, Brave)
  - Version: **1.74.51 Chromium: 132.0.6834.160** (Official Build) (64-Bit)
- **Firefox**
  - Version: **134.0.2 (64-Bit)**

## Platform Support
- ✅ **Windows & Linux** (Confirmed working)
- ❓ **MacOS / WebKit** (Not tested, but it's just JavaScript and HTML, so... YOLO 🤷‍♂️)

## Installation
### Option 1: Load as an unpacked extension
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/qualification-viewer.git
   ```

   OR

   - Click the green `<>Code` Button
   - Download ZIP
   - Unzip `Qualification-Viewer-V1-main.zip`


2. Load the plugin as an unpacked extension in your browser (Chrome/Edge/Brave):
   - Open `chrome://extensions/`
   - Enable **Developer Mode** (top right corner)
   - Click **Load unpacked**
   - Select the cloned folder
3. (Optional) For Firefox, use `about:debugging` to load it temporarily.

### Option 2: Install from pre-built `.crx` file
Alternatively, you can use the `Qualification Viewer.crx` file from the `build` folder. Browsers will mark this as being from an untrusted source, though.

## Contributing
Feel free to open issues and submit pull requests. Contributions are welcome!

## License
[MIT License](https://github.com/cbauerdev/Qualification-Viewer-V1/blob/main/LICENSE.md)

---
**Disclaimer:** This project is not affiliated with Stellar.ai.