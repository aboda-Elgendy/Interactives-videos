import React from 'react'
import AddQuestions from './questionsModels/AddQuestions'
export default function FooterActivities({ setHitQuestion ,setFullStyle, videoRef, interactiveMode, setIsPlaying, hitQuestion }) {

    return (
        <div>
            <div className='activities'>
                {interactiveMode && <div className="vl"></div>}
                {interactiveMode && <AddQuestions  setFullStyle={setFullStyle}
       setHitQuestion={setHitQuestion}  videoRef={videoRef} setIsPlaying={setIsPlaying}
                    hitQuestion={hitQuestion} />}
            </div>
        </div>
    )
}
