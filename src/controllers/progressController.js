// src/controllers/progressController.js
const supabase = require('../config/supabaseClient');

// Marcar um conteúdo (aula) como concluído para o usuário logado
exports.markContentComplete = async (req, res) => {
  const userId = req.user.id;
  const { content_id } = req.body;

  if (!content_id) {
    return res.status(400).json({ error: 'O ID do conteúdo é obrigatório.' });
  }

  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        content_id: content_id,
        status: 'completed',
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_content_unique'
      });

    if (error) throw error;

    res.status(200).json({ message: 'Progresso atualizado com sucesso.' });

  } catch (error) {
    console.error('Erro ao marcar conteúdo como completo:', error.message);
    res.status(500).json({ error: 'Erro ao salvar o progresso.' });
  }
};

// Buscar todos os IDs de conteúdos concluídos pelo usuário logado
exports.getCompletionStatus = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('content_id')
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (error) throw error;

    const completedContentIds = data.map(item => item.content_id);

    res.status(200).json({ completedContentIds });

  } catch (error) {
    console.error('Erro ao buscar status de conclusão:', error.message);
    res.status(500).json({ error: 'Erro ao buscar o progresso do usuário.' });
  }
};