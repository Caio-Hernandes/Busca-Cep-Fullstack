const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cepRoutes = require('./routes/cepRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://busca-cep-fullstack-1.onrender.com',
];


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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
