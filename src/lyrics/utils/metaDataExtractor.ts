import {type ITag, parseBlob} from "music-metadata";
import {parseLyrics} from "./LyricsParser.ts";
import type {LyricRow} from "./types.ts";

const LYRICS_LANGUAGE_REGEX = /lyrics_\w{2}/

function extractAllLyricsTags(nativeTags: ITag[]): LyricRow[][] {
    return nativeTags
        .filter(tag => {
            const id = tag.id.toLowerCase();
            if (id.toLowerCase() == ("lyrics")){
                return true;
            } else if (LYRICS_LANGUAGE_REGEX.test(id)){
                return true;
            }
            return false;
        })
        .map(tag => parseLyrics(tag.value as string));
}

export async function extractLyrics(file: Blob) {
    const metadata = await parseBlob(file)
    const nativeTags: ITag[] = Object.values(metadata.native).flat();
    const lyrics = extractAllLyricsTags(nativeTags);
    if (!lyrics || !lyrics.length) {
        return null;
    }
    return lyrics;
}

