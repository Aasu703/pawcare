'use client';

import { useEffect, useState, useRef } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    opacity: number;
}

// Color palette inspired by Antigravity (Google colors + orange for PawCare)
const colors = [
    'rgb(251, 140, 0)',    // Orange (primary)
    'rgb(255, 193, 7)',    // Amber
    'rgb(255, 152, 0)',    // Deep Orange
    'rgb(66, 133, 244)',   // Google Blue
    'rgb(234, 67, 53)',    // Google Red
];

export default function CursorAnimation() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isMoving, setIsMoving] = useState(false);
    const animationFrameRef = useRef<number>(undefined);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const movingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);


    useEffect(() => {
        let particleId = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const newX = e.clientX;
            const newY = e.clientY;

            setCursorPosition({ x: newX, y: newY });
            setIsMoving(true);

            // Clear existing timeout
            if (movingTimeoutRef.current) {
                clearTimeout(movingTimeoutRef.current);
            }

            // Set timeout to detect when mouse stops
            movingTimeoutRef.current = setTimeout(() => {
                setIsMoving(false);
            }, 100);

            // Calculate velocity based on mouse movement
            const dx = newX - lastPositionRef.current.x;
            const dy = newY - lastPositionRef.current.y;
            const velocity = Math.sqrt(dx * dx + dy * dy);

            lastPositionRef.current = { x: newX, y: newY };

            // Create particles based on velocity (more particles when moving faster)
            if (velocity > 2) {
                const numParticles = Math.min(Math.floor(velocity / 10), 3);

                for (let i = 0; i < numParticles; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 2 + 1;
                    const size = Math.random() * 4 + 2;
                    const life = Math.random() * 60 + 40;

                    const newParticle: Particle = {
                        id: particleId++,
                        x: newX + (Math.random() - 0.5) * 20,
                        y: newY + (Math.random() - 0.5) * 20,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed - 1, // Slight upward bias (antigravity effect)
                        life: life,
                        maxLife: life,
                        size: size,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        opacity: 1,
                    };

                    setParticles((prev) => [...prev, newParticle]);
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (movingTimeoutRef.current) {
                clearTimeout(movingTimeoutRef.current);
            }
        };
    }, []);

    // Animate particles
    useEffect(() => {
        const animate = () => {
            setParticles((prev) => {
                return prev
                    .map((particle) => ({
                        ...particle,
                        x: particle.x + particle.vx,
                        y: particle.y + particle.vy,
                        vy: particle.vy - 0.05, // Antigravity effect (particles float up)
                        life: particle.life - 1,
                        opacity: particle.life / particle.maxLife,
                    }))
                    .filter((particle) => particle.life > 0);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <>
            {/* Custom Cursor - Inspired by Antigravity */}
            <div
                className="fixed pointer-events-none z-[9999] transition-transform duration-100 ease-out"
                style={{
                    left: `${cursorPosition.x}px`,
                    top: `${cursorPosition.y}px`,
                    transform: `translate(-50%, -50%) scale(${isMoving ? 1.2 : 1})`,
                }}
            >
                {/* Outer ring */}
                <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-full h-full rounded-full border-2 border-primary/40 animate-ping"
                        style={{ animationDuration: '1.5s' }} />
                </div>

                {/* Middle ring */}
                <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-full h-full rounded-full border-2 border-primary/60" />
                </div>

                {/* Inner dot */}
                <div className="absolute inset-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-full h-full rounded-full bg-primary" />
                </div>
            </div>

            {/* Floating Particles */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="fixed pointer-events-none z-[9998] rounded-full"
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: particle.color,
                        opacity: particle.opacity,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                        filter: 'blur(0.5px)',
                    }}
                />
            ))}

            {/* CSS for cursor */}
            <style jsx global>{`
        body {
          cursor: none !important;
        }

        button, a, input, textarea, select, [role="button"], [type="submit"] {
          cursor: none !important;
        }

        * {
          cursor: none !important;
        }
      `}</style>
        </>
    );
}
