// frontend/src/hooks/useEditMovie.js

import { useState } from 'react';
// Importe a função de atualização da API
import { atualizarFilmeAPI } from '../services/api'; 

export const useEditMovie = (setMovies, handleCloseEdit) => {
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Recebe os dados do filme (incluindo o _id)
    const editMovie = async (movieData) => {
        setIsSaving(true);
        setSaveError(null);

        // Separa o _id do resto dos dados que serão enviados para o backend
        const { _id, ...dataToUpdate } = movieData; 

        try {
            // 1. Chama a API de atualização (PUT /api/movies/:id)
            const updatedMovie = await atualizarFilmeAPI(_id, dataToUpdate); 

            // 2. Atualiza o estado local com o filme retornado pela API
            setMovies(prevMovies => 
                prevMovies.map(movie => 
                    movie._id === _id 
                        ? updatedMovie 
                        : movie
                )
            );

            // 3. Fecha o formulário de edição e dá feedback ao usuário
            handleCloseEdit();
            alert(`Filme "${updatedMovie.title}" atualizado com sucesso!`);

        } catch (err) {
            const errorMessage = err.message || 'Falha ao salvar as alterações do filme.';
            setSaveError(errorMessage);
            console.error('Erro de edição:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return { 
        isSaving, 
        saveError, 
        editMovie 
    };
};