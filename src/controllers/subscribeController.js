// src/controllers/subscribeController.js
const supabase = require('../config/supabaseClient');

exports.addFeatureSubscriber = async (req, res) => {
  // 1. Extrai os dados do corpo da requisição enviada pelo frontend
  const { email, feature } = req.body;

  // 2. Validação simples dos dados recebidos
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Por favor, forneça um e-mail válido.' });
  }

  try {
    // 3. Insere os dados na tabela 'feature_subscribers'
    const { data, error } = await supabase
      .from('feature_subscribers')
      .insert({
        email: email,
        feature_name: feature // 'pageName' que vem do componente UnderConstruction
      })
      .select()
      .single();

    // 4. Tratamento de erros, incluindo o caso de e-mail duplicado
    if (error) {
      // O código '23505' é o erro padrão do PostgreSQL para violação de constraint UNIQUE.
      if (error.code === '23505') {
        return res.status(409).json({ message: 'Obrigado! Este e-mail já está na nossa lista de espera para esta funcionalidade.' });
      }
      // Lança outros erros para serem capturados pelo bloco catch
      throw error;
    }
    
    // 5. Retorna uma resposta de sucesso
    res.status(201).json({ 
      message: `Obrigado! Avisaremos em ${data.email} assim que a seção de ${data.feature_name} for lançada.`,
      subscription: data 
    });

  } catch (error) {
    console.error('Erro ao registrar interesse:', error.message);
    res.status(500).json({ error: 'Não foi possível registrar seu interesse. Tente novamente mais tarde.' });
  }
};