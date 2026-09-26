import Experience from './Experience';
import { Canvas } from '@react-three/fiber';
import './snowstorm.css';
import { create } from 'zustand';
import { useRef } from 'react';
import ArcadeControls from './ArcadeControls';

export const usePointsStore = create(set => ({
  points: 0,
  increasePoints: () => set(state => ({ points: state.points + 1 })),
  decreasePoints: () => set(state => ({ points: state.points - 1 })),
}));

function Points() {
  const points = usePointsStore(state => state.points);

  return <div id="snowstorm-points">Points: {points}</div>;
}

export default function Snowstorm() {
  const aimRef = useRef(null);

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
      <Points />
      <div id="snowstorm">
        <Canvas>
          <color attach="background" args={['black']} />
          <Experience />
          <ArcadeControls aimRef={aimRef} />
        </Canvas>
      </div>
      <div ref={aimRef} className="snowstorm-aim" aria-hidden="true" />
    </div>
  );
}
