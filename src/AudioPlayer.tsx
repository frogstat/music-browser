import AudioSeeker from "./AudioSeeker.tsx";

type LyricsAudioPlayerProps = {
    duration: number;
    currentTime: number;
    changeCurrentTime(currentTime: number): void;
}

function LyricsAudioPlayer({duration, currentTime, changeCurrentTime}: LyricsAudioPlayerProps) {


    return (
        <div className="audio-player">
            <div className="seeker">
                <AudioSeeker
                    duration={duration}
                    currentTime={currentTime}
                    changeCurrentTime={changeCurrentTime}
                >
                </AudioSeeker>
            </div>

        </div>
    );
}

export default LyricsAudioPlayer;