import os
from pathlib import Path
from mutagen import File
from flask import Flask, send_from_directory, send_file, abort
from flask_cors import CORS
from io import BytesIO
from sys import argv, exit

FILES_DIR = None
ALBUMS = {}
BACKEND_DIR = Path(__file__).parent

app = Flask(__name__)
CORS(app)


@app.get("/albums/<path:album_name>/<path:track_name>")
def get_track(album_name: str, track_name: str):
    if album_name not in ALBUMS:
        abort(404, description="Could not find album")
    album_path = ALBUMS[album_name]["album_path"]
    track_path = f"{album_path}/{track_name}"
    if not os.path.isfile(track_path):
        abort(404, description="Could not find track")
    return send_from_directory(album_path, track_name)


@app.get("/albums/<path:album_name>")
def get_files(album_name):
    if album_name not in ALBUMS:
        abort(404, description="Could not find album")
    return list_files(ALBUMS[album_name]["album_path"])


@app.get("/manifest.json")
def get_albums():
    albums_to_return = []
    for album_name in ALBUMS.keys():
        albums_to_return.append({
            "album_name": album_name,
            "artist": ALBUMS[album_name].get("artist_name"),
        })
    return albums_to_return


@app.get("/covers/<path:album_name>")
def get_thumbnail(album_name):
    if album_name not in ALBUMS:
        abort(404, description="Could not find album")
    album_path = ALBUMS[album_name]["album_path"]

    cache_dir = f"{BACKEND_DIR}/cache/{album_path}"
    if os.path.isfile(f"{cache_dir}/cover.jpg"):
        return send_from_directory(cache_dir, "cover.jpg")

    if not os.path.isfile(f"{album_path}/cover.jpg"):
        result = extract_cover_from_file(album_path)
        if not result:
            abort(404, description="Could not find cover")
        cover_data, mime = result
        if mime == "image/jpeg":
            Path(cache_dir).mkdir(parents=True, exist_ok=True)
            with open(f"{BACKEND_DIR}/cache/{album_path}/cover.jpg", "wb") as f:
                f.write(cover_data)

        return send_file(
            BytesIO(cover_data),
            mimetype=mime,
            download_name="cover"
        )
    return send_from_directory(album_path, "cover.jpg")


def extract_cover_from_file(album_path):
    try:
        tracks = list_files(album_path)
        if len(tracks) == 0:
            return None
        audio = File(f"{album_path}/{sorted(tracks)[0]}")

        if hasattr(audio, "pictures") and audio.pictures:
            return [audio.pictures[0].data, audio.pictures[0].mime]
        elif "metadata_block_picture" in audio.tags:
            import base64
            from mutagen.flac import Picture

            picture = Picture(
                base64.b64decode(audio.tags["metadata_block_picture"][0])
            )
            return [picture.data, picture.mime]

        return None
    except Exception:
        return None


def list_files(path: str):
    return sorted([f for f in os.listdir(path) if is_music_file(f)])


def is_music_file(file) -> bool:
    return file.endswith(".flac") or file.endswith(".opus")


def resolve_artist_name(artist_path):
    artist_name = artist_path[artist_path.rfind("/") + 1:]
    if artist_name in ("_Downloaded", "Music"):
        return "Unknown"
    return artist_name


def main():
    for root, dirs, files in os.walk(FILES_DIR):
        for directory in dirs:
            album_path = str(Path(root) / directory)
            artist_path = str((Path(root) / directory).parent)
            artist_name = resolve_artist_name(artist_path)

            tracks = list_files(album_path)
            if len(tracks) > 0:
                album_name = album_path[album_path.rfind("/") + 1:]
                ALBUMS[album_name] = {
                    "album_path": album_path,
                    "artist_name": artist_name
                }


if __name__ == "__main__":
    if len(argv) < 2:
        print("Please provide a directory to scan")
        exit(1)
    if not os.path.isdir(argv[1]):
        print(f"{argv[1]} is not a valid directory")
        exit(1)
    FILES_DIR = Path(argv[1]).resolve()
    main()
app.run(host="0.0.0.0", port=8000)
