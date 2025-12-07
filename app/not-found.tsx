"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, Github, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ColorPalette {
    MysticMint: string;
    NocturnalExpedition: string;
}

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
    const DAY_COLOR = "#D9E8E3"; // Mystic Mint
    const DAY_BALL_COLOR = "#00f0ff"; // Neon Blue from your theme
    const NIGHT_COLOR = "#114C5A"; // Nocturnal Expedition
    const NIGHT_BALL_COLOR = "#bd00ff"; // Neon Purple from your theme

    const SQUARE_SIZE = 20; // Smaller for better visibility on 404 page
    const MIN_SPEED = 4;
    const MAX_SPEED = 8;
    const CANVAS_SIZE = 400; // Smaller for 404 page

    const [squares, setSquares] = useState<string[][]>([]);
    const ballsRef = useRef<Ball[]>([
        {
            x: CANVAS_SIZE / 4,
            y: CANVAS_SIZE / 2,
            dx: 6,
            dy: -6,
            reverseColor: DAY_COLOR,
            ballColor: DAY_BALL_COLOR,
        },
        {
            x: (CANVAS_SIZE / 4) * 3,
            y: CANVAS_SIZE / 2,
            dx: -6,
            dy: 6,
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
        setSquares(initialSquares);
    }, []);

    const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, SQUARE_SIZE / 2, 0, Math.PI * 2, false);
        ctx.fillStyle = ball.ballColor;
        ctx.fill();

        // Add neon glow effect
        ctx.shadowColor = ball.ballColor;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.closePath();
    };

    const drawSquares = (ctx: CanvasRenderingContext2D) => {
        let dayCount = 0;
        let nightCount = 0;
        const numSquaresX = Math.floor(CANVAS_SIZE / SQUARE_SIZE);
        const numSquaresY = Math.floor(CANVAS_SIZE / SQUARE_SIZE);

        for (let i = 0; i < numSquaresX; i++) {
            for (let j = 0; j < numSquaresY; j++) {
                ctx.fillStyle = squares[i]?.[j] || DAY_COLOR;
                ctx.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

                // Update scores
                if (squares[i]?.[j] === DAY_COLOR) dayCount++;
                if (squares[i]?.[j] === NIGHT_COLOR) nightCount++;
            }
        }

        setDayScore(dayCount);
        setNightScore(nightCount);
    };

    const checkSquareCollision = (ball: Ball, squares: string[][]) => {
        const numSquaresX = Math.floor(CANVAS_SIZE / SQUARE_SIZE);
        const numSquaresY = Math.floor(CANVAS_SIZE / SQUARE_SIZE);
        const updatedSquares = squares.map(row => [...row]);

        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
            const checkX = ball.x + Math.cos(angle) * (SQUARE_SIZE / 2);
            const checkY = ball.y + Math.sin(angle) * (SQUARE_SIZE / 2);

            const i = Math.floor(checkX / SQUARE_SIZE);
            const j = Math.floor(checkY / SQUARE_SIZE);

            if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
                if (updatedSquares[i]?.[j] !== ball.reverseColor) {
                    updatedSquares[i][j] = ball.reverseColor;

                    if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
                        ball.dx = -ball.dx;
                    } else {
                        ball.dy = -ball.dy;
                    }
                }
            }
        }

        return updatedSquares;
    };

    const checkBoundaryCollision = (ball: Ball) => {
        if (ball.x + ball.dx > CANVAS_SIZE - SQUARE_SIZE / 2 || ball.x + ball.dx < SQUARE_SIZE / 2) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy > CANVAS_SIZE - SQUARE_SIZE / 2 || ball.y + ball.dy < SQUARE_SIZE / 2) {
            ball.dy = -ball.dy;
        }
    };

    const addRandomness = (ball: Ball) => {
        ball.dx += (Math.random() - 0.5) * 0.8;
        ball.dy += (Math.random() - 0.5) * 0.8;

        ball.dx = Math.min(Math.max(ball.dx, -MAX_SPEED), MAX_SPEED);
        ball.dy = Math.min(Math.max(ball.dy, -MAX_SPEED), MAX_SPEED);

        if (Math.abs(ball.dx) < MIN_SPEED) ball.dx = ball.dx > 0 ? MIN_SPEED : -MIN_SPEED;
        if (Math.abs(ball.dy) < MIN_SPEED) ball.dy = ball.dy > 0 ? MIN_SPEED : -MIN_SPEED;
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear with dark background
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        drawSquares(ctx);

        let updatedSquares = squares.map(row => [...row]);
        ballsRef.current.forEach((ball) => {
            drawBall(ctx, ball);
            updatedSquares = checkSquareCollision(ball, updatedSquares);
            checkBoundaryCollision(ball);
            ball.x += ball.dx;
            ball.y += ball.dy;
            addRandomness(ball);
        });

        setSquares(updatedSquares);
    };

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
        setSquares(initialSquares);

        ballsRef.current = [
            {
                x: CANVAS_SIZE / 4,
                y: CANVAS_SIZE / 2,
                dx: 6,
                dy: -6,
                reverseColor: DAY_COLOR,
                ballColor: DAY_BALL_COLOR,
            },
            {
                x: (CANVAS_SIZE / 4) * 3,
                y: CANVAS_SIZE / 2,
                dx: -6,
                dy: 6,
                reverseColor: NIGHT_COLOR,
                ballColor: NIGHT_BALL_COLOR,
            },
        ];

        setDayScore(0);
        setNightScore(0);
        setIsRunning(true);
        startAnimation();
    };

    useEffect(() => {
        if (isMounted && isRunning && squares.length > 0) {
            startAnimation();
        }

        return () => {
            stopAnimation();
        };
    }, [isMounted, isRunning, squares.length]);

    const toggleAnimation = () => {
        if (isRunning) {
            stopAnimation();
        } else {
            startAnimation();
        }
        setIsRunning(!isRunning);
    };

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
                                    <div className="text-xs text-muted-foreground mt-1">Day</div>
                                </div>
                                <div className="h-8 w-px bg-border"></div>
                                <div className="text-center">
                                    <div className="text-2xl lg:text-3xl font-bold neon-glow-purple font-mono">{nightScore}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Night</div>
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
                                className="relative rounded-2xl border border-border/50 shadow-2xl"
                                data-mounted={isMounted}
                            />

                            {/* Game title overlay */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                                <div className="glass-panel px-4 py-2 rounded-lg shadow-lg">
                                    <h3 className="text-sm font-bold text-white font-mono tracking-wider">PONG WARS 404</h3>
                                </div>
                            </div>
                        </div>

                        {/* Controls and Info */}
                        <div className="mt-10 lg:mt-12 w-full max-w-md">
                            <div className="glass-panel rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-white mb-3">Game Controls</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-[#00f0ff]"></div>
                                        <span className="text-muted-foreground">Day Ball (Blue)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-[#bd00ff]"></div>
                                        <span className="text-muted-foreground">Night Ball (Purple)</span>
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
                            Lost in the Digital Void?
                        </h3>
                        <p className="text-muted-foreground">
                            This 404 page features an interactive port of Pong Wars, where two balls battle for territory.
                            Watch as the neon blue (Day) and purple (Night) balls bounce around, converting squares to their colors.
                            The score shows how much territory each side has conquered.
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