import { useFrame, useThree } from '@react-three/fiber';
import { PLAYER_1, STATUS } from '@rcade/plugin-input-classic';
import { useEffect, useRef } from 'react';
import { Vector2 } from 'three';

export default function ArcadeControls({ aimRef }) {
  const { camera, raycaster, scene } = useThree();
  const aim = useRef(new Vector2());
  const wasFiring = useRef(false);
  const isBrowser = window.parent === window;

  useEffect(() => {
    if (!isBrowser) return undefined;

    const trackPointer = event => {
      aim.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      aim.current.y = 1 - (event.clientY / window.innerHeight) * 2;
    };

    window.addEventListener('pointermove', trackPointer);
    return () => window.removeEventListener('pointermove', trackPointer);
  }, [isBrowser]);

  useFrame((_, delta) => {
    const step = delta * 1.2;
    const dpad = PLAYER_1.DPAD;
    if (!isBrowser) {
      aim.current.x = Math.max(
        -1,
        Math.min(1, aim.current.x + (dpad.right - dpad.left) * step),
      );
      aim.current.y = Math.max(
        -1,
        Math.min(1, aim.current.y + (dpad.up - dpad.down) * step),
      );
    }

    if (aimRef.current) {
      aimRef.current.style.display =
        isBrowser || STATUS.connected ? 'block' : 'none';
      aimRef.current.style.left = `${((aim.current.x + 1) / 2) * 100}%`;
      aimRef.current.style.top = `${((1 - aim.current.y) / 2) * 100}%`;
    }

    raycaster.setFromCamera(aim.current, camera);
    if (PLAYER_1.A && !wasFiring.current) {
      for (const intersection of raycaster.intersectObjects(
        scene.children,
        true,
      )) {
        let target = intersection.object;
        while (target && typeof target.userData.onHit !== 'function') {
          target = target.parent;
        }
        if (target) {
          target.userData.onHit();
          break;
        }
      }
    }
    wasFiring.current = PLAYER_1.A;
  });

  return null;
}
