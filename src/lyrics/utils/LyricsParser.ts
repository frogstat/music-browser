import type {LyricRow} from "./types.ts";

const LYRICS_REGEX = /\[(\d{2}):(\d{2}\.\d{2})](.+)?/

function parseRow(row: string): LyricRow {
    const match = row.match(LYRICS_REGEX);
    if (!match) {
        throw Error(`Unrecognized row: ${row}`);
    }
    const minutes = Number(match[1])
    const seconds = Number(match[2])
    const time = minutes * 60 + seconds;
    const text = match[3] ?? ""

    return {
        timestamp: time,
        text: text.trim()
    }
}

export function parseLyrics(lyricsString:string): LyricRow[] {
    const lyrics: LyricRow[] = []

    for (let i = 0; i < 10; i++) {
        lyrics.push({
            timestamp: 0,
            text: ""
        });
    }

    for (const row of lyricsString.split("\n")) {
        try{
            const lyricsRow: LyricRow = parseRow(row)
            lyrics.push(lyricsRow)
        } catch(_) {}
    }

    for (let i = 0; i < 10; i++) {
        lyrics.push({
            timestamp: 9999,
            text: ""
        });
    }
    return lyrics;
}