const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cepRoutes = require('./routes/cepRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', cepRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API CEP funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});