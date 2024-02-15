import React, { useState, useEffect } from 'react'
import Question_ from "../assets/Question.png";
import MultiChoices from './MultiChoices';
import OpenEndedQuestion from './OpenEndedQuestion';
import multi_choices from "../assets/multi_choices.jpg";
import EquationEditor from "./textArea"
import axios from 'axios';
export default function ViewQuestion({ Question, setFullStyle, setHitQuestion, setIsPlaying, isPlaying, videoRef, interactiveMode }) {
  const style = { 'margin-left': "10px" }
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isCheckboxValid, setIsCheckboxValid] = useState(true);
  const [editEnabled, setEditEnabled] = useState(false);
  const [showSave , setShowSave ] = useState(true);
  const [allOptions, setAllOptions] = useState(Question.options.map((option) => ({ ...option, checked: false })));
  const [answerBody, setAnswerBody] = useState("");

  const video = videoRef.current;

  const handleCheckboxChange = (event , id) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedOptions((prevOptions) => [...prevOptions, id]);
      setIsCheckboxValid(true);

    } else {
      setSelectedOptions((prevOptions) =>
        prevOptions.filter((option) => option !== id)
      );
    }
  };

  const handleSkipTheQuestion = () => {
    setHitQuestion(false);
    setFullStyle({ background: "black" })
    setTimeout(() => {
      const video = videoRef.current;
      setIsPlaying(!isPlaying);

      video.play();
    }, 10)
  }
  const handleDeleteQuestion = () => {
    const video = videoRef.current;
    video.pause();
    setIsPlaying(false);
    const confirmed = window.confirm(`are you sure to delete that Question with id : ${Question.id}`);
    if(confirmed){
      axios.delete(`http://localhost:8080/api/videos/1/questions/${Question.id}`).then((res) => {
        alert(res.data.message);
        handleSkipTheQuestion();
      })
    }
  }
  const handleEditTheQuestion = () => {
    const video = videoRef.current;
    setEditEnabled(true);
    video.pause();
    setIsPlaying(false);
  }
  const formatResponse = () => {
    const formattedResponse = {
      student_id:1,
      answer : Question.type ===1 ? selectedOptions.join('|') :  answerBody
    }
    return formattedResponse;
  }
  const handleFormSubmit = (event) => {

    event.preventDefault();

    if (!selectedOptions.length && Question.type === 1) {
      setIsCheckboxValid(false);
      return;
    }
    if(answerBody=== '' && Question.type ===2){
      setIsCheckboxValid(false);
      return;
    }
    const formattedResponse = formatResponse();
    axios.post(`http://localhost:8080/api/videos/1/questions/${Question.id}/answer` , formattedResponse).then((res)=>{
      alert(res.data.message);
    })
    handleSkipTheQuestion();
    setTimeout(() => {
      const video = videoRef.current;
      setIsPlaying(!isPlaying);

      video.play();
    }, 10)
    return;
  };
  const [questionAnswer, setQuestionAnswer] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/videos/1/questions/${Question.id}/answer`);
        setQuestionAnswer(response.data.answer);
        if (questionAnswer) {
          setShowSave(false)
          setAllOptions(allOptions.map(element =>(questionAnswer.split('|').includes(`${element.optionId}`) ? {...element , checked :true} : element )));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [Question, allOptions , questionAnswer]);

  return (
    <div className="question-overlay d-flex  flex-column">
      <div class="h5 d-flex  flex-row mt-2">
        <div className="question-img">
          <img src={Question.type === 1 ? multi_choices : Question_} alt="Icon" />
        </div>
        <p style={{ 'margin-top': "10px" }}> {Question.type === 1 ? "Multi Choices Question" : "Open Ended Question"}   </p>


      </div>
      <div className="question-content">
        <form action="/action_page.php" >

          <p> {Question.questionBody} </p>
          <div class="row">
            {allOptions.map(option => (
              <div className='col-6'>
                <div class="input-group mb-3">
                  <span class={interactiveMode ? "option_point" : ""} id="basic-addon1">
                    <span className='check-box'>
                      {interactiveMode ? '' : <input
                        checked= {option.checked}
                        type="checkbox" class="form-check-input " id={`${option.optionId}`}
                        onChange={(event)=>handleCheckboxChange(event , option.optionId)}
                        value="something"></input>}

                    </span>
                  </span>

                  <p style={style}> {option.value}</p>
                </div>
              </div>
            ))}
            {!interactiveMode && showSave && Question.type === 2 &&<EquationEditor placeholder = {"Enter your answer here."}  questionBody = {answerBody} setQuestionBody={setAnswerBody} />  }

            {!isCheckboxValid && (
              <div className="text-danger">{ Question.type === 1 ? "Please select at least one checkbox." : "Please enter your answer"}</div>
            )}
          </div>
          {interactiveMode ? <div className={`question-buttons modal-footer`}>
            <button onClick={handleDeleteQuestion} type="button" class="btn btn-primary">Delete </button>
            <button style={style} onClick={handleEditTheQuestion} type="button" class="btn btn-primary ">Edit </button>
          </div> : <div className={`question-buttons modal-footer`}>
            {showSave && <button onClick={handleFormSubmit} type="submit" class="btn btn-primary">Save </button>}
          </div>}
        </form>
      </div>
      {editEnabled && Question.type === 1 ? <MultiChoices setIsPlaying={setIsPlaying} setFullStyle={setFullStyle}
        setHitQuestion={setHitQuestion} videoRef={videoRef} currentTimeInSec={video.currentTime} editMode={editEnabled} setIsMutiChoicesVisiable={setEditEnabled} isMutiChoicesVisiable={editEnabled} question={Question} /> : <></>}
      {editEnabled && Question.type === 2 ? <OpenEndedQuestion setIsPlaying={setIsPlaying} setFullStyle={setFullStyle}
        setHitQuestion={setHitQuestion} videoRef={videoRef} currentTimeInSec={video.currentTime} editMode={editEnabled} setIsOpenEndedQuestionVisiable={setEditEnabled} isOpenEndedQuestionVisiable={editEnabled} question={Question} /> : <></>}
    </div>



  )
}
