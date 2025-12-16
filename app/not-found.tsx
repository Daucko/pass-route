"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, Github, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
    reverseColor: string;
    ballColor: string;
}

export default function NotFound() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const [dayScore, setDayScore] = useState(0);
    const [nightScore, setNightScore] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Updated colors to match your dark theme
    const DAY_COLOR = "#D9E8E3"; // Light mint
    const DAY_BALL_COLOR = "#00f0ff"; // Neon Blue
    const NIGHT_COLOR = "#114C5A"; // Dark teal
    const NIGHT_BALL_COLOR = "#bd00ff"; // Neon Purple

    const SQUARE_SIZE = 20;
    const MIN_SPEED = 3;
    const MAX_SPEED = 6;
    const CANVAS_SIZE = 400;

    const squaresRef = useRef<string[][]>([]);
    const ballsRef = useRef<Ball[]>([
        {
            x: CANVAS_SIZE / 4,
            y: CANVAS_SIZE / 2,
            dx: 4,
            dy: -4,
            reverseColor: DAY_COLOR,
            ballColor: DAY_BALL_COLOR,
        },
        {
            x: (CANVAS_SIZE / 4) * 3,
            y: CANVAS_SIZE / 2,
            dx: -4,
            dy: 4,
            reverseColor: NIGHT_COLOR,
            ballColor: NIGHT_BALL_COLOR,
        },
    ]);

    // Initialize squares
    useEffect(() => {
        setIsMounted(true);
        const numSquaresX = Math.floor(CANVAS_SIZE / SQUARE_SIZE);
        const numSquaresY = Math.floor(CANVAS_SIZE / SQUARE_SIZE);

        const initialSquares: string[][] = [];
        for (let i = 0; i < numSquaresX; i++) {
            initialSquares[i] = [];
            for (let j = 0; j < numSquaresY; j++) {
                initialSquares[i][j] = i < numSquaresX / 2 ? DAY_COLOR : NIGHT_COLOR;
            }
        }
        squaresRef.current = initialSquares;

        // Calculate initial scores
        const totalSquares = numSquaresX * numSquaresY;
        setDayScore(Math.floor(totalSquares / 2));
        setNightScore(Math.floor(totalSquares / 2));

        // Start animation
        if (isRunning) {
            startAnimation();
        }
    }, []);

    const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
        // Draw ball with simple fill (no complex shadows that might cause issues)
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, SQUARE_SIZE / 2, 0, Math.PI * 2);
        ctx.fillStyle = ball.ballColor;
        ctx.fill();

        // Add a subtle glow effect using a larger, semi-transparent circle
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, SQUARE_SIZE / 2 + 3, 0, Math.PI * 2);
        ctx.fillStyle = ball.ballColor + "40"; // 25% opacity hex
        ctx.fill();
    };

    const drawSquares = (ctx: CanvasRenderingContext2D) => {
        let dayCount = 0;
        let nightCount = 0;
        const numSquaresX = Math.floor(CANVAS_SIZE / SQUARE_SIZE);
        const numSquaresY = Math.floor(CANVAS_SIZE / SQUARE_SIZE);

        // Draw squares
        for (let i = 0; i < numSquaresX; i++) {
            for (let j = 0; j < numSquaresY; j++) {
                const color = squaresRef.current[i]?.[j] || DAY_COLOR;
                ctx.fillStyle = color;
                ctx.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

                // Draw subtle grid lines
                ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
                ctx.lineWidth = 0.5;
                ctx.strokeRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

                // Update scores
                if (color === DAY_COLOR) dayCount++;
                if (color === NIGHT_COLOR) nightCount++;
            }
        }

        setDayScore(dayCount);
        setNightScore(nightCount);
    };

    const updateBallPosition = (ball: Ball) => {
        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Check boundary collision
        const radius = SQUARE_SIZE / 2;
        if (ball.x + radius > CANVAS_SIZE || ball.x - radius < 0) {
            ball.dx = -ball.dx;
            // Ensure ball stays within bounds
            ball.x = Math.max(radius, Math.min(CANVAS_SIZE - radius, ball.x));
        }
        if (ball.y + radius > CANVAS_SIZE || ball.y - radius < 0) {
            ball.dy = -ball.dy;
            // Ensure ball stays within bounds
            ball.y = Math.max(radius, Math.min(CANVAS_SIZE - radius, ball.y));
        }
    };

    const checkBallSquareCollision = (ball: Ball) => {
        const numSquaresX = Math.floor(CANVAS_SIZE / SQUARE_SIZE);
        const numSquaresY = Math.floor(CANVAS_SIZE / SQUARE_SIZE);

        // Get the grid cell the ball center is in
        const gridX = Math.floor(ball.x / SQUARE_SIZE);
        const gridY = Math.floor(ball.y / SQUARE_SIZE);

        // Check 3x3 area around the ball
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const checkX = gridX + dx;
                const checkY = gridY + dy;

                if (checkX >= 0 && checkX < numSquaresX && checkY >= 0 && checkY < numSquaresY) {
                    const currentColor = squaresRef.current[checkX]?.[checkY];

                    // Calculate distance from ball center to square center
                    const squareCenterX = checkX * SQUARE_SIZE + SQUARE_SIZE / 2;
                    const squareCenterY = checkY * SQUARE_SIZE + SQUARE_SIZE / 2;
                    const distance = Math.sqrt(
                        Math.pow(ball.x - squareCenterX, 2) +
                        Math.pow(ball.y - squareCenterY, 2)
                    );

                    // If ball is close enough to the square and square is not already the ball's color
                    if (distance < SQUARE_SIZE && currentColor && currentColor !== ball.reverseColor) {
                        squaresRef.current[checkX][checkY] = ball.reverseColor;

                        // Bounce effect based on collision direction
                        if (Math.abs(dx) > Math.abs(dy)) {
                            ball.dx = -ball.dx * 1.05; // Slight speed boost on bounce
                        } else {
                            ball.dy = -ball.dy * 1.05;
                        }
                    }
                }
            }
        }
    };

    const addRandomness = (ball: Ball) => {
        // Add subtle randomness to movement
        ball.dx += (Math.random() - 0.5) * 0.2;
        ball.dy += (Math.random() - 0.5) * 0.2;

        // Limit speed
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        if (speed > MAX_SPEED) {
            ball.dx = (ball.dx / speed) * MAX_SPEED;
            ball.dy = (ball.dy / speed) * MAX_SPEED;
        }
        if (speed < MIN_SPEED) {
            ball.dx = (ball.dx / speed) * MIN_SPEED;
            ball.dy = (ball.dy / speed) * MIN_SPEED;
        }
    };

    const draw = useRef(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas with dark background
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw squares first
        drawSquares(ctx);

        // Update and draw balls
        ballsRef.current.forEach((ball) => {
            // Update ball position and check collisions
            updateBallPosition(ball);
            checkBallSquareCollision(ball);
            addRandomness(ball);

            // Draw the ball
            drawBall(ctx, ball);
        });
    }).current; // Keep draw stable as it relies on refs mainly or updated via closure if needed. Actually refs are fine.
    // Wait, if draw relies on setDayScore (stable), it's fine.
    // But drawSquares relies on squaresRef (stable).
    // The previous implementation defined 'draw' inside render, so it was new every time.
    // Let's wrapping it in useCallback would require listing all deps.
    // However, draw squares logic is complex.
    // Since we are inside a functional component, and these likely don't change much:
    // simpler fix: Just add missing deps to useEffect OR disable the rule for this animation effect if standard patterns are annoying.
    // But better: define `draw` via useCallback.
    // I will try to address the specific specific warnings by adding dependencies, which means I need to wrap `startAnimation` and `draw`.

    const startAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        const animate = () => {
            draw();
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    };

    const resetGame = () => {
        stopAnimation();

        const numSquaresX = Math.floor(CANVAS_SIZE / SQUARE_SIZE);
        const numSquaresY = Math.floor(CANVAS_SIZE / SQUARE_SIZE);

        const initialSquares: string[][] = [];
        for (let i = 0; i < numSquaresX; i++) {
            initialSquares[i] = [];
            for (let j = 0; j < numSquaresY; j++) {
                initialSquares[i][j] = i < numSquaresX / 2 ? DAY_COLOR : NIGHT_COLOR;
            }
        }
        squaresRef.current = initialSquares;

        ballsRef.current = [
            {
                x: CANVAS_SIZE / 4,
                y: CANVAS_SIZE / 2,
                dx: 4,
                dy: -4,
                reverseColor: DAY_COLOR,
                ballColor: DAY_BALL_COLOR,
            },
            {
                x: (CANVAS_SIZE / 4) * 3,
                y: CANVAS_SIZE / 2,
                dx: -4,
                dy: 4,
                reverseColor: NIGHT_COLOR,
                ballColor: NIGHT_BALL_COLOR,
            },
        ];

        const totalSquares = numSquaresX * numSquaresY;
        setDayScore(Math.floor(totalSquares / 2));
        setNightScore(Math.floor(totalSquares / 2));
        setIsRunning(true);

        // Start animation
        startAnimation();
    };

    useEffect(() => {
        if (isMounted && isRunning) {
            startAnimation();
        }

        return () => {
            stopAnimation();
        };
    }, [isMounted, isRunning]);

    const toggleAnimation = () => {
        if (isRunning) {
            stopAnimation();
        } else {
            startAnimation();
        }
        setIsRunning(!isRunning);
    };

    // Force a redraw when mounted
    useEffect(() => {
        if (isMounted && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                // Initial draw
                draw();
            }
        }
    }, [isMounted]);

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading Pong Wars...</p>
                </div>
            </div>
        );
    }

    const totalSquares = Math.floor(CANVAS_SIZE / SQUARE_SIZE) * Math.floor(CANVAS_SIZE / SQUARE_SIZE);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#172B36]/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,240,255,0.1)_0%,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(189,0,255,0.1)_0%,transparent_50%)]"></div>

            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left column - 404 Text */}
                    <div className="text-center lg:text-left space-y-6 lg:space-y-8">
                        <div className="space-y-3 lg:space-y-4">
                            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                <span className="text-sm font-medium text-muted-foreground">404 Error</span>
                            </div>

                            <h1 className="text-7xl lg:text-9xl font-bold tracking-tighter bg-gradient-to-r from-white via-white to-muted-foreground bg-clip-text text-transparent">
                                404
                            </h1>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white">
                                Page Not Found
                            </h2>
                        </div>

                        <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
                            The page you&apos;re looking for has been caught in the crossfire of the Pong Wars.
                            While our digital gladiators battle it out, you can enjoy the spectacle or find your way back home.
                        </p>

                        {/* Score display */}
                        <div className="glass-panel rounded-xl p-4 lg:p-6 mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-muted-foreground">Live Battle Score</span>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                    <span className="text-xs">{isRunning ? 'Live' : 'Paused'}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <div className="text-2xl lg:text-3xl font-bold neon-glow-blue font-mono">{dayScore}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Day ({Math.round((dayScore / totalSquares) * 100)}%)</div>
                                </div>
                                <div className="h-8 w-px bg-border"></div>
                                <div className="text-center">
                                    <div className="text-2xl lg:text-3xl font-bold neon-glow-purple font-mono">{nightScore}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Night ({Math.round((nightScore / totalSquares) * 100)}%)</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center lg:justify-start">
                            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link href="/" className="flex items-center gap-2">
                                    <Home className="h-4 w-4" />
                                    Back to Home
                                </Link>
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    onClick={toggleAnimation}
                                    variant={isRunning ? "destructive" : "default"}
                                    size="lg"
                                    className="flex items-center gap-2"
                                >
                                    {isRunning ? "Pause" : "Play"}
                                </Button>
                                <Button
                                    onClick={resetGame}
                                    variant="outline"
                                    size="lg"
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Game Canvas */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                            <canvas
                                ref={canvasRef}
                                width={CANVAS_SIZE}
                                height={CANVAS_SIZE}
                                className="relative rounded-2xl border border-border/50 shadow-2xl bg-black"
                                data-mounted={isMounted}
                            />

                            {/* Game title overlay */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                                <div className="glass-panel px-4 py-2 rounded-lg shadow-lg">
                                    <h3 className="text-sm font-bold text-white font-mono tracking-wider">PONG WARS 404</h3>
                                </div>
                            </div>
                        </div>

                        {/* Game Info */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                Watch the balls convert squares to their colors!
                                <span className="block mt-1">
                                    <span className="text-[#00f0ff]">Blue ball</span> converts to light squares •
                                    <span className="text-[#bd00ff]"> Purple ball</span> converts to dark squares
                                </span>
                            </p>
                        </div>

                        {/* Controls and Info */}
                        <div className="mt-6 w-full max-w-md">
                            <div className="glass-panel rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-white mb-3">Game Info</h4>
                                <div className="grid grid-cols-1 gap-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-[#00f0ff] animate-pulse"></div>
                                            <span className="text-muted-foreground">Day Ball (Blue)</span>
                                        </div>
                                        <span className="text-white">Converts to light</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-[#bd00ff] animate-pulse"></div>
                                            <span className="text-muted-foreground">Night Ball (Purple)</span>
                                        </div>
                                        <span className="text-white">Converts to dark</span>
                                    </div>
                                </div>
                            </div>

                            {/* Attribution */}
                            <div className="mt-4 text-center text-xs text-muted-foreground font-mono">
                                <p className="mb-2">Original game by Koen van Gilst</p>
                                <div className="flex gap-4 justify-center">
                                    <a
                                        href="https://koenvangilst.nl/labs/pong-wars"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Original
                                    </a>
                                    <a
                                        href="https://github.com/vnglst/pong-wars"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-white transition-colors"
                                    >
                                        <Github className="w-3 h-3" />
                                        Source
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom section - Explanation */}
                <div className="mt-12 lg:mt-16 pt-8 border-t border-border/50">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <h3 className="text-lg font-semibold text-white">
                            How It Works
                        </h3>
                        <p className="text-muted-foreground">
                            Two balls representing Day (blue) and Night (purple) bounce around the grid.
                            When they hit a square, they convert it to their color territory.
                            Watch the scores change in real-time as the battle unfolds!
                        </p>
                        <p className="text-sm text-muted-foreground/70 font-mono pt-2">
                            Built with Next.js 15 • TypeScript • Tailwind CSS • shadcn/ui
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}