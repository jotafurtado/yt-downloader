# YouTube Downloader CLI 🚀

A simple, powerful, and cross-platform command-line application to download YouTube videos and audio in the highest possible quality.

Under the hood, this tool uses the industry-standard [yt-dlp](https://github.com/yt-dlp/yt-dlp) and automatically provides static builds of **FFmpeg** to seamlessly merge 4K/1080p video streams and convert highest quality audio into MP3.

## Features

- 📥 **Interactive CLI:** Easy-to-use menu to select your desired download options.
- 🎥 **Best Video Quality:** Automatically downloads and merges the highest resolution video and audio streams (1080p, 4K, 8K) into a single file.
- 🎵 **Best Audio Quality (MP3):** Extracts the highest quality audio stream directly from YouTube and encodes it to a transparent V0 VBR MP3 (~256-320 kbps).
- 🔗 **Direct Links:** Option to fetch and output the direct raw download links directly from YouTube servers.
- 📁 **Organized:** Automatically creates a `downloads/` folder and saves files named after their YouTube title.
- 💻 **Cross-Platform:** Works on Windows, macOS, and Linux!

## Prerequisites

1. **Node.js** installed on your system.
2. **yt-dlp** executable. 
   - **Windows:** The script looks for `yt-dlp.exe` in the root folder.
   - **macOS/Linux:** The script looks for `yt-dlp_macos` or `yt-dlp_linux` in the root folder.
   - **Global Fallback:** If you have `yt-dlp` installed globally via `pip install yt-dlp`, `brew install yt-dlp`, or `apt`, the app will automatically detect and use it!

## Installation

1. Clone or download this repository.
2. Open your terminal in the project folder and install the dependencies (this will also download `ffmpeg` and `ffprobe` for your OS automatically):
   ```bash
   npm install
   ```
3. (Optional but recommended) Download the latest `yt-dlp` executable for your OS from their [official releases](https://github.com/yt-dlp/yt-dlp/releases/latest) and place it in the root folder.

## Usage

Simply run the start command and follow the interactive prompts:

```bash
npm start
```

### Options Explained:

1. **Get direct download links (Video/Audio):** Does not download the file locally. Instead, it extracts the hidden direct URLs to the highest quality streams.
2. **Download video and audio in best quality:** Downloads the absolute best video stream and the best audio stream, then uses FFmpeg to merge them into an `.mkv` file.
3. **Download audio only (MP3):** Downloads the best audio stream and converts it into a high-quality `.mp3` file.

## Dependencies Used

- [inquirer](https://www.npmjs.com/package/inquirer): For the interactive CLI prompts.
- [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static): Provides the FFmpeg binary dynamically for any OS.
- [ffprobe-static](https://www.npmjs.com/package/ffprobe-static): Provides the FFprobe binary dynamically for any OS.

## License

MIT License. Feel free to fork and modify!

---

**⚠️ Disclaimer:** *This tool is for educational purposes only. Downloading copyrighted material without permission is against YouTube's Terms of Service and may be illegal in your country. The author is not responsible for any misuse of this software.*
