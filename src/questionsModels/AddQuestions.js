import React, { useState , useEffect} from 'react'
import MultiChoices from "./MultiChoices";
import OpenEndedQuestion from "./OpenEndedQuestion";
import Question from "../assets/Question.png";
import multi_choices from "../assets/multi_choices.jpg";


export default function AddQuestions({videoRef, hitQuestion, setIsPlaying}) {
 
  const [isPopUpVisiable , setIsPopupVisiable] = useState(false); 
  const [isOpenEndedQuestionVisiable, setIsOpenEndedQuestionVisiable] = useState(false);
  const [isMutiChoicesVisiable  , setIsMutiChoicesVisiable ] = useState(false);
  const [progressTime, setProgressTime] = useState("00:00");
  const [currentTimeInSec , setCurrentTimeInsec] = useState(0);
  const handleOpenEndedQuestion = () => {
    setIsOpenEndedQuestionVisiable(!isOpenEndedQuestionVisiable);
    setIsPopupVisiable(false);

  }
  const handleMutiChoicesQuestion = () => {
    setIsMutiChoicesVisiable(!isMutiChoicesVisiable);
    setIsPopupVisiable(false);

  }
  const handleOpenOuterModal = ()=>{
    setIsPopupVisiable(true);
    setIsPlaying(false);
    const video = videoRef.current;
    video.pause();
  }
  const handleCloseOuterModal = ()=>{
    setIsPopupVisiable(false);
  }
     const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => {
        setProgressTime(formatTime(video.currentTime))
        setCurrentTimeInsec(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
    };
});
  return (

    <div>
      <button onClick = {handleOpenOuterModal}  type="button" className={hitQuestion?`btn btn-primary add-activity disabled`:`btn btn-primary add-activity`} >
        Add Activity at {progressTime}
      </button>
      
      {isPopUpVisiable && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" > Add Activity </h5>
                <button  onClick = {handleCloseOuterModal}type="button" class="btn-close" ></button>
              </div>
              <div class="modal-body">
                <div className="content">
                  <button onClick={handleMutiChoicesQuestion} type="button" className={`question-button`}  >
                    <img src={multi_choices} alt="Icon" />
                    <p> Multi Choices Question  </p>

                  </button>
                  <button onClick={handleOpenEndedQuestion} type="button" className={`question-button`}  >
                    <img src={Question} alt="Icon" />
                    <p> Open Ended Question  </p>

                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      
     
        {
        isMutiChoicesVisiable ?  <MultiChoices currentTimeInSec = {currentTimeInSec} setIsMutiChoicesVisiable = { setIsMutiChoicesVisiable } isMutiChoicesVisiable = {isMutiChoicesVisiable} /> : <></> 
      }
        {
        isOpenEndedQuestionVisiable ?  <OpenEndedQuestion currentTimeInSec = {currentTimeInSec} setIsOpenEndedQuestionVisiable = { setIsOpenEndedQuestionVisiable } isOpenEndedQuestionVisiable = {isOpenEndedQuestionVisiable} /> : <></> 
      }
       
       {(isPopUpVisiable ) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  )
}


