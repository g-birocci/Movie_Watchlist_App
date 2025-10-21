// frontend/src/hooks/useDeleteMovie.js - VERSÃO FUNCIONAL RESTAURADA

import { useState } from 'react';
// Importe a função de exclusão
import { removerFilmeAPI } from '../services/api'; 

// Este hook aceita a função 'setMovies' do useMovies para atualizar o estado
export const useDeleteMovie = (setMovies) => {
  const [isDeleting, setIsDeleting] = useState(false); // Estado de carregamento da exclusão
  const [deleteError, setDeleteError] = useState(null); // Estado de erro da exclusão

  // Função assíncrona que será chamada quando o usuário clicar em deletar
  const deleteMovie = async (movieId) => {
    
    // 1. CONFIRMAÇÃO DELEÇÃO: USANDO O POP-UP NATIVO (alert/confirm)
    if (!window.confirm('Tem certeza que deseja deletar este filme? Esta ação não pode ser desfeita.')) {
        return; // Sai se o usuário clicar em Cancelar
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // 2. Chama a API de exclusão
      await removerFilmeAPI(movieId); 

      // 3. Atualiza o estado local
      // O filme é removido da lista sem precisar recarregar a página
      setMovies(prevMovies => prevMovies.filter(movie => movie._id !== movieId));

      // 4. NOTIFICAÇÃO SUCESSO: USANDO O alert()
      alert('Filme deletado com sucesso!');

    } catch (err) {
      const errorMessage = err.message || 'Falha ao deletar o filme.';
      setDeleteError(errorMessage);
      console.error('Erro de deleção:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Retorna o estado e a função de deleção
  return { 
    isDeleting, 
    deleteError, 
    deleteMovie 
  };
};