import {useEffect, useRef, useState} from 'react';

interface RunnerGameProps {
    width?: number;
    height?: number;
}

type Bullet = { x: number; y: number; vy: number };
type Enemy = { x: number; y: number; r: number; hp: number; vx: number; vy: number };
type Obstacle = { x: number; y: number; w: number; h: number; vx: number; vy: number; hp: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

export function RunnerGame({width = 832, height = 260}: RunnerGameProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const gameStateRef = useRef({
        shipX: width / 2,
        moveLeft: false,
        moveRight: false,
        canShoot: true,
        shootCooldown: 0,
        bullets: [] as Bullet[],
        enemies: [] as Enemy[],
        obstacles: [] as Obstacle[],
        particles: [] as Particle[],
        enemyTimer: 0,
        obstacleTimer: 0,
        score: 0,
        starsOffset: 0,
        running: true
    });

    const [displayScore, setDisplayScore] = useState(0);
    const [best, setBest] = useState<number>(() => Number(localStorage.getItem('runner_best') || 0));
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const state = gameStateRef.current;
        const shipY = height - 46;
        const shipSpeed = 7.2;

        let last = performance.now();
        let acc = 0;
        const timestep = 1000 / 60;

        const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

        const reset = () => {
            state.shipX = width / 2;
            state.moveLeft = false;
            state.moveRight = false;
            state.canShoot = true;
            state.shootCooldown = 0;
            state.bullets = [];
            state.enemies = [];
            state.obstacles = [];
            state.particles = [];
            state.enemyTimer = 0;
            state.obstacleTimer = 0;
            state.score = 0;
            state.running = true;
            setDisplayScore(0);
            setIsRunning(true);
        };

        const spawnEnemy = () => {
            const r = rnd(10, 18);
            const x = rnd(r + 8, width - r - 8);
            const y = -r - 10;
            const vx = rnd(-0.6, 0.6);
            const vy = rnd(1.2, 2.6);
            const hp = r > 15 ? 2 : 1;
            state.enemies.push({x, y, r, hp, vx, vy});
        };

        const shoot = () => {
            if (!state.canShoot || !state.running) return;
            state.bullets.push({x: state.shipX, y: shipY - 18, vy: -9.5});
            state.canShoot = false;
            state.shootCooldown = 8;
            for (let i = 0; i < 6; i++) {
                state.particles.push({
                    x: state.shipX,
                    y: shipY - 24,
                    vx: rnd(-0.8, 0.8),
                    vy: rnd(-2.5, -0.8),
                    life: rnd(18, 30),
                    color: 'rgba(167,139,250,0.8)'
                });
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft') state.moveLeft = true;
            if (e.code === 'ArrowRight') state.moveRight = true;
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                shoot();
            }
            if (!state.running && (e.code === 'Space' || e.code === 'Enter')) reset();
        };

        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft') state.moveLeft = false;
            if (e.code === 'ArrowRight') state.moveRight = false;
        };

        const onClick = () => {
            if (!state.running) reset();
            else shoot();
        };

        canvas.addEventListener('click', onClick);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        const step = (now: number) => {
            const dt = now - last;
            last = now;
            acc += dt;
            while (acc >= timestep) {
                if (state.running) update();
                acc -= timestep;
            }
            render();
            rafRef.current = requestAnimationFrame(step);
        };

        const update = () => {
            // Movement
            if (state.moveLeft) state.shipX -= shipSpeed;
            if (state.moveRight) state.shipX += shipSpeed;
            state.shipX = Math.max(20, Math.min(width - 20, state.shipX));

            // Auto-fire
            if (!state.canShoot) {
                state.shootCooldown -= 1;
                if (state.shootCooldown <= 0) state.canShoot = true;
            }
            if (state.canShoot) shoot();

            // Scrolling background
            state.starsOffset += 2.2;
            if (state.starsOffset > height) state.starsOffset -= height;

            // Spawn enemies
            state.enemyTimer -= 1;
            if (state.enemyTimer <= 0) {
                spawnEnemy();
                state.enemyTimer = Math.max(18, 40 - Math.floor(state.score / 200) + Math.floor(rnd(-6, 6)));
            }

            // Spawn obstacles
            state.obstacleTimer -= 1;
            if (state.obstacleTimer <= 0) {
                const w = rnd(24, 64);
                const h = rnd(16, 44);
                const x = rnd(12, width - w - 12);
                const y = -h - 14;
                const speedBase = rnd(1.6, 3.8);
                const vx = rnd(-0.9, 0.9);
                const vy = speedBase;
                const hp = Math.max(1, Math.round((w * h) / 800));
                state.obstacles.push({x, y, w, h, vx, vy, hp});
                state.obstacleTimer = Math.max(20, 52 - Math.floor(state.score / 180) + Math.floor(rnd(-8, 10)));
            }

            // Move everything
            state.bullets.forEach(b => (b.y += b.vy));
            state.enemies.forEach(en => {
                en.x += en.vx;
                en.y += en.vy;
            });
            state.obstacles.forEach(ob => {
                ob.x += ob.vx;
                ob.y += ob.vy;
            });
            state.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 1;
            });

            // Remove off-screen
            state.bullets = state.bullets.filter(b => b.y > -20);
            state.enemies = state.enemies.filter(en => en.y < height + en.r + 20);
            state.obstacles = state.obstacles.filter(ob => ob.y < height + ob.h + 20);
            state.particles = state.particles.filter(p => p.life > 0);

            // Bullet collisions with enemies
            for (const en of state.enemies) {
                for (const b of state.bullets) {
                    if (pointCircleOverlap(b.x, b.y, en.x, en.y, en.r)) {
                        en.hp -= 1;
                        b.y = -9999;
                        state.score += 10;
                        for (let i = 0; i < 14; i++) {
                            state.particles.push({
                                x: en.x,
                                y: en.y,
                                vx: rnd(-2.2, 2.2),
                                vy: rnd(-2.2, 2.2),
                                life: rnd(16, 40),
                                color: 'rgba(250,204,21,0.9)'
                            });
                        }
                    }
                }
            }

            // Bullet collisions with obstacles
            for (const ob of state.obstacles) {
                for (const b of state.bullets) {
                    if (rectsOverlap(b.x - 2, b.y - 8, 4, 12, ob.x, ob.y, ob.w, ob.h)) {
                        ob.hp -= 1;
                        b.y = -9999;
                        state.score += 6;
                        for (let i = 0; i < 10; i++) {
                            state.particles.push({
                                x: ob.x + ob.w / 2,
                                y: ob.y + ob.h / 2,
                                vx: rnd(-1.8, 1.8),
                                vy: rnd(-1.8, 1.8),
                                life: rnd(12, 30),
                                color: 'rgba(148,163,184,0.9)'
                            });
                        }
                    }
                }
            }

            // Remove destroyed
            state.bullets = state.bullets.filter(b => b.y > -9000);
            state.enemies = state.enemies.filter(en => en.hp > 0);
            state.obstacles = state.obstacles.filter(ob => ob.hp > 0);

            // Check collisions with ship
            for (const en of state.enemies) {
                if (circleRectOverlap(en.x, en.y, en.r, state.shipX - 16, shipY - 18, 32, 36)) {
                    gameOver();
                    return;
                }
            }

            for (const ob of state.obstacles) {
                if (rectsOverlap(state.shipX - 16, shipY - 18, 32, 36, ob.x, ob.y, ob.w, ob.h)) {
                    gameOver();
                    return;
                }
            }

            // Score increment
            state.score += 1;
            setDisplayScore(state.score);
        };

        const gameOver = () => {
            state.running = false;
            setIsRunning(false);
            if (state.score > best) {
                setBest(state.score);
                localStorage.setItem('runner_best', String(state.score));
            }
        };

        const render = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            drawSpaceBg(ctx, width, height);
            drawStars(ctx, width, height, state.starsOffset);

            state.enemies.forEach(en => drawEnemy(ctx, en));
            state.obstacles.forEach(ob => drawObstacle(ctx, ob));
            state.bullets.forEach(b => drawBullet(ctx, b));
            state.particles.forEach(p => drawParticle(ctx, p));
            drawShip(ctx, state.shipX, shipY);
            drawHud(ctx, state.score, best, state.running, width, height);
        };

        rafRef.current = requestAnimationFrame(step);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            canvas.removeEventListener('click', onClick);
        };
    }, [width, height, best]);

    return (
        <div style={{width, margin: '0 auto'}}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    width: '100%',
                    borderRadius: 12,
                    border: '1px solid rgba(167,139,250,0.25)',
                    display: 'block'
                }}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8}}>
                <span style={{color: '#C4B5FD', fontSize: 12}}>
                    {isRunning ? 'Стрелки ← → — движение' : 'Нажмите для новой игры'}
                </span>
                <span style={{color: '#A78BFA', fontSize: 12}}>
                    Очки: {displayScore} | Рекорд: {best}
                </span>
            </div>
        </div>
    );
}

// Drawing functions
function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);
    const t = performance.now() / 500;
    const wobble = Math.sin(t) * 1.5;

    // Body
    ctx.fillStyle = '#1f1b4a';
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(16, 10);
    ctx.lineTo(-16, 10);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.ellipse(0, -4, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Window
    ctx.fillStyle = '#E9D5FF';
    ctx.beginPath();
    ctx.arc(0, -6, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Flame
    const flame = 10 + Math.sin(performance.now() / 70) * 4;
    const grad = ctx.createLinearGradient(0, 10, 0, 10 + flame + 10);
    grad.addColorStop(0, 'rgba(168,85,247,0.9)');
    grad.addColorStop(1, 'rgba(59,130,246,0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-6, 10);
    ctx.quadraticCurveTo(0, 10 + flame + wobble, 6, 10);
    ctx.lineTo(0, 12 + flame);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawBullet(ctx: CanvasRenderingContext2D, b: Bullet) {
    ctx.save();
    ctx.translate(b.x, b.y);
    const g = ctx.createLinearGradient(0, -8, 0, 8);
    g.addColorStop(0, '#E9D5FF');
    g.addColorStop(1, '#8B5CF6');
    ctx.fillStyle = g;
    ctx.fillRect(-2, -8, 4, 12);
    ctx.fillStyle = 'rgba(167,139,250,0.8)';
    ctx.fillRect(-1, 4, 2, 6);
    ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
    ctx.save();
    ctx.translate(e.x, e.y);
    const rg = ctx.createRadialGradient(0, 0, e.r * 0.2, 0, 0, e.r);
    rg.addColorStop(0, '#FCD34D');
    rg.addColorStop(1, '#EA580C');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(0, 0, e.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(-e.r * 0.6, -e.r * 0.1, e.r * 1.2, 2);
    ctx.restore();
}

function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle) {
    ctx.save();
    ctx.translate(o.x, o.y);
    const g = ctx.createLinearGradient(0, 0, o.w, o.h);
    g.addColorStop(0, 'rgba(75,85,99,0.9)');
    g.addColorStop(1, 'rgba(31,41,55,0.9)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, o.w, o.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, o.w - 2, o.h - 2);
    ctx.restore();
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 2, 2);
    ctx.restore();
}

function drawHud(ctx: CanvasRenderingContext2D, score: number, best: number, running: boolean, w: number, h: number) {
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '700 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Очки: ${score}`, w / 2, 20);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText(`Рекорд: ${best}`, w - 12, 20);

    if (!running) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#E9D5FF';
        ctx.font = '700 22px system-ui, -apple-system, sans-serif';
        ctx.fillText('Корабль уничтожен', w / 2, h / 2 - 8);
        ctx.font = '500 14px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#C4B5FD';
        ctx.fillText('Пробел или Enter — начать заново', w / 2, h / 2 + 18);
    }
}

function drawSpaceBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f0c29');
    grad.addColorStop(0.5, '#302b63');
    grad.addColorStop(1, '#24243e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
}

function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, offset: number) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 100; i++) {
        const x = (i * 73) % w;
        const y = ((i * 47) % h + offset) % h;
        const s = (i % 3) + 1;
        ctx.fillRect(x, y, s * 0.6, s * 0.6);
        const y2 = (y + h * 0.5) % h;
        ctx.fillRect((x + 41) % w, y2, s * 0.6, s * 0.6);
    }
}

// Collision helpers
function pointCircleOverlap(px: number, py: number, cx: number, cy: number, cr: number) {
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= cr * cr;
}

function circleRectOverlap(cx: number, cy: number, cr: number, rx: number, ry: number, rw: number, rh: number) {
    const nearestX = Math.max(rx, Math.min(cx, rx + rw));
    const nearestY = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - nearestX;
    const dy = cy - nearestY;
    return dx * dx + dy * dy <= cr * cr;
}

function rectsOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
