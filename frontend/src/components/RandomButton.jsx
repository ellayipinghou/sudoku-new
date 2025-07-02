function RandomButton({handleGenerate}) {
        return (
                <div className="flex shrink align-center justify-center border-2 border-[#725E17] rounded-md h-10 w-20 bg-[#D6BC5D] mt-10">
                        <button 
                                type="button" 
                                onClick={handleGenerate}
                                className="text-[#725E17] text-md font-mulish"
                        >
                                Random
                        </button>
                </div>
        )
}

export default RandomButton