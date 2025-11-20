# Ever Beauty Website

This is a static website for Ever Beauty that has been set up to run locally and fix 404 errors.

## Quick Start

### Option 1: Using Python Server (Recommended)
```bash
python3 server.py
```

Or use the convenience script:
```bash
./start-server.sh
```

Then open your browser and go to: **http://localhost:8000**

### Option 2: Using Python's Built-in Server
```bash
cd www_ever_clean/www.ever.co.id
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

## What Was Fixed

1. **Created a custom HTTP server** (`server.py`) that:
   - Serves the main HTML file from the correct location
   - Handles 404 errors gracefully by serving the main page
   - Properly serves all static assets (CSS, JS, images, fonts)
   - Handles CDN paths correctly

2. **Copied index.html to root** for easier access

3. **Server automatically handles**:
   - Root path (`/`) → serves main page
   - Missing files → serves main page instead of 404
   - All static assets from `www_ever_clean/` directory

## File Structure

```
.
├── server.py              # Custom HTTP server
├── start-server.sh        # Convenience script to start server
├── index.html             # Copy of main HTML (for easy access)
└── www_ever_clean/        # All website files
    └── www.ever.co.id/
        └── index.html     # Main website file
```

## Troubleshooting

If you see 404 errors:
1. Make sure the server is running
2. Check that you're accessing `http://localhost:8000` (not file://)
3. The server will automatically serve the main page even for missing routes

## Notes

- External CDN resources (like Google Tag Manager, GSAP, etc.) will load from their original sources
- Local assets are served from the `www_ever_clean/` directory
- The server runs on port 8000 by default

