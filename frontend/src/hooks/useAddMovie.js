// frontend/src/hooks/useAddMovie.js

import { useState } from 'react';
import { adicionarFilmeAPI } from '../services/api';

// Recebe setMovies (ou onMovieAdded) e handleClose
export const useAddMovie = (setMovies, handleClose) => {
    const [isLoading, setIsLoading] = useState(false);
    const [addError, setAddError] = useState(null);
    const [success, setSuccess] = useState(false); // Adiciona estado de sucesso

    const resetSuccess = () => setSuccess(false);

    const addMovie = async (movieData) => {
        setIsLoading(true);
        setAddError(null);
        setSuccess(false);

        const { title, year, genre, rating } = movieData;
        
        // --- VALIDAÇÃO DE NEGÓCIO ---

        // 1. Validação do Ano
        if (year < 1900 || year > 2025) {
            setAddError('O ano deve estar entre 1900 e 2025.');
            setIsLoading(false);
            return;
        }

        // 2. Validação da Avaliação (Duas Casas Decimais e Limites)
        if (rating !== undefined && rating !== null) {
            if (rating < 0 || rating > 10) {
                 setAddError('A avaliação deve ser entre 0 e 10.');
                 setIsLoading(false);
                 return;
            }
            // Verifica se tem mais de duas casas decimais
            const ratingString = rating.toString();
            if (ratingString.includes('.') && ratingString.split('.')[1].length > 2) {
                setAddError('A avaliação só pode ter no máximo duas casas decimais.');
                setIsLoading(false);
                return;
            }
        }

        // --- CHAMADA DA API ---

        try {
            const newMovie = await adicionarFilmeAPI(movieData);

            // 1. Atualiza a lista no componente pai
            setMovies(prevMovies => [newMovie, ...prevMovies]);

            // 2. Chama handleClose (AQUI ESTÁ A CORREÇÃO DO TypeError)
            if (typeof handleClose === 'function') {
                 handleClose(); 
            }
            
            setSuccess(true); // Indica sucesso para limpar o formulário

        } catch (err) {
            const errorMessage = err.message || 'Falha ao adicionar o filme.';
            setAddError(errorMessage);
            console.error('Erro ao adicionar filme:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return { 
        isLoading, 
        addError, 
        success,
        addMovie,
        resetSuccess 
    };
};