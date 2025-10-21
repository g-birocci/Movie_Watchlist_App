// frontend/src/components/AllMovies.jsx

import React, { useState, useMemo } from "react";
import { useMovies } from "../hooks/useMovies";
import { useDeleteMovie } from "../hooks/useDeleteMovie";
import { useUpdateWatched } from "../hooks/useUpdateWatched";
import EditMovie from './EditMovie';

export default function AllMovies({ onRefresh }) {
  const {
    movies,
    isLoading: carregando,
    error: erro,
    setMovies,
    refetchMovies
  } = useMovies();

  const { isDeleting, deleteError, deleteMovie } = useDeleteMovie(setMovies);
  
  // ✅ CORREÇÃO: removeOnToggle: false para NÃO remover da lista
  const { isUpdating, updateError, toggleWatchedStatus } = useUpdateWatched(setMovies, {
    removeOnToggle: false
  });

  // ESTADO DE EDIÇÃO
  const [movieToEdit, setMovieToEdit] = useState(null);
  
  // ESTADO DE ORDENAÇÃO
  const [sortBy, setSortBy] = useState('default');

  // ✅ PROTEÇÃO: Garante que movies é sempre um array
  const filmes = Array.isArray(movies) ? movies : [];

  const handleOpenEdit = (filme) => {
    setMovieToEdit(filme);
  };

  const handleCloseEdit = () => {
    setMovieToEdit(null);
  };
  
  // LÓGICA DE ORDENAÇÃO
  const sortedFilmes = useMemo(() => {
    // ✅ PROTEÇÃO: Verifica se filmes é array antes de copiar
    if (!Array.isArray(filmes)) {
      console.warn('filmes não é um array:', filmes);
      return [];
    }

    let sortableFilmes = [...filmes]; 

    switch (sortBy) {
      case 'title_asc':
        sortableFilmes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        sortableFilmes.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'year_desc':
        sortableFilmes.sort((a, b) => b.year - a.year);
        break;
      case 'year_asc':
        sortableFilmes.sort((a, b) => a.year - b.year);
        break;
      case 'date_desc':
        sortableFilmes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date_asc':
        sortableFilmes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'default':
      default:
        sortableFilmes.sort((a, b) => a._id.localeCompare(b._id));
        break;
    }

    return sortableFilmes;
  }, [filmes, sortBy]); 
  
  const isBusy = carregando || isDeleting || isUpdating;

  if (isBusy)
    return (
      <p className="text-center text-muted">
        {isDeleting
          ? "Deletando filme..."
          : isUpdating
          ? "Atualizando status..."
          : "Carregando seus filmes..."}
      </p>
    );

  if (erro || deleteError || updateError)
    return (
      <p className="text-center text-red-400">
        Erro: {erro || deleteError || updateError}
      </p>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Minha Biblioteca</h2>

        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm text-muted font-medium">
            Ordenar por:
          </label>
          <select 
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)} 
            className="select select-dark text-sm"
          >
            <option value="default">Padrão</option>
            <option value="title_asc">Título (A-Z)</option>
            <option value="title_desc">Título (Z-A)</option>
            <option value="year_desc">Ano (Mais Recente)</option>
            <option value="year_asc">Ano (Mais Antigo)</option>
            <option value="date_desc">Data (Mais Recente)</option>
            <option value="date_asc">Data (Mais Antigo)</option>
          </select>
        </div>
      </div>

      {movieToEdit && (
        <div className="mb-8">
          <EditMovie
            movie={movieToEdit}
            setMovies={setMovies}
            handleCloseEdit={handleCloseEdit}
          />
        </div>
      )}

      {!movieToEdit &&
        (sortedFilmes.length === 0 ? (
          <p className="text-muted text-center">
            Você ainda não adicionou nenhum filme.
          </p>
        ) : (
          <div className="grid gap-4">
            {sortedFilmes.map((filme) => (
              <div key={filme._id} className="card p-5">
                <h3 className="text-xl font-semibold">{filme.title}</h3>

                <p className="text-sm text-[color:var(--muted)] mb-1">
                  Ano de Lançamento: {filme.year}
                </p>

                {filme.createdAt && (
                  <p className="text-xs text-[color:var(--muted)] mb-2 italic">
                    Adicionado em: {new Date(filme.createdAt).toLocaleDateString()}
                  </p>
                )}

                {filme.rating && (
                  <p className="text-sm text-[color:var(--foreground)]">
                    Avaliação:{" "}
                    <span className="font-bold text-yellow-400">
                      {filme.rating}/10
                    </span>
                  </p>
                )}

                <span
                  className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                    filme.watched
                      ? "bg-green-500/15 text-green-400"
                      : "bg-yellow-400/15 text-yellow-300"
                  }`}
                >
                  {filme.watched ? "✅ Assistido" : "🕒 Pendente"}
                </span>

                <div className="mt-3 flex gap-2 justify-end">
                  <button
                    onClick={() => handleOpenEdit(filme)}
                    disabled={isBusy}
                    className="btn btn-secondary py-1 px-3 text-sm"
                  >
                    ✏️ Editar
                  </button>

                  {!filme.watched && (
                    <button
                      onClick={() => toggleWatchedStatus(filme._id, filme.watched)}
                      disabled={isBusy}
                      className="btn btn-success py-1 px-3 text-sm"
                    >
                      Marcar como Assistido
                    </button>
                  )}

                  <button
                    onClick={() => deleteMovie(filme._id)}
                    disabled={isBusy}
                    className="btn btn-danger py-1 px-3 text-sm"
                  >
                    {isDeleting ? "..." : "Deletar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}