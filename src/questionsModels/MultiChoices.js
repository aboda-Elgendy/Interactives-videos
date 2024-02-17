import React, { useState } from 'react'
import EquationEditor from "./textArea"
import axios from "axios";
import Swal from 'sweetalert2'

export default function MultiChoices( {setIsPlaying ,  setHitQuestion, setFullStyle ,videoRef , editMode = false,  currentTimeInSec , isMutiChoicesVisiable, setIsMutiChoicesVisiable , question = {options:
  [{ optionId: 1, checked: false, value: "" }, { optionId: 2, checked: false, value: "" }] , questionBody : "" , answer : [] }}) {
  const style = {
    display: "block"
  };
  const [isCheckboxValid, setIsCheckboxValid] = useState(true);
  const [optionId, setOptionId] = useState(question.options.sort((a,b)=>(a.optionId-b.optionId)).at(-1).optionId+1);
  const [allOptions, setAllOptions] = useState(question.options.reverse());
  const [questionBody, setQuestionBody] = useState(question.questionBody);

  const returnOption = () => {
    setAllOptions([...allOptions,
    { optionId: optionId, checked: false, value: "" }
    ])
    setOptionId(optionId + 1);

  }

  const handleCloseInnerModal = () => {

    setIsMutiChoicesVisiable(!isMutiChoicesVisiable);

  }
  const sweetAlert = ({ title, text, icon }) => {
    return Swal.fire({
      title: `${title}`,
      text: `${text}`,
      icon: `${icon}`
    });
  }
  const formatResponse = () => {
    const formattedResponse = {
      question_body : questionBody,
      teacher_id:1,
      question_type:1,
      options : allOptions.map(option=>( {...option , checked: +option.checked} )),
      timestamp : Math.floor(currentTimeInSec)
    }
    return formattedResponse;
  }
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const atLeastOneChecked = allOptions.some((checkbox) => checkbox.checked);

    if (!atLeastOneChecked) {
      setIsCheckboxValid(false);
      return;
    }
    const formattedResponse = formatResponse();
    if(editMode){
      axios.put(`http://localhost:8080/api/videos/1/questions/${question.id}` , formattedResponse).then((res)=>{
        sweetAlert({ title: "Good job!", text: res.data.message, icon: "success" });
        const video = videoRef.current;

        handleCloseInnerModal();
        setHitQuestion(false);
        setFullStyle({background: "black"})
        setIsPlaying(true);
        video.play();
       
      })
    }else{
    axios.post("http://localhost:8080/api/videos/1/questions/" , formattedResponse).then((res)=>{
      sweetAlert({ title: "Good job!", text: res.data.message, icon: "success" });
      handleCloseInnerModal();
    })
  }
  };
  const handleDeleteOption = (optionId)=>{
    setAllOptions(allOptions.filter((option)=>(option.optionId !==optionId)));

  }
  const handleCheckboxChange = (event, optionId) => {
    const updatedCheckboxes = allOptions.map((checkbox) => {
      if (checkbox.optionId === optionId) {
        return { ...checkbox, checked: event.target.checked };
      }
      return checkbox;
    });
    setAllOptions(updatedCheckboxes);
    setIsCheckboxValid(true);
  }
  const handleOptionInput = (event, optionId) => {
    const updatedOptionsValue = allOptions.map((optionValue) => {
      if (optionValue.optionId === optionId) {
        return { ...optionValue, value: event.target.value };
      }
      return optionValue;
    });
    setAllOptions(updatedOptionsValue);
  }
  return (
    <>
      {
        isMutiChoicesVisiable &&
        (<div style={style} class="modal" role="dialog" tabIndex="-1" >
          <div style ={{height:"max-content"}}class="modal-dialog modal-fullscreen">

            <div class="modal-content">
              <form  >

                <div class="modal-header">
                </div>
                <div class="modal-body">

                  <div class="textArea-Size">
                    <EquationEditor  questionBody = {questionBody} setQuestionBody={setQuestionBody} />
                    
                    <div className='options-groups'>
                      {allOptions.map(option => (
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">
                            <span className='check-box'>
                              <input

                                checked={option.checked} type="checkbox" class="form-check-input " id={`option${option.optionId}`}
                                onChange={(event) => handleCheckboxChange(event, option.optionId)}

                                value="something"></input>

                            </span>
                          </span>
                          <input required type="text" id={`value${option.optionId}`} onChange={(event) => handleOptionInput(event, option.optionId)} value={option.value} class="form-control" placeholder="Answer option" aria-label="Username" aria-describedby="basic-addon1"></input>
                         { allOptions.length>2 && <button onClick={()=>handleDeleteOption(option.optionId)}  className='trash-icon'><i  class="fa-solid fa-trash"></i></button>}
                        </div>
                      ))}
                      {!isCheckboxValid && (
                        <div className="text-danger">Please select at least one checkbox.</div>
                      )}
                  
                    </div>
                 
                  </div>
                  <div style={ {
              height : "250px",
              background : "white"
            }
            }></div>
                  
                </div>

                <div className='modal-footer-background'>
                  <div className={`modal-footer`}>
                  <button style = {{
                    left: "40%",
                    position: "absolute"
                  }}onClick={returnOption} type="button" class="btn btn-primary">+ Add Answer</button>

                    <button onClick={handleCloseInnerModal} type="button" class="btn btn-primary">Cancel </button>
                    <button onClick={handleFormSubmit} type="submit" class="btn btn-primary active btn-lg">Save </button>

                  </div>
                 
                </div>
              </form>

            </div>
            <div style={ {
              height : "250px",
              background : "white"
            }
            }></div>
          </div>
        </div>
        )
      }
    </>

  )
}
