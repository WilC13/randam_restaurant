import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    MAP_API_KEY: str = os.environ.get("MAP_API_KEY")
    FIREBASE_CREDENTIALS: dict = os.environ.get("FIREBASE_CREDENTIALS")
    SEARCH_API_KEY: str = os.environ.get("SEARCH_API_KEY")
    SEARCH_ENGINE_ID: str = os.environ.get("SEARCH_ENGINE_ID")
