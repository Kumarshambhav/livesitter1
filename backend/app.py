import os
import json
from datetime import datetime
from bson.objectid import ObjectId
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/rtsp_overlay")

app = Flask(__name__, static_folder=None)
CORS(app)

# Mongo setup
client = MongoClient(MONGO_URI)
db = client.get_default_database()
overlays = db.get_collection("overlays")

def serialize(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@app.route("/api/health")
def health():
    return jsonify({"ok": True, "time": datetime.utcnow().isoformat() + "Z"}), 200

@app.route("/api/overlays", methods=["GET"])
def list_overlays():
    return jsonify([serialize(d) for d in overlays.find().sort("zIndex", 1)])

@app.route("/api/overlays", methods=["POST"])
def create_overlay():
    data = request.get_json(force=True)
    now = datetime.utcnow()
    data.setdefault("position", {"x": 40, "y": 40})
    data.setdefault("size", {"w": 200, "h": 80})
    data.setdefault("style", {"color": "#ffffff", "fontSize": 24, "opacity": 1.0})
    data.setdefault("zIndex", 1)
    data["createdAt"] = now
    data["updatedAt"] = now
    result = overlays.insert_one(data)
    created = overlays.find_one({"_id": result.inserted_id})
    return jsonify(serialize(created)), 201

@app.route("/api/overlays/<id>", methods=["GET"])
def get_overlay(id):
    doc = overlays.find_one({"_id": ObjectId(id)})
    if not doc:
        return jsonify({"error": "Not found"}), 404
    return jsonify(serialize(doc))

@app.route("/api/overlays/<id>", methods=["PUT", "PATCH"])
def update_overlay(id):
    data = request.get_json(force=True)
    data["updatedAt"] = datetime.utcnow()
    result = overlays.update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Not found"}), 404
    doc = overlays.find_one({"_id": ObjectId(id)})
    return jsonify(serialize(doc))

@app.route("/api/overlays/<id>", methods=["DELETE"])
def delete_overlay(id):
    result = overlays.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})

# Serve OpenAPI via swagger UI
from flask_swagger_ui import get_swaggerui_blueprint
SWAGGER_URL = "/docs"
API_URL = "/openapi.json"

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "RTSP Overlay API"
    }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

@app.route("/openapi.json")
def openapi():
    with open(os.path.join(os.path.dirname(__file__), "openapi.yaml"), "r", encoding="utf-8") as f:
        import yaml
        return jsonify(yaml.safe_load(f))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)