import {useState, useEffect, useRef} from 'react';

const codeSnippets = [
    'function fibonacci(n) {\n  return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);\n}',
    'const sum = arr => arr.reduce((a, b) => a + b, 0);',
    'async function fetchData(url) {\n  const response = await fetch(url);\n  return response.json();\n}',
    'const debounce = (fn, ms) => {\n  let timeout;\n  return (...args) => {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn(...args), ms);\n  };\n};',
    'const quickSort = arr => arr.length <= 1 ? arr : [\n  ...quickSort(arr.filter(x => x < arr[0])),\n  ...arr.filter(x => x === arr[0]),\n  ...quickSort(arr.filter(x => x > arr[0]))\n];'
];

export function CodeTypingGame() {
    const [code] = useState(() => codeSnippets[Math.floor(Math.random() * codeSnippets.length)]);
    const [typed, setTyped] = useState('');
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [errors, setErrors] = useState(0);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleInput = (value: string) => {
        if (!started) {
            setStarted(true);
            setStartTime(Date.now());
        }

        setTyped(value);

        // Count errors
        let errorCount = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] !== code[i]) errorCount++;
        }
        setErrors(errorCount);
        setAccuracy(value.length > 0 ? Math.round(((value.length - errorCount) / value.length) * 100) : 100);

        if (value === code) {
            setFinished(true);
            const timeInMinutes = (Date.now() - startTime) / 60000;
            const words = code.split(' ').length;
            setWpm(Math.round(words / timeInMinutes));
        }
    };

    const reset = () => {
        setTyped('');
        setStarted(false);
        setFinished(false);
        setErrors(0);
        setAccuracy(100);
        setWpm(0);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div style={{width: 700, margin: '0 auto'}}>
            <div style={{
                background: 'rgba(30,30,46,0.6)',
                borderRadius: 12,
                padding: 20,
                fontFamily: 'monospace',
                position: 'relative',
                border: '1px solid rgba(167,139,250,0.3)'
            }}>
                <div style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: '#a6adc8',
                    marginBottom: 16,
                    whiteSpace: 'pre-wrap'
                }}>
                    {code.split('').map((char, i) => {
                        let color = '#6c7086';
                        if (i < typed.length) {
                            color = typed[i] === char ? '#a6e3a1' : '#f38ba8';
                        } else if (i === typed.length) {
                            color = '#f9e2af';
                        }
                        return (
                            <span key={i} style={{
                                color,
                                backgroundColor: i === typed.length ? 'rgba(249,226,175,0.2)' : 'transparent'
                            }}>
                                {char}
                            </span>
                        );
                    })}
                </div>

                <textarea
                    ref={inputRef}
                    value={typed}
                    onChange={(e) => handleInput(e.target.value)}
                    disabled={finished}
                    style={{
                        width: '100%',
                        minHeight: 120,
                        background: 'rgba(17,17,27,0.6)',
                        border: '1px solid rgba(167,139,250,0.3)',
                        borderRadius: 8,
                        padding: 12,
                        color: '#cdd6f4',
                        fontSize: 14,
                        fontFamily: 'monospace',
                        resize: 'none',
                        outline: 'none'
                    }}
                    placeholder="Начните печатать здесь..."
                />

                {finished && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(30,30,46,0.95)',
                        borderRadius: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16
                    }}>
                        <div style={{fontSize: 32, fontWeight: 700, color: '#a6e3a1'}}>
                            Отлично!
                        </div>
                        <div style={{color: '#cdd6f4', fontSize: 18}}>
                            Скорость: <strong>{wpm}</strong> слов/мин
                        </div>
                        <div style={{color: '#cdd6f4', fontSize: 18}}>
                            Точность: <strong>{accuracy}%</strong>
                        </div>
                        <button
                            onClick={reset}
                            style={{
                                padding: '12px 32px',
                                borderRadius: 8,
                                border: 'none',
                                background: '#89b4fa',
                                color: '#1e1e2e',
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: 8
                            }}
                        >
                            Ещё раз
                        </button>
                    </div>
                )}
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12}}>
                <span style={{color: '#C4B5FD', fontSize: 12}}>
                    {finished ? 'Нажмите "Ещё раз" для новой попытки' : 'Печатайте код в точности как показано'}
                </span>
                <span style={{color: '#A78BFA', fontSize: 12}}>
                    Ошибок: {errors} | Точность: {accuracy}%
                </span>
            </div>
        </div>
    );
}
