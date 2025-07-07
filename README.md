# Sudoku Solver 🔎

## Overview 📜
This is a full-stack web application designed to solve Sudoku puzzles, with support for various input modes. The application utilizes a backtracking algorithm for solving puzzles and a digit recognition model for processing Sudoku images. The backend is built using Python and Flask, while the frontend leverages React, Tailwind CSS, and Vite for a smooth user experience.

## Input Modes 💻
* ✏️ **Manual Input:** Input Sudoku puzzles by typing the board into the interface.
* 📄 **CSV Upload:** Upload CSV files containing Sudoku puzzles for automatic solving. A modal will pop up when the button is clicked to specify the required format for the CSV file.
* 📷 **Image Upload:** Upload images of Sudoku puzzles, which are processed using a digit recognition model to convert the image into a board. A modal will pop up when the button is clicked to specify the required format for the image file.
* 🔮 **Random:** Generate a random board with a unique solution.

## Features ✨
* ✅ **Solve:** Solve the sudoku puzzle. Answers not in the original board will be highlighted in green. If multiple solutions exist, only one solution will be shown.
* 🕥 **Unsolve:**: Return to the board's state before hitting "solve".
* 💡 **Hint:** Get step-by-step hints by revealing one digit of the solution at a time. Revealed digit will be temporarily highlighted in green.
* 🧹 **Reset:** Reset to an empty board.
* ‼️ **Error-checking**: Automatic error-checking for duplicate or invalid inputs, displayed through a message.

## Installation 🔧
To set up the project locally, follow these steps:

### Prerequisites
Make sure you have Python 3.10.16 and Node.js v22.12.0 installed. You can verify your installations with:

```
python --version
node --version
```
### 1. Clone the Repository
```
git clone https://github.com/ellayipinghou/sudoku-new.git
cd sudoku-new
```

### 2. Backend Setup
#### a. Create a Python virtual environment:
On Windows (with Python launcher):
```
py -3.10 -m venv venv
```

On Mac/Linux:
```
python3.10 -m venv venv
```
#### b. Activate the virtual environment:

On Windows:
```
venv\Scripts\activate
```

On Mac/Linux:

```
source venv/bin/activate
```
#### c. Install the required Python dependencies:
```
pip install -r requirements.txt
```

Ensure your requirements.txt contains all necessary dependencies, including:
```
Flask==3.1.1
flask-cors==5.0.1
keras==3.9.2
numpy==2.1.3
opencv-python==4.11.0.86
pillow==11.2.1
tensorflow==2.19.0
```
### 3. Frontend Setup
Change into the frontend directory and install Node.js dependencies:
```
cd frontend
npm install
```

### 4. Run the Application
Start the frontend (React app with Vite):
```
npm run dev
```

In a separate terminal, start the backend:

```
cd backend
flask run
```

## Credits for Image Recognition Model ©️
The Sudoku Solver uses a digit recognition model built by Kshitij Dhama and trained on the [Kaggle Printed Digits Dataset](https://www.kaggle.com/datasets/kshitijdhama/printed-digits-dataset), Copyright (c) 2021. In this application, the model is stored in the file new_digit_model.keras and is used for digit classification when an image of a Sudoku puzzle is uploaded.

If you plan to distribute this app or use the dataset in any way, please make sure to give proper credit to the original dataset creator.

