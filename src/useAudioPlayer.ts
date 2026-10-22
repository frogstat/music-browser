import {useEffect, useRef, useState} from "react";

export function useAudioPlayer() {
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (audioPlayerRef.current) {
                setCurrentTime(audioPlayerRef.current.currentTime);
            }
        }, 50);

        return () => clearInterval(timer)
    }, []);


    function changeCurrentTime(newTime: number) {
        if (!audioPlayerRef.current || newTime > audioPlayerRef.current.duration) {
            return;
        }
        audioPlayerRef.current.currentTime = newTime;
        if (audioPlayerRef.current.paused) {
            audioPlayerRef.current.play();
        }
    }

    function playTrack(trackUrl: string) {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
        }

        const audio = new Audio(trackUrl);
        audioPlayerRef.current = audio;

        audio.play().then(() => setDuration(audio.duration));
    }

    return {
        currentTime,
        changeCurrentTime,
        duration,
        playTrack
    }
}