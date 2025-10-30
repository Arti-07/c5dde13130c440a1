import { Mail, Bell, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: '#E5E7EB',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{
          backgroundColor: '#000000',
          color: '#FFFFFF',
          fontSize: '18px',
          fontWeight: '600',
          padding: '8px 16px',
          borderRadius: '24px',
        }}>
          talentry
        </div>
        
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
         
          <Link to="/companies" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>
            Компании
          </Link>
          <Link to="/ai-cv-analysis" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>
            AI анализ резюме
          </Link>
          <Link to="/mock-interview" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>
            Пробное интервью
          </Link>
          <Link to="/career-coach" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>
            Карьерный коуч
          </Link>
          <Link to="/audio-test" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>
            Audio Test
          </Link>
          <Link to="/about" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>
            О нас
          </Link>
        </nav>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button style={{
          backgroundColor: '#F3F4F6',
          border: 'none',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Mail size={20} color="#6B7280" />
        </button>
        
        <button style={{
          backgroundColor: '#F3F4F6',
          border: 'none',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Bell size={20} color="#6B7280" />
        </button>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#F3F4F6',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={24} color="#6B7280" />
        </button>
      </div>
    </header>
  );
}

