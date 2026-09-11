#!/usr/bin/env python3
"""
CashFlow Saathi - Zero-Dependency Local Dev & Presentation Server
Team 46 | Kalpvruksh 2.0 Mini Hackathon
Problem 1.5: Fragmented Cashflow Visibility for Small Vendors
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import json

PORT = 5173
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CashFlowHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Optional mock API status endpoint for demonstration of Python backend integration
        if self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "status": "online",
                "team": "Team 46 (CF46)",
                "event": "Kalpvruksh 2.0 Mini Hackathon",
                "app": "CashFlow Saathi",
                "version": "1.0.0",
                "currency": "INR (₹)",
                "settlementEngine": "active"
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
            return
        
        return super().do_GET()

def run_server():
    os.chdir(DIRECTORY)
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    server_address = ("", PORT)
    try:
        with socketserver.TCPServer(server_address, CashFlowHTTPRequestHandler) as httpd:
            url = f"http://localhost:{PORT}"
            print("=" * 65)
            print("  🚀 CASHFLOW SAATHI — PROTOTYPE SERVER")
            print("  Team 46 | Kalpvruksh 2.0 Mini Hackathon")
            print("  Problem 1.5: Fragmented Cashflow Visibility For Vendors")
            print("=" * 65)
            print(f"  App running at: {url}")
            print(f"  Root folder:    {DIRECTORY}")
            print("  Press Ctrl+C to stop the server.")
            print("=" * 65)
            
            # Automatically launch browser if not in headless environment
            try:
                webbrowser.open(url)
            except Exception as e:
                print(f"  Could not auto-launch browser: {e}")
                print(f"  Please open {url} manually in Chrome/Edge.")
            
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98 or e.errno == 10048: # Address already in use
            fallback_port = 5174
            print(f"Port {PORT} in use, switching to port {fallback_port}...")
            with socketserver.TCPServer(("", fallback_port), CashFlowHTTPRequestHandler) as httpd:
                url = f"http://localhost:{fallback_port}"
                print(f"App running at: {url}")
                try:
                    webbrowser.open(url)
                except Exception:
                    pass
                httpd.serve_forever()
        else:
            raise e
    except KeyboardInterrupt:
        print("\nStopping CashFlow Saathi server. Good luck with your hackathon!")
        sys.exit(0)

if __name__ == '__main__':
    run_server()
