import Papa from 'papaparse';
const csvDimensionError = "Incorrect CSV format: wrong dimensions";

function CSVModal({setShowCSVModal, setError, setGrid, hasDuplicates, updateUnfilledPositions}) {
    
    const handleCSV = async (e) => {
        // prevent form from refreshing
        e.preventDefault();

        // get file from user
        const fileInput = document.getElementById('csv_file');
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }

        // process using a csv parser
        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                console.log('Parsed CSV data:', results.data);
                // make sure there are 9 rows
                if (results.data.length != 9) {
                    setError(csvDimensionError);
                    return;
                }

                // iterate over rows
                for (let r = 0; r < 9; r++) {
                    // make sure there are 9 columns
                    if (results.data[r].length != 9) {
                        setError(csvDimensionError);
                        return;
                    }

                    // iterate over columns
                    for (let c = 0; c < 9; c++) {
                        // convert each element to an int
                        const intResult = parseInt(results.data[r][c]);
                        // make sure element is a valid digit between 1 and 9, or -1 for empty cells
                        if (isNaN(intResult) || !Number.isInteger(intResult)) {
                            setError(`Incorrect CSV format: row ${r}, column ${c} is not a valid integer`);
                            return;
                        }
                        if ((intResult != -1) && (intResult < 1 || intResult > 9)) {
                            setError(`Incorrect CSV format: row ${r}, column ${c} must be -1 or between 1-9`);
                            return;
                        }

                        // TODO: check for floats?

                        // replace element in grid with the integer version
                        results.data[r][c] = intResult;
                    }
                }

                // validate input for duplicates
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        const val = results.data[r][c];
                        // temporarily set this cell to -1 to avoid counting it as a duplicate of itself
                        results.data[r][c] = -1;

                        const duplicateFound = hasDuplicates(results.data, val, r, c);
            
                        // restore value
                        results.data[r][c] = val;

                        if (duplicateFound) {
                            setError(`Incorrect CSV format: duplicate value(s) ${val} found: row ${r}, column ${c}`);
                            return;
                        }
                    }
                }

                // set grid and update state of system
                setError("");
                setGrid(results.data);
                updateUnfilledPositions(results.data);
                
            }
        })
        
        setShowCSVModal(false);
    }
    
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] max-w-[80%] rounded-md bg-white shadow-lg z-50">
            {/* Button to close modal */}
            <div className="relative w-full">
                <button className="absolute top-2 right-2 z-60" onClick={() => setShowCSVModal(false)}>
                    {/* red "x" icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#DC143C" className="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            </div>
            <div className="flex flex-col space-y-6 items-center justify-center w-full h-full"> 
                {/* Instructions */}
                <h3 className="font-mulish -mt-2">Upload CSV File</h3>
                <p className="font-mulish text-left mt-3 w-[80%]">Please upload a .csv file formatted as follows:
                    <li>Must be a 9×9 grid representing a Sudoku puzzle</li>
                    <li>Each cell contains a number from 1 to 9, or -1 for unknown cells</li>
                    <li>Values should be comma-separated, with each row on a new line</li>
                    <li>No duplicates within rows, columns, or 3x3 blocks</li>
                </p>
                {/* Submit button to upload and parse CSV */}
                <div className= "flex flex-row shrink mt-6">
                    <form onSubmit={handleCSV}>
                        <input id="csv_file" name="csv_file" type="file" accept=".csv"/>
                        <button type="submit" className="h-8 w-20 border-2 border-[#3D591C66] bg-[#B5D293] rounded-2 text-[#3D591C]">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
      
export default CSVModal;



