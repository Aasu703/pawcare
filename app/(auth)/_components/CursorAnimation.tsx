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
    shape: 'circle' | 'paw' | 'heart' | 'star';
}

// Enhanced color palette with more vibrant colors
const colors = [
    'rgb(251, 140, 0)',    // Orange (primary)
    'rgb(255, 193, 7)',    // Amber
    'rgb(255, 152, 0)',    // Deep Orange
    'rgb(66, 133, 244)',   // Google Blue
    'rgb(234, 67, 53)',    // Google Red
    'rgb(52, 211, 153)',   // Emerald
    'rgb(168, 85, 247)',   // Purple
];

const shapes: Array<'circle' | 'paw' | 'heart' | 'star'> = ['circle', 'paw', 'heart', 'star'];

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
                        shape: shapes[Math.floor(Math.random() * shapes.length)],
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
            {particles.map((particle) => {
                const renderShape = () => {
                    const baseStyle = {
                        position: 'absolute' as const,
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        opacity: particle.opacity,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none' as const,
                        filter: 'blur(0.5px)',
                    };

                    switch (particle.shape) {
                        case 'paw':
                            return (
                                <div
                                    style={{
                                        ...baseStyle,
                                        width: `${particle.size * 1.5}px`,
                                        height: `${particle.size * 1.5}px`,
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill={particle.color} style={{ width: '100%', height: '100%' }}>
                                        <path d="M14.5 2C13.12 2 12 3.12 12 4.5S13.12 7 14.5 7 17 5.88 17 4.5 15.88 2 14.5 2M9.5 2C8.12 2 7 3.12 7 4.5S8.12 7 9.5 7 12 5.88 12 4.5 10.88 2 9.5 2M18.5 7C17.12 7 16 8.12 16 9.5S17.12 12 18.5 12 21 10.88 21 9.5 19.88 7 18.5 7M5.5 7C4.12 7 3 8.12 3 9.5S4.12 12 5.5 12 8 10.88 8 9.5 6.88 7 5.5 7M12 10C8.69 10 6 12.69 6 16S8.69 22 12 22 18 19.31 18 16 15.31 10 12 10Z" />
                                    </svg>
                                </div>
                            );
                        case 'heart':
                            return (
                                <div
                                    style={{
                                        ...baseStyle,
                                        width: `${particle.size * 1.5}px`,
                                        height: `${particle.size * 1.5}px`,
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill={particle.color} style={{ width: '100%', height: '100%' }}>
                                        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                                    </svg>
                                </div>
                            );
                        case 'star':
                            return (
                                <div
                                    style={{
                                        ...baseStyle,
                                        width: `${particle.size * 1.5}px`,
                                        height: `${particle.size * 1.5}px`,
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill={particle.color} style={{ width: '100%', height: '100%' }}>
                                        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                                    </svg>
                                </div>
                            );
                        default:
                            return (
                                <div
                                    style={{
                                        ...baseStyle,
                                        width: `${particle.size}px`,
                                        height: `${particle.size}px`,
                                        backgroundColor: particle.color,
                                        borderRadius: '50%',
                                        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                                    }}
                                />
                            );
                    }
                };

                return <div key={particle.id}>{renderShape()}</div>;
            })}

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
