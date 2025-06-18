const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const supabase = require('../config/supabaseClient');
const { allPathsData } = require('../data/allPathsData');

async function seedDatabase() {
  console.log('Iniciando o processo de seeding...');
  if (!supabase || typeof supabase.from !== 'function') {
    console.error('ERRO: Conexão com Supabase falhou. Verifique .env');
    process.exit(1);
  }
  try {
    console.log('Limpando tabelas...');
    await supabase.from('contents').delete().neq('id', -1);
    await supabase.from('modules').delete().neq('id', 'dummy');
    await supabase.from('paths').delete().neq('id', 'dummy');
    console.log('Tabelas limpas.');
    for (const pathData of allPathsData) {
      if (!pathData.details) continue;
      console.log(`\n-> Inserindo trilha: ${pathData.title}`);
      const { error: pathError } = await supabase.from('paths').insert({
        id: pathData.id, title: pathData.title, description: pathData.description,
        category: pathData.category, difficulty_level: pathData.level,
      });
      if (pathError) throw new Error(`Trilha "${pathData.title}": ${pathError.message}`);
      if (pathData.details.modulesData) {
        for (const moduleData of pathData.details.modulesData) {
          const { error: moduleError } = await supabase.from('modules').insert({
            id: moduleData.id, path_id: pathData.id, title: moduleData.title
          });
          if (moduleError) throw new Error(`Módulo "${moduleData.title}": ${moduleError.message}`);
          if (moduleData.lessons && moduleData.lessons.length > 0) {
            const lessonsToInsert = moduleData.lessons.map((lesson, index) => ({
              id: lesson.id, module_id: moduleData.id, title: lesson.title, content_type: lesson.type,
              url: `https://www.youtube.com/embed/YOUTUBE_ID_HERE{lesson.youtubeId}`,
              estimated_duration_minutes: parseInt(lesson.duration) || null, content_order: index + 1,
            }));
            const { error: lessonsError } = await supabase.from('contents').insert(lessonsToInsert);
            if (lessonsError) throw new Error(`Aulas para "${moduleData.title}": ${lessonsError.message}`);
          }
        }
      }
    }
    console.log('\n✅ Processo de seeding concluído com sucesso!');
  } catch (error) {
    console.error('\n❌ Ocorreu um erro durante o seeding:', error);
    process.exit(1);
  }
}
seedDatabase();