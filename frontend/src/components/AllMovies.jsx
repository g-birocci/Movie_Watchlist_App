// frontend/src/components/AllMovies.jsx

// ATENÇÃO: Adicionado 'useMemo' na importação do React
import React, { useState, useMemo } from "react";
import { useMovies } from "../hooks/useMovies";
import { useDeleteMovie } from "../hooks/useDeleteMovie";
import { useUpdateWatched } from "../hooks/useUpdateWatched";
import EditMovie from './EditMovie';

export default function AllMovies({ onRefresh }) { // Adicionei 'onRefresh' aqui para manter a compatibilidade com o index.jsx que você mostrou
  const {
    movies: filmes,
    loading: carregando,
    error: erro,
    setMovies,
    refetchMovies // Adicionei refetchMovies para uso potencial
  } = useMovies();

  const { isDeleting, deleteError, deleteMovie } = useDeleteMovie(setMovies);
  const { isUpdating, updateError, toggleWatchedStatus } =
    useUpdateWatched(setMovies);

  // ESTADO DE EDIÇÃO
  const [movieToEdit, setMovieToEdit] = useState(null);
  
  // ESTADO DE ORDENAÇÃO (básica)
  const [sortBy, setSortBy] = useState('default');

  const handleOpenEdit = (filme) => {
    setMovieToEdit(filme);
  };

  const handleCloseEdit = () => {
    setMovieToEdit(null);
    // Se você usa o setMovies no EditMovie, isso já atualiza. Se não, use refetchMovies() aqui.
  };
  
  // LÓGICA DE ORDENAÇÃO BÁSICA (sem rating)
  const sortedFilmes = useMemo(() => {
    let sortableFilmes = [...filmes]; 

    switch (sortBy) {
      case 'title_asc': // Ordem Alfabética (A-Z)
        sortableFilmes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc': // Ordem Alfabética (Z-A)
        sortableFilmes.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'year_desc': // Ano mais recente primeiro
        sortableFilmes.sort((a, b) => b.year - a.year);
        break;
      case 'year_asc': // Ano mais antigo primeiro
        sortableFilmes.sort((a, b) => a.year - b.year);
        break;
      case 'date_desc': // Mais recentemente adicionados primeiro
        sortableFilmes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date_asc': // Mais antigamente adicionados primeiro
        sortableFilmes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'default':
      default:
        // Ordenação Padrão (mantém a ordem de inserção do MongoDB)
        sortableFilmes.sort((a, b) => a._id.localeCompare(b._id));
        break;
    }

    return sortableFilmes;
  }, [filmes, sortBy]); 
  
  // --- Lógica de Carregamento e Erro (INALTERADA) ---
  const isBusy = carregando || isDeleting || isUpdating;

  // Sua lógica de refresh (se 'onRefresh' foi implementado no 'index.jsx')
  // if (onRefresh && refetchMovies) { onRefresh(refetchMovies); } 

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

        {/* SELETOR DE ORDENAÇÃO BÁSICA */}
        <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm text-muted font-medium">Ordenar por:</label>
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

      {/* RENDERIZAÇÃO DO FORMULÁRIO DE EDIÇÃO (INALTERADA) */}
      {movieToEdit && (
        <div className="mb-8">
          <EditMovie
            movie={movieToEdit}
            setMovies={setMovies}
            handleCloseEdit={handleCloseEdit}
          />
        </div>
      )}

      {/* RENDERIZAÇÃO DA LISTA DE FILMES */}
      {!movieToEdit &&
        (sortedFilmes && sortedFilmes.length === 0 ? ( // ATENÇÃO: Usando sortedFilmes aqui
          <p className="text-muted text-center">
            Você ainda não adicionou nenhum filme.
          </p>
        ) : (
          <div className="grid gap-4">
            {sortedFilmes && // ATENÇÃO: Usando sortedFilmes aqui
              sortedFilmes.map((filme) => ( // ATENÇÃO: Usando sortedFilmes aqui
                <div
                  key={filme._id}
                  className="card p-5"
                >
                  {/* DETALHES DO FILME (INALTERADOS) */}
                  <h3 className="text-xl font-semibold">
                    {filme.title}
                  </h3>

                  <p className="text-sm text-[color:var(--muted)] mb-1">
                    Ano de Lançamento: {filme.year}
                  </p>

                  {filme.createdAt && (
                    <p className="text-xs text-[color:var(--muted)] mb-2 italic">
                      Adicionado em:{" "}
                      {new Date(filme.createdAt).toLocaleDateString()}
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

                  {/* INDICADOR DE STATUS (INALTERADO) */}
                  <span
                    className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                      filme.watched
                        ? "bg-green-500/15 text-green-400"
                        : "bg-yellow-400/15 text-yellow-300"
                    }`}
                  >
                    {filme.watched ? "✅ Assistido" : "🕒 Pendente"}
                  </span>

                  {/* BOTÕES DE AÇÃO (INALTERADOS) */}
                  <div className="mt-3 flex gap-2 justify-end">
                    {/* Botão de Edição */}
                    <button
                      onClick={() => handleOpenEdit(filme)}
                      disabled={isBusy}
                      className="btn btn-secondary py-1 px-3 text-sm"
                    >
                      ✏️ Editar
                    </button>

                    {/* Botão de Alternância (Somente se não foi assistido) */}
                    {!filme.watched && (
                      <button
                        onClick={() =>
                          toggleWatchedStatus(filme._id, filme.watched)
                        }
                        disabled={isBusy}
                        className="btn btn-success py-1 px-3 text-sm"
                      >
                        Marcar como Assistido
                      </button>
                    )}

                    {/* Botão Deletar */}
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