import React, { useRef, useState, useEffect } from "react";
import VolumeControl from "./Volume";
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';

const TimeLine = ({videoRef ,setCurrentQuestionTime,setFullStyle, isPlaying , setHitQuestion ,setIsPlaying , questions=[], interactiveMode})=>{
const progressBarRef = useRef(null);
const [startPointPosition, setStartPointPosition] = useState(0);

    const [isToggle, setIsToggle] = useState(true);
    const [progress, setProgress] = useState(0);
    const [progressTime, setProgressTime] = useState("00:00");
    const [totalDuration, setTotalDuration] = useState("00:00");
    const [videoDuration, setVideoDuration] = useState(0);
    
   
    const renderQuestionIndicators = () => {
        
        return questions.map((question) => (
            <div
                key={question.time}
                data-toggle= {interactiveMode? "tooltip":""}
                title= {interactiveMode? question.question:""}
                style={{ left: `${((question.time ) / videoDuration) * 100 +startPointPosition }%`  }}
                className='question-indicator'
            ></div>
        ));
    };
   
    const handleResize = () => {
        const progressBar = progressBarRef.current;
        const rect = progressBar.getBoundingClientRect();
        setStartPointPosition((rect.left/window.innerWidth)-1 );
      };
    
      useEffect(() => {
        handleResize(); // Initial position calculation
        
    
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    const handlePlayPause = () => {
        const video = videoRef.current;
        setIsPlaying(!isPlaying);
        setHitQuestion(false)
        setFullStyle({background: "black"})
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    };

    useEffect(() => {
        const video = document.getElementById("video");

        const handleLoadedMetadata = () => {
            setTotalDuration(formatTime(video.duration));
            setVideoDuration(video.duration)
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    },
        []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const handleProgressBarClick = (event) => {
        const progressBar = progressBarRef.current;
        const progressContainerRect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - progressContainerRect.left;
        const progressBarWidth = progressContainerRect.width;
        const progressPercentage = (clickX / progressBarWidth) * 100;

        setProgress(progressPercentage);
        setHitQuestion(false)
        setFullStyle({background: "black"})
        const video = videoRef.current;
        const duration = video.duration;
        const currentTime = (progressPercentage / 100) * duration;
        video.currentTime = currentTime;
        setCurrentQuestionTime(currentTime)
    };


    useEffect(() => {
        const video = videoRef.current;
        const handleTimeUpdate = () => {
            const curr = (video.currentTime / video.duration) * 100;
            setProgress(curr);
            setProgressTime(formatTime(video.currentTime))
            if (video.currentTime / video.duration === 1){
                setIsPlaying(!setIsPlaying);
            }

        };

        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    });
    const toggleActivities = () => {
        if (isToggle) {
            setIsToggle(false);
        } else {
            setIsToggle(true);
        }
    }
    return (
        <div className="controls">
           {interactiveMode && <>
        <span className='interactive-mode'> Interactive Mode </span>
        <label className="switch"
        >
            <input onClick={toggleActivities} type="checkbox" defaultChecked />
            <span className="slider round"></span>
        </label>
        </>}
        <button onClick={handlePlayPause}>
            {isPlaying ?
                <i
                    className="fa fa-pause play-pause-icon"
                ></i> :
                <i
                    className="fa fa-play play-pause-icon"
                >  </i>
            }
        </button>
        <VolumeControl videoRef={videoRef} interactiveMode= {interactiveMode} />

        <div className="timeline"
            ref={progressBarRef}
            onClick={handleProgressBarClick}
        >
            <div className="bar">
                <div className="inner" style={{ width: `${progress}%` }}></div>
                {isToggle ?
                    <div className="question-indicators">{renderQuestionIndicators()}</div> : ""}
            </div>
        </div>
        <div className='progress-time'>
            {progressTime} / {totalDuration}
        </div>
    </div>
        
    )
}

export default TimeLine;