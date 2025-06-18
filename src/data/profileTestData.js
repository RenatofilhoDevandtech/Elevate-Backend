// src/data/profileTestData.js

const profileTestQuestions = [
  {
    id: 'q1',
    text: 'Qual destas atividades mais te atrai em um projeto de tecnologia?',
    type: 'multiple-choice',
    options: [
      { id: 'q1o1', text: 'Criar a aparência visual e a interatividade de um site ou app.', value: { frontend: 3, uxui: 2 } },
      { id: 'q1o2', text: 'Resolver problemas lógicos complexos e construir a "mente" por trás de uma aplicação.', value: { backend: 3, datascience: 1 } },
      { id: 'q1o3', text: 'Garantir que tudo funcione perfeitamente e encontrar falhas antes dos usuários.', value: { qa: 3 } },
      { id: 'q1o4', text: 'Planejar como diferentes partes de um sistema se conectam e otimizar processos.', value: { devops: 2, backend: 1 } },
    ],
  },
  {
    id: 'q2',
    text: 'Como você prefere aprender coisas novas?',
    type: 'multiple-choice',
    options: [
      { id: 'q2o1', text: 'Experimentando e construindo coisas práticas.', value: { frontend: 2, fullstack: 2 } },
      { id: 'q2o2', text: 'Analisando dados e entendendo padrões.', value: { datascience: 3 } },
      { id: 'q2o3', text: 'Lendo documentações e entendendo a fundo a teoria.', value: { backend: 2, devops: 1 } },
      { id: 'q2o4', text: 'Colaborando com outros e discutindo ideias.', value: { qa: 1, uxui: 1 } },
    ],
  },
  {
    id: 'q3',
    text: 'O que te dá mais satisfação?',
    type: 'multiple-choice',
    options: [
      { id: 'q3o1', text: 'Ver um design que criei ganhar vida e ser usado por pessoas.', value: { frontend: 2, uxui: 3 } },
      { id: 'q3o2', text: 'Automatizar uma tarefa repetitiva para que ninguém precise fazê-la novamente.', value: { devops: 3, backend: 1 } },
      { id: 'q3o3', text: 'Descobrir um bug difícil que ninguém mais conseguiu encontrar.', value: { qa: 3 } },
      { id: 'q3o4', text: 'Criar um algoritmo eficiente que processa dados rapidamente.', value: { backend: 2, datascience: 2 } },
    ],
  },
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
    // Garante que a resposta seja sempre um array para simplificar a lógica
    const selectedOptionIds = Array.isArray(answers[questionId]) ? answers[questionId] : [answers[questionId]];
    const question = profileTestQuestions.find(q => q.id === questionId);

    if (question) {
      selectedOptionIds.forEach(optionId => {
        const option = question.options.find(o => o.id === optionId);
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

  // Lógica para Fullstack: se front e back tiverem pontuações altas e próximas
  if (scores.frontend > 0 && scores.backend > 0) {
      scores.fullstack = (scores.frontend + scores.backend) / 2;
  }

  // Encontra a área com a maior pontuação
  let bestMatch = 'frontend'; // Um padrão caso nada seja encontrado
  let maxScore = -1;
  for (const area in scores) {
    if (scores[area] > maxScore) {
      maxScore = scores[area];
      bestMatch = area;
    }
  }

  return bestMatch; // Retorna o ID da trilha recomendada (ex: 'frontend')
};

module.exports = {
  profileTestQuestions,
  calculateProfileResult,
};