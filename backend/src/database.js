const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  }
}

testConnection();

module.exports = prisma;