// frontend/src/hooks/useMovies.js

import { useState, useEffect, useCallback, useMemo } from 'react';
import { carregarFilmesAPI } from '../services/api'; 

export const useMovies = (filterParams = {}) => { 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SOLUÇÃO 1: Estabilizar filterParams com useMemo
  // Converte o objeto em uma string estável para comparação
  const stableFilterParams = useMemo(
    () => JSON.stringify(filterParams),
    [JSON.stringify(filterParams)]
  );

  // A função de busca agora depende da string estável
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Reconverte a string de volta para objeto
      const params = JSON.parse(stableFilterParams);
      const data = await carregarFilmesAPI(params); 
      
      setMovies(Array.isArray(data) ? data : []); 
    } catch (err) {
      setError(err.message || 'Falha ao carregar os filmes.');
      setMovies([]);
      console.error('Erro ao buscar filmes:', err);
    } finally {
      setLoading(false);
    }
  }, [stableFilterParams]); // Agora depende de uma string estável

  // Busca apenas quando fetchMovies mudar (não em todo render)
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]); 
  
  return { 
    movies, 
    isLoading: loading,
    error, 
    refetchMovies: fetchMovies,
    setMovies 
  };
};