// frontend/src/hooks/useMovies.js

import { useState, useEffect, useCallback, useMemo } from 'react';
import { carregarFilmesAPI } from '../services/api'; 

export const useMovies = (filterParams = {}) => { 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ SOLUÇÃO: Serializa filterParams para criar uma chave estável
  const filterKey = useMemo(() => {
    return JSON.stringify(filterParams);
  }, [JSON.stringify(filterParams)]);

  // A função de busca agora depende da chave serializada
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Deserializa a chave de volta para objeto
      const params = JSON.parse(filterKey);
      const data = await carregarFilmesAPI(params); 
      
      setMovies(Array.isArray(data) ? data : []); 
    } catch (err) {
      setError(err.message || 'Falha ao carregar os filmes.');
      setMovies([]);
      console.error('Erro ao buscar filmes:', err);
    } finally {
      setLoading(false);
    }
  }, [filterKey]); // ✅ Agora depende apenas de filterKey

  // Busca apenas quando fetchMovies mudar
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