// src/scripts/seed.js
const path = require("path");

// Caminho para o arquivo .env:
// Garante que o .env na raiz do projeto seja carregado.
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// Caminho para o supabaseClient.js:
// Resolve o caminho absoluto para 'src/config/supabaseClient.js'.
const supabase = require(path.resolve(__dirname, "../../src/config/supabaseClient"));

// Caminho para o allPathsData.js:
const { allPathsData } = require(path.resolve(__dirname, "../../src/data/allPathsData"));

const axios = require("axios"); // Para fazer requisições HTTP (API do YouTube)

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Sua chave da API do YouTube do .env

// Helper para converter a duração ISO 8601 do YouTube (ex: PT1H30M5S) para minutos
function convertYoutubeDurationToMinutes(isoDuration) {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || 0) * 60;
  const minutes = parseInt(match[2] || 0);
  const seconds = Math.ceil(parseInt(match[3] || 0) / 60); // Arredonda segundos para o minuto mais próximo
  return hours + minutes + seconds;
}

async function seedDatabase() {
  console.log("Iniciando o processo de seeding do banco de dados para Elevate... 🚀");

  // Verifica a conexão com o Supabase
  if (!supabase || typeof supabase.from !== "function") {
    console.error("ERRO CRÍTICO: Conexão com Supabase falhou. Verifique SUPABASE_URL e SUPABASE_SERVICE_KEY no seu .env.");
    process.exit(1);
  }
  // Avisa se a chave do YouTube não estiver configurada
  if (!YOUTUBE_API_KEY) {
    console.warn("AVISO: YOUTUBE_API_KEY não definida no .env. Metadados do YouTube NÃO serão buscados.");
    // Se a chave é crítica e você quer que o seed pare, pode usar process.exit(1) aqui.
  }

  try {
    console.log("Limpando tabelas de paths, modules e contents. CUIDADO: Isso APAGA DADOS EXISTENTES nessas tabelas!");
    // Limpa as tabelas em cascata (contents -> modules -> paths) para evitar erros de FK
    await supabase.from("contents").delete().neq("id", -1); // Deleta tudo, -1 é um ID que nunca existirá
    await supabase.from("modules").delete().neq("id", "dummy"); // Deleta tudo
    await supabase.from("paths").delete().neq("id", "dummy_path"); // Deleta tudo
    console.log("Tabelas de paths, modules e contents limpas com sucesso.");

    for (const [pathIndex, pathData] of allPathsData.entries()) {
      if (!pathData.details || !pathData.details.modulesData) {
        console.warn(`\nAVISO: Trilha "${pathData.title}" (${pathData.id}) pulada, pois não possui 'details' ou 'modulesData'.`);
        continue;
      }

      console.log(`\n-> Processando trilha: ${pathData.title} (${pathData.id})`);

      // 1. Inserir/Atualizar dados na tabela 'paths' (usa upsert para ser idempotente)
      const { error: pathError } = await supabase.from("paths").upsert({
        id: pathData.id,
        title: pathData.title,
        description: pathData.description,
        category: pathData.category,
        difficulty_level: pathData.level,
        cover_image_url: pathData.icon || null, // Se 'icon' for uma URL de imagem de capa, use aqui
        long_description: pathData.details.longDescription || null,
        skills_array: pathData.details.skills || [],
        career_opportunities_array: pathData.details.careerOpportunities || [],
      });

      if (pathError) {
        console.error(`   ❌ ERRO ao upsertar trilha "${pathData.title}" (${pathData.id}): ${pathError.message}`);
        continue;
      }
      console.log(`   ✔️ Trilha "${pathData.title}" inserida/atualizada.`);

      for (const [moduleIndex, moduleData] of pathData.details.modulesData.entries()) {
        console.log(`  -> Processando módulo: ${moduleData.title} (${moduleData.id})`);

        // 2. Inserir/Atualizar dados na tabela 'modules'
        const { error: moduleError } = await supabase.from("modules").upsert({
          id: moduleData.id,
          path_id: pathData.id,
          title: moduleData.title,
          module_order: moduleData.module_order || moduleIndex + 1,
        });

        if (moduleError) {
          console.error(`     ❌ ERRO ao upsertar módulo "${moduleData.title}" (${moduleData.id}): ${moduleError.message}`);
          continue;
        }
        console.log(`     ✔️ Módulo "${moduleData.title}" inserido/atualizado.`);

        if (moduleData.lessons && moduleData.lessons.length > 0) {
          const contentsToInsert = [];
          for (const [lessonIndex, lesson] of moduleData.lessons.entries()) {
            console.log(`    -> Processando lição: ${lesson.title} (${lesson.id})`);

            let contentEntry = {
              id: lesson.id,
              module_id: moduleData.id,
              title: lesson.title,
              content_type: lesson.type,
              description: lesson.description || null,
              estimated_duration_minutes: null, // Será preenchido pela API do YouTube ou default
              content_order: lesson.content_order || lessonIndex + 1,
              url: lesson.url || null, // Prioriza 'url' se já estiver no mock (para artigos, quizzes etc.)
              youtube_video_id: null,
              thumbnail_url: null,
              channel_name: null,
            };

            // 3. Se o conteúdo for um vídeo do YouTube, busca metadados da API do YouTube
            if (lesson.type === "video" && lesson.youtubeId) {
              contentEntry.youtube_video_id = lesson.youtubeId;
              // >>>>>>>>>> CORREÇÃO FINAL E DEFINITIVA DA URL DE EMBED DO YOUTUBE <<<<<<<<<<
              // Use o formato correto: `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`
              contentEntry.url = `https://www.youtube-nocookie.com/embed/${lesson.youtubeId}`; // <<< ESTA É A CORREÇÃO FINAL E ABSOLUTA

              if (YOUTUBE_API_KEY) {
                try {
                  const youtubeResponse = await axios.get(
                    "https://www.googleapis.com/youtube/v3/videos",
                    {
                      params: {
                        id: lesson.youtubeId,
                        key: YOUTUBE_API_KEY,
                        part: "snippet,contentDetails",
                      },
                    }
                  );

                  const videoData = youtubeResponse.data.items[0];
                  if (videoData) {
                    contentEntry.thumbnail_url = videoData.snippet.thumbnails.high.url;
                    contentEntry.channel_name = videoData.snippet.channelTitle;
                    contentEntry.estimated_duration_minutes = convertYoutubeDurationToMinutes(videoData.contentDetails.duration);
                    
                    if (!lesson.title || lesson.title === videoData.snippet.title) {
                        contentEntry.title = videoData.snippet.title;
                    }
                    if (!lesson.description || lesson.description.length < 10) { 
                        contentEntry.description = videoData.snippet.description;
                    }
                    console.log(`       ✔️ Metadados do YouTube para ${lesson.youtubeId} obtidos.`);
                  } else {
                    console.warn(`       ⚠️ Vídeo do YouTube ${lesson.youtubeId} NÃO encontrado na API. Inserindo com dados limitados.`);
                  }
                } catch (youtubeError) {
                  console.error(`       ❌ ERRO ao buscar metadados do YouTube para ${lesson.youtubeId}: ${youtubeError.message}`);
                }
              } else {
                console.warn(`       ⚠️ YOUTUBE_API_KEY não configurada. Metadados do YouTube para ${lesson.youtubeId} NÃO serão buscados.`);
              }
            } else if (lesson.type === "article" || lesson.type === "quiz" || lesson.type === "project") {
              // Para outros tipos, preenche a duração se for string e contém 'min'
              if (lesson.duration && typeof lesson.duration === "string" && lesson.duration.includes("min")) {
                contentEntry.estimated_duration_minutes = parseInt(lesson.duration.replace("min", "")) || null;
              } else if (typeof lesson.duration === "number") {
                contentEntry.estimated_duration_minutes = lesson.duration;
              }
            }
            contentsToInsert.push(contentEntry);
          }

          // 4. Inserir/Atualizar conteúdos em lote
          if (contentsToInsert.length > 0) {
            const { error: contentsError } = await supabase.from("contents").upsert(contentsToInsert);
            if (contentsError) {
              console.error(`     ❌ ERRO ao upsertar conteúdos para "${moduleData.title}": ${contentsError.message}`);
              throw new Error(`Erro ao upsertar conteúdos para "${moduleData.title}": ${contentsError.message}`);
            }
            console.log(`     ✔️ ${contentsToInsert.length} conteúdos inseridos/atualizados para "${moduleData.title}".`);
          }
        } else {
          console.log(`     Módulo "${moduleData.title}" NÃO possui lições.`);
        }
      }
    }
    console.log("\n✅ Processo de seeding concluído com sucesso! Banco de dados populado com trilhas e metadados do YouTube.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Ocorreu um erro CRÍTICO durante o seeding:", error);
    process.exit(1);
  }
}

seedDatabase();