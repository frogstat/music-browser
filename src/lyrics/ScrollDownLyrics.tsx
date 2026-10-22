import type {LyricRow} from "../../../froggy-lyrics/src/utils/types.ts";
import type {Ref} from "react";

type ScrollDownLyricsProps = {
    lyrics: LyricRow[] | null,
    changeCurrentTime: (timestamp: number) => void,
    activeIndex: number,
    currentLyricsRef: Ref<HTMLSpanElement>,
}

function ScrollDownLyrics({lyrics, changeCurrentTime, activeIndex, currentLyricsRef}: ScrollDownLyricsProps) {

    function resolveRowPosition(index: number):string {
        if (index === activeIndex) {
            return "lyrics-row-active"
        } else if (Math.abs(index - activeIndex) === 1) {
            return "lyrics-row-one-apart"
        } else if (Math.abs(index - activeIndex) === 2) {
            return "lyrics-row-two-apart"
        } else if (Math.abs(index - activeIndex) === 3) {
            return "lyrics-row-three-apart"
        }
        return "lyrics-row-inactive"
    }

    return (
        <div className="lyrics-container">
            {lyrics && lyrics.map((lyric, index) => (
                <span
                    key={index}
                    onClick={() => {
                        changeCurrentTime(lyric.timestamp)
                    }}
                    ref={index === activeIndex ? currentLyricsRef : undefined}
                    className={`lyrics-row ${resolveRowPosition(index)} ${!lyric.text && "lyrics-row-empty"}`}>
                        {lyric.text.length ? lyric.text : ""}
                    </span>
            ))}
            {!lyrics && <p>No lyrics loaded</p>}
        </div>
    )

}

export default ScrollDownLyrics;