// src/data/allPathsData.js
// Conteúdo expandido para Front-End, Back-End, Full Stack (do Zero ao Expert)

const allPathsData = [
  {
    id: "frontend",
    title: "Desenvolvedor Front-End Completo",
    description:
      "Crie interfaces web interativas e responsivas com HTML, CSS, JavaScript e frameworks modernos como React.",
    icon: "💻",
    level: "Iniciante",
    category: "Desenvolvimento Web",
    details: {
      longDescription:
        "A trilha de Desenvolvedor Front-End Completo é o seu portal definitivo para o mundo da criação de interfaces web. Você aprenderá desde os fundamentos da web (HTML, CSS, JavaScript), passará por frameworks como React, ferramentas de build e princípios de UX/UI, até o desenvolvimento de aplicações complexas, responsivas e de alta performance. Prepare-se para construir experiências digitais incríveis.",
      skills: [
        "HTML5",
        "CSS3 (Flexbox, Grid)",
        "JavaScript (ES6+)",
        "DOM Manipulation",
        "React.js",
        "State Management (Context API, Redux)",
        "Hooks",
        "APIs RESTful",
        "Async JS",
        "Webpack/Vite",
        "Git/GitHub",
        "Design Responsivo",
        "Performance Web",
        "Testes (Jest, React Testing Library)",
        "UX/UI Fundamentos",
      ],
      careerOpportunities: [
        "Desenvolvedor Front-End Jr/Pleno/Sênior",
        "Engenheiro de UI",
        "Especialista em React",
        "Desenvolvedor Web",
      ],
      modulesData: [
        // Módulo 1: Fundamentos da Web (HTML, CSS Básico)
        {
          id: "fe_mod_1_web_fund",
          title: "Módulo 1: Fundamentos Essenciais da Web",
          module_order: 1,
          lessons: [
            {
              id: 101,
              title: "Anatomia da Web: HTML, CSS, JS",
              content_type: "video",
              youtubeId: "Y_m1Lq0yF2Y",
              content_order: 1,
            },
            {
              id: 102,
              title: "HTML5: Estrutura Semântica e Acessibilidade",
              content_type: "video",
              youtubeId: "epDCjksKMok",
              content_order: 2,
            },
            {
              id: 103,
              title: "CSS Básico: Seletores, Box Model e Fundamentos",
              content_type: "video",
              youtubeId: "fS0fS1rGg4U",
              content_order: 3,
            },
            {
              id: 104,
              title: "Primeiro Projeto: Construindo uma Página Estática",
              content_type: "project",
              description: "Crie uma página web simples usando HTML e CSS",
              content_order: 4,
              duration: "60min",
            },
          ],
        },
        // Módulo 2: CSS Avançado e Responsividade
        {
          id: "fe_mod_2_css_adv",
          title: "Módulo 2: Estilização Avançada com CSS",
          module_order: 2,
          lessons: [
            {
              id: 201,
              title: "Flexbox: Layouts Modernos e Flexíveis",
              content_type: "video",
              youtubeId: "fYq5PXgS_Q8",
              content_order: 1,
            },
            {
              id: 202,
              title: "CSS Grid: Layouts Bidimensionais Robustos",
              content_type: "video",
              youtubeId: "tJ-i-L2F6-s",
              content_order: 2,
            },
            {
              id: 203,
              title: "Design Responsivo: Media Queries e Mobile-First",
              content_type: "video",
              youtubeId: "lAChEBGkEKQ",
              content_order: 3,
            },
            {
              id: 204,
              title: "CSS Custom Properties (Variáveis CSS) e Animações",
              content_type: "article",
              url: "https://developer.mozilla.org/pt-BR/docs/Web/CSS/Using_CSS_custom_properties",
              content_order: 4,
              duration: "30min",
            },
          ],
        },
        // Módulo 3: JavaScript Essencial
        {
          id: "fe_mod_3_js_ess",
          title: "Módulo 3: JavaScript Essencial para a Web",
          module_order: 3,
          lessons: [
            {
              id: 301,
              title: "Variáveis, Tipos de Dados e Operadores",
              content_type: "video",
              youtubeId: "PfJ_Vw9Fm_Q",
              content_order: 1,
            },
            {
              id: 302,
              title: "Estruturas de Controle: Condicionais e Loops",
              content_type: "video",
              youtubeId: "E_x_Jb-Q3o8",
              content_order: 2,
            },
            {
              id: 303,
              title: "Funções: Declaração, Expressões e Arrow Functions",
              content_type: "video",
              youtubeId: "W31M5C49L_E",
              content_order: 3,
            },
            {
              id: 304,
              title: "Manipulação do DOM e Eventos",
              content_type: "video",
              youtubeId: "PFXvLwB9E-0",
              content_order: 4,
            },
            {
              id: 305,
              title: "JavaScript Assíncrono: Callbacks, Promises e Async/Await",
              content_type: "video",
              youtubeId: "MDNfM_L0J0Y",
              content_order: 5,
            },
          ],
        },
        // Módulo 4: React.js Fundamentos
        {
          id: "fe_mod_4_react_fund",
          title: "Módulo 4: Primeiros Passos com React.js",
          module_order: 4,
          lessons: [
            {
              id: 401,
              title: "Introdução ao React: Componentes e JSX",
              content_type: "video",
              youtubeId: "DqM2tWkyI2M",
              content_order: 1,
            },
            {
              id: 402,
              title: "Props: Passando Dados entre Componentes",
              content_type: "video",
              youtubeId: "sV-Ua1jCjH4",
              content_order: 2,
            },
            {
              id: 403,
              title: "State: Gerenciando o Estado Interno de Componentes",
              content_type: "video",
              youtubeId: "fL1aB1m1WjQ",
              content_order: 3,
            },
            {
              id: 404,
              title: "Eventos no React",
              content_type: "article",
              url: "https://pt-br.react.dev/learn/responding-to-events",
              content_order: 4,
              duration: "25min",
            },
          ],
        },
        // Módulo 5: React Hooks e Gerenciamento de Estado
        {
          id: "fe_mod_5_react_hooks",
          title: "Módulo 5: React Hooks e Gerenciamento de Estado",
          module_order: 5,
          lessons: [
            {
              id: 501,
              title: "useState e useEffect: O Essencial dos Hooks",
              content_type: "video",
              youtubeId: "k_U9_vD30-Q",
              content_order: 1,
            },
            {
              id: 502,
              title: "useContext: Compartilhando Estado Global",
              content_type: "video",
              youtubeId: "Z5iF_j1x4iE",
              content_order: 2,
            },
            {
              id: 503,
              title: "useRef e useMemo/useCallback: Otimização de Performance",
              content_type: "video",
              youtubeId: "r-x_b-s-p-s",
              content_order: 3,
            },
            {
              id: 504,
              title: "Projeto Prático: To-Do List com Hooks",
              content_type: "project",
              description:
                "Crie um app de lista de tarefas completo com React Hooks",
              content_order: 4,
              duration: "90min",
            },
          ],
        },
        // Módulo 6: Roteamento, Requisições HTTP e Context API
        {
          id: "fe_mod_6_routing_http",
          title: "Módulo 6: Navegação e Consumo de APIs",
          module_order: 6,
          lessons: [
            {
              id: 601,
              title: "React Router DOM: Navegação no SPA",
              content_type: "video",
              youtubeId: "sV-Ua1jCjH4",
              content_order: 1,
            }, // Reuso de ID, ajustar se necessário
            {
              id: 602,
              title: "Consumindo APIs REST com Fetch e Axios",
              content_type: "video",
              youtubeId: "gB5zL669_jQ",
              content_order: 2,
            },
            {
              id: 603,
              title: "Tratamento de Erros em Requisições",
              content_type: "article",
              url: "https://www.alura.com.br/artigos/tratando-erros-requisicoes-http",
              content_order: 3,
              duration: "20min",
            },
          ],
        },
        // Módulo 7: Boas Práticas, Testes e Performance
        {
          id: "fe_mod_7_best_practices",
          title: "Módulo 7: Boas Práticas e Otimização Front-End",
          module_order: 7,
          lessons: [
            {
              id: 701,
              title: "Performance Web: Otimizando seu Código e Assets",
              content_type: "video",
              youtubeId: "XQx9n6x4h5A",
              content_order: 1,
            },
            {
              id: 702,
              title: "Introdução a Testes: Jest e React Testing Library",
              content_type: "video",
              youtubeId: "gG5-vK-d22Q",
              content_order: 2,
            },
            {
              id: 703,
              title: "Princípios de UX/UI para Desenvolvedores",
              content_type: "article",
              url: "https://www.alura.com.br/artigos/ux-para-desenvolvedores",
              content_order: 3,
              duration: "35min",
            },
            {
              id: 704,
              title: "Projeto Final: Aplicação Web Completa (CRUD)",
              content_type: "project",
              description:
                "Desenvolva uma aplicação web completa com React, roteamento, consumo de API e testes.",
              content_order: 4,
              duration: "240min",
            },
          ],
        },
      ],
    },
  },
  {
    id: "backend",
    title: "Desenvolvedor Back-End Completo",
    description:
      "Construa a lógica de servidor, APIs robustas e gerencie bancos de dados com Node.js e Express.",
    icon: "⚙️",
    level: "Intermediário",
    category: "Desenvolvimento Web",
    details: {
      longDescription:
        "A trilha de Desenvolvedor Back-End Completo foca na construção da espinha dorsal de qualquer aplicação. Você aprenderá a criar APIs escaláveis e seguras com Node.js e Express, gerenciar dados em bancos de dados relacionais (PostgreSQL) e não relacionais (MongoDB), e implementar autenticação, segurança e deploy. Prepare-se para ser o arquiteto por trás dos sistemas.",
      skills: [
        "Node.js",
        "Express.js",
        "APIs RESTful",
        "HTTP/HTTPS",
        "SQL (PostgreSQL)",
        "NoSQL (MongoDB)",
        "Autenticação (JWT)",
        "Middleware",
        "Modelagem de Dados",
        "Testes (Mocha, Chai, Jest)",
        "Docker",
        "Deploy (Nginx, PM2)",
        "Segurança de APIs",
      ],
      careerOpportunities: [
        "Desenvolvedor Back-End Jr/Pleno/Sênior",
        "Engenheiro de Software (Back-End)",
        "API Developer",
      ],
      modulesData: [
        // Módulo 1: Fundamentos de Servidores e Node.js
        {
          id: "be_mod_1_node_fund",
          title: "Módulo 1: Fundamentos de Servidores e Node.js",
          module_order: 1,
          lessons: [
            {
              id: 1001,
              title: "Como a Web Funciona: HTTP e o Modelo Cliente-Servidor",
              content_type: "video",
              youtubeId: "ZtD65tPz4Qo",
              content_order: 1,
            },
            {
              id: 1002,
              title: "Introdução ao Node.js, NPM e Módulos",
              content_type: "video",
              youtubeId: "L73Wf3nL7j0",
              content_order: 2,
            },
            {
              id: 1003,
              title: "JavaScript no Servidor: ES Modules e CommonJS",
              content_type: "article",
              url: "https://www.treinaweb.com.br/blog/javascript-no-backend-commonjs-vs-es-modules",
              content_order: 3,
              duration: "20min",
            },
          ],
        },
        // Módulo 2: Express.js para APIs RESTful
        {
          id: "be_mod_2_express",
          title: "Módulo 2: Construindo APIs com Express.js",
          module_order: 2,
          lessons: [
            {
              id: 2001,
              title: "Primeira API REST com Express: Rotas e Respostas",
              content_type: "video",
              youtubeId: "pM_g52u6Jp8",
              content_order: 1,
            },
            {
              id: 2002,
              title: "Middleware no Express: Autenticação, Logs e Erros",
              content_type: "video",
              youtubeId: "jVj1lS_2tV4",
              content_order: 2,
            },
            {
              id: 2003,
              title: "Estrutura de Projeto: Rotas, Controllers e Serviços",
              content_type: "article",
              url: "https://blog.rocketseat.com.br/arquitetura-de-software-backend/",
              content_order: 3,
              duration: "30min",
            },
          ],
        },
        // Módulo 3: Banco de Dados Relacionais (PostgreSQL com Supabase)
        {
          id: "be_mod_3_sql_supabase",
          title: "Módulo 3: Banco de Dados com PostgreSQL e Supabase",
          module_order: 3,
          lessons: [
            {
              id: 3001,
              title: "Introdução ao SQL e Modelagem de Dados",
              content_type: "video",
              youtubeId: "PGP-c-YpQjU",
              content_order: 1,
            },
            {
              id: 3002,
              title: "Supabase: Configuração e Primeiras Consultas",
              content_type: "video",
              youtubeId: "wVl_yq0Fp2g",
              content_order: 2,
            },
            {
              id: 3003,
              title: "CRUD Completo com Node.js, Express e Supabase",
              content_type: "project",
              description:
                "Construa uma API RESTful completa usando Express e Supabase.",
              content_order: 3,
              duration: "120min",
            },
          ],
        },
        // Módulo 4: Autenticação e Segurança
        {
          id: "be_mod_4_auth_sec",
          title: "Módulo 4: Autenticação e Segurança de APIs",
          module_order: 4,
          lessons: [
            {
              id: 4001,
              title: "Autenticação com JWT e Supabase Auth",
              content_type: "video",
              youtubeId: "r_0_2nJ3K1E",
              content_order: 1,
            },
            {
              id: 4002,
              title: "Autorização Baseada em Roles (RBAC)",
              content_type: "article",
              url: "https://medium.com/desenvolvimento-com-seguranca/controle-de-acesso-baseado-em-fun%C3%A7%C3%B5es-rbac-a72e81d8a113",
              content_order: 2,
              duration: "25min",
            },
            {
              id: 4003,
              title: "Segurança de APIs: OWASP Top 10 e Boas Práticas",
              content_type: "video",
              youtubeId: "9-Qo-i2L_5Q",
              content_order: 3,
            },
          ],
        },
        // Módulo 5: Testes e Deploy
        {
          id: "be_mod_5_test_deploy",
          title: "Módulo 5: Testes, Logging e Deploy",
          module_order: 5,
          lessons: [
            {
              id: 5001,
              title: "Introdução a Testes de API: Mocha, Chai e Jest",
              content_type: "video",
              youtubeId: "gG5-vK-d22Q",
              content_order: 1,
            }, // Reuso do ID
            {
              id: 5002,
              title: "Docker para Aplicações Node.js",
              content_type: "video",
              youtubeId: "b8F0E2Cg-wE",
              content_order: 2,
            }, // Reuso do ID
            {
              id: 5003,
              title: "Deploy de Aplicações Node.js na Nuvem (Render, Railway)",
              content_type: "article",
              url: "https://www.freecodecamp.org/news/how-to-deploy-a-nodejs-app/",
              content_order: 3,
              duration: "45min",
            },
          ],
        },
      ],
    },
  },
  {
    id: "fullstack",
    title: "Desenvolvedor Full Stack Completo",
    description:
      "Domine o desenvolvimento front-end e back-end para criar aplicações web completas e escaláveis.",
    icon: "🚀",
    level: "Avançado",
    category: "Desenvolvimento Web",
    details: {
      longDescription:
        "A trilha de Desenvolvedor Full Stack Completo te capacita a construir aplicações web de ponta a ponta. Você aprenderá a integrar o front-end e o back-end de forma fluida, a gerenciar bancos de dados e a implantar suas aplicações. Esta é a trilha para quem busca uma compreensão holística do desenvolvimento web, tornando-se um profissional completo.",
      skills: [
        "HTML",
        "CSS",
        "JavaScript",
        "React.js",
        "Node.js",
        "Express.js",
        "SQL/NoSQL Databases",
        "APIs RESTful",
        "Autenticação",
        "Containerization (Docker)",
        "CI/CD",
        "Cloud Deployment",
        "Testes Integrados",
        "Microservices (Introdução)",
      ],
      careerOpportunities: [
        "Desenvolvedor Full Stack Jr/Pleno/Sênior",
        "Engenheiro de Software Full Stack",
        "Arquiteto de Soluções Web",
      ],
      modulesData: [
        // Módulo 1: Integração Front-End e Back-End
        {
          id: "fs_mod_1_integration",
          title: "Módulo 1: Conectando Front-End e Back-End",
          module_order: 1,
          lessons: [
            {
              id: 1,
              title: "Entendendo Requisições HTTP e CORS",
              content_type: "video",
              youtubeId: "sF2d4D9oP9o",
              content_order: 1,
            }, // Reuso ID
            {
              id: 2,
              title: "Consumindo APIs REST no Front-End com Axios",
              content_type: "video",
              youtubeId: "gB5zL669_jQ",
              content_order: 2,
            }, // Reuso ID
            {
              id: 3,
              title: "Autenticação em Aplicações Full Stack (JWT)",
              content_type: "video",
              youtubeId: "r_0_2nJ3K1E",
              content_order: 3,
            }, // Reuso ID
          ],
        },
        // Módulo 2: Desenvolvimento de Projeto Full Stack
        {
          id: "fs_mod_2_project",
          title: "Módulo 2: Projeto Prático Full Stack",
          module_order: 2,
          lessons: [
            {
              id: 4,
              title: "Planejamento e Design de uma Aplicação Completa",
              content_type: "article",
              url: "https://www.alura.com.br/artigos/planejamento-de-aplicacao-web",
              content_order: 1,
              duration: "40min",
            },
            {
              id: 5,
              title: "Desenvolvimento do Back-End: APIs e Banco de Dados",
              content_type: "project",
              description:
                "Crie o backend para a aplicação de blog/e-commerce.",
              content_order: 2,
              duration: "180min",
            },
            {
              id: 6,
              title: "Desenvolvimento do Front-End: Interface e Integração",
              content_type: "project",
              description: "Crie o frontend e integre com a API desenvolvida.",
              content_order: 3,
              duration: "180min",
            },
          ],
        },
        // Módulo 3: Testes, Deploy e Boas Práticas Full Stack
        {
          id: "fs_mod_3_deploy",
          title: "Módulo 3: Deploy, Testes e Otimização Full Stack",
          module_order: 3,
          lessons: [
            {
              id: 7,
              title: "Testes Integrados: Front-End e Back-End",
              content_type: "video",
              youtubeId: "oYw6t4G2qf8",
              content_order: 1,
            },
            {
              id: 8,
              title: "Introdução a Docker e Contêineres",
              content_type: "video",
              youtubeId: "b8F0E2Cg-wE",
              content_order: 2,
            }, // Reuso ID
            {
              id: 9,
              title:
                "Deploy de Aplicações Full Stack na Nuvem (Ex: Vercel, Render)",
              content_type: "video",
              youtubeId: "Y_m1Lq0yF2Y",
              content_order: 3,
            }, // Reuso ID
            {
              id: 10,
              title: "Boas Práticas de Segurança em Aplicações Web",
              content_type: "article",
              url: "https://www.treinaweb.com.br/blog/seguranca-em-aplicacoes-web-as-melhores-praticas/",
              content_order: 4,
              duration: "30min",
            },
          ],
        },
      ],
    },
  },
  // --- OUTRAS TRILHAS (MANTIDAS, MAS COM IDs CORRIGIDOS) ---
  {
    id: "devops",
    title: "Engenheiro DevOps",
    description:
      "Automatize, otimize e gerencie o ciclo de vida de desenvolvimento e operação de software.",
    icon: "☁️",
    level: "Avançado",
    category: "Infraestrutura e Operações",
    details: {
      longDescription:
        "A trilha de Engenheiro DevOps te prepara para o mundo da integração contínua, entrega contínua (CI/CD) e orquestração de containers. Aprenda a usar ferramentas como Docker, Kubernetes, Jenkins e a gerenciar infraestruturas em nuvem para construir pipelines de deploy robustos e eficientes.",
      skills: [
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Jenkins",
        "AWS/Azure/GCP",
        "Linux",
        "Scripting (Bash/Python)",
        "Monitoramento",
      ],
      careerOpportunities: [
        "Engenheiro DevOps Jr.",
        "Engenheiro de Confiabilidade de Site (SRE)",
        "Engenheiro de Automação",
      ],
      modulesData: [
        {
          id: "devops_module_1",
          title: "Módulo 1: Introdução a DevOps e Docker",
          module_order: 1,
          lessons: [
            {
              id: 3001,
              title: "O que é DevOps?",
              content_type: "video",
              youtubeId: "X_C18u51f4c",
              content_order: 1,
            },
            {
              id: 3002,
              title: "Primeiros Passos com Docker",
              content_type: "video",
              youtubeId: "b8F0E2Cg-wE",
              content_order: 2,
            },
          ],
        },
      ],
    },
  },
  {
    id: "qa",
    title: "Engenheiro de Qualidade (QA)",
    description:
      "Garanta a qualidade do software, implementando testes automatizados e manuais para aplicações robustas.",
    icon: "🐛",
    level: "Intermediário",
    category: "Qualidade e Testes",
    details: {
      longDescription:
        "A trilha de Engenheiro de Qualidade (QA) te ensina a identificar, reportar e prevenir defeitos em software. Você aprenderá sobre metodologias de teste, automação de testes (Selenium, Cypress) e garantia de qualidade em todo o ciclo de vida do desenvolvimento. Seja a pessoa que assegura que o software funciona como esperado.",
      skills: [
        "Testes Manuais",
        "Testes Automatizados",
        "Selenium",
        "Cypress",
        "JMeter",
        "Metodologias Ágeis",
        "Bug Tracking",
        "Automação de Testes",
      ],
      careerOpportunities: [
        "Engenheiro de QA Jr.",
        "Analista de Testes",
        "Automatizador de Testes",
      ],
      modulesData: [
        {
          id: "qa_module_1",
          title: "Módulo 1: Fundamentos de Teste de Software",
          module_order: 1,
          lessons: [
            {
              id: 4001,
              title: "O que é Teste de Software?",
              content_type: "video",
              youtubeId: "d6P0x_1Y48o",
              content_order: 1,
            },
            {
              id: 4002,
              title:
                "Tipos de Teste: Funcional, Não-Funcional, Unidade, Integração",
              content_type: "article",
              url: "https://www.alura.com.br/artigos/tipos-de-testes-software",
              content_order: 2,
              duration: "15min",
            },
          ],
        },
      ],
    },
  },
  {
    id: "data_ai",
    title: "Cientista de Dados & IA",
    description:
      "Analise grandes volumes de dados, construa modelos preditivos e desenvolva soluções de inteligência artificial.",
    icon: "🧠",
    level: "Avançado",
    category: "Dados e IA",
    details: {
      longDescription:
        "A trilha de Cientista de Dados & IA te imerge no universo dos dados. Você aprenderá a coletar, limpar, analisar e visualizar grandes volumes de informações, além de construir modelos de Machine Learning e Inteligência Artificial para resolver problemas complexos e tomar decisões baseadas em dados.",
      skills: [
        "Python",
        "R",
        "SQL",
        "Machine Learning",
        "Deep Learning",
        "Pandas",
        "NumPy",
        "TensorFlow/PyTorch",
        "Visualização de Dados",
      ],
      careerOpportunities: [
        "Cientista de Dados Jr.",
        "Engenheiro de Machine Learning",
        "Analista de Dados",
        "Especialista em IA",
      ],
      modulesData: [
        {
          id: "dataai_module_1",
          title: "Módulo 1: Fundamentos de Python para Dados",
          module_order: 1,
          lessons: [
            {
              id: 5001,
              title: "Introdução ao Python e Ambiente de Desenvolvimento",
              content_type: "video",
              youtubeId: "fr-y7_34R8E",
              content_order: 1,
            },
            {
              id: 5002,
              title: "Estruturas de Dados e Controle em Python",
              content_type: "video",
              youtubeId: "k5l8wM9Fw0c",
              content_order: 2,
            },
          ],
        },
      ],
    },
  },
  {
    id: "ux_ui",
    title: "Designer UX/UI",
    description:
      "Crie experiências de usuário intuitivas e interfaces digitais visualmente atraentes e funcionais.",
    icon: "🎨",
    level: "Iniciante",
    category: "Design",
    details: {
      longDescription:
        "A trilha de Designer UX/UI te capacita a projetar produtos digitais que não são apenas bonitos, mas também fáceis de usar e prazerosos. Você aprenderá sobre pesquisa de usuário, prototipagem, testes de usabilidade e princípios de design de interface, transformando ideias em soluções que encantam usuários.",
      skills: [
        "Pesquisa de Usuário",
        "Wireframing",
        "Prototipagem (Figma/Adobe XD)",
        "Testes de Usabilidade",
        "Design System",
        "Interface Gráfica",
        "Acessibilidade",
        "Design Thinking",
      ],
      careerOpportunities: [
        "Designer UX/UI Jr.",
        "Product Designer",
        "Designer de Interfaces",
        "Arquiteto de Informação",
      ],
      modulesData: [
        {
          id: "uxui_module_1",
          title: "Módulo 1: Introdução a UX/UI Design",
          module_order: 1,
          lessons: [
            {
              id: 6001,
              title: "O que é UX e UI Design?",
              content_type: "video",
              youtubeId: "n4_J1qFk_3A",
              content_order: 1,
            },
            {
              id: 6002,
              title: "Princípios de Usabilidade e Acessibilidade",
              content_type: "article",
              url: "https://www.gov.br/governodigital/pt-br/experiencia-do-usuario/principios-de-usabilidade",
              content_order: 2,
              duration: "15min",
            },
          ],
        },
      ],
    },
  },
];

module.exports = { allPathsData };
