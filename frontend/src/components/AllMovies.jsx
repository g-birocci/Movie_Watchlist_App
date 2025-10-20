// frontend/src/components/AllMovies.jsx
import { useState, useEffect } from 'react';
import { carregarFilmesAPI } from '../services/api';

export default function AllMovies({ onRefresh }) {
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarFilmes = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await carregarFilmesAPI();
      setFilmes(Array.isArray(dados) ? dados : []);
    } catch (err) {
      setErro(err.message);
      setFilmes([]);
    } finally {
      setCarregando(false);
    }
  };

  // Busca inicial ao montar
  useEffect(() => {
    buscarFilmes();
  }, []);

  // Passa a função de refresh para o componente pai (via prop onRefresh)
  useEffect(() => {
    if (onRefresh) {
      onRefresh(buscarFilmes);
    }
  }, [onRefresh, buscarFilmes]);

  if (carregando) return <p className="text-center text-gray-600">Carregando seus filmes...</p>;
  if (erro) return <p className="text-center text-red-500">Erro: {erro}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Minha Biblioteca</h2>
      {filmes.length === 0 ? (
        <p className="text-gray-500 text-center">Você ainda não adicionou nenhum filme.</p>
      ) : (
        <div className="grid gap-4">
          {filmes.map((filme) => (
            <div
              key={filme._id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{filme.title}</h3>
                  <p className="text-gray-600">{filme.genre} • {filme.year}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    filme.watched
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {filme.watched ? 'Assistido' : 'Pendente'}
                </span>
              </div>

              {filme.rating !== undefined && filme.rating > 0 && (
                <p className="mt-2 text-gray-700">⭐ Nota: {filme.rating}/10</p>
              )}

              <p className="text-xs text-gray-400 mt-3">
                Adicionado em: {new Date(filme.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}