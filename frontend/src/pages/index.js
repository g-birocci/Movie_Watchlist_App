// frontend/src/pages/index.jsx

import { useState, useRef } from 'react';
import AddMovie from '../components/AddMovie';

// NOVAS IMPORTAÇÕES DE COMPONENTES DE LISTA
import AllMovies from '../components/AllMovies';
import WatchedMovies from '../components/WatchedMovies';
import NotWatchedMovies from '../components/NotWatchedMovies';
import MoviesByRating from '../components/MoviesByRating';

export default function Home() {
    const [showForm, setShowForm] = useState(false);
    
    // NOVO ESTADO: Controla qual aba está ativa ('all', 'watched', 'notWatched', 'byRating')
    const [activeTab, setActiveTab] = useState('all'); 
    
    // O useRef será compartilhado e usado para atualizar a lista ATIVA
    const refreshRef = useRef(null); 

    const handleMovieAdded = () => {
        // 1. Fecha o formulário
        setShowForm(false);
        // 2. Atualiza a lista ATIVA
        if (refreshRef.current) {
            refreshRef.current();
        }
    };

    // Função que renderiza o componente da lista baseado na aba ativa
    const renderActiveList = () => {
        // A prop onRefresh agora é passada para o componente ativo
        const refreshProps = {
            onRefresh: (fn) => (refreshRef.current = fn)
        };
        
        switch (activeTab) {
            case 'watched':
                return <WatchedMovies {...refreshProps} />;
            case 'notWatched':
                return <NotWatchedMovies {...refreshProps} />;
            case 'byRating':
                return <MoviesByRating {...refreshProps} />;
            case 'all':
            default:
                return <AllMovies {...refreshProps} />;
        }
    };

    const tabClasses = (tabName) => 
        `px-4 py-3 font-semibold text-sm transition-colors duration-200 cursor-pointer whitespace-nowrap
         ${activeTab === tabName 
            ? 'text-cyan-400 border-b-2 border-cyan-400' 
            : 'text-muted hover:text-cyan-400'}`;

    return (
        <div className="min-h-screen py-6 px-4">
            <div className="max-w-3xl mx-auto">
                {/* BARRA DE ABAS FIXA (diretamente abaixo do Navbar) */}
                <div className="sticky top-[64px] z-30 bg-[color:var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/70 border-b border-[color:var(--border)]">
                    <div className="max-w-3xl mx-auto px-1">
                        <div className="flex gap-4 overflow-x-auto no-scrollbar">
                            <div 
                                className={tabClasses('all')} 
                                onClick={() => setActiveTab('all')}
                            >
                                Todos os Filmes
                            </div>
                            <div 
                                className={tabClasses('watched')} 
                                onClick={() => setActiveTab('watched')}
                            >
                                Assistidos
                            </div>
                            <div 
                                className={tabClasses('notWatched')} 
                                onClick={() => setActiveTab('notWatched')}
                            >
                                Pendentes
                            </div>
                            <div 
                                className={tabClasses('byRating')} 
                                onClick={() => setActiveTab('byRating')}
                            >
                                Por Avaliação
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cabeçalho/descrição abaixo das abas */}
                <header className="text-center mb-4 mt-3">
                    <p className="text-muted mt-1">Filmes que vi, quero ver e minhas avaliações</p>
                </header>

                <main>
                    {/* RENDERIZAÇÃO DA LISTA ATIVA */}
                    <div className="mt-4">
                        {renderActiveList()}
                    </div>

                    <div className="text-center mb-6 mt-10">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn btn-primary py-2 px-6 rounded-full shadow-sm"
                        >
                            {showForm ? 'Cancelar' : '➕ Adicionar Filme'}
                        </button>
                    </div>

                    {/* Formulário de Adição */}
                    {showForm && (
                        <AddMovie
                            onClose={() => setShowForm(false)}
                            onMovieAdded={handleMovieAdded}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}