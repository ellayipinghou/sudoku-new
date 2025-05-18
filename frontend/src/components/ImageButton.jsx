function ImageButton({isSolved, setShowImageModal}) {
    return (
        <div className="flex shrink align-center justify-center border-2 border-[#3D591C] rounded-md h-10 w-20 bg-[#B5D293] mt-10">
            <button 
                type="button" 
                disabled={isSolved} 
                className={`text-[#3D591C] text-md ${isSolved ? "cursor-not-allowed" : ""}`} 
                onClick={() => setShowImageModal(true)}
            >
                Image
            </button>
        </div>
    )
}

export default ImageButton;