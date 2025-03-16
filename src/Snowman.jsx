import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { usePointsStore } from './Snowstorm';

const generateRandomSnowmanPosition = camera => {
  const minDepth = 5;
  const maxDepth = 15;
  const depth =
    Math.floor(Math.random() * (maxDepth - minDepth + 1)) + minDepth;

  const aspect = camera.aspect;
  const vFOV = (camera.fov * Math.PI) / 180; // Convert FOV to radians
  const height = 2 * Math.tan(vFOV / 2) * depth; // Frustum height at depth
  const width = height * aspect; // Frustum width at depth

  const x = (Math.random() - 0.5) * width; // Random X coordinate
  const y = (Math.random() - 0.5) * height; // Random Y coordinate
  return [x, y, -depth]; // Negative depth for forward in camera space
};

function Snowman(props) {
  const increasePoints = usePointsStore(state => state.increasePoints);
  const decreasePoints = usePointsStore(state => state.decreasePoints);

  const { camera } = useThree();

  const groupRef = React.useRef();

  useFrame((state, delta) => {
    if (groupRef.current.position.z >= 0) {
      const position = generateRandomSnowmanPosition(camera);
      groupRef.current.position.x = position[0];
      groupRef.current.position.y = position[1];
      groupRef.current.position.z = position[2];
      groupRef.current.visible = true;
    } else {
      groupRef.current.position.z += delta;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={event => {
        if (groupRef.current.visible) {
          if (props.evil) {
            increasePoints();
          } else {
            decreasePoints();
          }
          groupRef.current.visible = false;
          event.stopPropagation();
        }
      }}
      scale={[0.25, 0.25, 0.25]}
      position={generateRandomSnowmanPosition(camera)}
    >
      {/* Bottom sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Middle sphere */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={props.evil ? 'red' : '#8ACE00'} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 2.4, 0.5]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.2, 2.4, 0.5]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 2.3, 0.6]}>
        <coneGeometry args={[0.1, 0.3, 32]} />
        <meshStandardMaterial color={props.evil ? 'red' : 'green'} />
      </mesh>
    </group>
  );
}

export default Snowman;
