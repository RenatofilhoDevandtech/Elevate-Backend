// src/controllers/aiController.js
const OpenAI = require("openai");
const Joi = require("joi"); // Biblioteca para validar dados de entrada

// Inicializa o cliente da OpenAI. A chave é lida de OPENAI_API_KEY no .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define as regras para validar os dados que chegam na requisição
const chatSchema = Joi.object({
  topic: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "O tópico é obrigatório.",
    "string.min": "O tópico deve ter pelo menos 3 caracteres.",
    "string.max": "O tópico não pode exceder 100 caracteres.",
    "any.required": "O tópico é obrigatório.",
  }),
  history: Joi.array()
    .items(
      Joi.object({
        sender: Joi.string().valid("user", "bot").required(), // Quem enviou a mensagem: 'user' ou 'bot'
        text: Joi.string().trim().min(1).required(), // O conteúdo da mensagem
      })
    )
    .min(1) // O histórico deve ter pelo menos uma mensagem
    .required()
    .messages({
      "array.min":
        "O histórico da conversa é obrigatório e não pode estar vazio.",
      "any.required": "O histórico da conversa é obrigatório.",
    }),
});

// Função que processa a conversa com o Mentor IA
exports.handleInterviewChat = async (req, res) => {
  // Valida os dados da requisição
  const { error: validationError, value } = chatSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }

  const { topic, history } = value; // Pega o tópico e o histórico de mensagens

  // Define o papel e as regras do Mentor IA
  const systemPrompt = `
    Você é o "Mentor IA", um entrevistador profissional de tecnologia da plataforma "Elevate".
    Seu objetivo é ajudar o usuário a praticar para entrevistas, focando em: ${topic}.
    
    Regras:
    1. Faça uma pergunta por vez. Perguntas abertas para avaliar conhecimento ou comportamento.
    2. NUNCA dê a resposta. Apenas questione e avalie.
    3. Seja conciso e direto, como um entrevistador real.
    4. Use o histórico para fazer perguntas de acompanhamento e evitar repetições.
    5. Se a resposta do usuário for curta, peça para ele elaborar (ex: "Poderia dar um exemplo?").
    6. Se o usuário pedir feedback, critique construtivamente (ponto forte e área para melhoria).
    7. Comece com uma pergunta introdutória sobre o tópico.
  `;

  try {
    // Converte o histórico de mensagens para o formato da API da OpenAI
    const messagesForAPI = history.map((msg) => ({
      role: msg.sender === "bot" ? "assistant" : "user", // 'bot' do frontend vira 'assistant' na OpenAI
      content: msg.text,
    }));

    // Chama a API de Chat Completion da OpenAI para obter a resposta do Mentor IA
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Modelo da IA
      messages: [
        { role: "system", content: systemPrompt }, // A instrução principal da IA
        ...messagesForAPI, // O histórico da conversa
      ],
      temperature: 0.7, // Controla a "criatividade" da IA (0.0 a 1.0)
      max_tokens: 150, // Limita o tamanho da resposta da IA
    });

    // Extrai e envia a resposta da IA de volta para o frontend
    const botResponse = completion.choices[0].message.content.trim();
    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Erro na API da OpenAI:", error); // Loga o erro completo para depuração no servidor
    res.status(500).json({
      error: "Não foi possível obter uma resposta da IA.",
      details: error.response?.data?.error?.message || error.message, // Detalhes do erro para depuração
    });
  }
};
