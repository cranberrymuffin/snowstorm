import Experience from './Experience';
import { Canvas } from '@react-three/fiber';
import './snowstorm.css';
import { create } from 'zustand';

export const usePointsStore = create(set => ({
  points: 0,
  increasePoints: () => set(state => ({ points: state.points + 1 })),
  decreasePoints: () => set(state => ({ points: state.points - 1 })),
}));

function Points() {
  const points = usePointsStore(state => state.points);

  return <div id="snowstorm-info">Points: {points}</div>;
}

export default function Snowstorm() {
  return (
    <div>
      <div id="snowstorm-info">
        Winter Assignment: Destroy all evil (red team) snowmen. Destroying good
        (green team) snowmen results in lost points.
      </div>
      <Points />
      <div id="snowstorm">
        <Canvas>
          <color attach="background" args={['black']} />
          <Experience />
        </Canvas>
      </div>
    </div>
  );
}
