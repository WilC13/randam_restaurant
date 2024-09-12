from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests, json, random
from io import BytesIO

import time, math, os

# from KEY import *

MAP_API_KEY = os.environ.get("MAP_API_KEY")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
# CORS(app)


class NearbySearch:
    """https://developers.google.com/maps/documentation/places/web-service/search-nearby?hl=zh-tw#pagetoken"""

    def __init__(self, api_key, radius=2000):
        self.api_key = api_key
        self.next_page_token = None
        self.RADIUS = radius
        self.NEARBY_SEARCH_URL = (
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        )

    def _search_place(self, params: dict) -> list:
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

    def find_by_distance(
        self,
        latitude: float,
        longitude: float,
        lang="zh-HK",
        maxprice: int = None,
        place_type="restaurant",
    ) -> list:
        params = {
            "location": f"{latitude},{longitude}",
            "language": lang,
            "maxprice": maxprice,
            "keyword": place_type,
            "opennow": True,
            "type": place_type,
            "key": self.api_key,
            "rankby": "distance",
        }

        return self._search_place(params)

    def find_by_radius(
        self,
        latitude: float,
        longitude: float,
        lang="zh-HK",
        maxprice: int = None,
        place_type="restaurant",
    ) -> list:
        params = {
            "location": f"{latitude},{longitude}",
            "radius": self.RADIUS,
            "language": lang,
            "maxprice": maxprice,
            "keyword": place_type,
            "opennow": True,
            "type": place_type,
            "key": self.api_key,
        }

        return self._search_place(params)

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
            if res.get("status") == "INVALID_REQUEST":
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
        lang="zh-HK",
        maxprice=None,
        place_type="food",
        limit=20,
    ) -> list:
        def _next_page():
            nonlocal counter
            while self.next_page_token and counter < limit:
                res = self.get_next_page()
                results.extend(res)
                counter += 1

        counter = 0
        results = self.find_by_distance(latitude, longitude, lang, maxprice, place_type)

        _next_page()

        if len(results) < 60:  # 20 * 3
            results.extend(
                self.find_by_radius(latitude, longitude, lang, maxprice, place_type)
            )

        _next_page()

        return results

    def filter_results(
        self, results: list[dict], latitude: float, longitude: float
    ) -> list:
        filtered_results = []
        for result in results:
            lat = result["geometry"]["location"]["lat"]
            lng = result["geometry"]["location"]["lng"]
            distance = self.haversine(latitude, longitude, lat, lng)
            if distance <= self.RADIUS:
                filtered_results.append(result)
        return filtered_results

    @staticmethod
    def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """return distance in meters"""
        # 地球半徑，單位為公里
        R = 6371.0
        R_m = R * 1000

        # 將經緯度轉換為弧度
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)

        # 計算差值
        delta_lat = lat2_rad - lat1_rad
        delta_lon = lon2_rad - lon1_rad

        # 應用哈弗辛公式
        a = (
            math.sin(delta_lat / 2) ** 2
            + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
        )
        c = 2 * math.asin(math.sqrt(a))

        # 最終距離
        distance = R_m * c
        return distance


@app.route("/api/location", methods=["POST"])
def receive_location():
    data = request.json
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    # Process the location data as needed
    print(f"Received location: Latitude={latitude}, Longitude={longitude}")

    places_result = NearbySearch(MAP_API_KEY)
    raw_list = places_result.get_all_results(latitude, longitude, maxprice=3)
    l = places_result.filter_results(raw_list, latitude, longitude)
    print(len(l))
    res = random.choice(l)

    # for testing
    # with open("places.json", "w", encoding="utf-8") as json_file:
    #     json.dump(
    #         l,
    #         json_file,
    #         ensure_ascii=False,
    #         indent=4,
    #     )

    return (
        jsonify({"status": "success", "message": "Location received", "result": res}),
        200,
    )


@app.route("/api/photo", methods=["GET"])
def get_photo():
    photo_reference = request.args.get("photo_reference")
    if not photo_reference:
        return jsonify({"error": "Missing photo_reference parameter"}), 400

    photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={MAP_API_KEY}"
    response = requests.get(photo_url)

    if response.status_code == 200:
        return send_file(BytesIO(response.content), mimetype="image/jpeg")
    else:
        return jsonify({"error": "Failed to fetch photo"}), response.status_code


if __name__ == "__main__":
    app.run(debug=True)
