// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// CORS liberado para desenvolvimento
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(cors()); // Permite TODAS as origens em desenvolvimento
  console.log('⚠️  CORS: Todas as origens permitidas (desenvolvimento)');
} else {
  // Em produção, use configuração específica
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }));
  console.log(`✅ CORS: Apenas ${process.env.FRONTEND_URL} permitido (produção)`);
}

app.use(express.json());

app.use('/api/movies', movieRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}!`);
});