const prisma = require('../database');

const cepController = {
  // Listar todos os CEPs
  async index(req, res) {
    try {
      const ceps = await prisma.cep.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return res.json(ceps);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar CEPs' });
    }
  },

  // Cadastrar novo CEP
  async store(req, res) {
    try {
      const { cep, logradouro, localidade, uf } = req.body;

      // Verificar se CEP já existe
      const cepExists = await prisma.cep.findUnique({
        where: { cep }
      });

      if (cepExists) {
        return res.status(400).json({ error: 'CEP já cadastrado' });
      }

      const newCep = await prisma.cep.create({
        data: {
          cep,
          logradouro,
          localidade,
          uf
        }
      });

      return res.status(201).json(newCep);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar CEP' });
    }
  },

  // Deletar CEP
  async delete(req, res) {
    try {
      const { id } = req.params;

      await prisma.cep.delete({
        where: { id: parseInt(id) }
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar CEP' });
    }
  }
};

module.exports = cepController;