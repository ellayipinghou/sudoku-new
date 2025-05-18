import { useState } from 'react'

function Header({submitted, handleHint}) {

    // true when hovering over lightbulb
    const [showHintText, setShowHintText] = useState(false);
    
    return (
        <div className="relative">
            {/* hint button */}
            <button disabled={submitted} 
                onMouseEnter={() => setShowHintText(true)}
                onMouseLeave={() => setShowHintText(false)} 
                className={`absolute left-[105%] bottom-[50%] ${submitted ? "cursor-not-allowed" : ""}`} 
                onClick={handleHint}
                >
                {/* lightbulb icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#F4BB44" className="bi bi-lightbulb mt-4" viewBox="0 0 16 16">
                    <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>
                </svg>
            </button>
            {showHintText && 
                (<div className="absolute left-[122%] bottom-[70%] border-2 border-gray-400 h-[35px] w-[220px] rounded-md bg-gray-200 flex items-center justify-center">
                    <p className="font-mulish text-[14px] text-gray-500 m-0">Reveal one element as a hint</p>
                </div>)
            }
            {/* title */}
            <h1 className="text-6xl mt-4 mb-1 font-kaushan text-[#553F0D]">Sudoku Solver</h1>
        </div>
    )
}

export default Header;