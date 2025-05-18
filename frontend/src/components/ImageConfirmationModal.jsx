function ImageConfirmationModal({setShowConfirmationModal}) {
    return (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[250px] w-[500px] max-w-[80%] bg-white rounded-md z-50`}>
            {/* Button to close modal */}
            <div className="relative w-full">
                <button className="absolute top-2 right-2 z-60" onClick={() => setShowConfirmationModal(false)}>
                    {/* red "x" icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#DC143C" className="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            </div>
            {/* Confirmation message and accuracy warning */}
            <div className="flex flex-col items-center justify-center w-full h-full">
                <h4 className="font-mulish w-[80%] text-green-600">Image has been parsed!</h4>
                <h5 className="font-mulish w-[80%] text-[#DC143CCC]">Warning: May not be 100% accurate. Verify results and adjust before solving</h5>
            </div>
        </div>
    );
}

export default ImageConfirmationModal;