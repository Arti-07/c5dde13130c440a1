import { FileText, UserPlus, Bookmark, Calendar, Clock, Settings } from 'lucide-react';

export function FilterSidebar() {
  const actionButtons = [
    { icon: UserPlus, label: 'Добавить контакт' },
    { icon: Bookmark, label: 'Сохраненные вакансии' },
    { icon: FileText, label: 'Документы' },
    { icon: Calendar, label: 'Календарь' },
    { icon: Clock, label: 'История' },
    { icon: Settings, label: 'Настройки' },
  ];

  return (
    <aside style={{ width: '360px', padding: '0 0 0 32px' }}>
      {/* AI Match Card */}
      <div style={{
        backgroundColor: '#F9FAFB',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          backgroundColor: '#E5E7EB',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <FileText size={28} color="#6B7280" />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1F2937' }}>
          Пусть AI найдет вашу идеальную работу
        </h3>
        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
          Загрузите резюме и получите подборку мгновенно
        </p>
        <button style={{
          backgroundColor: '#000000',
          color: '#FFFFFF',
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Найти совпадения
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {actionButtons.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              style={{
                backgroundColor: '#F3F4F6',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: '#1F2937',
                fontWeight: '500',
              }}
            >
              <Icon size={20} color="#6B7280" />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#1F2937',
          }}>
            Компания / Индустрия
          </label>
          <select style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            color: '#6B7280',
            cursor: 'pointer',
          }}>
            <option>Медиа и Дизайн</option>
            <option>Технологии</option>
            <option>Финансы</option>
            <option>Здравоохранение</option>
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#1F2937',
          }}>
            График работы
          </label>
          <select style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            color: '#6B7280',
            cursor: 'pointer',
          }}>
            <option>Гибкий график</option>
            <option>Стандартный 9-5</option>
            <option>Сменный график</option>
            <option>Частичная занятость</option>
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#1F2937',
          }}>
            Диапазон зарплаты
          </label>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '12px',
              fontSize: '14px',
              color: '#1F2937',
              fontWeight: '500',
            }}>
              <span>₽80ТЫС</span>
              <span>₽150ТЫС</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="200000" 
              defaultValue="150000"
              style={{ width: '100%' }}
            />
            <div style={{ 
              fontSize: '12px', 
              color: '#6B7280',
              marginTop: '8px',
              textAlign: 'center',
            }}>
              В год
            </div>
          </div>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#1F2937',
          }}>
            Тип работы
          </label>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
          }}>
            {['Полная занятость', 'Частичная занятость', 'Контракт', 'Фриланс'].map((type) => (
              <label key={type} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                fontSize: '14px',
                color: '#1F2937',
                cursor: 'pointer',
              }}>
                <input 
                  type="checkbox" 
                  style={{ marginRight: '8px' }}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

