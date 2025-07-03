const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cepRoutes = require('./routes/cepRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200
}));


app.use(express.json());

// tava tendo uns problemas com o token no backend
app.use((req, res, next) => {
  console.log(`\n🔄 ${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log('✅ Authorization header presente!');
  } else {
    console.log('❌ Authorization header AUSENTE!');
  }
  next();
});

app.use('/api', cepRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API CEP funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});