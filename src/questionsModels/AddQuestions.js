import React, { useState, useRef } from 'react'
import MultiChoices from "./MutiChoices";
import TrueFalseQuestion from "./TrueFalseQuestion";
import OpenEndedQuestion from "./OpenEndedQuestion";
import Question from "../assets/Question.png";
import TF from '../assets/TF.png';
import multi_choices from "../assets/multi_choices.jpg";

export default function AddQuestions() {
  
  const modalRef = useRef(null);
  const [isTrueFalseVisible, setIsTrueFalseVisible] = useState(0);
  const [isOpenEndedQuestionVisiable, setIsOpenEndedQuestionVisiable] = useState(0);
  const [isMutiChoicesVisiable  , setIsMutiChoicesVisiable ] = useState(0);

  const handleTrueFalseQuestion = () => {
    handleCloseModal();
    setIsTrueFalseVisible(!isTrueFalseVisible);
  }
  const handleOpenEndedQuestion = () => {
    handleCloseModal();
    setIsOpenEndedQuestionVisiable(!isOpenEndedQuestionVisiable);
  }
  const handleMutiChoicesQuestion = () => {
    handleCloseModal();
    setIsMutiChoicesVisiable(!isMutiChoicesVisiable);
  }
 
  const handleCloseModal = () => {
    const modalElement = modalRef.current;
    modalElement.setAttribute('data-bs-dismiss', 'modal');
  };
  return (

    <div>
      <button  type="button" className={`add-activity "btn btn-primary`} data-bs-toggle="modal" data-bs-target="#exampleModal">
        <i class="fa fa-tasks" aria-hidden="true"></i>
      </button>

      {1 && (
        <div ref={modalRef} class="modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"> Add Activity </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div className="content">
                  <button onClick={handleMutiChoicesQuestion} type="button" className={`question-button`} data-bs-toggle="modal" data-bs-target="#exampleModal" >
                    <img src={multi_choices} alt="Icon" />
                    <p> Multi Choices Question  </p>

                  </button>
                  <button onClick={handleOpenEndedQuestion} type="button" className={`question-button`} data-bs-toggle="modal" data-bs-target="#exampleModal" >
                    <img src={Question} alt="Icon" />
                    <p> Open Ended Question  </p>

                  </button>
                  <button onClick={handleTrueFalseQuestion} type="button" className={`question-button`} data-bs-toggle="modal" data-bs-target="#exampleModal" >
                    <img src={TF} alt="Icon" />
                    <p> True/False </p>

                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      {
        isTrueFalseVisible && <TrueFalseQuestion/>
      }
        {
        isOpenEndedQuestionVisiable && <MultiChoices/>
      }
        {
        isMutiChoicesVisiable && <OpenEndedQuestion/>
      }
    </div>
  )
}


