import sys
import os

# Add parent directory to sys.path so backend module can be imported
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.main import app

# Vercel Serverless Function entrypoint
