const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cepRoutes = require('./routes/cepRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://busca-cep-fullstack-1.onrender.com',
  'http://localhost:3001',
];


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Origin bloqueada:', origin);
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true, // 🔥 ADICIONE ESTA LINHA
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

console.log("Banco conectado:", process.env.DATABASE_URL);

// Middleware para debug
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

app.get('/', (req, res) => {
  res.json({ message: 'API CEP funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
