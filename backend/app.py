import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


import time, math, os, re, requests, json, random, threading
from io import BytesIO

from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS

from config import Config
from services.nearby_search_service import NearbySearch, results_cache
from services.firebase_service import fetch_photo, save_photo
from services.openrice_search import find_openrice_url


load_dotenv()

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


def clear_cache():
    global results_cache
    results_cache.clear()
    print("Cache cleared")
    threading.Timer(3600, clear_cache).start()


@app.route("/api/location", methods=["POST"])
def receive_location():
    data = request.json
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    # Process the location data as needed
    print(f"Received location: Latitude={latitude}, Longitude={longitude}")

    places_result = NearbySearch()
    raw_list = places_result.get_all_results(latitude, longitude, maxprice=3)
    res = random.choice(places_result.filter_results(raw_list, latitude, longitude))

    return (
        jsonify({"status": "success", "message": "Location received", "result": res}),
        200,
    )


@app.route("/api/photo", methods=["GET"])
def get_photo():
    photo_reference = request.args.get("photo_reference")
    place_id = request.args.get("place_id")
    if not photo_reference:
        return jsonify({"error": "Missing photo_reference parameter"}), 400

    # cached_photo = photo_cache.get(photo_reference)
    cached_photo = fetch_photo(place_id)
    if cached_photo:
        print("Returning cached photo from Firebase")
        return send_file(BytesIO(cached_photo), mimetype="image/jpeg")

    # If not in cache, make a new request
    print("photo from api")
    photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={Config.MAP_API_KEY}"
    response = requests.get(photo_url)

    if response.status_code == 200:
        # Store result in firebase photo_cache
        if not save_photo(place_id, response.content):
            print(f"Failed to save photo {place_id} to Firebase")
        return send_file(BytesIO(response.content), mimetype="image/jpeg")
    else:
        return jsonify({"error": "Failed to fetch photo"}), response.status_code


@app.route("/ads.txt")
def ads():
    return send_file("ads.txt")


@app.route("/api/showphoto/", methods=["GET"])
def showphoto():
    import base64

    place_id = request.args.get("place_id")

    print("show photo", place_id)

    photo_data = get_photo(place_id)
    if photo_data:
        photo_bytes = photo_data
        return send_file(
            BytesIO(photo_bytes),
            mimetype="image/jpeg",
            as_attachment=False,
        )
    else:
        return "Photo not found", 404


@app.route("/api/orsearch", methods=["POST"])
def search():
    data = request.json
    place_id = data.get("place_id")
    query = data.get("query")
    if not place_id:
        return jsonify({"error": "Missing place_id parameter"}), 400
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400

    openrice_url = find_openrice_url(place_id, query)
    if openrice_url:
        return jsonify({"status": "success", "openrice_url": openrice_url})
    else:
        return jsonify({"status": "error", "message": "No OpenRice URL found"}), 404


@app.route("/")
def index():
    return render_template_string(
        """
        <h1>Photo Viewer</h1>
        <form action="/api/showphoto" method="get">
            <label for="place_id">Place ID:</label>
            <input type="text" id="place_id" name="place_id">
            <input type="submit" value="View Photo">
        </form>
    """
    )


if __name__ == "__main__":
    clear_cache()
    app.run(debug=True)
    # temp = NearbySearch(Config.MAP_API_KEY)
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
#         "X-Goog-Api-Key": Config.MAP_API_KEY,
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


# params = {"key": Config.MAP_API_KEY, "maxWidthPx": 4800, "skipHttpRedirect": True}
# res = requests.get(
#     url,
#     params=params,

# )

# print(res.json())
