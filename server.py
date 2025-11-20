#!/usr/bin/env python3
"""
Simple HTTP server to serve the static website
Fixes 404 errors by serving files from the correct directories
"""

import http.server
import socketserver
import os
import urllib.parse
from pathlib import Path

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash
        if path.startswith('/'):
            path = path[1:]
        
        # If root or index, serve the main HTML file
        if path == '' or path == '/' or path == 'index.html':
            # Try to serve from www_ever_clean/www.ever.co.id/index.html
            main_html = os.path.join('www_ever_clean', 'www.ever.co.id', 'index.html')
            if os.path.exists(main_html):
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                with open(main_html, 'rb') as f:
                    self.wfile.write(f.read())
                return
        
        # Check if file exists in www_ever_clean directory structure
        # Handle CDN paths
        if path.startswith('cdn.'):
            # Try to find in www_ever_clean
            full_path = os.path.join('www_ever_clean', path)
            if os.path.exists(full_path):
                return self.serve_file(full_path)
        
        # Handle other common paths
        possible_paths = [
            os.path.join('www_ever_clean', path),
            path,
            os.path.join('www_ever_clean', 'www.ever.co.id', path),
        ]
        
        for possible_path in possible_paths:
            if os.path.exists(possible_path) and os.path.isfile(possible_path):
                return self.serve_file(possible_path)
        
        # If not found, try to serve from www_ever_clean directory
        www_path = os.path.join('www_ever_clean', path)
        if os.path.exists(www_path):
            return self.serve_file(www_path)
        
        # 404 - but try to serve main page anyway
        main_html = os.path.join('www_ever_clean', 'www.ever.co.id', 'index.html')
        if os.path.exists(main_html):
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open(main_html, 'rb') as f:
                self.wfile.write(f.read())
            return
        
        # Real 404
        self.send_error(404, "File not found")
    
    def serve_file(self, filepath):
        """Serve a file with appropriate content type"""
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
            
            # Determine content type
            content_type = 'text/html'
            if filepath.endswith('.css'):
                content_type = 'text/css'
            elif filepath.endswith('.js'):
                content_type = 'application/javascript'
            elif filepath.endswith('.json'):
                content_type = 'application/json'
            elif filepath.endswith('.png'):
                content_type = 'image/png'
            elif filepath.endswith('.jpg') or filepath.endswith('.jpeg'):
                content_type = 'image/jpeg'
            elif filepath.endswith('.svg'):
                content_type = 'image/svg+xml'
            elif filepath.endswith('.avif'):
                content_type = 'image/avif'
            elif filepath.endswith('.woff') or filepath.endswith('.woff2'):
                content_type = 'font/woff2'
            elif filepath.endswith('.ttf'):
                content_type = 'font/ttf'
            elif filepath.endswith('.otf'):
                content_type = 'font/otf'
            
            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Error serving file: {str(e)}")
    
    def log_message(self, format, *args):
        """Override to show cleaner logs"""
        print(f"{self.address_string()} - {format % args}")

if __name__ == "__main__":
    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = CustomHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print(f"Serving from: {os.getcwd()}")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

