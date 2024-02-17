import React, { useEffect, useMemo, useState } from 'react';
import ViewQuestion from "./questionsModels/viewQuestion";
import axios from 'axios';
const InteractiveVideo = ({ videoRef, setCurrentQuestionTime , currentQuestionTime, interactiveMode ,isPlaying ,setIsPlaying, questions= [] , setFullStyle, hitQuestion, setHitQuestion}) => {
   
  
  const [Question , setQuestion] = useState([]);
    const questionsTimeStamp  = useMemo(()=>{ 
      const  timeStamp = {};
      questions.forEach(question => {
        timeStamp[question.time] = question
  } )
  return timeStamp;
 } , [questions]); 
    
 
    

    
    useEffect(() => {
        const video = videoRef.current;
        const handleTimeUpdate = () => {
            const curr = video.currentTime ;
            const question = questionsTimeStamp[Math.floor(curr)];
            if(question && !hitQuestion && currentQuestionTime!== question.time){
                setQuestion(question);
                setCurrentQuestionTime(question.time);    
                setIsPlaying(false)
                video.pause();
                setHitQuestion(!hitQuestion);
                setFullStyle({background: "#152d39"})
            }    
        };
        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    } )
    const  [videoUrl, setVideoUrl] = useState(null)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/videos/1');
        setVideoUrl(response.data.video_url);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 
    return (
        <div className="container">
         <video ref={videoRef} src= {videoUrl} id="video"></video>
         {hitQuestion && <ViewQuestion setFullStyle = {setFullStyle} setHitQuestion = {setHitQuestion}videoRef = {videoRef } isPlaying = {isPlaying} setIsPlaying= {setIsPlaying}Question={Question} interactiveMode = {interactiveMode}/> }
        </div>
    );
};

export default InteractiveVideo;