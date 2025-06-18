// src/controllers/aiController.js
const OpenAI = require('openai');

// Inicializa o cliente da OpenAI com a chave do seu arquivo .env
// A biblioteca automaticamente procura pela variável de ambiente OPENAI_API_KEY.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Função principal que lida com a conversa da entrevista
exports.handleInterviewChat = async (req, res) => {
  // 1. Recebe o tópico e o histórico da conversa do frontend
  const { topic, history } = req.body;

  if (!history || history.length === 0) {
    return res.status(400).json({ error: 'O histórico da conversa é obrigatório.' });
  }

  // 2. O "System Prompt": A instrução mestre que define o comportamento da IA.
  // Esta é a parte mais importante para garantir a qualidade da entrevista.
  // Você pode ajustar este texto para mudar a personalidade e o comportamento do seu Mentor IA.
  const systemPrompt = `
    Você é o "Mentor IA", um entrevistador especialista em tecnologia para a plataforma educacional "Elevate".
    Sua personalidade é encorajadora, profissional e direta.
    Seu objetivo é ajudar o usuário a praticar para entrevistas.
    O foco principal da entrevista neste momento é sobre: ${topic || 'conhecimentos gerais de tecnologia'}.

    REGRAS IMPORTANTES:
    1. Faça uma pergunta por vez. Suas perguntas devem ser abertas e projetadas para avaliar o conhecimento técnico ou comportamental do usuário.
    2. NUNCA dê a resposta para a sua própria pergunta. Seu papel é questionar e avaliar, não ensinar a resposta.
    3. Mantenha suas respostas e perguntas concisas e diretas, como um entrevistador real faria.
    4. Use o histórico da conversa para fazer perguntas de acompanhamento relevantes e evitar repetições.
    5. Se a resposta do usuário for muito curta, peça para ele elaborar (ex: "Interessante. Poderia me dar um exemplo prático disso?").
    6. Se o usuário pedir feedback sobre uma resposta, forneça uma crítica construtiva e sucinta, apontando um ponto forte e uma área para melhoria.
  `;

  try {
    // 3. Mapeamos o histórico do frontend para o formato que a API da OpenAI espera
    const messagesForAPI = history.map(msg => ({
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text,
    }));

    // 4. Criamos a chamada para a API de Chat
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Um modelo rápido e com ótimo custo-benefício
      messages: [
        { role: "system", content: systemPrompt }, // A instrução mestre vai primeiro
        ...messagesForAPI, // Depois todo o histórico da conversa para dar contexto
      ],
      temperature: 0.7, // Controla a "criatividade". 0.7 é um bom equilíbrio.
      max_tokens: 150,  // Limita o tamanho da resposta para ser concisa
    });

    // 5. Extraímos a resposta de texto da IA
    const botResponse = completion.choices[0].message.content.trim();

    // 6. Enviamos a resposta de volta para o frontend
    res.status(200).json({ response: botResponse });

  } catch (error) {
    console.error('Erro na API da OpenAI:', error);
    res.status(500).json({ error: 'Não foi possível obter uma resposta da IA.' });
  }
};