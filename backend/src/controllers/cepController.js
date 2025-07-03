const prisma = require('../database.js');

const cepController = {
  // Listar todos os CEPs
  async index(req, res) {
    try {
      const userId = req.userId;
      const ceps = await prisma.cep.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return res.json(ceps);
    } catch (error) {
      console.error('Erro ao buscar CEPs:', error);
      return res.status(500).json({ error: 'Erro ao buscar CEPs' });
    }
  },

  // Cadastrar novo CEP
  async store(req, res) {
    try {
      const userId = req.userId;
      const { cep, logradouro, localidade, uf } = req.body;

      // ✅ CORREÇÃO: Verificar se CEP já existe para este usuário
      const cepExists = await prisma.cep.findFirst({
        where: { 
          cep: cep,
          userId: userId.toString() 
        }
      });

      if (cepExists) {
        return res.status(400).json({ error: 'CEP já cadastrado' });
      }

      const newCep = await prisma.cep.create({
        data: {
          cep,
          logradouro,
          localidade,
          uf,
          userId
        }
      });

      return res.status(201).json(newCep);
    } catch (error) {
      console.error('Erro ao cadastrar CEP:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar CEP' });
    }
  },

  // Deletar CEP
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      // ✅ CORREÇÃO: Verificar se o CEP pertence ao usuário logado
      const cep = await prisma.cep.findFirst({
        where: { 
          id: parseInt(id),
          userId: userId 
        }
      });

      if (!cep) {
        return res.status(404).json({ error: 'CEP não encontrado ou você não tem permissão' });
      }

      await prisma.cep.delete({
        where: { id: parseInt(id) }
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar CEP:', error);
      return res.status(500).json({ error: 'Erro ao deletar CEP' });
    }
  }
};

module.exports = cepController;