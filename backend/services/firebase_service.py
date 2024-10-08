import os, json, base64

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

from config import Config

load_dotenv()

firebase_credentials_dict = json.loads(Config.FIREBASE_CREDENTIALS)

cred = credentials.Certificate(firebase_credentials_dict)
firebase_admin.initialize_app(cred)

db = firestore.client()


def fetch_photo(place_id: str):
    doc = db.collection("photos").document(place_id).get()
    if doc.exists:
        photo_data = doc.to_dict()["photo_data"]
        return base64.b64decode(photo_data)


def save_photo(place_id: str, photo_data: str) -> bool:
    if place_id is None or photo_data is None:
        return False

    db.collection("photos").document(place_id).set(
        {
            "place_id": place_id,
            "photo_data": base64.b64encode(photo_data).decode(
                "utf-8"
            ),  # Encode photo_data as base64 string
        }
    )
    return True

def fetch_url(place_id: str) -> str:
    doc = db.collection("urls").document(place_id).get()
    if doc.exists:
        print(f"Found URL {doc.to_dict()['url']} for place_id {place_id}")
        return doc.to_dict()["url"]

def save_url(place_id: str, url: str) -> bool:
    if place_id is None or url is None:
        print(f"Failed to save URL {url} for place_id {place_id}")
        return False

    db.collection("urls").document(place_id).set(
        {
            "place_id": place_id,
            "url": url,
        }
    )
    print(f"Saved URL {url} for place_id {place_id}")
    return True