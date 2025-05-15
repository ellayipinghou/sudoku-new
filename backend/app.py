# for flask server

from flask import Flask, request, jsonify
from flask_cors import CORS
from solver import solve
from read_image import parser
import os
import numpy as np

app = Flask(__name__)
# make temporary, relative uploads folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True) # create the folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# enables CORS for development
CORS(app, supports_credentials=True)
#CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/solve', methods=['POST'])
def solve_sudoku():
        data = request.get_json()
        grid = data.get('grid')

        to_assign = {}
        for row_index, row in enumerate(grid):
                for col_index, elem in enumerate(row):
                        if grid[row_index][col_index] == -1:
                               to_assign[row_index, col_index] = []

        solution = solve(grid, to_assign)



        # sends a JSON response back to the frontend, confirming the data was received
        return jsonify({"message": "Solution", "solution": solution})

@app.route('/image', methods=['POST'])
def parse_image():
        if 'image' not in request.files:
                return jsonify({'message': 'No file part'}), 400
        
        file = request.files['image']

        if file.filename == '':
                return jsonify({'message': 'No selected file'}), 400
        
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        grid = parser(file_path)
        grid = [[int(elem) for elem in row] for row in grid]

        # TODO: get digits using function!
        return jsonify({"message": "received image: " + file.filename, "grid": grid})


if __name__ == '__main__':
    app.run(port=5000, debug=True)