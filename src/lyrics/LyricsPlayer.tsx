import {useLyricsPlayer} from "./hooks/useLyricsPlayer.ts";
import ScrollDownLyrics from "./ScrollDownLyrics.tsx";

import LyricsAudioPlayer from "./audio/LyricsAudioPlayer.tsx";
import type {LyricRow, Metadata} from "./utils/types.ts";
import {useMemo} from "react";

type LyricsPlayerProps = {
    currentTime: number;
    changeCurrentTime: (time: number) => void;
    duration: number;
    allLyrics: LyricRow[][],
    lyrics: LyricRow[],
    setLyrics: (lyrics: LyricRow[]) => void,
    metadata: Metadata,
    disableLyricsOverlay: () => void,
}

function LyricsPlayer({
                          currentTime,
                          changeCurrentTime,
                          duration,
                          allLyrics,
                          lyrics,
                          setLyrics,
                          metadata,
                          disableLyricsOverlay
                      }: LyricsPlayerProps) {


    const {
        activeIndex,
        currentLyricsRef,
        switchLyrics,
        numberOfLanguages
    } = useLyricsPlayer(currentTime, allLyrics, lyrics, setLyrics)

    const lyricsStyle = useMemo(() => {
        if (!metadata) {
            return {}
        }

        return {
            background: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url(${metadata.cover}) center / cover no-repeat`
        }

    },[metadata])


    return (
        <div className="lyrics-player-overlay" onClick={disableLyricsOverlay}>
            <div className="lyrics-player-panel" style={lyricsStyle} onClick={e => e.stopPropagation()}>
                <div className="lyrics-player">
                    {numberOfLanguages > 1 &&
                        <button
                            onClick={switchLyrics}
                            className="language-toggle-button">
                            Switch Language
                        </button>
                    }
                    <ScrollDownLyrics
                        lyrics={lyrics}
                        changeCurrentTime={changeCurrentTime}
                        activeIndex={activeIndex}
                        currentLyricsRef={currentLyricsRef}>
                    </ScrollDownLyrics>
                    <LyricsAudioPlayer
                        metadata={metadata}
                        duration={duration}
                        currentTime={currentTime}
                        changeCurrentTime={changeCurrentTime}
                    />
                </div>
            </div>
        </div>
    )

}

export default LyricsPlayer;