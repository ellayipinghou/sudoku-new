function ResetButton({handleReset}) {
    return (
        <div className="flex shrink align-center justify-center border-2 border-[#725E17] rounded-md h-10 w-20 bg-[#D6BC5D] mt-10">
            <button 
                type="button" 
                onClick={handleReset}
                className="text-[#725E17] text-md font-mulish"
            >
                Reset
            </button>
        </div>
    )
}

export default ResetButton;