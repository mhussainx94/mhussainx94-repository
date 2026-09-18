"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SceneContent } from "./SceneContent";
import { Fallback2D } from "./Fallback2D";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isWebGLAvailable } from "@/lib/performance";

/**
 * The single Canvas for the whole site — mounted once here at the page
 * root and never recreated as sections scroll past. It sits fixed
 * behind the content at a low opacity so section panels (solid
 * backgrounds) stay fully readable; the 3D layer only shows through
 * the hero and the gaps around content.
 */
export function SceneCanvas() {
  const [webglReady, setWebglReady] = useState(false);
  const { config } = usePerformanceTier();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setWebglReady(isWebGLAvailable());
  }, []);

  if (!webglReady) return <Fallback2D />;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-70" aria-hidden="true">
      <Canvas
        dpr={config.dpr}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.1, 6], fov: 45 }}
      >
        <Suspense fallback={null}>
          <SceneContent config={config} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
