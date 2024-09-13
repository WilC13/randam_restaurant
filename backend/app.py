from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests, json, random
from io import BytesIO

import time, math, os, re

# from KEY import *

MAP_API_KEY = os.environ.get("MAP_API_KEY")

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "https://randam-restaurant-website.onrender.com",
            ]
        }
    },
)
# CORS(app)

temp_results = dict()


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
        pattern = r"([-+]?\d*\.\d+),([-+]?\d*\.\d+)"
        new_match = re.match(pattern, params.get("location"))
        new_latitude = float(new_match.group(1))
        new_longitude = float(new_match.group(2))

        for k, v in temp_results.items():
            exist_match = re.match(pattern, k)
            exist_latitude = float(exist_match.group(1))
            exist_longitude = float(exist_match.group(2))
            if (
                self.haversine(
                    new_latitude, new_longitude, exist_latitude, exist_longitude
                )
                < 200
            ):
                return v

        print("new search")
        response = requests.get(self.NEARBY_SEARCH_URL, params=params)
        # print(response.url)
        if response.status_code == 200:
            res = response.json()
            # print(res)
            # print(res.get("next_page_token"))
            if res.get("next_page_token"):
                self.next_page_token = res.get("next_page_token")
            else:
                self.next_page_token = None
            # for _ in res["results"]:
            #     print(_["name"])
            temp_results[params.get("location")] = res["results"]
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
            # "type": place_type,
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
            "radius": str(self.RADIUS),
            "language": lang,
            "maxprice": maxprice,
            "opennow": True,
            "keyword": place_type,
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
            # print(res)
            if res.get("status") == "INVALID_REQUEST":
                time.sleep(1)
                return []
            if res.get("next_page_token"):
                self.next_page_token = res.get("next_page_token")
            else:
                self.next_page_token = None
            # print(res["results"][0].get("name"))
            # for _ in res["results"]:
            #     print(_["name"])
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
    res = random.choice(places_result.filter_results(raw_list, latitude, longitude))

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
    # temp = NearbySearch(MAP_API_KEY)
    # raw_list = temp.get_all_results(22.2780997, 114.1823117)
    # print(raw_list)


"""new api"""
# def receive_location():
#     latitude = 22.2780997
#     longitude = 114.1823117

#     if not latitude or not longitude:
#         return jsonify({"error": "Missing latitude or longitude"}), 400

#     headers = {
#         "Content-Type": "application/json",
#         "X-Goog-Api-Key": MAP_API_KEY,
#         "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.photos,places.priceLevel,places.rating",
#     }

#     payload = {
#         "includedTypes": [
#             "restaurant",
#             "american_restaurant",
#             "bakery",
#             "bar",
#             "barbecue_restaurant",
#             "brazilian_restaurant",
#             "breakfast_restaurant",
#             "brunch_restaurant",
#             "cafe",
#             "chinese_restaurant",
#             "coffee_shop",
#             "fast_food_restaurant",
#             "french_restaurant",
#             "greek_restaurant",
#             "hamburger_restaurant",
#             "ice_cream_shop",
#             "indian_restaurant",
#             "indonesian_restaurant",
#             "italian_restaurant",
#             "japanese_restaurant",
#             "korean_restaurant",
#             "lebanese_restaurant",
#             "meal_delivery",
#             "meal_takeaway",
#             "mediterranean_restaurant",
#             "mexican_restaurant",
#             "middle_eastern_restaurant",
#             "pizza_restaurant",
#             "ramen_restaurant",
#             "restaurant",
#             "sandwich_shop",
#             "seafood_restaurant",
#             "spanish_restaurant",
#             "steak_house",
#             "sushi_restaurant",
#             "thai_restaurant",
#             "turkish_restaurant",
#             "vegan_restaurant",
#             "vegetarian_restaurant",
#             "vietnamese_restaurant",
#         ],
#         "locationRestriction": {
#             "circle": {
#                 "center": {"latitude": latitude, "longitude": longitude},
#                 "radius": 2000.0,
#             }
#         },
#         "languageCode": "zh-HK",
#         "rankPreference": "DISTANCE",
#     }

#     response = requests.post(
#         "https://places.googleapis.com/v1/places:searchNearby",
#         headers=headers,
#         json=payload,
#     )

#     if response.status_code == 200:
#         with open("places.json", "w", encoding="utf-8") as json_file:
#             json.dump(
#                 response.json(),
#                 json_file,
#                 ensure_ascii=False,
#                 indent=4,
#             )
#     else:
#         print("err", response.json())


# name = "places/ChIJMzGJ2VAABDQRyXkWsL9iK10/photos/AXCi2Q74TzJf9sb4oTMkwrREoPBQNYrOxqIXoRYIHxwTZuX53IHNRMPYcyxUU9PN2A0p3ChyYPrDhEM0SJhydSaBKwXrgNTWMXeKpuI2lPqE1rK4ncorrUFWO6cOHHw3l-nYcA0bJ-JI8zetHnHgQphaK_tXqvqitgWgT8Qx"
# url = f"https://places.googleapis.com/v1/{name}/media"


# params = {"key": MAP_API_KEY, "maxWidthPx": 4800, "skipHttpRedirect": True}
# res = requests.get(
#     url,
#     params=params,

# )

# print(res.json())
