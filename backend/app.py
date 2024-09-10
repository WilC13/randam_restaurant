from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, json, random

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
            "radius": radius,
            "language": lang,
            "maxprice": maxprice,
            "opennow": True,
            "type": place_type,
            "key": self.api_key,
        }

        response = requests.get(self.NEARBY_SEARCH_URL, params=params)
        if response.status_code == 200:
            res = response.json()
            print(res.get("next_page_token"))
            if res.get("next_page_token"):
                self.next_page_token = res.get("next_page_token")
            else:
                self.next_page_token = None
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
            if res.get("next_page_token"):
                self.next_page_token = res.get("next_page_token")
            else:
                self.next_page_token = None
            return res["results"]
        else:
            print(f"Error: {response.status_code}")
            return []

    def get_all_results(
        self,
        latitude,
        longitude,
        radius=2000,
        lang="zh-HK",
        maxprice=None,
        place_type="restaurant",
        limit=5,
    ) -> list:
        results = self.find_nearby_places(
            latitude, longitude, radius, lang, maxprice, place_type
        )
        counter = 0
        while self.next_page_token and counter < limit:
            results += self.get_next_page()
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
    res = random.choice(temp.get_all_results(latitude, longitude))

    # for testing
    with open("places.json", "w", encoding="utf-8") as json_file:
        json.dump(
            temp.get_all_results(latitude, longitude),
            json_file,
            ensure_ascii=False,
            indent=4,
        )

    return (
        jsonify({"status": "success", "message": "Location received", "result": res}),
        200,
    )


if __name__ == "__main__":
    app.run(debug=True)
