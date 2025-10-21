// frontend/src/components/WatchedMovies.jsx (CRIAR ARQUIVO)

import React, { useState, useMemo, useEffect } from "react";
import { useMovies } from "../hooks/useMovies";
// Note que este componente não tem a lógica de Editar/Deletar, mas você pode adicioná-la se quiser.

// Parâmetro de filtro para esta lista: Filmes Assistidos
const FILTER_PARAMS = { watched: true };

export default function WatchedMovies({ onRefresh }) {
  const {
    movies: filmes,
    isLoading: carregando,
    error: erro,
    refetchMovies,
  } = useMovies(FILTER_PARAMS); // <<< Usa o filtro

  const isBusy = carregando;

  // Estado e Lógica de Ordenação (Copiar do AllMovies)
  const [sortBy, setSortBy] = useState("default");

  // Mecanismo de Refresh (Se precisar que esta lista se atualize quando algo muda)
  useEffect(() => {
    if (onRefresh) {
      onRefresh(refetchMovies);
    }
  }, [onRefresh, refetchMovies]);

  const sortedFilmes = useMemo(() => {
    let sortableFilmes = [...filmes];

    switch (sortBy) {
      case "rating_desc":
        sortableFilmes.sort((a, b) => {
          const ratingA = a.rating || -1;
          const ratingB = b.rating || -1;
          return ratingB - ratingA;
        });
        break;
      case "rating_asc":
        sortableFilmes.sort((a, b) => {
          const ratingA = a.rating || 11;
          const ratingB = b.rating || 11;
          return ratingA - ratingB;
        });
        break;
      default:
        // Tenta manter a ordem de inserção original
        sortableFilmes.sort((a, b) => a._id.localeCompare(b._id));
        break;
    }
    return sortableFilmes;
  }, [filmes, sortBy]);

  // --- Lógica de Carregamento e Erro ---
  if (isBusy)
    return (
      <p className="text-center text-muted">
        Carregando filmes assistidos...
      </p>
    );

  if (erro) return <p className="text-center text-red-400">Erro: {erro}</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Filmes Assistidos</h2>
        {/* Seletor de Ordenação */}
        <div className="flex items-center">
          <label
            htmlFor="sort-watched"
            className="mr-2 text-sm text-muted font-medium"
          >
            Ordenar por:
          </label>
          <select
            id="sort-watched"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select select-dark text-sm"
          >
            <option value="default">Padrão</option>
            <option value="rating_desc">Melhor Avaliação</option>
            <option value="rating_asc">Pior Avaliação</option>
          </select>
        </div>
      </div>

      {/* RENDERIZAÇÃO DA LISTA */}
      {sortedFilmes && sortedFilmes.length === 0 ? (
        <p className="text-muted text-center">
          Você ainda não marcou nenhum filme como assistido.
        </p>
      ) : (
        <div className="grid gap-4">
          {sortedFilmes.map((filme) => (
            <div
              key={filme._id}
              className="card p-5"
            >
              <h3 className="text-xl font-semibold">
                {filme.title}
              </h3>
              <p className="text-sm text-[color:var(--muted)] mb-1">Ano: {filme.year}</p>
              {filme.rating && (
                <p className="text-yellow-400 font-bold mt-1">
                  Avaliação: ⭐ {filme.rating}/10
                </p>
              )}
              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-green-500/15 text-green-400">
                ✅ Assistido
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
