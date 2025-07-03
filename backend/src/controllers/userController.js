const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../database.js');

const userController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      console.log('Dados recebidos:', req.body)
      
      // Verificar se o email já existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      });
      
      
      const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );
      
      
      res.status(201).json({ 
        token, 
        user: { id: user.id, name: user.name, email: user.email } 
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(400).json({ error: 'Erro no cadastro' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
      );
      
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro no login' });
    }
  }
};

module.exports = userController;