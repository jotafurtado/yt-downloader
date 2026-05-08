const inquirer = require('inquirer');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

// Add ffmpeg and ffprobe directories to PATH so yt-dlp can find them
process.env.PATH = `${path.dirname(ffmpegPath)}${path.delimiter}${path.dirname(ffprobePath)}${path.delimiter}${process.env.PATH}`;

const platform = process.platform;
let ytDlpBinaryName = 'yt-dlp';

if (platform === 'win32') {
    ytDlpBinaryName = 'yt-dlp.exe';
} else if (platform === 'darwin') {
    ytDlpBinaryName = 'yt-dlp_macos';
} else {
    ytDlpBinaryName = 'yt-dlp_linux';
}

let ytDlpPath = path.join(__dirname, ytDlpBinaryName);
const downloadsDir = path.join(__dirname, 'downloads');

// Fallback to global yt-dlp if local binary doesn't exist
if (!fs.existsSync(ytDlpPath)) {
    try {
        // Check if yt-dlp is installed globally in the system PATH
        execSync('yt-dlp --version', { stdio: 'ignore' });
        ytDlpPath = 'yt-dlp';
    } catch (e) {
        console.error(`Error: local binary '${ytDlpBinaryName}' not found, and global 'yt-dlp' command is not installed.`);
        console.log(`Please download the correct yt-dlp executable for your OS from https://github.com/yt-dlp/yt-dlp/releases/latest`);
        console.log(`and place it in this folder as '${ytDlpBinaryName}', OR install it globally (e.g., via pip, brew, or apt).`);
        process.exit(1);
    }
}

// Create downloads directory if it doesn't exist
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

// Default yt-dlp output path format
const outputPath = path.join(downloadsDir, '%(title)s.%(ext)s');

async function main() {
    console.log("=========================================");
    console.log("      YouTube Downloader CLI App         ");
    console.log("=========================================\n");

    const { url } = await inquirer.prompt([
        {
            type: 'input',
            name: 'url',
            message: 'Enter the YouTube video URL:',
            validate: input => input ? true : 'The URL cannot be empty.'
        }
    ]);

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: 'Get direct download links (Video/Audio)', value: 'links' },
                { name: 'Download video and audio in best quality', value: 'download_best' },
                { name: 'Download audio only (MP3)', value: 'download_audio' },
            ]
        }
    ]);

    if (action === 'links') {
        console.log('\nFetching direct links, please wait...');
        try {
            // --dump-json gets all metadata
            const output = execSync(`"${ytDlpPath}" --dump-json --no-warnings --quiet "${url}"`, { encoding: 'utf-8' });
            const data = JSON.parse(output);

            // get the best video and best audio formats
            const bestVideo = data.formats.filter(f => f.vcodec !== 'none' && f.acodec === 'none').sort((a, b) => b.tbr - a.tbr)[0] || data.formats.find(f => f.format_id === data.bestvideo?.format_id);
            const bestAudio = data.formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none').sort((a, b) => b.tbr - a.tbr)[0] || data.formats.find(f => f.format_id === data.bestaudio?.format_id);
            const bestCombined = data.formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none').sort((a, b) => b.tbr - a.tbr)[0] || data.formats.find(f => f.format_id === data.format_id);
            
            console.log("\n================ DIRECT LINKS ================\n");
            console.log(`Title: ${data.title}\n`);
            
            if (bestCombined) {
                console.log(`[Best Single File (Video+Audio)]`);
                console.log(`Resolution: ${bestCombined.resolution || 'N/A'}, Extension: ${bestCombined.ext}`);
                console.log(`Link: ${bestCombined.url}\n`);
            }
            if (bestVideo) {
                console.log(`[Video Only (Best Quality)]`);
                console.log(`Resolution: ${bestVideo.resolution || 'N/A'}, Extension: ${bestVideo.ext}`);
                console.log(`Link: ${bestVideo.url}\n`);
            }
            if (bestAudio) {
                console.log(`[Audio Only (Best Quality)]`);
                console.log(`Extension: ${bestAudio.ext}`);
                console.log(`Link: ${bestAudio.url}\n`);
            }
            console.log("Note: Direct YouTube links might expire or be restricted to your current IP address.");
        } catch (error) {
            console.error('\nError fetching links:', error.message);
        }
    } else if (action === 'download_best') {
        console.log('\nStarting download (Best Video & Audio Quality)...');
        console.log(`Saving to: ${downloadsDir}\n`);
        
        // Requires ffmpeg to merge video and audio for highest resolutions
        const child = spawn(ytDlpPath, ['-o', outputPath, '-f', 'bestvideo+bestaudio/best', '--merge-output-format', 'mkv', url], {
            stdio: 'inherit',
            shell: false
        });
        
        child.on('close', code => {
            if (code === 0) console.log('\nDownload completed successfully!');
            else console.log(`\nProcess finished with code ${code}`);
        });
    } else if (action === 'download_audio') {
        console.log('\nStarting audio download...');
        console.log(`Saving to: ${downloadsDir}\n`);
        
        const child = spawn(ytDlpPath, ['-o', outputPath, '-f', 'bestaudio', '-x', '--audio-format', 'mp3', '--audio-quality', '0', url], {
            stdio: 'inherit',
            shell: false
        });
        
        child.on('close', code => {
            if (code === 0) console.log('\nDownload completed successfully!');
            else console.log(`\nProcess finished with code ${code}`);
        });
    }
}

main().catch(err => {
    console.error("Error:", err);
});
