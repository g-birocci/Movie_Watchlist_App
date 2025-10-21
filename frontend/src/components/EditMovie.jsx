import React, { useState } from 'react';
import { useEditMovie } from '../hooks/useEditMovie';

export default function EditMovie({ movie, setMovies, handleCloseEdit }) {
    
    // Inicializa o estado do formulário com os dados atuais do filme, INCLUINDO O GÊNERO
    const [formData, setFormData] = useState({
        _id: movie._id, 
        title: movie.title || '',
        year: movie.year || '',
        genre: movie.genre || '', // 👈 CAMPO 'genre' ADICIONADO
        rating: movie.rating || 0,
        watched: movie.watched || false,
    });

    const { isSaving, saveError, editMovie } = useEditMovie(setMovies, handleCloseEdit);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Converte os valores numéricos antes de enviar
        const dataToSave = {
            ...formData,
            year: Number(formData.year),
            rating: Number(formData.rating) 
        };
        editMovie(dataToSave);
    };

    return (
        <div className="card p-6 border border-[color:var(--border)]">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">
                Editando: {movie.title}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Campo Título */}
                <div>
                    <label htmlFor="title" className="label">Título</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="input mt-1"
                        disabled={isSaving}
                    />
                </div>
                
                {/* NOVO CAMPO: Gênero */}
                <div>
                    <label htmlFor="genre" className="label">Gênero</label>
                    <input
                        type="text"
                        name="genre"
                        id="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                        className="input mt-1"
                        disabled={isSaving}
                    />
                </div>

                {/* Campo Ano */}
                <div>
                    <label htmlFor="year" className="label">Ano de Lançamento</label>
                    <input
                        type="number"
                        name="year"
                        id="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="input mt-1"
                        disabled={isSaving}
                        min="1888" 
                        max={new Date().getFullYear()}
                    />
                </div>
                
                {/* Campo Avaliação (Rating) */}
                <div>
                    <label htmlFor="rating" className="label">Avaliação (0 a 10)</label>
                    <input
                        type="number"
                        name="rating"
                        id="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="input mt-1"
                        disabled={isSaving}
                        min="0"
                        max="10"
                        step="0.1" // Permite notas decimais
                    />
                </div>
                
                {/* Campo Watched (Assistido) */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="watched"
                        id="watched"
                        checked={formData.watched}
                        onChange={handleChange}
                        className="h-4 w-4 text-cyan-500 border-[color:var(--border)] rounded bg-white/5"
                        disabled={isSaving}
                    />
                    <label htmlFor="watched" className="ml-2 text-sm">
                        Já assisti a este filme
                    </label>
                </div>
                

                {saveError && (
                    <p className="text-red-400 text-sm mt-2">{saveError}</p>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleCloseEdit}
                        disabled={isSaving}
                        className="btn btn-secondary px-4 py-2 text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn btn-primary px-4 py-2 text-sm"
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}