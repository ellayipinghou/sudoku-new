function SolveButton({grid, error, handleSolve, isFull}) {

    return (
        <div className="flex shrink align-center justify-center border-2 border-[#3D591C] rounded-md h-10 w-20 bg-[#B5D293] mt-10">
            <button 
                type="button" 
                disabled={isFull || error != ""} 
                className={`text-[#3D591C] text-md ${(isFull || error != "") ? "cursor-not-allowed" : ""}`} 
                onClick={handleSolve}
            >
                Solve
            </button>
        </div>
    )
}

export default SolveButton;
