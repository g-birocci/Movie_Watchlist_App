// frontend/src/hooks/useMovies.js

import { useState, useEffect } from 'react';
import { carregarFilmesAPI } from '../services/api'; 

export const useMovies = (filterParams = {}) => { 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função que busca filmes (pode receber novos filtros opcionalmente)
  const fetchMovies = async (customFilters) => {
    setLoading(true);
    setError(null);
    try {
      const filters = customFilters || filterParams;
      const data = await carregarFilmesAPI(filters); 
      
      setMovies(Array.isArray(data) ? data : []); 
    } catch (err) {
      setError(err.message || 'Falha ao carregar os filmes.');
      setMovies([]);
      console.error('Erro ao buscar filmes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Busca inicial apenas uma vez na montagem
  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Intencionalmente vazio - só executa na montagem
  
  return { 
    movies, 
    isLoading: loading,
    error, 
    refetchMovies: fetchMovies, // Pode passar novos filtros: refetchMovies({ watched: true })
    setMovies 
  };
};