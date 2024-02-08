import VideoPlayer from './VideoPlayer';
import FooterActivities from './FooterActivities';
import TimeLine from './Timeline';
import { useRef, useState } from "react";
function App() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className='interactive-video'>
          <div className='upper-content'>

          </div>
          <VideoPlayer
            videoRef={videoRef}
            isPlaying={isPlaying} setIsPlaying={setIsPlaying}
          />
          <TimeLine videoRef={videoRef}
            isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
          <FooterActivities />
    </div>

  );
}
export default App;
