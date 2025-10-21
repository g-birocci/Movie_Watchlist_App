import React, { useState, useMemo, useEffect } from "react";
import { FaEyeSlash } from 'react-icons/fa'; // Apenas o ícone para "Desmarcar Assistido"
import { useMovies } from "../hooks/useMovies";

// ⚠️ Importe apenas o hook necessário para a funcionalidade "Desmarcar como Assistido"
import { useUpdateWatched } from '../hooks/useUpdateWatched';

export default function WatchedMovies({ onRefresh, openEditModal }) { // openEditModal não será usado, mas mantido por segurança
    
    // 🚨 CORREÇÃO DE LENTIDÃO: Usa useMemo para estabilizar o objeto de filtro.
    const filterParams = useMemo(() => ({ watched: true }), []);
    
    const {
        movies: filmes,
        isLoading: carregando,
        error: erro,
        refetchMovies,
        setMovies // Necessário para atualizar o estado após desmarcar
    } = useMovies(filterParams);

    // ⚠️ Inicialização do Hook para desmarcar como assistido
    const { toggleWatchedStatus } = useUpdateWatched(setMovies);

    const isBusy = carregando;
    const [sortBy, setSortBy] = useState("default");

    // Mecanismo de Refresh 
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
            {/* Cabeçalho com Ordenação */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Filmes Assistidos</h2>
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
                            className="card p-5 relative"
                        >
                            <h3 className="text-xl font-semibold">
                                {filme.title}
                            </h3>
                            {/* ⚠️ Ajuste de Layout: Para manter os elementos como na imagem */}
                            <p className="text-sm text-[color:var(--muted)] mb-1">
                                    Ano de Lançamento: {filme.year}
                                </p>
                                <p className="text-sm text-[color:var(--muted)] mb-1">
                                    Adicionado em: {new Date(filme.createdAt).toLocaleDateString('pt-BR')} {/* Exemplo de data de criação, ajuste conforme seu backend */}
                                </p>
                            {filme.rating !== undefined && ( // Verifica se rating existe e não é null/undefined
                                <p className="text-yellow-400 font-bold mt-1">
                                    Avaliação: {filme.rating}/10
                                </p>
                            )}
                            
                                {/* Botão "Assistido" / "Desmarcar como Assistido" */}
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-500/15 text-green-400">
                                        ✅ Assistido
                                    </span>
                                    {/* 🚀 BOTÃO "NÃO ASSISTIDO" (Desmarcar) */}
                                    
                                </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
