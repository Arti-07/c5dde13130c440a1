import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import './AuthPage.css';
import writingManAnimation from '../../assets/Writing man.json';
import typingGirlAnimation from '../../assets/typing girl.json';

export function AuthPage() {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  // Автоматически переключаемся на регистрацию, если URL /register
  useEffect(() => {
    if (location.pathname === '/register') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location.pathname]);
  
  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Register state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await login(loginUsername, loginPassword);
      navigate('/');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    // Валидация на фронтенде
    if (registerUsername.length < 3) {
      setRegisterError('Имя пользователя должно содержать минимум 3 символа');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Пароли не совпадают');
      return;
    }

    setRegisterLoading(true);

    try {
      await register(registerUsername, registerPassword);
      navigate('/');
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-container ${isActive ? 'active' : ''}`}>
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Создать аккаунт</h1>
            <span>Используйте свои данные для регистрации</span>
            <input
              type="text"
              placeholder="Имя пользователя"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
              disabled={registerLoading}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              disabled={registerLoading}
            />
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              required
              disabled={registerLoading}
            />
            {registerError && <div className="error-message">{registerError}</div>}
            <div className="form-switch">
              Уже есть аккаунт?
              <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                Войти
              </a>
            </div>
            <button type="submit" disabled={registerLoading}>
              {registerLoading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleLoginSubmit}>
            <h1>Войти</h1>
            <span>Используйте свои данные для входа</span>
            <input
              type="text"
              placeholder="Имя пользователя"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
              disabled={loginLoading}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              disabled={loginLoading}
            />
            {loginError && <div className="error-message">{loginError}</div>}
            <div className="form-switch">
              Нет аккаунта?
              <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
                Зарегистрироваться
              </a>
            </div>
            <button type="submit" disabled={loginLoading}>
              {loginLoading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <Lottie 
                animationData={writingManAnimation} 
                loop={true}
                className="toggle-lottie"
              />
            </div>
            <div className="toggle-panel toggle-right">
              <Lottie 
                animationData={typingGirlAnimation} 
                loop={true}
                className="toggle-lottie"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

