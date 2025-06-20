// src/middlewares/adminAuthMiddleware.js
// Este middleware de autorização deve ser usado APÓS o `authMiddleware` (protect)
// que popula `req.user` com as informações do usuário autenticado.

const authorize = (roles = []) => {
    // Garante que 'roles' seja sempre um array para simplificar a lógica interna
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        // Verifica se as informações do usuário estão presentes após a autenticação
        if (!req.user) {
            // Este caso não deveria ocorrer se o middleware 'protect' funcionar corretamente,
            // mas é uma salvaguarda para garantir que o usuário está autenticado.
            return res.status(401).json({ error: 'Não autorizado. Usuário não autenticado.' });
        }

        const userRole = req.user.user_metadata?.role; // Acessa a role do usuário

        // Verifica se o usuário tem a role necessária para acessar a rota
        // Se 'roles' estiver vazio, significa que qualquer usuário autenticado pode acessar.
        // Caso contrário, verifica se a role do usuário está na lista de roles permitidas.
        if (roles.length === 0 || (userRole && roles.includes(userRole))) {
            next(); // Permite o acesso à próxima função do middleware/rota
        } else {
            // Loga o acesso negado para fins de auditoria/segurança no backend
            console.warn(`Acesso negado para o usuário ${req.user.id} com role '${userRole}'. Necessita de uma das roles: ${roles.join(', ')}`);
            // Retorna um status 403 Forbidden para o frontend
            return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para realizar esta ação.' });
        }
    };
};

module.exports = authorize;