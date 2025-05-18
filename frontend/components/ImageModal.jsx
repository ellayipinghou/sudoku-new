import { useState, useRef } from 'react'
import Spinner from 'react-bootstrap/Spinner';

const imageCancelError = "Image upload cancelled";
const serverError = "Server error: check connection and try again";

function ImageModal({setShowImageModal, setError, setGrid, setShowConfirmationModal}) {
        
    // load spinner while waiting for image parsing
    const [showLoadSpinner, setShowLoadSpinner] = useState(false);

    // abort upload early if x (cancel) button clicked
    const abortControllerRef = useRef(null);

    // parse image using a trained neural network and set the grid accordingly
    const handleImage = async (e) => {
        // prevent form from refreshing
        e.preventDefault();

        // set up abort controller and signal
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        // get input file and create formData object
        const fileInput = document.getElementById('image_file');
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);

        try {
            setShowLoadSpinner(true);

            // send to server and get response
            const response = await fetch('http://localhost:5000/image', {
                method: 'POST',
                body: formData,
                signal: signal
            });

            // if response is good, then update the grid and state of system
            if (response.ok) {
                const data = await response.json();
                setGrid(data.grid);
                setShowConfirmationModal(true);
                setError("");
                updateUnfilledPositions(data.grid);
            } else {
                // else, show error
                setError(serverError);
            }

        } catch (error) {
            // if aborted, then show cancel message
            if (error.name === 'AbortError') {
                setError(imageCancelError);
            } else {
                // otherwise, show server error
                console.error('Error:', error);
                setError(serverError)
            }
            
        } finally {
            setShowLoadSpinner(false);
            setShowImageModal(false);
        }

    }
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] max-w-[80%] rounded-md bg-white shadow-lg z-50">
            {/* Button to close modal and abort process (if submit has been clicked) */}
            <div className="relative w-full">
                <button className="absolute top-2 right-2 z-60" 
                        onClick={() => {
                            if (abortControllerRef.current) {
                                abortControllerRef.current.abort();
                            }
                            setShowImageModal(false);
                            setShowLoadSpinner(false);
                        }}>
                    {/* red "x" icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#DC143C" className="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            </div>
            <div className="flex flex-col space-y-6 items-center justify-center w-full h-full"> 
                {/* Instructions */}
                <h3 className="font-mulish -mt-2">Upload Image or Screenshot</h3>
                <p className="font-mulish text-left mt-3 w-[80%]">Please upload an image of a sudoku board:
                    <li>Must be a 9×9 grid representing a Sudoku puzzle</li>
                    <li>Cells contain TYPED values 1 to 9, or -1 if unknown</li>
                    <li>Clear outer grid boundary with square, evenly-sized cells</li>
                    <li>Slight to moderate angles are acceptable</li>
                </p>
                {/* Submit button to uplaod and process image data */}
                <div className= "flex flex-row shrink mt-6 items-center">
                    <form onSubmit={handleImage}>
                        <input id="image_file" name="image_file" type="file" accept="image/*"/>
                        <button type="submit" className="h-8 w-20 border-2 border-[#3D591C66] bg-[#B5D293] rounded-2 text-[#3D591C]">Submit</button>
                    </form>
                </div>
            </div>
            {/* Spinner object: wrap in div to reserve space and prevent unwanted movement when appearing/disappearing */}
            <div className="absolute bottom-14 right-8">
                {showLoadSpinner && <Spinner animation="border" variant="secondary" size="sm" />}
            </div>
        </div>
    )
}

export default ImageModal;