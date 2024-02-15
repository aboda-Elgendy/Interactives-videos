
const EditableMathExample = ({placeholder= "Enter your question here", questionBody, setQuestionBody }) => {

  const handleTextAreaChange = (event) => {

    setQuestionBody(event.target.value);
  };
  return (
    <div>
      <textarea
        required
        onChange={handleTextAreaChange}
        placeholder= {placeholder }class="form-control" id="exampleFormControlTextarea1" rows="5"

        value={questionBody}
      >


      </textarea>


    </div>

  )
}

export default EditableMathExample;