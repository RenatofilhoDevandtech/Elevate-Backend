// src/data/profileTestData.js

const profileTestQuestions = [
  {
    id: "q1",
    text: "Qual destas atividades mais te atrairia no dia a dia de um projeto de tecnologia?",
    type: "single-choice", // Usaremos single-choice para direcionar mais
    options: [
      {
        id: "q1o1",
        text: "Transformar ideias em interfaces visuais e interativas para usuários.",
        value: { frontend: 3, uxui: 2, fullstack: 1 },
      },
      {
        id: "q1o2",
        text: "Construir a lógica por trás dos sistemas, APIs e garantir que os dados fluam corretamente.",
        value: { backend: 3, datascience: 1, fullstack: 1 },
      },
      {
        id: "q1o3",
        text: "Garantir a qualidade do software, identificando e testando cada detalhe antes do lançamento.",
        value: { qa: 3, devops: 1 },
      },
      {
        id: "q1o4",
        text: "Automatizar processos, gerenciar servidores e garantir que o sistema esteja sempre no ar e escalável.",
        value: { devops: 3, backend: 1 },
      },
      {
        id: "q1o5",
        text: "Analisar grandes volumes de dados para extrair insights e criar modelos preditivos.",
        value: { datascience: 3, backend: 1 },
      },
      {
        id: "q1o6",
        text: "Desenhar a experiência do usuário, tornando produtos intuitivos e agradáveis de usar.",
        value: { uxui: 3, frontend: 1 },
      },
    ],
  },
  {
    id: "q2",
    text: "Você prefere resolver problemas que envolvem...",
    type: "single-choice",
    options: [
      {
        id: "q2o1",
        text: "Erros visuais na tela ou dificuldades de navegação do usuário.",
        value: { frontend: 3, uxui: 2 },
      },
      {
        id: "q2o2",
        text: "Falhas na lógica do servidor, desempenho de banco de dados ou segurança de APIs.",
        value: { backend: 3, devops: 1 },
      },
      {
        id: "q2o3",
        text: "Ineficiências na entrega de software ou problemas de infraestrutura.",
        value: { devops: 3, qa: 1 },
      },
      {
        id: "q2o4",
        text: "Padrões ocultos em grandes conjuntos de dados ou como otimizar modelos de Machine Learning.",
        value: { datascience: 3 },
      },
      {
        id: "q2o5",
        text: "Identificar como o usuário interage com um produto e aprimorar essa jornada.",
        value: { uxui: 3, frontend: 1 },
      },
      {
        id: "q2o6",
        text: "Garantir que um software atenda a todos os requisitos e seja livre de bugs críticos.",
        value: { qa: 3, devops: 1 },
      },
    ],
  },
  {
    id: "q3",
    text: "Qual ambiente de trabalho te parece mais estimulante?",
    type: "single-choice",
    options: [
      {
        id: "q3o1",
        text: "Construindo componentes visuais e animando a interface.",
        value: { frontend: 3, uxui: 2 },
      },
      {
        id: "q3o2",
        text: "Desenvolvendo sistemas complexos que rodam 'nos bastidores'.",
        value: { backend: 3, datascience: 1 },
      },
      {
        id: "q3o3",
        text: "Onde a segurança e a estabilidade dos sistemas são prioridade máxima.",
        value: { devops: 2, qa: 1 },
      },
      {
        id: "q3o4",
        text: "Trabalhando com números, estatísticas e algoritmos para desvendar informações.",
        value: { datascience: 3 },
      },
      {
        id: "q3o5",
        text: "Focando na experiência do cliente, realizando pesquisas e prototipando soluções.",
        value: { uxui: 3, frontend: 1 },
      },
      {
        id: "q3o6",
        text: "Testando exaustivamente softwares para garantir sua funcionalidade e performance.",
        value: { qa: 3 },
      },
    ],
  },
  {
    id: "q4",
    text: "Se você pudesse aprender uma nova ferramenta hoje, qual escolheria?",
    type: "single-choice",
    options: [
      {
        id: "q4o1",
        text: "React ou Vue.js (frameworks front-end)",
        value: { frontend: 3 },
      },
      {
        id: "q4o2",
        text: "Node.js com Express ou Python com Django (frameworks back-end)",
        value: { backend: 3 },
      },
      {
        id: "q4o3",
        text: "Docker ou Kubernetes (ferramentas de contêineres)",
        value: { devops: 3 },
      },
      {
        id: "q4o4",
        text: "TensorFlow ou PyTorch (bibliotecas de Machine Learning)",
        value: { datascience: 3 },
      },
      {
        id: "q4o5",
        text: "Figma ou Adobe XD (ferramentas de design de interface)",
        value: { uxui: 3 },
      },
      {
        id: "q4o6",
        text: "Cypress ou Selenium (ferramentas de automação de testes)",
        value: { qa: 3 },
      },
    ],
  },
  {
    id: "q5",
    text: "O que você valoriza mais em um time de desenvolvimento?",
    type: "single-choice",
    options: [
      {
        id: "q5o1",
        text: "Colaboração e comunicação clara para garantir a melhor entrega ao usuário.",
        value: { uxui: 2, frontend: 1, qa: 1 },
      },
      {
        id: "q5o2",
        text: "Eficiência e otimização dos processos internos e da infraestrutura.",
        value: { devops: 2, backend: 1 },
      },
      {
        id: "q5o3",
        text: "Inovação e a busca por soluções criativas para problemas complexos.",
        value: { datascience: 1, fullstack: 1 },
      },
      {
        id: "q5o4",
        text: "Atenção aos detalhes e rigor na qualidade para evitar falhas.",
        value: { qa: 2, devops: 1 },
      },
      {
        id: "q5o5",
        text: "A capacidade de construir sistemas completos, do front ao back.",
        value: { fullstack: 2 },
      },
    ],
  },
  // Adicione mais perguntas para cobrir melhor as áreas
];

const calculateProfileResult = (answers) => {
  const scores = {
    frontend: 0,
    backend: 0,
    fullstack: 0,
    qa: 0,
    devops: 0,
    datascience: 0,
    uxui: 0,
  };

  for (const questionId in answers) {
    const selectedOptionIds = Array.isArray(answers[questionId])
      ? answers[questionId]
      : [answers[questionId]];
    const question = profileTestQuestions.find((q) => q.id === questionId);

    if (question) {
      selectedOptionIds.forEach((optionId) => {
        const option = question.options.find((o) => o.id === optionId);
        if (option && option.value) {
          for (const area in option.value) {
            if (scores.hasOwnProperty(area)) {
              scores[area] += option.value[area];
            }
          }
        }
      });
    }
  }

  // --- Lógica Aprimorada para Fullstack ---
  // Fullstack não é apenas a soma, mas um perfil que se destaca em ambos
  const MIN_SCORE_FOR_INDIVIDUAL_STACK = 4; // Pontuação mínima para ser considerado "forte" em Front ou Back individualmente
  const FULLSTACK_BONUS_FOR_BALANCE = 3; // Bônus para quem tem balanço em F+B

  if (
    scores.frontend >= MIN_SCORE_FOR_INDIVIDUAL_STACK &&
    scores.backend >= MIN_SCORE_FOR_INDIVIDUAL_STACK
  ) {
    // Se a pessoa é forte nos dois, damos um score combinado + bônus de equilíbrio
    const combinedScore = scores.frontend + scores.backend;
    const scoreDifference = Math.abs(scores.frontend - scores.backend);

    // Quanto menor a diferença, maior o peso para Fullstack
    if (scoreDifference <= 2) {
      // Ex: dif de 0, 1 ou 2 pontos
      scores.fullstack = combinedScore + FULLSTACK_BONUS_FOR_BALANCE;
    } else {
      scores.fullstack = combinedScore; // Ainda é Fullstack, mas sem o bônus de balanço
    }
  } else {
    scores.fullstack = 0; // Se não é forte em ambos, não é Fullstack dominante
  }

  // --- Lógica para Priorizar Perfis Puros vs. Híbridos Iniciais ---
  // Se Fullstack for o mais alto, ótimo.
  // Caso contrário, podemos dar um pequeno boost a perfis mais "puros"
  // para evitar que um score baixo em F+B se torne Fullstack à toa.

  // Mapeamento de perfis para nomes de exibição e links de trilha
  const profileDetails = {
    frontend: { name: "Desenvolvedor Front-End", link: "frontend" },
    backend: { name: "Desenvolvedor Back-End", link: "backend" },
    fullstack: { name: "Desenvolvedor Full Stack", link: "fullstack" },
    devops: { name: "Engenheiro DevOps", link: "devops" },
    datascience: { name: "Cientista de Dados & IA", link: "data_ai" }, // ID da trilha
    uxui: { name: "Designer UX/UI", link: "ux_ui" }, // ID da trilha
    qa: { name: "Engenheiro de Qualidade (QA)", link: "qa" }, // ID da trilha
  };

  // Converte scores para um array de objetos e ordena (maior para menor)
  const sortedScores = Object.keys(scores)
    .map((area) => ({ area, score: scores[area] }))
    .sort((a, b) => b.score - a.score);

  // Filtra áreas com score 0 e pega as top N
  const topRecommendedAreas = sortedScores.filter((item) => item.score > 0);

  // Se não houver top 3 com score > 0, pegamos as 3 primeiras mesmo com 0
  let finalRecommendations =
    topRecommendedAreas.length > 0
      ? topRecommendedAreas.slice(0, 3)
      : sortedScores.slice(0, 3); // Em caso extremo de todos os scores zero, ainda mostra algo

  // Formata o resultado para incluir nome e link da trilha
  const recommendedPaths = finalRecommendations.map((item) => ({
    id: profileDetails[item.area].link,
    title: profileDetails[item.area].name,
    // Estes campos (description, category, difficulty_level, cover_image_url)
    // precisam ser populados buscando de `allPathsData` ou do DB se não vierem da API.
    // O frontend TestResultPage já espera um objeto de trilha completo para PathCard.
    // No `profileTestController.js` faremos o JOIN com a tabela 'paths' para pegar esses detalhes.
  }));

  return recommendedPaths; // Retorna um ARRAY de objetos de trilha com ID e Título
};

module.exports = {
  profileTestQuestions,
  calculateProfileResult,
};
