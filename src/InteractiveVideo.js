import React from 'react';
const InteractiveVideo = ({videoRef , isPlaying , setIsPlaying}) => {


    const handlePlayPause = () => {
        const video = videoRef.current;
        setIsPlaying(!isPlaying);

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    };

    return (
        <div onClick={handlePlayPause}className="container">
            <video ref={videoRef}  src="https://cf.nearpod.com/neareducation/new/interactive-video/d1366796-c71f-4245-8a84-1b6e13211f77/medium.mp4?AWSAccessKeyId=AKIA5LQSO4AXLNJOYW5K&Expires=2147483646&Signature=v8ciuYGx0bGApGVW4%2F4I%2BOGW2zk%3D" id="video"></video>

        </div>
    );
};

export default InteractiveVideo;