// frontend/src/hooks/useUpdateWatched.js

import { useState } from 'react';
import { alterarStatusWatchedAPI } from '../services/api';

/**
 * Hook para atualizar o status "watched" de um filme
 * @param {Function} setMovies - Função para atualizar o estado de filmes
 * @param {Object} options - Opções de configuração
 * @param {boolean} options.removeOnToggle - Se true, remove o filme da lista ao alternar
 * @returns {Object} - Retorna toggleWatchedStatus, isUpdating e updateError
 */
export const useUpdateWatched = (setMovies, options = {}) => {
  const { removeOnToggle = false } = options;
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const toggleWatchedStatus = async (movieId, currentWatchedStatus) => {
    const newWatchedStatus = !currentWatchedStatus;
    let oldMovies;

    setIsUpdating(true);
    setUpdateError(null);

    // ⚡️ ATUALIZAÇÃO OTIMISTA
    setMovies((currentMovies) => {
      oldMovies = currentMovies;

      if (removeOnToggle) {
        // 🗑️ MODO: Remove da lista (para tela "Watched Movies")
        return currentMovies.filter((movie) => movie._id !== movieId);
      } else {
        // ✏️ MODO: Atualiza o status sem remover (para tela "All Movies")
        return currentMovies.map((movie) =>
          movie._id === movieId
            ? { ...movie, watched: newWatchedStatus }
            : movie
        );
      }
    });

    // 📤 Tenta fazer a chamada API
    try {
      await alterarStatusWatchedAPI(movieId, newWatchedStatus);
      // Sucesso: A UI já está atualizada
    } catch (err) {
      // ❌ FALHA: Reverte o estado (Rollback)
      const errorMsg = err.message || 'Falha ao atualizar status do filme';
      console.error('Erro ao atualizar watched:', errorMsg, err);
      setUpdateError(errorMsg);
      setMovies(oldMovies);
      alert('Houve um erro ao salvar a alteração. Tente novamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  return { 
    toggleWatchedStatus,
    isUpdating,
    updateError
  };
};