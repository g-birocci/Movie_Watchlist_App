// frontend/src/hooks/useMovies.js

import { useState, useEffect, useCallback } from 'react';
import { carregarFilmesAPI } from '../services/api'; // Ajuste o caminho se necessário

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // A função de busca é memorizada
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carregarFilmesAPI();
      // Garante que é um array antes de atualizar o estado
      setMovies(Array.isArray(data) ? data : []); 
    } catch (err) {
      setError(err.message || 'Falha ao carregar os filmes.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para que não mude

  // Busca inicial ao montar o componente
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]); 
  
  // Retorna o estado e a função para recarregar ou atualizar a lista diretamente
  return { 
    movies, 
    loading, 
    error, 
    refetch: fetchMovies, // Função para recarregar a lista (chamar a API novamente)
    setMovies // Permite que outros hooks atualizem a lista localmente
  };
};