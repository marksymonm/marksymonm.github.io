import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const ABOUT_VISUAL_LABELS = [
  "THINGS I LIKE"
];

// Solid mesh + slightly-scaled wireframe overlay = the "raw blueprint" edge
// look, without needing drei's <Edges> helper or any extra dependency.
function Solid({
  geometry,
  color = "#ff2b00",
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}: {
  geometry: THREE.BufferGeometry;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#141414" roughness={0.85} metalness={0.1} />
      </mesh>
      <mesh geometry={geometry} scale={1.015}>
        <meshBasicMaterial color={color} wireframe />
      </mesh>
    </group>
  );
}

function Camera3D() {
  const body = new THREE.BoxGeometry(1.5, 1, 0.7);
  const lens = new THREE.CylinderGeometry(0.38, 0.38, 0.55, 20);
  const flash = new THREE.BoxGeometry(0.4, 0.25, 0.3);
  return (
    <>
      <Solid geometry={body} />
      <Solid geometry={lens} position={[0, -0.05, 0.55]} rotation={[Math.PI / 2, 0, 0]} />
      <Solid geometry={flash} position={[-0.4, 0.62, -0.1]} />
    </>
  );
}

function Clapperboard3D() {
  const base = new THREE.BoxGeometry(1.5, 1.1, 0.1);
  const flap = new THREE.BoxGeometry(1.5, 0.32, 0.1);
  return (
    <>
      <Solid geometry={base} position={[0, -0.1, 0]} />
      <Solid geometry={flap} position={[0, 0.58, 0.02]} rotation={[0, 0, -0.35]} />
    </>
  );
}

function CodePlate3D() {
  const backing = new THREE.BoxGeometry(1.6, 1.6, 0.08);
  const grid = new THREE.PlaneGeometry(1.5, 1.5, 6, 6);
  const arm = new THREE.BoxGeometry(0.09, 0.5, 0.09);
  const slash = new THREE.BoxGeometry(0.09, 0.85, 0.09);

  return (
    <>
      <Solid geometry={backing} />
      <mesh geometry={grid} position={[0, 0, 0.05]}>
        <meshBasicMaterial color="#ff2b00" wireframe />
      </mesh>

      {/* "<" — two arms meeting at a vertex */}
      <Solid geometry={arm} position={[-0.575, 0.175, 0.15]} rotation={[0, 0, Math.PI / 4]} />
      <Solid geometry={arm} position={[-0.575, -0.175, 0.15]} rotation={[0, 0, (3 * Math.PI) / 4]} />

      {/* "/" */}
      <Solid geometry={slash} position={[0, 0, 0.15]} rotation={[0, 0, Math.PI / 8]} />

      {/* ">" — mirrored */}
      <Solid geometry={arm} position={[0.575, 0.175, 0.15]} rotation={[0, 0, -Math.PI / 4]} />
      <Solid geometry={arm} position={[0.575, -0.175, 0.15]} rotation={[0, 0, -(3 * Math.PI) / 4]} />
    </>
  );
}

function Mountain3D() {
  const backPeak = new THREE.ConeGeometry(0.55, 1.1, 4);
  const frontPeakA = new THREE.ConeGeometry(0.45, 0.85, 4);
  const frontPeakB = new THREE.ConeGeometry(0.5, 0.95, 4);
  const sun = new THREE.SphereGeometry(0.22, 16, 16);
  const flag = new THREE.ConeGeometry(0.1, 0.18, 3);
  const pole = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);

  return (
    <group rotation={[0, 0, 0]}>
      {/* sun tucked behind the range */}
      <Solid geometry={sun} position={[0.35, 0.55, -0.6]} />

      {/* back peak, offset and rotated 45° so a flat face reads as the "front" */}
      <Solid geometry={backPeak} position={[-0.15, -0.05, -0.35]} rotation={[0, Math.PI / 4, 0]} />

      {/* two foreground peaks */}
      <Solid geometry={frontPeakA} position={[-0.55, -0.28, 0.15]} rotation={[0, Math.PI / 4, 0]} />
      <Solid geometry={frontPeakB} position={[0.35, -0.22, 0.2]} rotation={[0, Math.PI / 4, 0]} />

      {/* small summit flag on the tallest peak */}
      <Solid geometry={pole} position={[0.35, 0.38, 0.2]} />
      <Solid geometry={flag} position={[0.42, 0.48, 0.2]} rotation={[0, 0, -Math.PI / 2]} />
    </group>
  );
}

function Party3D() {
  const hat = new THREE.ConeGeometry(0.5, 1, 24);
  const brim = new THREE.TorusGeometry(0.5, 0.05, 8, 24);
  const pom = new THREE.SphereGeometry(0.14, 16, 16);
  const confetti = new THREE.BoxGeometry(0.12, 0.12, 0.03);

  const confettiPositions: [number, number, number][] = [
    [-0.85, 0.5, 0.3],
    [0.9, 0.35, -0.2],
    [-0.6, -0.65, 0.5],
    [0.75, -0.55, 0.1],
    [0.1, 0.85, -0.4],
    [-0.2, -0.9, -0.3],
  ];

  return (
    <group>
      {/* cone party hat */}
      <Solid geometry={hat} position={[0, 0.1, 0]} />
      <Solid geometry={brim} position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Solid geometry={pom} position={[0, 0.63, 0]} />

      {/* scattered confetti squares, each at its own tumble angle */}
      {confettiPositions.map((pos, i) => (
        <Solid
          key={i}
          geometry={confetti}
          position={pos}
          rotation={[i * 0.7, i * 1.1, i * 0.5]}
        />
      ))}
    </group>
  );
}

function FilmReel3D() {
  const rim = new THREE.TorusGeometry(0.6, 0.09, 12, 32);
  const hub = new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16);
  const hole = new THREE.CylinderGeometry(0.13, 0.13, 0.1, 12);
  const spoke = new THREE.BoxGeometry(0.85, 0.06, 0.06);

  // six sprocket holes arranged evenly around the reel
  const holePositions: [number, number, number][] = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const r = 0.38;
    return [Math.cos(angle) * r, Math.sin(angle) * r, 0];
  });

  return (
    <group rotation={[0, 0.5, 0]}>
      <Solid geometry={rim} rotation={[Math.PI / 2, 0, 0]} />
      <Solid geometry={hub} rotation={[Math.PI / 2, 0, 0]} />

      {holePositions.map((pos, i) => (
        <Solid key={i} geometry={hole} position={pos} rotation={[Math.PI / 2, 0, 0]} />
      ))}

      {/* two crossbars behind the reel for a bit of structure */}
      <Solid geometry={spoke} position={[0, 0, -0.06]} rotation={[0, 0, Math.PI / 6]} />
      <Solid geometry={spoke} position={[0, 0, -0.06]} rotation={[0, 0, -Math.PI / 6]} />
    </group>
  );
}

function Travel3D() {
  const globe = new THREE.SphereGeometry(0.65, 20, 20);
  const pinHead = new THREE.SphereGeometry(0.16, 16, 16);
  const pinPoint = new THREE.ConeGeometry(0.16, 0.28, 16);
  const plane = new THREE.ConeGeometry(0.12, 0.5, 8);
  const wing = new THREE.BoxGeometry(0.4, 0.04, 0.14);

  return (
    <group>
      {/* globe, wireframe overlay from Solid already reads as latitude/longitude lines */}
      <Solid geometry={globe} />

      {/* location pin planted on the globe's surface */}
      <group position={[0.35, 0.5, 0.35]} rotation={[0, 0, -Math.PI / 5]}>
        <Solid geometry={pinPoint} position={[0, -0.14, 0]} rotation={[Math.PI, 0, 0]} />
        <Solid geometry={pinHead} position={[0, 0.08, 0]} />
      </group>

      {/* small paper-plane orbiting above, banking into its turn */}
      <group position={[-0.5, 0.75, 0.3]} rotation={[0.3, 0.6, -0.4]}>
        <Solid geometry={plane} rotation={[0, 0, -Math.PI / 2]} />
        <Solid geometry={wing} position={[-0.05, 0, 0]} />
      </group>
    </group>
  );
}

const SHAPES = [
  Camera3D,
  Clapperboard3D,
  CodePlate3D,
  Mountain3D,
  Party3D,
  FilmReel3D,
  Travel3D,
];

// Handles the pop-out / swap / pop-in transition whenever `index` changes.
function ActiveShape({ index }: { index: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const [displayedIndex, setDisplayedIndex] = useState(index);
  const phaseRef = useRef<"idle" | "exiting" | "entering">("idle");
  const scaleRef = useRef(1);

  useEffect(() => {
    if (index !== displayedIndex) {
      phaseRef.current = "exiting";
    }
  }, [index, displayedIndex]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // spin faster while mid-transition, gentle idle spin otherwise
    const spinSpeed = phaseRef.current === "idle" ? 0.35 : 2.4;
    groupRef.current.rotation.y += delta * spinSpeed;

    if (phaseRef.current === "exiting") {
      scaleRef.current = THREE.MathUtils.damp(scaleRef.current, 0, 12, delta);
      if (scaleRef.current < 0.03) {
        scaleRef.current = 0;
        setDisplayedIndex(index);
        phaseRef.current = "entering";
      }
    } else if (phaseRef.current === "entering") {
      scaleRef.current = THREE.MathUtils.damp(scaleRef.current, 1, 7, delta);
      if (scaleRef.current > 0.97) {
        scaleRef.current = 1;
        phaseRef.current = "idle";
      }
    } else {
      // subtle idle bob
      groupRef.current.position.y = Math.sin(Date.now() * 0.0006) * 0.06;
    }

    groupRef.current.scale.setScalar(scaleRef.current);
  });

  const Shape = SHAPES[displayedIndex];
  return (
    <group ref={groupRef}>
      <Shape />
    </group>
  );
}

export default function AboutVisual({
  onActiveChange,
}: {
  onActiveChange?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    onActiveChange?.(0);
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % SHAPES.length;
        onActiveChange?.(next);
        return next;
      });
    }, 5600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Canvas camera={{ position: [0, 1.2, 6], fov: 32 }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-3, -2, -4]} intensity={0.3} />
      <ActiveShape index={index} />
    </Canvas>
  );
}