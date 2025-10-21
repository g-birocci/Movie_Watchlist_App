import React, { useState, useMemo, useEffect } from "react";
import { useMovies } from "../hooks/useMovies";
import { useDeleteMovie } from "../hooks/useDeleteMovie";
import { useUpdateWatched } from "../hooks/useUpdateWatched";
import EditMovie from './EditMovie';

export default function MoviesByRating({ onRefresh }) {
    const {
        movies: filmes,
        loading: carregando,
        error: erro,
        setMovies,
        refetchMovies
    } = useMovies();

    const { isDeleting, deleteError, deleteMovie } = useDeleteMovie(setMovies);
    const { isUpdating, updateError, toggleWatchedStatus } = useUpdateWatched(setMovies);

    // Estado de Edição
    const [movieToEdit, setMovieToEdit] = useState(null);
    
    // Estado de Ordenação (sempre por rating)
    const [sortOrder, setSortOrder] = useState('desc'); // desc = melhor para pior, asc = pior para melhor

    const handleOpenEdit = (filme) => {
        setMovieToEdit(filme);
    };

    const handleCloseEdit = () => {
        setMovieToEdit(null);
    };

    // Lógica de Ordenação por Rating
    const sortedFilmes = useMemo(() => {
        let sortableFilmes = [...filmes];

        // Ordena por rating
        sortableFilmes.sort((a, b) => {
            const ratingA = a.rating || -1; // Filmes sem rating vão para o final
                    const ratingB = b.rating || -1;
            
            if (sortOrder === 'desc') {
                return ratingB - ratingA; // Melhor rating primeiro
            } else {
                return ratingA - ratingB; // Pior rating primeiro
            }
        });

        return sortableFilmes;
    }, [filmes, sortOrder]);

    // Mecanismo de Refresh
    useEffect(() => {
        if (onRefresh) {
            onRefresh(refetchMovies);
        }
    }, [onRefresh, refetchMovies]);

    // Lógica de Carregamento e Erro
    const isBusy = carregando || isDeleting || isUpdating;

    if (isBusy)
        return (
            <p className="text-center text-muted">
                {isDeleting
                    ? "Deletando filme..."
                    : isUpdating
                    ? "Atualizando status..."
                    : "Carregando filmes por avaliação..."}
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
                <h2 className="text-2xl font-bold">Filmes por Avaliação</h2>

                {/* Seletor de Ordem de Rating */}
                <div className="flex items-center">
                    <label htmlFor="sort-order" className="mr-2 text-sm text-muted font-medium">Ordenar:</label>
                    <select 
                        id="sort-order"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)} 
                        className="select select-dark text-sm"
                    >
                        <option value="desc">Melhor Avaliação</option>
                        <option value="asc">Pior Avaliação</option>
                    </select>
                </div>
            </div>

            {/* RENDERIZAÇÃO DO FORMULÁRIO DE EDIÇÃO */}
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
                (sortedFilmes && sortedFilmes.length === 0 ? (
                    <p className="text-muted text-center">
                        Você ainda não adicionou nenhum filme.
                    </p>
                ) : (
                    <div className="grid gap-4">
                        {sortedFilmes.map((filme) => (
                            <div
                                key={filme._id}
                                className="card p-5"
                            >
                                {/* DETALHES DO FILME */}
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

                                {/* AVALIAÇÃO DESTACADA */}
                                {filme.rating ? (
                                    <div className="my-3 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                                        <p className="text-sm font-medium text-yellow-400">
                                            ⭐ Avaliação: {filme.rating}/10
                                        </p>
                                    </div>
                                ) : (
                                    <div className="my-3 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                                        <p className="text-sm font-medium text-[color:var(--muted)]">
                                            📝 Sem avaliação
                                        </p>
                                    </div>
                                )}

                                {/* INDICADOR DE STATUS */}
                                <span
                                    className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                                        filme.watched
                                            ? "bg-green-500/15 text-green-400"
                                            : "bg-yellow-400/15 text-yellow-300"
                                    }`}
                                >
                                    {filme.watched ? "✅ Assistido" : "🕒 Pendente"}
                                </span>

                                {/* BOTÕES DE AÇÃO */}
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