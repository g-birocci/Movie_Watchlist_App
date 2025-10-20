// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies.js'; // ← importe as rotas

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use(express.json());
app.use(cors());

// Registre as rotas
app.use('/api/movies', movieRoutes); // ← todas as rotas de filme começam com /api/movies

app.listen(PORT, () => {
  console.log(`Servidor a correr corretamente na porta ${PORT}!`);
});