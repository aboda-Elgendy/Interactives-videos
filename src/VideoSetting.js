import React, { useState } from "react";

const VideoSetting = ({ videoRef }) => {
    const [resolution, setResolution] = useState('720p');
    const [speed, setSpeed] = useState(1);
    const [showSettings, setShowSettings] = useState(false);


    const handleResolutionChange = (e) => {
        const selectedResolution = e.target.value;
        setResolution(selectedResolution);
    };

    const handleSpeedChange = (e) => {
        const selectedSpeed = parseFloat(e.target.value);
        setSpeed(selectedSpeed);
        videoRef.current.playbackRate = selectedSpeed;
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    return (
    <div>
        <button onClick={toggleSettings}><i className="fa fa-cog" aria-hidden="true"></i></button>
        {showSettings && (
            <div className="settings-window">
                <label>
                    Resolution:
                    <select value={resolution} onChange={handleResolutionChange}>
                        <option value="360p">360p</option>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                        {/* Add more resolution options as needed */}
                    </select>
                </label>
                <label>
                    Speed:
                    <select value={speed} onChange={handleSpeedChange}>
                        <option value="0.5">0.5x</option>
                        <option value="1">1x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                        {/* Add more speed options as needed */}
                    </select>
                </label>
            </div>
        )}
    </div>


    )
};

export default VideoSetting;