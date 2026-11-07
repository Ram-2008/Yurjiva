"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import { Group, Vector3, Mesh } from "three";
function Field({ network }: { network: boolean }) {
  const group = useRef<Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: network ? 52 : 130 }, (_, i) => {
        const a = i * 2.39996,
          y = 1 - ((i + 0.5) / (network ? 52 : 130)) * 2,
          r = Math.sqrt(1 - y * y);
        return new Vector3(
          r * Math.cos(a) * 2.3,
          y * 1.8,
          r * Math.sin(a) * 1.7,
        );
      }),
    [network],
  );
  const pulse = useRef<Mesh>(null),
    scroll = useRef(0);
  useEffect(() => {
    const update = () => {
      scroll.current =
        window.scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const positions = useMemo(
    () => new Float32Array(nodes.flatMap((p) => p.toArray())),
    [nodes],
  );
  const edges = useMemo(
    () =>
      nodes.flatMap((a, i) =>
        nodes
          .slice(i + 1)
          .filter((b) => a.distanceTo(b) < 0.9)
          .flatMap((b) => [a, b]),
      ),
    [nodes],
  );
  useFrame(({ pointer, clock, camera }) => {
    camera.position.z = 5.3 - scroll.current * 0.55;
    if (pulse.current && edges.length) {
      const t = clock.elapsedTime * 0.65 + scroll.current * 32,
        i = (Math.floor(t) * 2) % edges.length;
      pulse.current.position.lerpVectors(edges[i], edges[i + 1], t % 1);
    }
    if (group.current) {
      group.current.rotation.y = clock.elapsedTime * 0.06 + scroll.current * 1.2 + pointer.x * 0.22;
      group.current.rotation.x = pointer.y * 0.13;
    }
  });
  return (
    <group ref={group}>
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#9dd6ff"
          size={network ? 0.05 : 0.023}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
      {network && (
        <mesh ref={pulse}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshBasicMaterial color="#e8f6ff" />
        </mesh>
      )}
      {network && (
        <Line
          segments
          points={edges}
          color="#6f87ff"
          transparent
          opacity={0.55}
          lineWidth={1}
        />
      )}
    </group>
  );
}
export default function Experience({ network = false }: { network?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.35]}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5.3], fov: 48 }}
    >
      <Field network={network} />
    </Canvas>
  );
}
