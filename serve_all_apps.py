"""
Multi-App Flagship Portfolio Server Launcher
Serves all 13 bespoke redesigned flagship applications concurrently on dedicated local ports,
with automatic shared `/vendor/` routing (for Three.js WebGL) and SPA history fallback.
"""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import threading
import time
import urllib.parse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VENDOR_DIR = os.path.join(BASE_DIR, "static", "vendor")

APPS = [
    ("TiendaRD Cross-Border Marketplace (Wise Edition)", 3000, os.path.join(BASE_DIR, "live_apps", "tiendard")),
    ("OmniPOS Cloud Terminal (Pro Dark Edition)", 3001, os.path.join(BASE_DIR, "live_apps", "omnipos")),
    ("SmileCraft Dental Concierge", 5173, os.path.join(BASE_DIR, "live_apps", "smilecraft")),
    ("NEXUS-01 3D Cybernetic Audio", 5174, os.path.join(BASE_DIR, "live_apps", "nexus-3d")),
    ("ColmadoPro Commercial OS (Weav Edition)", 5175, os.path.join(BASE_DIR, "live_apps", "colmadopro")),
    ("CosmosLens 3D Orbital Observatory", 5176, os.path.join(BASE_DIR, "live_apps", "cosmoslens")),
    ("Pedro Medina — Engineering Monograph", 5177, os.path.join(BASE_DIR, "live_apps", "portfolio-monograph")),
    ("PulseOps B2B Observability (Dovetail Edition)", 5178, os.path.join(BASE_DIR, "live_apps", "pulseops")),
    ("FinPulse Multi-Currency Treasury (Revolut Edition)", 5179, os.path.join(BASE_DIR, "live_apps", "finpulse")),
    ("CVForge Executive Studio (Vanta Edition)", 5180, os.path.join(BASE_DIR, "live_apps", "cvforge-studio")),
    ("ApexLend Credit Infrastructure (Lightspark Edition)", 5181, os.path.join(BASE_DIR, "live_apps", "apexlend")),
    ("taxi. Operations Santo Domingo (Set Space Edition)", 5182, os.path.join(BASE_DIR, "live_apps", "taxi-sdq")),
    ("Executive BI & DAX Studio (Mixpanel Edition)", 5184, os.path.join(BASE_DIR, "live_apps", "executive-studio")),
]


class FlagshipSPAHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        clean_path = urllib.parse.urlsplit(path).path
        if clean_path.startswith("/vendor/"):
            rel = clean_path[len("/vendor/"):].lstrip("/")
            return os.path.join(VENDOR_DIR, rel)
        return super().translate_path(path)

    def end_headers(self):
        # Allow clean iframe embedding inside the http://127.0.0.1:5000 Master Portfolio Preview Studio
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            index_path = os.path.join(self.directory, "index.html")
            if os.path.isfile(index_path):
                self.path = "/index.html"
                return self.do_GET()
        return super().send_error(code, message, explain)

    def log_message(self, format, *args):
        pass


def start_app_server(name: str, port: int, directory: str):
    os.makedirs(directory, exist_ok=True)
    handler = partial(FlagshipSPAHandler, directory=directory)
    ThreadingHTTPServer.allow_reuse_address = True
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"[ONLINE] http://127.0.0.1:{port}  ->  {name}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    for app_name, app_port, app_dir in APPS:
        t = threading.Thread(target=start_app_server, args=(app_name, app_port, app_dir), daemon=True)
        t.start()

    print("\nAll 13 flagship applications are live!", flush=True)
    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        pass
