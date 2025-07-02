function CSVButton({setShowCSVModal}) {
    return (
        <div className="flex shrink align-center justify-center border-2  border-[#3D591C] rounded-md h-10 w-20 bg-[#B5D293] mt-10">
            <button 
                type="button" 
                onClick={() => setShowCSVModal(true)}
                className="text-[#3D591C] text-md font-mulish"
            >
                CSV
            </button>
        </div>
    )
}

export default CSVButton;