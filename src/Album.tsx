import {useEffect, useMemo, useState} from "react";
import type {AlbumData} from "./useAlbumData.ts";
import type {Track} from "./App.tsx";
import {extractLyrics} from "./lyrics/utils/metaDataExtractor.ts";
import type {LyricRow} from "./lyrics/utils/types.ts";
import {BACKEND_URL} from "./main.tsx";


type AlbumProps = {
    album: AlbumData,
    playTrack: (track: string) => void,
    selectedTrack: Track | null,
    setSelectedTrack: (track: Track) => void,
    setAllLyrics: (allLyrics: LyricRow[][] | null) => void,
    setLyrics: (lyrics: LyricRow[] | null) => void,
}

function Album({album, playTrack, selectedTrack, setSelectedTrack, setAllLyrics, setLyrics}: AlbumProps) {


    const [tracks, setTracks] = useState<string[] | null>(null);
    const albumUrl = useMemo(() => {
        return encodeURIComponent(album.album_name)
    }, [album])

    useEffect(() => {
        fetch(`${BACKEND_URL}/albums/${albumUrl}`)
            .then(res => res.json())
            .then(setTracks);
    }, [album]);


    function selectTrack(track: Track) {
        setAllLyrics(null);
        setLyrics(null);
        setSelectedTrack(track);

        fetch(`${BACKEND_URL}/albums/${albumUrl}/${encodeURIComponent(track.track)}`)
            .then(res => res.blob())
            .then(blob => {
                playTrack(URL.createObjectURL(blob))
                extractLyrics(blob).then((result: LyricRow[][] | null) => {
                    if (!result) return;
                    setAllLyrics(result)
                    setLyrics(result[0])
                })
            })
    }

    return (
        <>
            {tracks && tracks.map((track: string, index: number) =>
                <p onClick={() => selectTrack({
                    track: track,
                    album: album.album_name,
                    artist: album.artist
                })}
                   key={index}
                   className={`track ${selectedTrack && selectedTrack.track === track ? "track-selected" : ""}`}
                >{track}</p>
            )}
        </>
    );


}

export default Album;