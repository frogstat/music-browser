import './App.css'
import Album from "./Album.tsx";
import {useAudioPlayer} from "./useAudioPlayer.ts";
import AudioPlayer from "./AudioPlayer.tsx";
import {type AlbumData, useAlbumData} from "./useAlbumData.ts";
import {useEffect, useState} from "react";
import LyricsPlayer from "./lyrics/LyricsPlayer.tsx";
import {useLyricsExtractor} from "./useLyricsExtractor.ts";

export type Track = {
    track: string,
    album: string,
    artist: string
}

function App() {

    const {
        currentTime,
        changeCurrentTime,
        duration,
        playTrack
    } = useAudioPlayer();

    const {
        albums,
        selectedAlbum,
        handleAlbumClick,
        getCoverUrl
    } = useAlbumData();

    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    useEffect(() => {
        setLyricsModeOn(false);
    }, [selectedTrack]);

    const {
        allLyrics,
        setAllLyrics,
        lyrics,
        setLyrics,
        lyricsModeOn,
        setLyricsModeOn
    } = useLyricsExtractor();


    function getMetadata() {
        if (!selectedTrack) {
            return (
                <div className="metadata empty">
                    <p>Metadata will appear here</p>
                </div>
            );
        }
        const track = formatTrackName(selectedTrack.track)
        const artist = selectedTrack.artist;
        const album = selectedTrack.album

        return (
            <div className="metadata">
                <p>{track}</p>
                <p>{album}</p>
                <p>{artist}</p>
                {lyrics && <p
                    onClick={() => setLyricsModeOn(true)}
                    className={"lyrics-on-button"}
                >Show Lyrics</p>}
            </div>
        );
    }

    function formatTrackName(track: string) {
        if (!track) {
            return track;
        }

        if (track.includes(".") && !track.startsWith(".")) {
            track = track.substring(0, track.lastIndexOf("."));
        }
        return track.replace(/^[\d_.\W]+/, "");

    }

    return (
        <>
            <main className="app">
                <div className={`left-side ${selectedAlbum ? "" : "hidden"}`}>
                    <div className="tracks">
                        {selectedAlbum &&
                            <Album
                                album={selectedAlbum}
                                playTrack={playTrack}
                                selectedTrack={selectedTrack}
                                setSelectedTrack={setSelectedTrack}
                                setAllLyrics={setAllLyrics}
                                setLyrics={setLyrics}
                            />
                        }
                    </div>
                    {getMetadata()}
                    <AudioPlayer
                        duration={duration}
                        currentTime={currentTime}
                        changeCurrentTime={changeCurrentTime}
                    />
                </div>
                <div className="albums-container">
                    {albums &&
                        albums
                            .sort((a, b) =>
                                a.artist.localeCompare(b.artist) ||
                                a.album_name.localeCompare(b.album_name)
                            )
                            .map((album: AlbumData, index: number) =>
                                <div onClick={() => handleAlbumClick(album)}
                                     className={`album-container ${selectedAlbum === album ? 'album-container-selected' : ''}`}
                                     key={index}>
                                    <div className="cover-image-container">
                                        <img src={getCoverUrl(album.album_name)} alt="album"/>
                                    </div>
                                    <p>{album.album_name}</p>

                                </div>
                            )}
                </div>
            </main>
            {lyricsModeOn && allLyrics && lyrics &&
                <LyricsPlayer
                    currentTime={currentTime}
                    changeCurrentTime={changeCurrentTime}
                    duration={duration}
                    allLyrics={allLyrics}
                    lyrics={lyrics}
                    setLyrics={setLyrics}
                    metadata={{
                        title: formatTrackName(selectedTrack?.track ?? ""),
                        artist: selectedTrack?.artist ?? "",
                        album: selectedTrack?.album ?? "",
                        cover: getCoverUrl(selectedTrack?.album ?? "")
                    }}
                    disableLyricsOverlay={() => setLyricsModeOn(false)}
                />
            }
        </>
    )
}

export default App
