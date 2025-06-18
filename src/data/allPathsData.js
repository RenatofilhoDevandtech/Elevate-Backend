// src/data/allPathsData.js

// NOTA: Os IDs foram ajustados para corresponder ao schema do banco de dados que criamos.
// (path.id = text, module.id = text, lesson.id = integer)

const allPathsData = [
  {
    id: 'frontend', // Este ID deve ser único e corresponder ao que está no teste de perfil
    title: 'Desenvolvedor Front-End',
    description: 'Crie interfaces web interativas e responsivas com HTML, CSS, JavaScript e frameworks modernos como React ou Vue.',
    icon: '💻',
    modules: 12,
    level: 'Iniciante',
    category: 'Desenvolvimento Web',
    details: {
      longDescription: "A trilha de Desenvolvedor Front-End é o seu portal para o mundo da criação de interfaces web. Você aprenderá desde os fundamentos do HTML, CSS e JavaScript, até o desenvolvimento de aplicações complexas e dinâmicas com React. Prepare-se para construir sites visualmente atraentes, responsivos e com ótima experiência do usuário.",
      skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Git", "APIs REST", "Design Responsivo"],
      careerOpportunities: ["Desenvolvedor Front-End Jr.", "Engenheiro de UI", "Desenvolvedor Web"],
      modulesData: [
        { 
          id: 'fe_module_1', 
          title: 'Módulo 1: HTML Essencial', 
          level: 'Básico',
          lessons: [
            { id: 101, title: 'Introdução ao HTML e Estrutura de Páginas', type: 'video', duration: '12min', youtubeId: 'epDCjksKMok' },
            { id: 102, title: 'Tags Semânticas e Boas Práticas', type: 'video', duration: '15min', youtubeId: 'b21PApgtP9U' },
            { id: 103, title: 'Formulários e Entradas de Usuário', type: 'article', duration: '20min', link: 'https://developer.mozilla.org/pt-BR/docs/Learn/Forms' },
          ]
        },
        { 
          id: 'fe_module_2', 
          title: 'Módulo 2: CSS para Estilização', 
          level: 'Básico',
          lessons: [
            { id: 201, title: 'Seletores CSS e Box Model', type: 'video', duration: '18min', youtubeId: 'GPK8A-A2w5A' },
            { id: 202, title: 'Flexbox e Grid Layout', type: 'video', duration: '25min', youtubeId: 'fYq5PXgS_Q8' },
            { id: 203, title: 'Design Responsivo com Media Queries', type: 'video', duration: '22min', youtubeId: 'lAChEBGkEKQ' },
          ]
        },
        { id: 'fe_module_3', title: 'Módulo 3: JavaScript Fundamental', level: 'Intermediário', lessons: [] },
        { id: 'fe_module_4', title: 'Módulo 4: Introdução ao React', level: 'Intermediário', lessons: [] },
      ]
    }
  },
  {
    id: 'backend',
    title: 'Desenvolvedor Back-End',
    description: 'Construa a lógica de servidor, APIs robustas e gerencie bancos de dados com tecnologias como Node.js ou Python.',
    icon: '⚙️',
    modules: 15,
    level: 'Intermediário',
    category: 'Desenvolvimento Web',
    details: { /* ... preencher similarmente ... */ }
  },
  {
    id: 'fullstack',
    title: 'Desenvolvedor Full Stack',
    description: 'Domine o desenvolvimento front-end e back-end para criar aplicações web completas e escaláveis.',
    icon: '🚀',
    modules: 20,
    level: 'Avançado',
    category: 'Desenvolvimento Web',
    details: { /* ... preencher similarmente ... */ }
  },
  // ... Outras trilhas (DevOps, QA, Data Science, UX/UI) ...
];

module.exports = { allPathsData };