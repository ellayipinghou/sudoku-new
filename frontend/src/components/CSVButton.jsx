function CSVButton({setShowCSVModal}) {
    return (
        <div className="flex shrink align-center justify-center border-2 border-[#565748] rounded-md h-10 w-20 bg-[#e4e6c3] mt-10">
            <button 
                type="button" 
                onClick={() => setShowCSVModal(true)}
                className="text-[#565748] text-md font-mulish"
            >
                CSV
            </button>
        </div>
    )
}

export default CSVButton;