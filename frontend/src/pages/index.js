// frontend/src/pages/index.jsx
import { useState, useRef } from 'react'; // ← useRef adicionado aqui
import AddMovie from '../components/AddMovie';
import AllMovies from '../components/AllMovies';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const refreshRef = useRef(null); // guarda a função de refresh

  const handleMovieAdded = () => {
    // Fecha o formulário
    setShowForm(false);
    // Atualiza a lista
    if (refreshRef.current) {
      refreshRef.current();
    }
  }; // ← chave e parêntese fechados corretamente

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FlixBytes</h1>
          <p className="text-gray-600 mt-2">Filmes que vi, quero ver e minhas avaliações</p>
        </header>

        <main>
          {/* Passa a função de refresh para AllMovies */}
          <AllMovies onRefresh={(fn) => (refreshRef.current = fn)} />

          <div className="text-center mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition shadow-sm"
            >
              {showForm ? 'Cancelar' : '➕ Adicionar Filme'}
            </button>
          </div>

          {/* Passa handleMovieAdded para o AddMovie */}
          {showForm && (
            <AddMovie
              onClose={() => setShowForm(false)}
              onMovieAdded={handleMovieAdded} // ← importante!
            />
          )}
        </main>
      </div>
    </div>
  );
}