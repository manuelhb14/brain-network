import React, { useState, useEffect } from "react";

const useAudio = () => {
    const [audio] = useState(new Audio("/music.mp3",));
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [playing]
    );

    useEffect(() => {
        setPlaying(true);
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle];
};

const Player = () => {
    const [playing, toggle] = useAudio();

    return (
        <div>
            <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
        </div>
    );
};

export default Player;