// frontend/src/lib/api.js

// Substitua '/api/movies' por 'http://localhost:3001/api/movies'
// (ou a URL do seu backend)

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function carregarFilmesAPI() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/movies`);
    if (!response.ok) throw new Error('Erro ao carregar filmes');
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    throw error;
  }
}

export async function adicionarFilmeAPI(filme) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao adicionar filme');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao adicionar filme:', error);
    throw error;
  }
}

// Faça o mesmo para atualizarFilmeAPI e removerFilmeAPI
// usando `${BACKEND_URL}/api/movies/${id}`