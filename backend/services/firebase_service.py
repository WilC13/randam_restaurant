import os, json, base64

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

from config import config

load_dotenv()

firebase_credentials_dict = json.loads(config.FIREBASE_CREDENTIALS)

cred = credentials.Certificate(firebase_credentials_dict)
firebase_admin.initialize_app(cred)

db = firestore.client()


def get_photo_from_firebase(place_id:str):
    doc = db.collection("photos").document(place_id).get()
    if doc.exists:
        photo_data = doc.to_dict()["photo_data"]
        return base64.b64decode(photo_data)


def save_photo_to_firebase(place_id:str, photo_data:str) -> bool:
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
