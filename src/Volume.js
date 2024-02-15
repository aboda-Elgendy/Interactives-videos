import React, { useState } from 'react';

const VolumeControl = ({ videoRef ,interactiveMode }) => {

    const [isVolumeBarVisible_, setVolumeBarVisible_] = useState(false);
    const [volume_, setVolume_] = useState(100);
    const [isMuted, setIsmuted] = useState(0);
    const style = {left: "23px"}
    const handleVolumeIconHover = () => {
        setVolumeBarVisible_(true);
    };

    const handleVolumeControlLeave = () => {
        setVolumeBarVisible_(false);
    };

    const handleVolumeChange = (event) => {
        const volumeLevel = event.target.value;
        console.log(volumeLevel);
        videoRef.current.volume = volumeLevel;
        setVolume_(volumeLevel);
    };

    const muteVolume = (event) => {
        if (isMuted) {
            setIsmuted(0);
            videoRef.current.volume = .2;
            setVolume_(.2);
        } else {
            setIsmuted(1);
            videoRef.current.volume = 0;
            setVolume_(0);
        }
    }

    return (
        <div className="volume-control" onMouseLeave={handleVolumeControlLeave}>
            <div
                className=""
                onMouseEnter={handleVolumeIconHover}
            >
                <button
                    onClick={muteVolume}>
                    {
                        (isMuted && !volume_) ? <i className="fa-solid fa-volume-xmark volume-icon"

                        ></i> : <i
                            className="fa-solid fa-volume-high volume-icon"></i>
                    }
                </button>
            </div>
            {isVolumeBarVisible_ && (
                <div  style = {interactiveMode?{}:style} className="volume-bar">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume_}
                        className="volume-slider"
                        onChange={handleVolumeChange}
                    />
                </div>
            )}
        </div>
    );
};

export default VolumeControl;