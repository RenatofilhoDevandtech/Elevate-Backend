// src/controllers/certificateController.js
const supabase = require("../config/supabaseClient");
const { generateCertificatePDF } = require("../utils/pdfGenerator"); // Seu gerador de PDF
const crypto = require("crypto"); // Módulo nativo do Node.js para gerar códigos únicos
const Joi = require("joi"); // Para validação de entrada
const path = require("path"); // Para resolver caminhos de arquivo (se for carregar imagens para o PDF)
const fs = require("fs/promises"); // Para ler arquivos (se for carregar imagens para o PDF)

// Esquema de validação para a requisição de geração de certificado
const generateCertificateSchema = Joi.object({
  path_id: Joi.string().trim().required().messages({
    "string.empty": "O ID da trilha é obrigatório.",
    "any.required": "O ID da trilha é obrigatório.",
  }),
});

// Verifica se o usuário concluiu todos os conteúdos de uma trilha
async function checkPathCompletion(userId, pathId) {
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select(`id, contents (id)`)
    .eq("path_id", pathId);

  if (modulesError) {
    console.error("Erro Supabase ao buscar módulos para checagem de conclusão:", modulesError.message);
    throw new Error("Falha ao verificar módulos da trilha.");
  }
  if (!modules || modules.length === 0) {
    return { isCompleted: false, completedCount: 0, totalContents: 0 };
  }

  let totalContents = 0;
  const allContentIdsInPath = [];
  modules.forEach((module) => {
    if (module.contents) {
      totalContents += module.contents.length;
      module.contents.forEach((content) => allContentIdsInPath.push(content.id));
    }
  });

  if (totalContents === 0) {
    return { isCompleted: false, completedCount: 0, totalContents: 0 };
  }

  const { data: progressData, error: progressError } = await supabase
    .from("user_progress")
    .select("content_id")
    .eq("user_id", userId)
    .in("content_id", allContentIdsInPath)
    .eq("status", "completed");

  if (progressError) {
    console.error("Erro Supabase ao buscar progresso do usuário para checagem de conclusão:", progressError.message);
    throw new Error("Falha ao buscar progresso do usuário.");
  }

  const completedCount = progressData.length;
  const isCompleted = completedCount === totalContents;

  return { isCompleted, completedCount, totalContents };
}

// Lista todos os certificados do usuário logado
exports.listMyCertificates = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("id, issued_at, unique_code, paths(id, title, description)")
      .eq("user_id", userId)
      .order("issued_at", { ascending: false });

    if (error) {
      console.error("Erro Supabase ao buscar certificados:", error.message);
      throw new Error("Falha ao buscar seus certificados.");
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro inesperado ao listar certificados:", error.message);
    res.status(500).json({ error: error.message || "Erro ao buscar certificados." });
  }
};

// Gera um novo certificado após verificar a conclusão da trilha
exports.generateCertificate = async (req, res) => {
  const userId = req.user.id;

  const { error: validationError, value } = generateCertificateSchema.validate(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError.details[0].message });
  }
  const { path_id } = value;

  try {
    // 1. Verifica se o certificado já existe
    const { data: existingCert, error: existingCertError } = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", userId)
      .eq("path_id", path_id)
      .single();

    if (existingCertError && existingCertError.code !== "PGRST116") {
      console.error("Erro Supabase ao verificar certificado existente:", existingCertError.message);
      throw new Error("Falha ao verificar certificado existente.");
    }
    if (existingCert) {
      return res.status(409).json({ error: "Certificado já emitido para esta trilha." });
    }

    // 2. Verifica se o usuário completou a trilha
    const { isCompleted, completedCount, totalContents } = await checkPathCompletion(userId, path_id);

    if (!isCompleted) {
      return res.status(403).json({
        error: `Você ainda não concluiu todos os conteúdos desta trilha. Progresso: ${completedCount}/${totalContents}`,
      });
    }

    // 3. Gera um código único para o certificado
    const uniqueCode = crypto.randomBytes(8).toString("hex").toUpperCase();

    // 4. Insere o novo certificado no banco de dados
    const { data: newCertificate, error: insertError } = await supabase
      .from("certificates")
      .insert({ user_id: userId, path_id, unique_code: uniqueCode })
      .select("id, unique_code")
      .single();

    if (insertError) {
      console.error("Erro Supabase ao inserir novo certificado:", insertError.message);
      throw new Error("Falha ao registrar o novo certificado.");
    }

    res.status(201).json({
      message: "Certificado gerado com sucesso!",
      certificate: newCertificate,
    });
  } catch (error) {
    console.error("Erro geral ao gerar certificado:", error.message);
    res.status(500).json({
      error: error.message || "Ocorreu um erro interno ao gerar certificado.",
    });
  }
};

// Baixa o PDF de um certificado específico para o usuário logado
exports.downloadCertificate = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    // 1. Busca os dados do certificado, juntando com informações da trilha e do usuário
    const { data: certData, error } = await supabase
      .from("certificates")
      .select(
        `
        unique_code,
        issued_at,
        paths (title),
        users:user_id ( raw_user_meta_data->>full_name ) 
        `
      )
      .eq("id", id)
      .eq("user_id", userId) // Garante que o usuário só pode baixar o próprio certificado
      .single();

    if (error || !certData) {
      console.error("Erro Supabase ao buscar dados do certificado para download:", error?.message);
      throw new Error("Certificado não encontrado ou você não tem permissão para baixá-lo.");
    }

    // 2. Extrai o nome do usuário e outros dados para o PDF
    const userName = certData.users?.raw_user_meta_data; // Já é a string do nome devido ao ->>
    if (!userName) {
      console.warn(`Nome completo não encontrado para o usuário ${userId} no certificado ${id}.`);
    }

    // Caminhos para as imagens do certificado
    const elevateLogoPath = path.resolve(__dirname, "../assets/elevate_logo.png");
    const directorSignaturePath = path.resolve(__dirname, "../assets/director_signature.png");

    // Lês e converte imagens para Base64
    const elevateLogoBase64 = await fs.readFile(elevateLogoPath, { encoding: "base64" });
    const directorSignatureBase64 = await fs.readFile(directorSignaturePath, { encoding: "base64" });

    const pdfData = {
      userName: userName || "Participante Elevate",
      pathTitle: certData.paths.title,
      issuedDate: new Date(certData.issued_at).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      uniqueCode: certData.unique_code,
      elevateLogoBase64: elevateLogoBase64,
      signatureImageBase64: directorSignatureBase64,
      VERIFY_URL: `https://elevate-backend-1pwj.onrender.com/api/certificates/validate/${certData.unique_code}`,
      VERIFY_URL_DISPLAY: `elevate.com/verify/${certData.unique_code}`,
    };

    // 3. Gera o PDF
    const pdfBuffer = await generateCertificatePDF(pdfData);

    // 4. Envia o PDF como resposta
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="elevate-certificate-${certData.paths.title.replace(/\s+/g, "-")}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao baixar certificado:", error.message);
    res.status(error.message.includes("não encontrado") ? 404 : 500).json({ error: error.message || "Erro ao baixar certificado." });
  }
};

// Função pública para validação externa de certificado (não exige autenticação)
exports.validateCertificate = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Busca o certificado pelo código único, juntando informações do usuário e trilha
    const { data: certData, error } = await supabase
      .from("certificates")
      .select(
        `
        unique_code,
        issued_at,
        paths (title),
        users:user_id ( raw_user_meta_data->>full_name )
        `
      )
      .eq("unique_code", uniqueCode)
      .single();

    if (error || !certData) {
      console.error("Erro Supabase ao validar certificado:", error?.message);
      return res.status(404).json({ error: "Certificado não encontrado ou inválido." });
    }

    // Extrai o nome do usuário (já string devido ao `->>full_name`)
    const userName = certData.users?.raw_user_meta_data; // Já é a string do nome devido ao `->>`
    if (!userName) {
      console.warn(`Nome completo não encontrado para o certificado ${uniqueCode} durante a validação.`);
    }

    res.status(200).json({
      userName: userName || "Participante Elevate",
      pathTitle: certData.paths.title,
      issuedDate: new Date(certData.issued_at).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      uniqueCode: certData.unique_code,
      validationUrl: `https://elevate-backend-1pwj.onrender.com/api/certificates/validate/${uniqueCode}`,
    });
  } catch (error) {
    console.error("Erro ao validar certificado:", error.message);
    res.status(500).json({ error: error.message || "Erro ao validar certificado." });
  }
};