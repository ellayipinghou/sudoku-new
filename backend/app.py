# for flask server

from flask import Flask, request, jsonify
from flask_cors import CORS
from solver import solve
from read_image import parser
import os
from solver import generate_board

app = Flask(__name__)

# make temporary relative uploads folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True) # create the folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)

# solve route, used by solve and hint buttons on frontend
@app.route('/solve', methods=['POST'])
def solve_sudoku():
        try:
                data = request.get_json()
                grid = data.get('grid')

                # add empty cells to to_assign, used in solve() function
                to_assign = {(r, c): [] for r in range(9) for c in range(9) if grid[r][c] == -1}

                # get solution
                solution, is_unique = solve(grid, to_assign)

                # if no solution found, return null response
                if solution is None:
                        return jsonify({
                                "message": "No solution found",
                                "solution": None,
                                "is_unique": False
                        }), 200

                # return the solution and uniqueness
                return jsonify({
                        "message": "Solution found",
                        "solution": solution,
                        "is_unique": is_unique
                        }), 200
        
        # return server error
        except Exception as e:
                print("Error in /solve route:", str(e))
                return jsonify({
                        "message": "Internal server error",
                        "error": str(e)
                }), 500
        
# generate route, generates puzzle board
@app.route('/generate', methods=['GET'])
def generate():
        try:
                board = generate_board()
                return jsonify({
                        "message": "Board generated",
                        "board": board,
                })
        
        except Exception as e:
                print("Error in /generate route:", str(e))
                return jsonify({
                        "message": "Internal server error", 
                        "error": str(e)
                }), 500

# image route, used by upload image button on frontend
@app.route('/image', methods=['POST'])
def parse_image():
        try: 
                # case: no image provided
                if 'image' not in request.files:
                        return jsonify({'message': 'No file part received'}), 400
                
                # get file and filename
                file = request.files['image']
                if file.filename == '':
                        return jsonify({'message': 'No selected file'}), 400
                
                # create relative file path to upload folder
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename) # uploads/filename
                file.save(file_path)

                # parse the image
                grid = parser(file_path)

                # detect if client has disconnected, return with AbortError
                socket_obj = request.environ.get('werkzeug.socket')
                if socket_obj and getattr(socket_obj, 'closed', False):
                        return '', 499
                
                # return the grid parsed from the image
                return jsonify({
                        "message": "received image: " + file.filename, 
                        "grid": grid
                })
        
        # return server error
        except Exception as e:
                print("Error in /image route:", str(e))
                return jsonify({
                        "message": "Internal server error", 
                        "error": str(e)
                }), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)