from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/location", methods=["POST"])
def receive_location():
    data = request.json
    latitude = data.get("lat")
    longitude = data.get("lng")
    # Process the location data as needed
    print(f"Received location: Latitude={latitude}, Longitude={longitude}")
    return jsonify({"status": "success", "message": "Location received"}), 200


if __name__ == "__main__":
    app.run(debug=True)
