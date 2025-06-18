const supabase = require('../config/supabaseClient');

exports.getAllPaths = async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 9 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('paths_with_stats')
      .select('id, title, description, category, difficulty_level, cover_image_url, modules_count', { count: 'exact' });

    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    if (category && category !== 'All') query = query.eq('category', category);
    if (level && level !== 'All') query = query.eq('difficulty_level', level);

    query = query.range(offset, offset + limit - 1).order('title', { ascending: true });
    
    const { data: pathsData, error, count } = await query;
    if (error) throw error;
    
    // Inicia os dados finais
    let finalData = pathsData.map(path => ({ ...path, modules: path.modules_count, userProgress: null }));

    // MELHORIA: Se o usuário estiver logado (req.user existe graças ao middleware 'protect'), busca o progresso
    if (req.user) {
        const userId = req.user.id;
        const pathIds = pathsData.map(p => p.id);
        
        // Busca todos os módulos das trilhas listadas
        const { data: modules } = await supabase.from('modules').select('id, path_id').in('path_id', pathIds);
        const moduleIds = modules.map(m => m.id);

        // Busca todos os conteúdos desses módulos
        const { data: allContents } = await supabase.from('contents').select('id, module_id').in('module_id', moduleIds);
        
        // Busca todo o progresso do usuário
        const { data: userProgress } = await supabase.from('user_progress').select('content_id').eq('user_id', userId).eq('status', 'completed');
        const completedContentIds = new Set(userProgress.map(p => p.content_id));

        // Mapeia e calcula o progresso de volta para cada trilha
        finalData = finalData.map(path => {
            const pathModules = modules.filter(m => m.path_id === path.id);
            const pathModuleIds = pathModules.map(m => m.id);
            const contentsForPath = allContents.filter(c => pathModuleIds.includes(c.module_id));
            
            const completedCount = contentsForPath.filter(c => completedContentIds.has(c.id)).length;
            const totalCount = contentsForPath.length;
            
            return {
                ...path,
                userProgress: {
                    completed: completedCount,
                    total: totalCount,
                    percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
                }
            };
        });
    }

    res.status(200).json({
      data: finalData,
      pagination: { totalItems: count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page), limit: parseInt(limit) }
    });

  } catch (error) {
    console.error('Erro ao buscar trilhas com filtros:', error.message);
    res.status(500).json({ error: 'Erro ao buscar as trilhas de aprendizado.' });
  }
};

/**
 * Busca uma trilha específica pelo seu ID, incluindo todos os seus módulos e conteúdos.
 * (Esta função não precisou de alterações)
 */
exports.getPathById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('paths')
      .select(`
        id, title, description, category, difficulty_level, cover_image_url,
        modules ( id, title, module_order,
          contents ( id, title, content_type, url, description, estimated_duration_minutes, content_order )
        )
      `)
      .eq('id', id)
      .order('module_order', { foreignTable: 'modules', ascending: true })
      .order('content_order', { foreignTable: 'modules.contents', ascending: true })
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Trilha não encontrada.' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(`Erro ao buscar trilha ${id}:`, error.message);
    res.status(500).json({ error: 'Erro ao buscar os detalhes da trilha.' });
  }
};