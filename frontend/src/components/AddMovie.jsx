// frontend/src/components/AddMovie.jsx
import { useState } from 'react';
import { adicionarFilmeAPI } from '../services/api';

export default function AddMovie({ onMovieAdded, onClose }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [watched, setWatched] = useState(false);
  const [rating, setRating] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validação simples
    if (!title || !year || !genre) {
      setError('Título, ano e gênero são obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      await adicionarFilmeAPI({
        title,
        year: Number(year),
        genre,
        watched,
        rating: rating ? Number(rating) : undefined,
      });

      setSuccess(true);

      // ✅ Chama o callback de sucesso (para atualizar a lista)
      if (onMovieAdded) {
        onMovieAdded();
      }

      // Opcional: resetar o formulário
      setTitle('');
      setYear('');
      setGenre('');
      setWatched(false);
      setRating('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Adicionar Filme</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
          Filme adicionado com sucesso!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ano *
            </label>
            <input
              type="number"
              min="1900"
              max="2025"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gênero *
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={watched}
              onChange={(e) => setWatched(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-gray-700">Assistido</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nota (0–10)
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-6 rounded-lg font-medium text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </form>
    </div>
  );
}