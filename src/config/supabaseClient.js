// src/config/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

// 1. Lê as suas credenciais secretas do arquivo .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// 2. Verifica se as credenciais foram realmente encontradas no .env
if (!supabaseUrl || !supabaseKey) {
  console.error("ERRO CRÍTICO: Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_KEY não encontradas.");
  console.error("Verifique se o seu arquivo .env na raiz do projeto backend está preenchido corretamente.");
  
  // Exportamos null para que qualquer tentativa de uso falhe de forma clara.
  module.exports = null; 
} else {
  // 3. Cria o cliente de conexão do Supabase
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      // Configurações importantes para uso em backend (server-to-server)
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });

  // 4. Exporta o cliente pronto para ser usado em outros arquivos
  module.exports = supabase;
}