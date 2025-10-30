import { useState } from 'react';
import { generateSound, textToSpeech, playAudio } from '../../api/audio';
import { VoiceId, ModelId } from '../../types/audio';

export function AudioTest() {
  const [loading, setLoading] = useState(false);
  const [soundText, setSoundText] = useState('office noise, people talking');
  const [speechText, setSpeechText] = useState('Привет! Это тестовое сообщение.');
  const [duration, setDuration] = useState(5.0);
  const [voiceId, setVoiceId] = useState(VoiceId.GEORGE);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');

  const handleGenerateSound = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const url = await generateSound({
        text: soundText,
        duration_seconds: duration,
        loop: false,
      });
      setCurrentAudioUrl(url);
      setSuccess('Звук успешно создан и воспроизводится!');
      playAudio(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка генерации звука');
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const url = await textToSpeech({
        text: speechText,
        voice_id: voiceId,
        model_id: ModelId.MULTILINGUAL_V2,
      });
      setCurrentAudioUrl(url);
      setSuccess('Речь успешно создана и воспроизводится!');
      playAudio(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка генерации речи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '32px' }}>Тест Audio API</h1>

      {loading && (
        <div style={{
          backgroundColor: '#DBEAFE',
          color: '#1E40AF',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '3px solid #1E40AF',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          Генерация аудио... Пожалуйста, подождите
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          ✅ {success}
        </div>
      )}

      {currentAudioUrl && (
        <div style={{
          backgroundColor: '#F3F4F6',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          <p style={{ marginBottom: '12px', fontSize: '14px', color: '#6B7280' }}>
            Текущее аудио:
          </p>
          <audio controls src={currentAudioUrl} style={{ width: '100%' }}>
            Ваш браузер не поддерживает аудио элемент.
          </audio>
        </div>
      )}

      {/* Генерация звука */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '16px' }}>Генерация звукового эффекта</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Описание звука:
          </label>
          <input
            type="text"
            value={soundText}
            onChange={(e) => setSoundText(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            placeholder="office noise, people talking"
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Длительность (сек): {duration}
          </label>
          <input
            type="range"
            min="0.5"
            max="22"
            step="0.5"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={handleGenerateSound}
          disabled={loading}
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Генерация...' : 'Создать звук'}
        </button>
      </section>

      {/* Text to Speech */}
      <section>
        <h2 style={{ marginBottom: '16px' }}>Преобразование текста в речь</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Текст для озвучки:
          </label>
          <textarea
            value={speechText}
            onChange={(e) => setSpeechText(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              minHeight: '80px',
              fontFamily: 'inherit',
            }}
            placeholder="Введите текст..."
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Голос:
          </label>
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value as VoiceId)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            <option value={VoiceId.GEORGE}>George (мужской)</option>
            <option value={VoiceId.RACHEL}>Rachel (женский)</option>
            <option value={VoiceId.ADAM}>Adam (мужской)</option>
            <option value={VoiceId.BELLA}>Bella (женский)</option>
            <option value={VoiceId.ANTONI}>Antoni (мужской)</option>
          </select>
        </div>

        <button
          onClick={handleTextToSpeech}
          disabled={loading}
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Генерация...' : 'Создать речь'}
        </button>
      </section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

