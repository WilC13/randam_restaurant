import os
import json
from dotenv import load_dotenv
from google.cloud import secretmanager

load_dotenv()


def get_secret(secret_name):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{os.getenv('GOOGLE_CLOUD_PROJECT')}/secrets/{secret_name}/versions/latest"
    response = client.access_secret_version(name=name)
    return response.payload.data.decode("UTF-8")


class Config:
    MAP_API_KEY: str = os.environ.get("MAP_API_KEY")
    FIREBASE_CREDENTIALS: dict = get_secret("FIREBASE_CREDENTIALS")
    SEARCH_API_KEY: str = os.environ.get("SEARCH_API_KEY")
    SEARCH_ENGINE_ID: str = os.environ.get("SEARCH_ENGINE_ID")
