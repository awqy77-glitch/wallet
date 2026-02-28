'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// An animated coin that reacts slightly to the mouse
function CryptoCoin({
    position,
    color,
    symbol,
    rotationSpeed = [0.2, 0.3],
    size = 1
}: {
    position: [number, number, number],
    color: string,
    symbol: string,
    rotationSpeed?: [number, number],
    size?: number
}) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState(false);

    const { mouse, viewport } = useThree();

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Continuous rotation
            groupRef.current.rotation.x += delta * rotationSpeed[0];
            groupRef.current.rotation.y += delta * rotationSpeed[1];

            // Mouse interaction: slight parallax effect
            const targetX = (mouse.x * viewport.width) / 5;
            const targetY = (mouse.y * viewport.height) / 5;

            groupRef.current.position.x += (position[0] + targetX - groupRef.current.position.x) * 0.05;
            groupRef.current.position.y += (position[1] + targetY - groupRef.current.position.y) * 0.05;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <group
                ref={groupRef}
                position={position}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                scale={hovered ? 1.2 : 1}
            >
                {/* Coin Body (Cylinder) */}
                <Cylinder args={[size, size, size * 0.15, 32]}>
                    <meshStandardMaterial
                        color={hovered ? '#ffffff' : color}
                        metalness={0.7}
                        roughness={0.2}
                    />
                </Cylinder>

                {/* Front Symbol */}
                <Text
                    position={[0, size * 0.08, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={size * 0.9}
                    color="#121212"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    {symbol}
                </Text>

                {/* Back Symbol */}
                <Text
                    position={[0, -size * 0.08, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                    fontSize={size * 0.9}
                    color="#121212"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    {symbol}
                </Text>
            </group>
        </Float>
    );
}

export default function ThreeBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#121212]">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#ffffff" />

                {/* Bitcoin */}
                <CryptoCoin position={[-5, 2, 0]} color="#F7931A" symbol="₿" rotationSpeed={[0.1, 0.4]} size={1.5} />
                {/* Ethereum */}
                <CryptoCoin position={[5, -2, -2]} color="#627EEA" symbol="Ξ" rotationSpeed={[0.3, 0.2]} size={1.2} />
                {/* Tether */}
                <CryptoCoin position={[4, 4, -4]} color="#26A17B" symbol="₮" rotationSpeed={[0.2, 0.5]} size={1} />
                {/* Binance */}
                <CryptoCoin position={[-4, -4, -1]} color="#F0B90B" symbol="B" rotationSpeed={[0.4, 0.1]} size={1.1} />

            </Canvas>
        </div>
    );
}
