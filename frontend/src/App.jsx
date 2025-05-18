import React from 'react'
import { useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import CSVModal from "../components/CSVModal"
import ImageModal from "../components/ImageModal"
import ImageConfirmationModal from '../components/ImageConfirmationModal';
import Header from "../components/Header";
import SolveButton from '../components/SolveButton';
import UnsolveButton from '../components/UnsolveButton';
import ResetButton from '../components/ResetButton';
import CSVButton from '../components/CSVButton';
import ImageButton from '../components/ImageButton';

// possible errors - see component files for more errors
const duplicateError = "No duplicates allowed within rows, columns, or inner grids";
const valueError = "Please enter a digit between 1 and 9";
const noSolutionError = "No solution, check that all inputs are as intended";

function App() {
    // create initial empty grid
    const createEmptyGrid = () => {
        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid[i] = [];
            for (let j = 0; j < 9; j++) {
                // initialize empty cells with -1
                grid[i][j] = -1;
            }
        }
        return grid;
    };

    // return a set containing all the cells, regardless of whether it's empty or full
    const createEntireUnfilledPositions = () => {
        // start with new empty set
        const positions = new Set();
        // iterate over all cells in arry
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                // create a unique key for each position and add to set
                const key = `${i}-${j}`;
                positions.add(key);
                
            }
        }
        return positions;
    }

    // calculate the ideal grid dimensions based on the screen size
    const getGridDimensions = () => {
        // get screen height and width
        const height = window.innerHeight;
        const width = window.innerWidth;

        // set grid to be 65% of the greater dimension
        if (height < width) {
            return "w-[65vh]"
        }
        return "w-[65vw]"
    }

    // store the current elements in the grid
    const [grid, setGrid] = useState(createEmptyGrid());

    // store the elements in the grid before solving, used to restore grid if user chooses to unsolve
    const [prevGrid, setPrevGrid] = useState(createEmptyGrid());

    // store the grid size, which changes responsively
    const [gridSize, setGridSize] = useState(getGridDimensions());

    // store the puzzle solving status, used for disabling certain buttons
    const [isSolved, setIsSolved] = useState(false);

    // store unfilled input positions before solving, used for calculating which cells should have a green highlight
    const [unfilledPositions, setUnfilledPositions] = useState(createEntireUnfilledPositions());

    // store the most recent element that hint revealed, used for temporary green highligh
    const [hintElem, setHintElem] = useState(null);

    // store the current error
    const [error, setError] = useState(""); 

    // to show/unshow modals
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    // dynamically resize the grid with changes in screen size
    useEffect(() => {
        // function to calculate and set the new grid size
        const handleResize = () => {
            setGridSize(getGridDimensions());
        };

        // whenever the window is resized, run handleResize
        window.addEventListener("resize", handleResize);

        // call once on mount
        handleResize();

        // clean up on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // function to update a single value in the grid
    const updateGrid = (e, rowIndex, colIndex) => {
        // clear isSolved and error status
        setIsSolved(false);
        setError("");

        // get new value from event
        const newVal = e.target.value;
        
        // if value is backspace or empty, set back to -1
        if (newVal === "") {
            // create updated object and re-render the grid with it
            const newGrid = [...grid.map(row => [...row])];
            newGrid[rowIndex][colIndex] = -1;
            setGrid(newGrid);
            return;
        }

        // if value is not a number, show value error
        if (isNaN(newVal)) {
            setError(valueError)
            return;
        }

        // convert the value to an integer
        const numVal = parseInt(newVal);

        // if value is not from 1 to 9 (inclusive), show value error
        if (numVal < 1 || numVal > 9) {
            setError(valueError)
            return;
        }
        
        // check for duplicates and set duplicate error if necessary
        if (hasDuplicates(grid, numVal, rowIndex, colIndex)) {
            setError(duplicateError);
            return;
        }

        // value is valid, so make new grid with updated value to re-render with and update unfilledPositions
        const newGrid = [...grid.map(row => [...row])];
        newGrid[rowIndex][colIndex] = numVal;
        setGrid(newGrid);
        updateUnfilledPositions(newGrid);

    }

    // update unfilledPositions, use a passed-in grid for synchronization purposes
    const updateUnfilledPositions = (newGrid) => {
        const newUnfilled = new Set();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                // if the cell is empty, add it to the set
                if (newGrid[i][j] === -1) {
                    newUnfilled.add(`${i}-${j}`);
                }
            }
        }
        setUnfilledPositions(newUnfilled);
    }

    // calcualte which borders a cell should have and how thick, used to avoid stacking issues
    const getCellBorderClasses = (rowInBox, colInBox, boxRow, boxCol) => {
        let classes = "";
        
        // add right border to all cells except those in the rightmost column of each box (will already have outer border)
        if (colInBox < 2) {
            classes += " border-r-2";
        }
        
        // add bottom border to all cells except those in the bottom row of each box (will already have outer border)
        if (rowInBox < 2) {
            classes += " border-b-2";
        }
        
        // add thicker right border for the right edge of each larger box (except the rightmost box)
        if (colInBox === 2 && boxCol < 2) {
            classes += " border-r-4";
        }
        
        // Add thicker bottom border for the bottom edge of each larger box (except the bottom box)
        if (rowInBox === 2 && boxRow < 2) {
            classes += " border-b-4";
        }
        
        return classes + " border-black";
    }

    // function to solve the puzzle
    const handleSolve = async () => {
        // don't allowing solving if there are any errors
        if (error != "") {
            return;
        }

        // get solution
        const result = await getResult();
        if (result == null) {
            // server error case
            return
        } 
        // if there's a solution, update the grid and state of the system
        if (result?.solution) {
            setGrid(result.solution);
            setIsSolved(true);
            setError("");
        } else {
            setError(noSolutionError);
        }
    };

    // unsolve by restoring grid to previous grid and updating the state of the system
    const handleUnsolve = () => {
        setGrid([...prevGrid.map(row => [...row])]);
        updateUnfilledPositions(prevGrid);
        setError("");
        setIsSolved(false);
    }
    
    // reset by emptying grid and updating state of system
    const handleReset = () => {
        setGrid(createEmptyGrid());
        setUnfilledPositions(createEntireUnfilledPositions());
        setError("");
        setIsSolved(false);
    }

    // send puzzle board to server and get solution
    const getResult = async () => {
        try {
            // save current state before solving
            setPrevGrid([...grid.map(row => [...row])]);
            // update the unfilled positions for future highlight purposes
            updateUnfilledPositions(grid);

            // send board to server and return result
            const response = await fetch('http://localhost:5000/solve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ grid }),
            });
            const result = await response.json();
            return result;
        } catch (err) {
            // return null if there's a server error
            setError(serverError);
            return null;
        }
    }

    // function to reveal a single element at a time
    const handleHint = async () => {
        // get the result
        const result = await getResult();

        // if there was a server error, return
        if (result == null) {
            return
        } 

        // case: a solution exists
        if (result?.solution) {
            // copy the current grid into newGrid
            const newGrid = [...grid.map((row) => [...row])];
            // make unfilledPositions into an array and select a random element from it
            const position_array = Array.from(unfilledPositions);
            const randomIndex = Math.floor(Math.random() * position_array.length);
            const randomElem = position_array[randomIndex];

            // convert the row-col key to numerical indices
            const grid_indices = randomElem.split("-");
            const rowIndex = parseInt(grid_indices[0]);
            const colIndex = parseInt(grid_indices[1]);

            // update grid and state of system
            newGrid[rowIndex][colIndex] = result.solution[rowIndex][colIndex];
            setGrid(newGrid);
            updateUnfilledPositions(newGrid);

            // highlight that cell for 2 seconds
            setHintElem([rowIndex, colIndex]);
            setTimeout(() => {
                setHintElem(null);
            }, 2000);

        } else {
            // case: no solution
            setSolveError(true);
            setError("");
        }
    }

    // helper function to determine if a cell should be highlighted
    const shouldHighlightCell = (rowIndex, colIndex) => {
        if (isSolved) {
            // if solved, then highlight cells that were empty before solving
            const key = `${rowIndex}-${colIndex}`;
            return unfilledPositions.has(key);
        } 
        // if it's the hint elem, highlight even if puzzle is not solved
        if (hintElem?.[0] === rowIndex && hintElem?.[1] === colIndex) {
            return true;
        }
        return false;
    };

    // check if there are any duplicates in the row
    const checkRow = (currGrid, val, row) => {
        return (val != -1) && (currGrid[row].includes(parseInt(val)));
    }

    // check if there are any duplicates in the column
    const checkCol = (currGrid, val, col) => {
        // ignore empty cells
        if (val == -1) {
            return false;
        }
        for (let row = 0; row < 9; row++) {
            if (currGrid[row][col] === parseInt(val)) {
                return true;
            }
        }
        return false;
    }

    // check if there are any duplicates in the block
    const checkBlock = (currGrid, val, row, col) => {
        // ignore empty cells
        if (val == -1) {
            return false;
        }

        // calculate where to start iterating from based on the current block
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (currGrid[r][c] === parseInt(val)) {
                    return true;
                }
            }
        }
        return false;
    }

    // function to check if there are any duplicates in the same row, col, or grid or the given element position and value
    const hasDuplicates = (currGrid, val, rowIndex, colIndex) => {
        const rowDuplicate = checkRow(currGrid, val, rowIndex);
        const colDuplicate = checkCol(currGrid, val, colIndex);
        const blockDuplicate = checkBlock(currGrid, val, rowIndex, colIndex);
        if (rowDuplicate || colDuplicate || blockDuplicate) {
            return true;
        }
        return false;
    }

    return (
        <div className="flex flex-col items-center justify-start">
            <div className="fixed inset-0 -z-10 bg-cover bg-center opacity-40 min-h-screen"
                style={{ backgroundImage: "url('/src/assets/paper-background.jpg')" }}>
            </div>
            {/* modal for CSV upload button */}
            { showCSVModal && <CSVModal setShowCSVModal={setShowCSVModal} setError={setError} setGrid={setGrid} hasDuplicates={hasDuplicates} updateUnfilledPositions={updateUnfilledPositions}></CSVModal>}

            {/* modal for upload button */}
            {showImageModal && <ImageModal setShowImageModal={setShowImageModal} setError={setError} setGrid={setGrid} setShowConfirmationModal={setShowConfirmationModal} updateUnfilledPositions={updateUnfilledPositions}></ImageModal>}

            {/* confirmation modal for image parsing */}
            {showConfirmationModal && <ImageConfirmationModal setShowConfirmationModal={setShowConfirmationModal}></ImageConfirmationModal>}
            
            {/* Header: title and hint icon */}
            <Header isSolved={isSolved} handleHint={handleHint}></Header>
            
            {/* optional error that appears/disappears under title */}
            <p className="text-lg text-red-500 mt-1 mb-2">
                {error != "" ? error : "\u00A0"}
            </p>
        
            {/* main sudoku grid */}
            <div className={`flex flex-col items-center ${gridSize}`}>
                <div className="aspect-square border-4 border-black grid grid-rows-3 grid-cols-3 w-full">
                    {/* map the large grid rows - rows 0, 1, 2 
                        use fragment to group multiple elements without adding extra nodes to the DOM
                    */}
                    {[0, 1, 2].map((boxRow) => (
                        <React.Fragment key={`row-${boxRow}`}>
                            {/* map the large grid cols - cols 0, 1, 2 */}
                            {[0, 1, 2].map((boxCol) => (
                                <div 
                                    key={`box-${boxRow}-${boxCol}`} 
                                    className="grid grid-rows-3 grid-cols-3 h-full w-full"
                                >
                                    {/* map the inner grid rows - rows 0, 1, 2 */}
                                    {[0, 1, 2].map((cellRow) => (
                                        <React.Fragment key={`cell-row-${cellRow}`}>
                                            {/* map the inner grid cols - rows 0, 1, 2 */}
                                            {[0, 1, 2].map((cellCol) => {
                                                // get overall indices within entire grid
                                                const rowIndex = boxRow * 3 + cellRow;
                                                const colIndex = boxCol * 3 + cellCol;
                                                const highlightedCell = shouldHighlightCell(rowIndex, colIndex);
                                                
                                                return (
                                                    <div
                                                        key={`cell-${rowIndex}-${colIndex}`} 
                                                        className={`flex items-center justify-center aspect-square
                                                                    ${getCellBorderClasses(cellRow, cellCol, boxRow, boxCol)}`}
                                                    >
                                                        <input
                                                            type="text"
                                                            maxLength={1}
                                                            value={grid[rowIndex][colIndex] === -1 ? "" : grid[rowIndex][colIndex]}
                                                            onChange={(e) => updateGrid(e, rowIndex, colIndex)}
                                                            style={{
                                                                backgroundColor: highlightedCell ? '#B5D29366' : 'transparent',
                                                                aspectRatio: 1
                                                            }}
                                                            className="text-center text-xl w-full h-full focus:outline-none text-black"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
                {/* Buttons */}
                <div className="flex flex-row space-between mb-5 w-full justify-between">
                    <SolveButton grid={grid} error={error} handleSolve={handleSolve}></SolveButton>
                    <UnsolveButton isSolved={isSolved} handleUnsolve={handleUnsolve}></UnsolveButton>
                    <ResetButton handleReset={handleReset}></ResetButton>
                    <CSVButton setShowCSVModal={setShowCSVModal}></CSVButton>
                    <ImageButton isSolved={isSolved} setShowImageModal={setShowImageModal}></ImageButton>
                </div>
            </div>
        </div>
    )
}

export default App