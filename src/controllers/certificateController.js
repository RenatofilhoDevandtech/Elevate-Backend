const supabase = require('../config/supabaseClient');
const { generateCertificatePDF } = require('../utils/pdfGenerator');
const crypto = require('crypto');

// Listar todos os certificados do usuário logado
exports.listMyCertificates = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('id, issued_at, unique_code, paths(id, title, description)')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar certificados.' });
  }
};

// Gerar um novo certificado (verificando a conclusão da trilha)
exports.generateCertificate = async (req, res) => {
  const userId = req.user.id;
  const { path_id } = req.body;

  if (!path_id) return res.status(400).json({ error: 'ID da trilha é obrigatório.' });

  try {
    // 1. Verificar se o certificado já existe
    const { data: existingCert } = await supabase
        .from('certificates')
        .select('id')
        .eq('user_id', userId)
        .eq('path_id', path_id)
        .single();
    if (existingCert) return res.status(409).json({ error: 'Certificado já emitido para esta trilha.' });

    // 2. Verificar se o usuário completou a trilha
    const { data: modules, error: modulesError } = await supabase.from('modules').select('id').eq('path_id', path_id);
    if (modulesError) throw modulesError;
    const moduleIds = modules.map(m => m.id);

    const { count: totalContents, error: contentsError } = await supabase.from('contents').select('id', { count: 'exact', head: true }).in('module_id', moduleIds);
    if (contentsError) throw contentsError;
    
    const { data: progressData, error: progressError } = await supabase.from('user_progress').select('content_id').eq('user_id', userId).eq('status', 'completed');
    if (progressError) throw progressError;
    const completedContentIds = new Set(progressData.map(p => p.content_id));
    
    const { data: pathContents } = await supabase.from('contents').select('id').in('module_id', moduleIds);
    const completedCount = pathContents.filter(c => completedContentIds.has(c.id)).length;

    if (completedCount < totalContents) {
      return res.status(403).json({ error: `Você ainda não concluiu todos os conteúdos desta trilha. Progresso: ${completedCount}/${totalContents}` });
    }
    
    // 3. Gerar o certificado
    const uniqueCode = crypto.randomBytes(8).toString('hex').toUpperCase();
    const { data: newCertificate, error: insertError } = await supabase
      .from('certificates')
      .insert({ user_id: userId, path_id, unique_code: uniqueCode })
      .select('id, unique_code')
      .single();
    if (insertError) throw insertError;
    
    res.status(201).json({ message: 'Certificado gerado com sucesso!', certificate: newCertificate });

  } catch (error) {
    console.error('Erro ao gerar certificado:', error);
    res.status(500).json({ error: `Erro ao gerar certificado: ${error.message}` });
  }
};

// Baixar o PDF de um certificado específico
exports.downloadCertificate = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    
    try {
        const { data: certData, error } = await supabase
            .from('certificates')
            .select(`unique_code, issued_at, paths (title), users:user_id ( raw_user_meta_data )`)
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        
        if (error || !certData) throw new Error('Certificado não encontrado ou não autorizado.');
        
        const pdfData = {
            userName: certData.users.raw_user_meta_data.full_name,
            pathTitle: certData.paths.title,
            issuedDate: new Date(certData.issued_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
            uniqueCode: certData.unique_code,
        };

        const pdfBuffer = await generateCertificatePDF(pdfData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="elevate-certificate-${certData.paths.title.replace(/\s+/g, '-')}.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Erro ao baixar certificado:', error);
        res.status(404).json({ error: error.message });
    }
};


// --- NOVA FUNÇÃO PARA VALIDAÇÃO PÚBLICA ---
// Esta função é chamada pela rota pública, por isso não usa req.user
exports.validateCertificate = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    const { data: certData, error } = await supabase
      .from('certificates')
      .select(`unique_code, issued_at, paths (title), users:user_id ( raw_user_meta_data->>full_name )`)
      .eq('unique_code', uniqueCode)
      .single();

    if (error || !certData) {
      throw new Error('Certificado não encontrado ou inválido.');
    }

    res.status(200).json({
      userName: certData.users.raw_user_meta_data.full_name,
      pathTitle: certData.paths.title,
      issuedDate: new Date(certData.issued_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
      uniqueCode: certData.unique_code,
    });

  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};