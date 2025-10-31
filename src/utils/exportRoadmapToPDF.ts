import type { ProfessionRoadmap } from '../types/roadmap';

export function exportRoadmapToPDF(roadmap: ProfessionRoadmap) {
  // Создаём HTML для печати
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна для скачивания PDF');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Roadmap - ${roadmap.profession}</title>
      <style>
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #333;
          max-width: 210mm;
          margin: 0 auto;
          padding: 10mm;
        }
        
        h1 {
          font-size: 24pt;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 5mm;
          page-break-after: avoid;
        }
        
        h2 {
          font-size: 16pt;
          font-weight: 700;
          color: #667eea;
          margin-top: 8mm;
          margin-bottom: 3mm;
          padding: 3mm;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 4px;
          page-break-after: avoid;
        }
        
        h3 {
          font-size: 13pt;
          font-weight: 600;
          color: #1F2937;
          margin-top: 5mm;
          margin-bottom: 2mm;
          page-break-after: avoid;
        }
        
        h4 {
          font-size: 11pt;
          font-weight: 600;
          color: #4B5563;
          margin-top: 3mm;
          margin-bottom: 1mm;
        }
        
        p {
          margin-bottom: 3mm;
          text-align: justify;
        }
        
        .header {
          text-align: center;
          margin-bottom: 8mm;
          border-bottom: 2px solid #667eea;
          padding-bottom: 5mm;
        }
        
        .badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 2mm 4mm;
          border-radius: 3mm;
          font-size: 9pt;
          font-weight: 600;
          margin-bottom: 2mm;
        }
        
        .section {
          margin-bottom: 5mm;
          page-break-inside: avoid;
        }
        
        .stage {
          margin-bottom: 8mm;
          page-break-inside: avoid;
        }
        
        .stage-header {
          background: #F3F4F6;
          padding: 3mm;
          border-left: 4px solid #667eea;
          margin-bottom: 3mm;
        }
        
        .stage-meta {
          font-size: 9pt;
          color: #6B7280;
          font-style: italic;
        }
        
        ul {
          margin-left: 5mm;
          margin-bottom: 3mm;
        }
        
        li {
          margin-bottom: 1mm;
        }
        
        .skill-item, .tool-item, .project-item {
          margin-bottom: 2mm;
          padding-left: 3mm;
        }
        
        .question-item {
          background: #F9FAFB;
          padding: 3mm;
          margin-bottom: 3mm;
          border-radius: 2mm;
          border-left: 3px solid #3B82F6;
          page-break-inside: avoid;
        }
        
        .question {
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 2mm;
        }
        
        .answer {
          color: #4B5563;
          font-size: 10pt;
          margin-left: 3mm;
        }
        
        .key-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 2mm;
          margin-bottom: 3mm;
        }
        
        .skill-tag {
          display: inline-block;
          background: #E5E7EB;
          color: #1F2937;
          padding: 1mm 3mm;
          border-radius: 2mm;
          font-size: 9pt;
          font-weight: 500;
        }
        
        .footer {
          margin-top: 10mm;
          padding-top: 3mm;
          border-top: 1px solid #E5E7EB;
          text-align: center;
          color: #9CA3AF;
          font-size: 9pt;
        }

        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="badge">🎯 Career Roadmap</div>
        <h1>${roadmap.profession}</h1>
      </div>

      <div class="section">
        <h3>📋 Обзор</h3>
        <p>${roadmap.overview.description}</p>
        <p><strong>Общая длительность:</strong> ${roadmap.overview.totalDuration}</p>
      </div>

      <div class="section">
        <h3>🔑 Ключевые навыки</h3>
        <div class="key-skills">
          ${roadmap.overview.keySkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>

      ${roadmap.overview.personalityInsight ? `
      <div class="section">
        <h3>💡 Личностный инсайт</h3>
        <p>${roadmap.overview.personalityInsight}</p>
      </div>
      ` : ''}

      ${roadmap.overview.astrologyInsight ? `
      <div class="section">
        <h3>⭐ Астрологический инсайт</h3>
        <p>${roadmap.overview.astrologyInsight}</p>
      </div>
      ` : ''}

      ${roadmap.stages.map((stage, index) => `
        <div class="stage">
          <h2>Этап ${index + 1}: ${stage.title}</h2>
          <div class="stage-header">
            <div class="stage-meta">${stage.level} • ${stage.duration}</div>
            <p>${stage.description}</p>
          </div>

          ${stage.goals.length > 0 ? `
          <div class="section">
            <h3>🎯 Цели</h3>
            <ul>
              ${stage.goals.map(goal => `<li>${goal}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${stage.skills.length > 0 ? `
          <div class="section">
            <h3>🔧 Навыки</h3>
            <ul>
              ${stage.skills.map(skill => `
                <li class="skill-item">
                  <strong>${skill.name}</strong> - ${skill.description}
                </li>
              `).join('')}
            </ul>
          </div>
          ` : ''}

          ${stage.tools.length > 0 ? `
          <div class="section">
            <h3>🛠️ Инструменты</h3>
            <ul>
              ${stage.tools.map(tool => `
                <li class="tool-item">
                  <strong>${tool.name}</strong> (${tool.category}) - ${tool.description}
                </li>
              `).join('')}
            </ul>
          </div>
          ` : ''}

          ${stage.projects.length > 0 ? `
          <div class="section">
            <h3>💻 Проекты для практики</h3>
            ${stage.projects.map(project => `
              <div class="project-item">
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <p><em>Навыки: ${project.skills.join(', ')}</em></p>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${stage.interviewQuestions && stage.interviewQuestions.length > 0 ? `
          <div class="section">
            <h3>💬 Вопросы на собеседовании</h3>
            ${stage.interviewQuestions.map((qa, qIndex) => `
              <div class="question-item">
                <div class="question">Q${qIndex + 1}: ${qa.question}</div>
                <div class="answer">A: ${qa.answer}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      `).join('')}

      <div class="footer">
        <p>Сгенерировано SMARTini • ${new Date().toLocaleDateString('ru-RU')}</p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 100);
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
