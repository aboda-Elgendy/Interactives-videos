import InteractiveVideo from './InteractiveVideo';
import FooterActivities from './FooterActivities';
import TimeLine from './Timeline';
import { useRef, useState , useEffect } from "react";
import axios from 'axios';
function App() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullStyle, setFullStyle] = useState({});
  const [hitQuestion, setHitQuestion] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(true);
  const [currentQuestionTime , setCurrentQuestionTime] = useState(-1);

  const handlePlayPause = () => {
    const video = videoRef.current;
    setIsPlaying(!isPlaying);
    if (hitQuestion ) {
      video.pause();
      setIsPlaying(false);
    }
    else if (isPlaying) {
      video.pause();
    }
    else {
      video.play();

    }
  };
  const [questions, setQuestions] = useState([
    {
      time: 1,
      questionBody: 'Who painted the Mona Lisa?',
      options: [{ value: "cairo", optionId: 1 }, { value: "Paris", optionId: 2 }, { value: "italy", optionId: 3 }, { value: "Giza", optionId: 4 }],
      answer: [2]
    },
    
  ]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/videos/1/questions/');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [questions]); 
  return (
    <div style={fullStyle} className='interactive-video'>
      <div className='upper-content'>
      </div>
      <div onClick={handlePlayPause} >
        <InteractiveVideo
          handlePlayPause={handlePlayPause}
          videoRef={videoRef}
          setFullStyle={setFullStyle}
          setHitQuestion={setHitQuestion}
          hitQuestion={hitQuestion}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          questions={questions}
          interactiveMode={interactiveMode}
          setCurrentQuestionTime = {setCurrentQuestionTime}
          currentQuestionTime = {currentQuestionTime}

        />
      </div>

      <TimeLine videoRef={videoRef}
        interactiveMode={interactiveMode}
        setCurrentQuestionTime = {setCurrentQuestionTime}
        setFullStyle={setFullStyle}
        setHitQuestion={setHitQuestion}
        isPlaying={isPlaying} setIsPlaying={setIsPlaying} questions={questions} />

      <FooterActivities         
       setFullStyle={setFullStyle}
       setHitQuestion={setHitQuestion}
      setIsPlaying={setIsPlaying}
 hitQuestion={hitQuestion} videoRef={videoRef} interactiveMode={interactiveMode} />
    </div>

  );
}
export default App;
