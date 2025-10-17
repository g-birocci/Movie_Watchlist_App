import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Servidor a correr corretamente !!!`);
});

