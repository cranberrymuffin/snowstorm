import Experience from './Experience';
import { Canvas } from '@react-three/fiber';
import './snowstorm.css';
import { create } from 'zustand';
import { useEffect, useRef, useState } from 'react';
import ArcadeControls from './ArcadeControls';
import { Volume2, VolumeX } from 'lucide-react';
import { on as onArcadeInput } from '@rcade/plugin-input-classic';

export const usePointsStore = create(set => ({
  points: 0,
  increasePoints: () => set(state => ({ points: state.points + 1 })),
  decreasePoints: () => set(state => ({ points: state.points - 1 })),
}));

function Points({ isArcade }) {
  const points = usePointsStore(state => state.points);
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.volume = 0.35;
    audio.muted = isArcade ? false : muted;

    const unlockPlayback = () => {
      if (audio.muted) return;

      audio
        .play()
        .then(() => {
          window.removeEventListener('pointerdown', unlockPlayback);
          window.removeEventListener('keydown', unlockPlayback);
          removeArcadeInputListener();
        })
        .catch(() => {});
    };

    const removeArcadeInputListener = onArcadeInput('press', unlockPlayback);

    if (isArcade) unlockPlayback();
    window.addEventListener('pointerdown', unlockPlayback);
    window.addEventListener('keydown', unlockPlayback);

    return () => {
      window.removeEventListener('pointerdown', unlockPlayback);
      window.removeEventListener('keydown', unlockPlayback);
      removeArcadeInputListener();
      audio.pause();
    };
  }, [isArcade]);

  const toggleMuted = event => {
    event.preventDefault();
    event.stopPropagation();

    const nextMuted = !muted;
    setMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted) audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div id="snowstorm-points">
      <span>Points: {points}</span>
      {!isArcade && (
        <button
          type="button"
          className="snowstorm-audio-toggle"
          aria-label={muted ? 'Unmute music' : 'Mute music'}
          aria-pressed={muted}
          title={muted ? 'Unmute music' : 'Mute music'}
          onClick={toggleMuted}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}${encodeURIComponent('8-Bit Carol of The Bells GamersCast.mp3')}`}
        loop
        preload="auto"
      />
    </div>
  );
}

export default function Snowstorm() {
  const aimRef = useRef(null);
  const [isArcade, setIsArcade] = useState(false);

  return (
    <div>
      <div id="snowstorm-banner" aria-label="Winter assignment">
        <div className="snowstorm-banner-track">
          <span>
            Winter Assignment: Destroy all{' '}
            <span className="team-red">evil</span> snowmen. Destroying{' '}
            <span className="team-green">good</span> snowmen results in lost
            points.
          </span>
          <span aria-hidden="true">
            Winter Assignment: Destroy all{' '}
            <span className="team-red">evil</span> snowmen. Destroying{' '}
            <span className="team-green">good</span> snowmen results in lost
            points.
          </span>
        </div>
      </div>
      <Points isArcade={isArcade} />
      <div id="snowstorm">
        <Canvas>
          <color attach="background" args={['black']} />
          <Experience />
          <ArcadeControls
            aimRef={aimRef}
            isArcade={isArcade}
            onArcadeConnected={setIsArcade}
          />
        </Canvas>
      </div>
      <div ref={aimRef} className="snowstorm-aim" aria-hidden="true" />
    </div>
  );
}
