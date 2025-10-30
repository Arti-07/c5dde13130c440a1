/**
 * UIShowcase - Демонстрация всех UI компонентов
 * Полезно для тестирования и визуализации
 */

import { Search, Heart, Star, Download } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { Input } from './Input';

export function UIShowcase() {
  return (
    <div style={{ 
      padding: '40px',
      backgroundColor: '#E5E7EB',
      minHeight: '100vh',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '36px', 
          marginBottom: '12px',
          color: '#1F2937',
        }}>
          Витрина UI компонентов
        </h1>
        <p style={{ 
          color: '#6B7280', 
          marginBottom: '48px',
          fontSize: '16px',
        }}>
          Демонстрация всех переиспользуемых UI компонентов
        </p>

        {/* Buttons Section */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '24px',
            color: '#1F2937',
          }}>
            Кнопки
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#6B7280' }}>
              Варианты
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="primary">Основная</Button>
              <Button variant="secondary">Вторичная</Button>
              <Button variant="outline">Контурная</Button>
              <Button variant="primary" disabled>Отключена</Button>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#6B7280' }}>
              Размеры
            </h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" size="sm">Маленькая</Button>
              <Button variant="primary" size="md">Средняя</Button>
              <Button variant="primary" size="lg">Большая</Button>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#6B7280' }}>
              С иконками
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="primary" icon={<Search size={18} />}>
                Поиск
              </Button>
              <Button variant="secondary" icon={<Heart size={18} />}>
                Нравится
              </Button>
              <Button variant="outline" icon={<Download size={18} />}>
                Скачать
              </Button>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#6B7280' }}>
              Полная ширина
            </h3>
            <Button variant="primary" fullWidth>
              Кнопка на всю ширину
            </Button>
          </div>
        </section>

        {/* Cards Section */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '24px',
            color: '#1F2937',
          }}>
            Карточки
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <Card variant="light" padding="md">
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Светлая карточка</h3>
              <p style={{ color: '#6B7280', fontSize: '14px' }}>
                Это светлая карточка со средним отступом.
              </p>
            </Card>

            <Card variant="dark" padding="md">
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Темная карточка</h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                Это темная карточка со средним отступом.
              </p>
            </Card>

            <Card variant="muted" padding="md">
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#1F2937' }}>Приглушенная карточка</h3>
              <p style={{ color: '#6B7280', fontSize: '14px' }}>
                Это приглушенная карточка со средним отступом.
              </p>
            </Card>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
            <Card variant="light" padding="sm" style={{ flex: 1 }}>
              <p style={{ fontSize: '14px' }}>Малый отступ</p>
            </Card>
            <Card variant="light" padding="md" style={{ flex: 1 }}>
              <p style={{ fontSize: '14px' }}>Средний отступ</p>
            </Card>
            <Card variant="light" padding="lg" style={{ flex: 1 }}>
              <p style={{ fontSize: '14px' }}>Большой отступ</p>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '24px',
            color: '#1F2937',
          }}>
            Значки
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#6B7280' }}>
              Варианты
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge variant="default">По умолчанию</Badge>
              <Badge variant="primary">Основной</Badge>
              <Badge variant="success">Успех</Badge>
              <Badge variant="warning">Предупреждение</Badge>
              <Badge variant="danger">Опасность</Badge>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#6B7280' }}>
              Размеры
            </h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant="primary" size="sm">Малый</Badge>
              <Badge variant="primary" size="md">Средний</Badge>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#6B7280' }}>
              Реальные примеры
            </h3>
            <Card variant="light" padding="md">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Badge variant="success">
                  <Star size={12} style={{ marginRight: '4px' }} />
                  Проверено
                </Badge>
                <Badge variant="default">Полная занятость</Badge>
                <Badge variant="default">Удаленно</Badge>
                <Badge variant="warning">Срочно</Badge>
                <Badge variant="primary">Избранное</Badge>
              </div>
            </Card>
          </div>
        </section>

        {/* Inputs Section */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '24px',
            color: '#1F2937',
          }}>
            Поля ввода
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <Input 
              label="Текстовое поле" 
              type="text" 
              placeholder="Введите текст..."
              fullWidth
            />
            
            <Input 
              label="Поле email" 
              type="email" 
              placeholder="ваш@email.com"
              fullWidth
            />
            
            <Input 
              label="Поле пароля" 
              type="password" 
              placeholder="••••••••"
              fullWidth
            />
            
            <Input 
              label="Поле поиска" 
              type="search" 
              placeholder="Поиск..."
              fullWidth
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <Input 
              label="Поле на всю ширину" 
              type="text" 
              placeholder="Это поле занимает всю ширину"
              fullWidth
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <Input 
              label="Отключенное поле" 
              type="text" 
              placeholder="Это поле отключено"
              disabled
              fullWidth
            />
          </div>
        </section>

        {/* Combined Example */}
        <section>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '24px',
            color: '#1F2937',
          }}>
            Комбинированный пример
          </h2>
          
          <Card variant="light" padding="lg">
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
                Старший React разработчик
                <Badge variant="success" size="sm" style={{ marginLeft: '12px' }}>
                  Проверено
                </Badge>
              </h3>
              <p style={{ color: '#6B7280', marginBottom: '16px' }}>
                Google • Удаленно • $120K - $180K
              </p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <Badge variant="default">Полная занятость</Badge>
                <Badge variant="default">Старший уровень</Badge>
                <Badge variant="primary">Избранное</Badge>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <Input 
                label="Откликнуться с email" 
                type="email" 
                placeholder="ваш@email.com"
                fullWidth
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="primary" icon={<Heart size={18} />}>
                Сохранить вакансию
              </Button>
              <Button variant="outline">
                Узнать больше
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

