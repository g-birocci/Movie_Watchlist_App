import { Router } from 'express';
import Movie from '../models/Movie.js'; // Seu modelo do Mongoose

const router = Router();

// NOTA: A linha 'const filmes = await Movie.find({});' foi removida, 
// pois ela causaria um erro de 'top-level await' e não é usada.

// ===================================
// 1. GET /api/movies - Buscar, Filtrar e Ordenar (CONSOLIDADA)
// ===================================
router.get('/', async (req, res) => {
  try {
    // Recebe os parâmetros do frontend:
    // watched (para WatchedMovies/NotWatchedMovies)
    // sortBy/order (se o frontend decidir passar a ordenação para o backend)
    const { watched, sortBy, order } = req.query;
    let filter = {};
    let sort = {};

    // --- Lógica de FILTRO: Status 'watched' (PARA WatchedMovies/NotWatchedMovies) ---
    if (watched !== undefined) {
      // Converte a string 'true'/'false' em um booleano
      filter.watched = watched.toLowerCase() === 'true';
    }

    // --- Lógica de ORDENAÇÃO (Melhor deixá-la no frontend, mas mantida aqui) ---
    // O frontend que criamos faz a ordenação, mas se você quiser o backend:
    if (sortBy) {
      // Converte 'desc' para -1 (decrescente) ou usa 1 (crescente)
      const sortOrder = order === 'desc' || sortBy === 'rating_desc' ? -1 : 1; 

      // Trata o caso específico de 'rating_desc'/'rating_asc' (do frontend)
      if (sortBy.startsWith('rating')) {
          sort.rating = sortOrder;
      } else {
          sort[sortBy] = sortOrder;
      }
    } else {
      sort.createdAt = -1; // Padrão: mais recentes primeiro
    }

    // 3. Executa a busca com filtro e ordenação
    const movies = await Movie.find(filter).sort(sort);
    res.json(movies);

  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    res.status(500).json({ erro: 'Erro ao buscar filmes' });
  }
});

// ===================================
// 2. POST /api/movies - Adicionar novo (INALTERADA)
// ===================================
router.post('/', async (req, res) => {
  try {
    const { title, year, genre, watched = false, rating } = req.body;

    // Validação básica
    if (!title || !year || !genre) {
      return res.status(400).json({ erro: 'Título, ano e gênero são obrigatórios' });
    }

    const newMovie = new Movie({
      title,
      year: Number(year),
      genre,
      watched,
      rating: rating ? Number(rating) : undefined,
    });

    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    console.error('Erro ao adicionar filme:', error);
    res.status(400).json({ erro: error.message || 'Erro ao adicionar filme' }); 
  }
});

// ===================================
// 3. PUT /api/movies/:id - Atualização Completa (Edição) (INALTERADA)
// ===================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, year, genre, watched, rating } = req.body;

    // Constrói o objeto de atualização
    const updates = {
      title,
      year: Number(year),
      genre,
      watched,
      rating: rating ? Number(rating) : undefined,
    };

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } 
    );

    if (!updatedMovie) {
      return res.status(404).json({ erro: 'Filme não encontrado' });
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error('Erro ao atualizar filme:', error);
    res.status(400).json({ erro: error.message || 'Erro ao atualizar filme' });
  }
});

// ===================================
// 4. PATCH /api/movies/:id - Atualização Parcial (Toggle Watched) (INALTERADA)
// ===================================
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ erro: 'Filme não encontrado' });
    }

    res.json(updatedMovie);

  } catch (error) {
    console.error('Erro ao alternar status do filme:', error);
    res.status(400).json({ erro: error.message || 'Erro ao atualizar status do filme' });
  }
});

// ===================================
// 5. DELETE /api/movies/:id - Remover filme (INALTERADA)
// ===================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({ erro: 'Filme não encontrado' });
    }

    res.json({ sucesso: true, message: 'Filme removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar filme:', error);
    res.status(500).json({ erro: 'Erro ao deletar filme' });
  }
});

export default router;