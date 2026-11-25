"""
Multi-App Portfolio Server Launcher
Serves all 13 pre-built frontend applications concurrently on dedicated local ports
with full SPA history fallback.
"""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import threading
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

APPS = [
    ("TiendaRD Cross-Border Marketplace", 3000, os.path.join(BASE_DIR, "static", "tiendard-live")),
    ("OmniPOS Cloud Retail & POS", 3001, os.path.join(BASE_DIR, "omnipos", "dist")),
    ("SmileCraft Dental Clinical", 5173, os.path.join(BASE_DIR, "dental-app", "frontend", "dist")),
    ("NEXUS-01 3D Cybernetic Audio", 5174, os.path.join(BASE_DIR, "nexus-tech-3d", "dist")),
    ("ColmadoPro POS & Inventory", 5175, os.path.join(BASE_DIR, "colmado-app", "dist")),
    ("CosmosLens 3D Spatial Viewer", 5176, os.path.join(BASE_DIR, "cosmoslens", "dist")),
    ("Portfolio Monograph SPA", 5177, os.path.join(BASE_DIR, "portfolio-pedro-medina", "dist")),
    ("PulseOps B2B Intelligence", 5178, os.path.join(BASE_DIR, "pulseops", "frontend", "dist")),
    ("FinPulse Expense & FX Audit", 5179, os.path.join(BASE_DIR, "finpulse", "frontend", "dist")),
    ("CVForge Studio Resume Platform", 5180, os.path.join(BASE_DIR, "cvforge-studio", "dist")),
    ("ApexLend Financial Suite", 5181, os.path.join(BASE_DIR, "apexlend", "frontend", "dist")),
    ("taxi. Operations Santo Domingo", 5182, os.path.join(BASE_DIR, "taxi-dashboard", "dist")),
    ("Executive Dashboard BI Studio", 5184, os.path.join(BASE_DIR, "executive-dashboard-studio", "dist")),
]


class SPAHandler(SimpleHTTPRequestHandler):
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
    if not os.path.isdir(directory):
        print(f"[SKIP] {name}: missing directory {directory}", flush=True)
        return
    handler = partial(SPAHandler, directory=directory)
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"[ONLINE] http://127.0.0.1:{port}  ->  {name}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    threads = []
    for app_name, app_port, app_dir in APPS:
        t = threading.Thread(target=start_app_server, args=(app_name, app_port, app_dir), daemon=True)
        t.start()
        threads.append(t)

    print("\nAll 13 standalone portfolio apps are running live!", flush=True)
    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        pass
