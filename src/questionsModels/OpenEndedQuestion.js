import React, { useState } from 'react'
import EquationEditor from "./textArea"
import axios from 'axios';
export default function OpenEndedQuestion({setIsPlaying ,  setHitQuestion, setFullStyle ,videoRef , editMode ,currentTimeInSec, isOpenEndedQuestionVisiable, setIsOpenEndedQuestionVisiable , question = {  questionBody : ""  }}) {
  const style = {
    display: "block"
  };
  const [questionBody, setQuestionBody] = useState(question.questionBody);

  const handleCloseInnerModal = () => {

    setIsOpenEndedQuestionVisiable(!isOpenEndedQuestionVisiable);

  }
 
  const formatResponse = () => {
    const formattedResponse = {
      question_body : questionBody,
      teacher_id:1,
      question_type:2,
      timestamp : Math.floor(currentTimeInSec)
    }
    return formattedResponse;
  }
  const handleFormSubmit = (event) => {
    event.preventDefault();
    
    const formattedResponse = formatResponse();
    if(editMode){
      axios.put(`http://localhost:8080/api/videos/1/questions/${question.id}` , formattedResponse).then((res)=>{
        alert(res.data.message);
        const video = videoRef.current;
        handleCloseInnerModal();
        setHitQuestion(false);
        setFullStyle({background: "black"})
        setIsPlaying(true);
        video.play();
      })
    }else{
    axios.post("http://localhost:8080/api/videos/1/questions/" , formattedResponse).then((res)=>{
      alert(res.data.message);
      handleCloseInnerModal();

    })
  }
  };



  return (
    <>
      {
        isOpenEndedQuestionVisiable &&
        (<div style={style} class="modal" role="dialog" tabIndex="-1" >
          <div class="modal-dialog modal-fullscreen">

            <div class="modal-content">
              <form action="/action_page.php" >

                <div class="modal-header">
                </div>
                <div class="modal-body">

                  <div class="textArea-Size">
                    <EquationEditor  questionBody = {questionBody} setQuestionBody={setQuestionBody}  />


                  </div>


                </div>

                <div className='modal-footer-background'>
                  <div className={`modal-footer`}>
                    <button onClick={handleCloseInnerModal} type="button" class="btn btn-primary">Cancel </button>
                    <button onClick={handleFormSubmit} type="submit" class="btn btn-primary active btn-lg">Save </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
        )
      }
    </>

  )
}
