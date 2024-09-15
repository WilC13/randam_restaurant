import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    MAP_API_KEY: str = os.environ.get("MAP_API_KEY")
    FIREBASE_CREDENTIALS: dict = os.environ.get("FIREBASE_CREDENTIALS")


config = Config()
