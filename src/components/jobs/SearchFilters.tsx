import { Search } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: () => void;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '24px',
      borderRadius: '16px',
      margin: '0 32px 24px 32px',
      display: 'grid',
      gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr auto',
      gap: '16px',
      alignItems: 'end',
    }}>
      <div>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#6B7280',
        }}>
          Должность / Ключевые слова
        </label>
        <input
          type="text"
          placeholder="например: UI Дизайнер, Backend Разработчик"
          style={{
            width: '100%',
            backgroundColor: '#F9FAFB',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '14px',
            color: '#1F2937',
          }}
        />
      </div>

      <div>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#6B7280',
        }}>
          Местоположение
        </label>
        <select style={{
          width: '100%',
          backgroundColor: '#F9FAFB',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '14px',
          color: '#1F2937',
          cursor: 'pointer',
        }}>
          <option>Удаленно</option>
          <option>Москва</option>
          <option>Санкт-Петербург</option>
          <option>Нью-Йорк</option>
          <option>Лондон</option>
        </select>
      </div>

      <div>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#6B7280',
        }}>
          Уровень опыта
        </label>
        <select style={{
          width: '100%',
          backgroundColor: '#F9FAFB',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '14px',
          color: '#1F2937',
          cursor: 'pointer',
        }}>
          <option>Выберите уровень опыта</option>
          <option>Начальный</option>
          <option>Средний</option>
          <option>Старший</option>
          <option>Руководитель</option>
        </select>
      </div>

      <div>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#6B7280',
        }}>
          Тип работы
        </label>
        <select style={{
          width: '100%',
          backgroundColor: '#F9FAFB',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '14px',
          color: '#1F2937',
          cursor: 'pointer',
        }}>
          <option>Выберите тип работы</option>
          <option>Полная занятость</option>
          <option>Частичная занятость</option>
          <option>Контракт</option>
          <option>Фриланс</option>
        </select>
      </div>

      <button
        onClick={onSearch}
        style={{
          backgroundColor: '#000000',
          color: '#FFFFFF',
          padding: '16px 32px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
        }}
      >
        <Search size={20} />
        Поиск
      </button>
    </div>
  );
}

