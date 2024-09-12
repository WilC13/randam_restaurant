from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests, json, random
from io import BytesIO

import time

from KEY import *

app = Flask(__name__)
CORS(app)


class NearbySearch:
    """https://developers.google.com/maps/documentation/places/web-service/search-nearby?hl=zh-tw#pagetoken"""

    def __init__(self, api_key):
        self.api_key = api_key
        self.next_page_token = None
        self.NEARBY_SEARCH_URL = (
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        )

    def find_nearby_places(
        self,
        latitude,
        longitude,
        radius=2000,
        lang="zh-HK",
        maxprice=None,
        place_type="restaurant",
    ) -> list:
        params = {
            "location": f"{latitude},{longitude}",
            # "radius": radius,
            "language": lang,
            "maxprice": maxprice,
            "keyword": place_type,
            "opennow": True,
            "type": place_type,
            "key": self.api_key,
            'rankby': 'distance'
        }

        response = requests.get(self.NEARBY_SEARCH_URL, params=params)
        if response.status_code == 200:
            res = response.json()
            print(res.get("next_page_token"))
            if res.get("next_page_token"):
                self.next_page_token = res.get("next_page_token")
            else:
                self.next_page_token = None
            for _ in res["results"]:
                print(_["name"])
            return res["results"]
        else:
            print(f"Error: {response.status_code}")
            return []

    def get_next_page(self) -> list:
        if not self.next_page_token:
            return []

        params = {
            "pagetoken": self.next_page_token,
            "key": self.api_key,
        }

        response = requests.get(self.NEARBY_SEARCH_URL, params=params)
        if response.status_code == 200:
            res = response.json()
            print(res)
            if res.get('status') == "INVALID_REQUEST":
                time.sleep(1)
                return []
            if res.get("next_page_token"):
                self.next_page_token = res.get("next_page_token")
            else:
                self.next_page_token = None
            print(res["results"][0].get("name"))
            for _ in res["results"]:
                print(_["name"])
            return res["results"]
        else:
            print(f"Error: {response.status_code}")
            return []

    def get_all_results(
        self,
        latitude,
        longitude,
        radius=1500,
        lang="zh-HK",
        maxprice=None,
        place_type="food",
        limit=20,
    ) -> list:
        results = self.find_nearby_places(
            latitude, longitude, radius, lang, maxprice, place_type
        )
        counter = 0
        while self.next_page_token and counter < limit:
            res = self.get_next_page()
            results.extend(res)
            counter += 1
        return results


@app.route("/api/location", methods=["POST"])
def receive_location():
    data = request.json
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    # Process the location data as needed
    print(f"Received location: Latitude={latitude}, Longitude={longitude}")

    temp = NearbySearch(MAP_API_KEY)
    l = temp.get_all_results(latitude, longitude, maxprice=3)
    print(len(l))
    res = random.choice(l)

    # for testing
    with open("places.json", "w", encoding="utf-8") as json_file:
        json.dump(
            l,
            json_file,
            ensure_ascii=False,
            indent=4,
        )

    return (
        jsonify({"status": "success", "message": "Location received", "result": res}),
        200,
    )

@app.route("/api/photo", methods=["GET"])
def get_photo():
    photo_reference = request.args.get('photo_reference')
    if not photo_reference:
        return jsonify({"error": "Missing photo_reference parameter"}), 400

    photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={MAP_API_KEY}"
    response = requests.get(photo_url)

    if response.status_code == 200:
        return send_file(BytesIO(response.content), mimetype='image/jpeg')
    else:
        return jsonify({"error": "Failed to fetch photo"}), response.status_code


if __name__ == "__main__":
    app.run(debug=True)
