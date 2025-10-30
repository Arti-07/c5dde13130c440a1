import {useEffect, useState} from 'react';
import {X, Rocket, Grid3x3, Code} from 'lucide-react';
import {RunnerGame} from './RunnerGame';
import {Game2048} from './Game2048';
import {CodeTypingGame} from './CodeTypingGame';

interface GameLoadingModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
}

type GameType = 'runner' | '2048' | 'typing';

export function GameLoadingModal({
                                     open,
                                     onClose,
                                     title = 'Пока ждём...',
                                     subtitle = 'Выберите игру'
                                 }: GameLoadingModalProps) {
    const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedGame) {
                setSelectedGame(null);
            }
        };
        if (open) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, selectedGame]);

    useEffect(() => {
        if (!open) {
            setSelectedGame(null);
        }
    }, [open]);

    if (!open) return null;

    const games = [
        {id: 'runner' as GameType, name: 'Space Runner', icon: Rocket, color: '#8B5CF6'},
        {id: '2048' as GameType, name: '2048', icon: Grid3x3, color: '#F59E0B'},
        {id: 'typing' as GameType, name: 'Code Typing', icon: Code, color: '#10B981'}
    ];

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '24px'
            }}
            onClick={() => {
                if (selectedGame) {
                    setSelectedGame(null);
                }
            }}
        >
            <div
                style={{
                    width: selectedGame ? 'min(900px, 100%)' : 'min(600px, 100%)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(15,12,41,0.95) 0%, rgba(48,43,99,0.95) 50%, rgba(36,36,62,0.95) 100%)',
                    border: '1px solid rgba(167,139,250,0.25)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {selectedGame && (
                    <button
                        onClick={() => setSelectedGame(null)}
                        style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: 'rgba(255,255,255,0.06)',
                            color: '#E9D5FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        }}
                    >
                        <X size={18}/>
                    </button>
                )}

                <div style={{padding: '18px 16px 8px 16px', textAlign: 'center'}}>
                    <h3 style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #E9D5FF 0%, #A78BFA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.02em'
                    }}>{title}</h3>
                    <p style={{
                        margin: '6px 0 0 0',
                        fontSize: 13,
                        color: '#C4B5FD',
                        opacity: 0.9
                    }}>{selectedGame ? 'ESC — вернуться к выбору игр' : subtitle}</p>
                </div>

                <div style={{padding: 16}}>
                    {!selectedGame ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                            gap: 12
                        }}>
                            {games.map((game) => {
                                const Icon = game.icon;
                                return (
                                    <button
                                        key={game.id}
                                        onClick={() => setSelectedGame(game.id)}
                                        style={{
                                            padding: '24px 16px',
                                            borderRadius: 16,
                                            border: '1px solid rgba(167,139,250,0.2)',
                                            background: 'rgba(255,255,255,0.03)',
                                            color: '#E9D5FF',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 12
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.borderColor = game.color;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)';
                                        }}
                                    >
                                        <div style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 12,
                                            background: `${game.color}22`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Icon size={24} color={game.color}/>
                                        </div>
                                        <span style={{
                                            fontSize: 14,
                                            fontWeight: 600
                                        }}>{game.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <>
                            {selectedGame === 'runner' && <RunnerGame width={832} height={260}/>}
                            {selectedGame === '2048' && <Game2048/>}
                            {selectedGame === 'typing' && <CodeTypingGame/>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
