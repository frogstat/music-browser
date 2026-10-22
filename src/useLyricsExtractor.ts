import {useState} from "react";
import type {LyricRow} from "./lyrics/utils/types.ts";


export function useLyricsExtractor(){
    const [allLyrics, setAllLyrics] = useState<LyricRow[][] | null>(null);
    const [lyrics, setLyrics] = useState<LyricRow[] | null>(null);
    const [lyricsModeOn, setLyricsModeOn] = useState<boolean | null>(false);

    return {
        allLyrics,
        setAllLyrics,
        lyrics,
        setLyrics,
        lyricsModeOn,
        setLyricsModeOn
    };
}