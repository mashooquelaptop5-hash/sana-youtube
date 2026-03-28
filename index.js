const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 8000;

const AUTHOR = "SaNa Usman";

// API Home Route
app.get('/', (req, res) => {
    res.send(`<h1>YouTube Downloader API</h1><p>Created by: <b>${AUTHOR}</b></p>`);
});

// Route to get Video Formats (Qualities)
app.get('/info', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "URL is required" });

    console.log(`[*] Fetching info for: ${videoUrl}`);
    
    // yt-dlp command to get JSON metadata
    exec(`yt-dlp -j "${videoUrl}"`, (error, stdout) => {
        if (error) return res.status(500).json({ error: error.message });
        
        const info = JSON.parse(stdout);
        const response = {
            title: info.title,
            thumbnail: info.thumbnail,
            duration: info.duration_string,
            formats: info.formats.filter(f => f.vcodec !== 'none').map(f => ({
                id: f.format_id,
                resolution: f.resolution,
                ext: f.ext,
                note: f.format_note
            })),
            createdBy: AUTHOR
        };
        res.json(response);
    });
});

// Route to Download (Best Video + Best Audio merged)
app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "URL is required" });

    console.log(`[*] Starting download for: ${videoUrl}`);
    
    // Merge best video + best audio into MP4 using ffmpeg
    const cmd = `yt-dlp -f "bestvideo+bestaudio/best" --merge-output-format mp4 -o "%(title)s.%(ext)s" "${videoUrl}"`;

    exec(cmd, (error) => {
        if (error) return res.status(500).json({ error: "Download failed" });
        res.json({ 
            status: "Success", 
            message: "File saved in Termux!", 
            createdBy: AUTHOR 
        });
    });
});

app.listen(port, () => {
    console.log(`\n==========================================`);
    console.log(`  API CREATED BY: ${AUTHOR.toUpperCase()} `);
    console.log(`  Running on: http://localhost:${port}   `);
    console.log(`==========================================\n`);
});
