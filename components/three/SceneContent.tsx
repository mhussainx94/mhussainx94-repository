"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollProgress } from "@/lib/sceneStore";
import type { PerformanceConfig } from "@/types";

interface SceneContentProps {
  config: PerformanceConfig;
  reducedMotion: boolean;
}

function ParticleField({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      // A slow, near-imperceptible drift — "ambient", not "active".
      pointsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#5fd98a" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function GridFloor() {
  const ref = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    const helper = ref.current;
    if (!helper) return;
    const material = Array.isArray(helper.material) ? helper.material[0] : helper.material;
    material.transparent = true;
    material.opacity = 0.16;
  }, []);

  // THREE.GridHelper's constructor is (size, divisions, colorCenterLine,
  // colorGrid) — it deliberately renders the two lines through the
  // origin brighter than the rest of the grid by default. Seen through
  // the camera, that pair of center lines read as a single vertical
  // line down the middle of the whole page (the grid is a persistent
  // full-viewport background). Using the same color for both params
  // removes that distinction without removing the grid itself.
  return <gridHelper ref={ref} args={[44, 36, "#1a1f1b", "#181d1a"]} position={[0, -3.4, 0]} />;
}

interface NodeDatum {
  position: [number, number, number];
  speed: number;
  offset: number;
}

function NetworkNodes({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo<NodeDatum[]>(
    () =>
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6 - 3,
        ],
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
      })),
    [count]
  );

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const n = nodes[i];
      if (!n) return;
      child.position.y = n.position[1] + Math.sin(clock.elapsedTime * n.speed + n.offset) * 0.4;
      child.rotation.x = clock.elapsedTime * 0.1 + n.offset;
      child.rotation.y = clock.elapsedTime * 0.08 + n.offset;
    });
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.position}>
          <icosahedronGeometry args={[0.28, 0]} />
          <meshBasicMaterial color="#5ac8d8" wireframe transparent opacity={0.32} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ enabled }: { enabled: boolean }) {
  useFrame(({ camera }) => {
    if (!enabled) return;
    const p = scrollProgress.value;
    camera.position.x = Math.sin(p * Math.PI * 2) * 0.55;
    camera.position.y = 1.1 - p * 1.3;
    camera.lookAt(0, -0.4, 0);
  });
  return null;
}

/**
 * Mounted once by SceneCanvas and never unmounted while the page is
 * open — sections transition by changing this content's parameters
 * (via the tier config and the scroll-driven camera), not by
 * destroying and recreating the Three.js scene.
 */
export function SceneContent({ config, reducedMotion }: SceneContentProps) {
  return (
    <>
      <ParticleField key={`particles-${config.particleCount}`} count={config.particleCount} />
      {config.showGrid && <GridFloor />}
      <NetworkNodes key={`nodes-${config.nodeCount}`} count={config.nodeCount} />
      <CameraRig enabled={config.cameraDrift && !reducedMotion} />
    </>
  );
}
