// frontend/src/components/AddMovie.jsx

import React, { useState, useEffect } from 'react';
import { useAddMovie } from '../hooks/useAddMovie';

// Recebe setMovies (ou onMovieAdded) e handleClose
export default function AddMovie({ onMovieAdded, handleClose }) { 
    
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        genre: '',
        rating: '',
        watched: false,
    });
    
    // Passando setMovies (onMovieAdded) e handleClose
    const { isLoading, addError, success, addMovie, resetSuccess } = useAddMovie(onMovieAdded, handleClose); 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    useEffect(() => {
        // Limpar o formulário no sucesso (o handleClose é chamado no hook)
        if (success) {
            setFormData({
                title: '',
                year: '',
                genre: '',
                rating: '',
                watched: false,
            });
            alert('Filme adicionado com sucesso!'); 
            resetSuccess(); 
        }
    }, [success, resetSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const movieData = { 
            title: formData.title,
            year: Number(formData.year),
            genre: formData.genre,
            watched: formData.watched,
            // Rating deve ser null/undefined se vazio
            rating: formData.rating ? Number(formData.rating) : undefined, 
        };
        
        await addMovie(movieData);
    };

    return (
        <form onSubmit={handleSubmit} className="card p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Adicionar Novo Filme</h3>
            
            {addError && <p className="text-red-400 mb-4">{addError}</p>}

            {/* Input Título */}
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título do Filme" className="input mb-3" disabled={isLoading} required />
            
            {/* Input Gênero */}
            <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="Gênero" className="input mb-3" disabled={isLoading} required />

            {/* Input Ano (Com Validação HTML5) */}
            <input 
                type="number" 
                name="year"
                value={formData.year} 
                onChange={handleChange} 
                placeholder="Ano (1900-2025)"
                className="input mb-3"
                disabled={isLoading}
                required
                min="1900" // Guia o usuário
                max="2025" // Guia o usuário
            />

            {/* Input Rating (Com Duas Casas Decimais) */}
            <input 
                type="number" 
                name="rating"
                value={formData.rating} 
                onChange={handleChange} 
                placeholder="Avaliação (0.00 - 10.00)"
                className="input mb-4"
                disabled={isLoading}
                min="0"
                max="10"
                step="0.01" // Permite duas casas decimais
            />

            {/* Checkbox Watched */}
            <div className="flex items-center mb-4">
                <input type="checkbox" name="watched" checked={formData.watched} onChange={handleChange} className="h-4 w-4 text-cyan-500 border-[color:var(--border)] rounded bg-white/5" disabled={isLoading} />
                <label className="ml-2 text-sm">Já assisti</label>
            </div>
            
            <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-2">
                {isLoading ? 'Adicionando...' : 'Adicionar Filme'}
            </button>
        </form>
    );
}