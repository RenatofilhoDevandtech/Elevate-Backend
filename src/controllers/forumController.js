// src/controllers/forumController.js
const supabase = require('../config/supabaseClient');
const slugify = require('slugify');

// Listar todos os tópicos do fórum (com informações do criador e contagem de posts)
exports.listForumTopics = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('forum_topics')
            .select('id, created_at, title, slug, category, last_activity_at, users:user_id(id, raw_user_meta_data->>full_name)')
            .order('last_activity_at', { ascending: false });
            
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar tópicos do fórum.' });
    }
};

// Criar um novo tópico no fórum
exports.createForumTopic = async (req, res) => {
    const userId = req.user.id;
    const { title, category } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'O título do tópico é obrigatório.' });
    }

    const slug = slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });

    try {
        const { data, error } = await supabase
            .from('forum_topics')
            .insert({ user_id: userId, title, slug, category })
            .select()
            .single();

        if (error) {
            // Tratar erros de slug duplicado
            if (error.code === '23505' && error.details.includes('slug')) {
                return res.status(409).json({ error: 'Já existe um tópico com um título muito parecido. Tente um título diferente.' });
            }
            throw error;
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o tópico do fórum.' });
    }
};