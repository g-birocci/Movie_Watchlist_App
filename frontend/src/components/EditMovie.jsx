// components/EditMovies.jsx (ou pages/movies/edit/[id].jsx se estiver no Pages Router)
'use client'; // necessário se estiver no App Router

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // ou 'next/router' no Pages Router

export default function EditMovies() {
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    releaseYear: '',
    genre: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const params = useParams(); // App Router — use `router.query.id` se estiver no Pages Router
  const movieId = params?.id;

  // Carregar dados do filme
  useEffect(() => {
    if (!movieId) return;
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        if (!res.ok) throw new Error('Filme não encontrado');
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar filme');
        router.push('/movies'); // redireciona se falhar
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/movies/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });

      if (!res.ok) throw new Error('Falha ao atualizar filme');
      alert('Filme atualizado com sucesso!');
      router.push('/movies'); // ou para a página de detalhes
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Filme</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            name="title"
            value={movie.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
          <input
            type="text"
            name="genre"
            value={movie.genre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ano de Lançamento</label>
          <input
            type="number"
            name="releaseYear"
            value={movie.releaseYear}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            min="1800"
            max="2100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            name="description"
            value={movie.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
              saving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}