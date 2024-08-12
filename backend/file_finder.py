# backend/file_finder.py

import os
import fnmatch
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests


def find_files(search_pattern, search_path="/"):
    result = []
    for root, dirs, files in os.walk(search_path):
        for name in fnmatch.filter(files, search_pattern):
            result.append(os.path.join(root, name))
    return result


@app.route("/search", methods=["GET"])
def search_files():
    file_name = request.args.get("file_name", "")
    if not file_name:
        return jsonify({"error": "No file name provided"}), 400

    search_pattern = "*" + file_name + "*"
    files = find_files(search_pattern)
    return jsonify(files)


if __name__ == "__main__":
    app.run(debug=True)
