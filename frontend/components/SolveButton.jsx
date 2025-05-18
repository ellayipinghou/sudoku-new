function SolveButton({grid, error, handleSolve}) {

    // calculate whether the current grid is full or not - used to disable button
    const isFull = (currGrid) => {
        for (let row = 0; row < 9; row++) {
            // if any row has -1, that it's not full
            if (currGrid[row].includes(-1)) {
                return false;
            }
        }
        return true;
    }

    return (
        <div className="flex shrink align-center justify-center border-2 border-[#3D591C] rounded-md h-10 w-20 bg-[#B5D293] mt-10">
            <button 
                type="button" 
                disabled={isFull(grid) || error != ""} 
                className={`text-[#3D591C] text-md ${(isFull(grid) || error != "") ? "cursor-not-allowed" : ""}`} 
                onClick={handleSolve}
            >
                Solve
            </button>
        </div>
    )
}

export default SolveButton;
