#!/bin/bash

# Set the port number
PORT=8090

# Get the directory of the script
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Change to the script's directory
cd "$SCRIPT_DIR"

# Serve the directory
echo "Serving $SCRIPT_DIR on http://localhost:$PORT"

# Use Python 3's HTTP server
python3 -c "
import http.server
import os

class CustomHandler(http.server.SimpleHTTPRequestHandler):
  def do_GET(self):
    super().do_GET()

os.chdir('$SCRIPT_DIR')
http.server.HTTPServer(('0.0.0.0', $PORT), CustomHandler).serve_forever()
"
