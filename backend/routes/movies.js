// backend/routes/movies.js
import { Router } from 'express';
import Movie from '../models/Movie.js'; // seu modelo

const router = Router();

// GET /api/movies
router.get('/', async (req, res) => {
  try {
    const { watched, sortBy, order } = req.query;
    let filter = {};

    if (watched !== undefined) {
      filter.watched = watched === 'true';
    }

    let sort = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sort[sortBy] = sortOrder;
    } else {
      sort.createdAt = -1; // mais recentes primeiro
    }

    const movies = await Movie.find(filter).sort(sort);
    res.json(movies);
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    res.status(500).json({ erro: 'Erro ao buscar filmes' });
  }
});

// POST /api/movies
router.post('/', async (req, res) => {
  try {
    const { title, year, genre, watched = false, rating } = req.body;

    // Validação básica (você pode melhorar depois)
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
    res.status(500).json({ erro: 'Erro ao adicionar filme' });
  }
});

// PUT /api/movies/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, year, genre, watched, rating } = req.body;

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      {
        title,
        year: Number(year),
        genre,
        watched,
        rating: rating ? Number(rating) : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ erro: 'Filme não encontrado' });
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error('Erro ao atualizar filme:', error);
    res.status(500).json({ erro: 'Erro ao atualizar filme' });
  }
});

// DELETE /api/movies/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({ erro: 'Filme não encontrado' });
    }

    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao deletar filme:', error);
    res.status(500).json({ erro: 'Erro ao deletar filme' });
  }
});

export default router;