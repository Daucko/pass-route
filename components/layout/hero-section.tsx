// components/HeroSection.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { SafeCanvas } from "@/components/ui/safe-canvas";
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
    return (
        <div className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
            {/* Background Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-90" />

            {/* 3D Holographic Card Animation */}
            <div className="absolute w-96 h-56">
                <SafeCanvas camera={{ position: [0, 0, 5], fov: 75 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <mesh>
                        <boxGeometry args={[3, 2, 0.1]} />
                        <MeshDistortMaterial
                            color="#2563eb"
                            distort={0.4}
                            speed={2}
                            roughness={0.5}
                        />
                    </mesh>
                    <OrbitControls enableZoom={false} enablePan={false} />
                </SafeCanvas>
            </div>

            {/* Text Content */}
            <div className="relative z-10 text-center">
                <motion.h1
                    className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Next Gen Payment System with Stripe
                </motion.h1>
                <motion.p
                    className="text-lg mb-8 text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Experience the future of payments with cutting-edge technology, seamless integration, and unparalleled security.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                        See Our Product
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;