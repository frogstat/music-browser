export type AudioSeekerProps = {
    duration: number,
    currentTime: number,
    changeCurrentTime(volume: number): void
}


function AudioSlider({duration, currentTime, changeCurrentTime}: AudioSeekerProps) {

    function parseTime(time: number): string {
        const minutes = String(Math.round(Math.floor(time / 60)));
        const seconds = String(Math.round(time % 60));

        const minutesOut = minutes.length === 2 ? minutes : `0${minutes}`;
        const secondsOut = seconds.length === 2 ? seconds : `0${seconds}`;
        return `${minutesOut}:${secondsOut}`;

    }

    return (
        <div>

            <p>{`${parseTime(currentTime)} / ${parseTime(duration)}`}</p>
            <input className="audio-seeker"
                   onChange={e =>
                       changeCurrentTime(Number(e.target.value))
                   }
                   value={currentTime}
                   min="0"
                   max={duration}
                   step="0.1"
                   type="range"
            />
        </div>
    );

}

export default AudioSlider;