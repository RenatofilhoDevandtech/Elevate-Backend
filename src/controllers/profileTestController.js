// src/controllers/profileTestController.js
const supabase = require('../config/supabaseClient');
const { profileTestQuestions, calculateProfileResult } = require('../data/profileTestData');

// Função para enviar as perguntas para o frontend (sem as pontuações)
exports.getTestQuestions = (req, res) => {
  const questionsForFrontend = profileTestQuestions.map(q => {
    const optionsForFrontend = q.options.map(o => {
      const { value, ...optionData } = o; // Remove a propriedade 'value'
      return optionData;
    });
    return { ...q, options: optionsForFrontend };
  });

  res.status(200).json(questionsForFrontend);
};

// Função para receber as respostas, calcular, salvar e retornar a recomendação
exports.submitTestAnswers = async (req, res) => {
  const userId = req.user.id;
  const { answers } = req.body;

  if (!answers || Object.keys(answers).length === 0) {
    return res.status(400).json({ error: 'Nenhuma resposta foi enviada.' });
  }

  try {
    const recommendedPathId = calculateProfileResult(answers);

    const { error: submissionError } = await supabase
      .from('profile_test_submissions')
      .upsert({
        user_id: userId,
        answers: answers,
        recommended_path_ids: [recommendedPathId],
        submitted_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (submissionError) throw submissionError;

    const { data: recommendedPath, error: pathError } = await supabase
      .from('paths')
      .select('id, title, description, category, difficulty_level')
      .eq('id', recommendedPathId)
      .single();

    if (pathError || !recommendedPath) {
      return res.status(404).json({ error: 'Trilha recomendada não encontrada no banco de dados.' });
    }

    res.status(200).json({ recommendation: recommendedPath });

  } catch (error) {
    console.error('Erro ao processar o teste de perfil:', error.message);
    res.status(500).json({ error: 'Erro ao processar o resultado do teste.' });
  }
};