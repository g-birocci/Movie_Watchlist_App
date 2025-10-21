// frontend/src/hooks/useUpdateWatched.js

import { useState } from 'react';
// Importe a função que você deve criar em services/api.js
import { alternarWatchedAPI } from '../services/api'; 

export const useUpdateWatched = (setMovies) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    // Alterna o status 'watched' de um filme
    const toggleWatchedStatus = async (movieId, currentStatus) => {
        setIsUpdating(true);
        setUpdateError(null);
        
        const newStatus = !currentStatus;

        try {
            // 1. Chama a API para persistir a mudança no servidor
            await alternarWatchedAPI(movieId, newStatus); 

            // 2. Otimismo no Frontend: Atualiza a lista de filmes localmente
            setMovies(prevMovies => 
                prevMovies.map(movie => 
                    movie._id === movieId 
                        ? { ...movie, watched: newStatus } // Atualiza apenas o 'watched'
                        : movie
                )
            );

        } catch (err) {
            const errorMessage = err.message || 'Falha ao atualizar o status do filme.';
            setUpdateError(errorMessage);
            console.error('Erro de atualização:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    return { 
        isUpdating, 
        updateError, 
        toggleWatchedStatus 
    };
};