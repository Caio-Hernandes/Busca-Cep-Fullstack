const jwt = require('jsonwebtoken');
const prisma = require('../database.js');

const authMiddleware = async (req, res, next) => {
  try {
   
    
   
    if (req.method === 'OPTIONS') {
      console.log('Requisição OPTIONS detectada - pulando autenticação');
      return next();
    }
    
    const authHeader = req.headers.authorization;
    console.log('Auth header recebido:', authHeader);
    
    if (!authHeader) {
      console.log('❌ Nenhum header de autorização encontrado');
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);
    
    if (!token) {
      console.log('❌ Token está vazio');
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado:', decoded);
    
    req.userId = decoded.id;
    console.log('✅ UserId definido como:', req.userId);

    // Verificar se o usuário ainda existe no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado no banco:', req.userId);
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    console.log('✅ Usuário encontrado:', user.email);
    next();
  } catch (error) {
    console.error('❌ Erro na autenticação:', error);
    return res.status(401).json({ error: 'Não autorizado' });
  }
};

module.exports = authMiddleware;