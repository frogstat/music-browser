import {useEffect, useState} from "react";
import {BACKEND_URL} from "./main.tsx";



export type AlbumData = {
    album_name: string;
    artist: string;
}

export function useAlbumData() {

    const [albums, setAlbums] = useState<AlbumData[] | null>(null)
    const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null)


    useEffect(() => {
        fetch(`${BACKEND_URL}/manifest.json`)
            .then(res => res.json())
            .then(setAlbums)
    }, []);

    function handleAlbumClick(album: AlbumData) {
        if (selectedAlbum && selectedAlbum.album_name === album.album_name) {
            setSelectedAlbum(null)
        } else {
            setSelectedAlbum(album)
        }
    }

    function getCoverUrl(album: string) {
        if (!album) {
            return "";
        }
        return `${BACKEND_URL}/covers/${encodeURIComponent(album)}`
    }


    return {
        albums,
        selectedAlbum,
        handleAlbumClick,
        getCoverUrl
    }
}
