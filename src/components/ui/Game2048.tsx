import {useEffect, useRef, useState, useCallback} from 'react';

export function Game2048() {
    const [grid, setGrid] = useState<number[][]>(() => initGrid());
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(() => Number(localStorage.getItem('2048_best') || 0));
    const [gameOver, setGameOver] = useState(false);
    const gridRef = useRef(grid);

    useEffect(() => {
        gridRef.current = grid;
    }, [grid]);

    const reset = useCallback(() => {
        setGrid(initGrid());
        setScore(0);
        setGameOver(false);
    }, []);

    const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return;

        let newGrid = gridRef.current.map(row => [...row]);
        let moved = false;
        let addScore = 0;

        if (direction === 'left') {
            for (let row = 0; row < 4; row++) {
                const {line, didMove, points} = mergeLine(newGrid[row]);
                if (didMove) moved = true;
                addScore += points;
                newGrid[row] = line;
            }
        } else if (direction === 'right') {
            for (let row = 0; row < 4; row++) {
                const {line, didMove, points} = mergeLine([...newGrid[row]].reverse());
                if (didMove) moved = true;
                addScore += points;
                newGrid[row] = line.reverse();
            }
        } else if (direction === 'up') {
            for (let col = 0; col < 4; col++) {
                const column = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]];
                const {line, didMove, points} = mergeLine(column);
                if (didMove) moved = true;
                addScore += points;
                for (let row = 0; row < 4; row++) {
                    newGrid[row][col] = line[row];
                }
            }
        } else if (direction === 'down') {
            for (let col = 0; col < 4; col++) {
                const column = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]].reverse();
                const {line, didMove, points} = mergeLine(column);
                if (didMove) moved = true;
                addScore += points;
                const result = line.reverse();
                for (let row = 0; row < 4; row++) {
                    newGrid[row][col] = result[row];
                }
            }
        }

        if (moved) {
            addRandomTile(newGrid);
            const newScore = score + addScore;
            setScore(newScore);
            setGrid(newGrid);

            if (newScore > best) {
                setBest(newScore);
                localStorage.setItem('2048_best', String(newScore));
            }

            if (isGameOver(newGrid)) {
                setGameOver(true);
            }
        }
    }, [gameOver, score, best]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                move('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                move('down');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                move('left');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                move('right');
            } else if ((e.key === 'Enter' || e.key === ' ') && gameOver) {
                e.preventDefault();
                reset();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move, reset, gameOver]);

    return (
        <div style={{width: 400, margin: '0 auto'}}>
            <div style={{
                background: 'rgba(187,173,160,0.4)',
                borderRadius: 12,
                padding: 12,
                position: 'relative'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 12,
                    position: 'relative'
                }}>
                    {grid.map((row, i) =>
                        row.map((cell, j) => (
                            <div
                                key={`${i}-${j}`}
                                style={{
                                    aspectRatio: '1',
                                    borderRadius: 8,
                                    background: getTileColor(cell),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: cell >= 1024 ? 24 : cell >= 128 ? 28 : 32,
                                    fontWeight: 700,
                                    color: cell > 4 ? '#f9f6f2' : '#776e65',
                                    transition: 'all 0.15s'
                                }}
                            >
                                {cell > 0 ? cell : ''}
                            </div>
                        ))
                    )}
                </div>

                {gameOver && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(238,228,218,0.75)',
                        borderRadius: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16
                    }}>
                        <div style={{
                            fontSize: 48,
                            fontWeight: 700,
                            color: '#776e65'
                        }}>Game Over!
                        </div>
                        <button
                            onClick={reset}
                            style={{
                                padding: '12px 32px',
                                borderRadius: 8,
                                border: 'none',
                                background: '#8f7a66',
                                color: '#f9f6f2',
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Попробовать снова
                        </button>
                    </div>
                )}
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12}}>
                <span style={{color: '#C4B5FD', fontSize: 12}}>
                    Используйте стрелки ← ↑ → ↓
                </span>
                <span style={{color: '#A78BFA', fontSize: 12}}>
                    Очки: {score} | Лучшее: {best}
                </span>
            </div>
        </div>
    );
}

function initGrid(): number[][] {
    const grid = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(grid);
    addRandomTile(grid);
    return grid;
}

function addRandomTile(grid: number[][]) {
    const empty: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) empty.push([i, j]);
        }
    }
    if (empty.length > 0) {
        const [row, col] = empty[Math.floor(Math.random() * empty.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function mergeLine(line: number[]): { line: number[]; didMove: boolean; points: number } {
    let arr = line.filter(x => x !== 0);
    let points = 0;
    let didMove = false;

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            points += arr[i];
            arr.splice(i + 1, 1);
            didMove = true;
        }
    }

    const result = [...arr, ...Array(4 - arr.length).fill(0)];
    if (JSON.stringify(result) !== JSON.stringify(line)) {
        didMove = true;
    }

    return {line: result, didMove, points};
}

function isGameOver(grid: number[][]): boolean {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
        }
    }
    return true;
}

function getTileColor(value: number): string {
    const colors: Record<number, string> = {
        0: 'rgba(238,228,218,0.35)',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
}
