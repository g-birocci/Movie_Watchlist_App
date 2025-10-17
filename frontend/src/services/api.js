// GET /api/movies - Carregar todos os filmes
export async function carregarFilmesAPI() {
  try {
    const response = await fetch('/api/movies');

    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText);
      throw new Error('Erro ao carregar filmes');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    throw error;
  }
}

// POST /api/movies - Adicionar novo filme
export async function adicionarFilmeAPI(filme) {
  try {
    const response = await fetch('/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filme)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao adicionar filme');
    }

    const resultado = await response.json();
    return resultado;

  } catch (error) {
    console.error('Erro ao adicionar filme:', error);
    throw error;
  }
}

// PUT /api/movies/:id - Atualizar um filme
export async function atualizarFilmeAPI(id, filmeAtualizado) {
  try {
    const response = await fetch(`/api/movies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filmeAtualizado)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao atualizar filme');
    }

    const resultado = await response.json();
    return resultado;

  } catch (error) {
    console.error('Erro ao atualizar filme:', error);
    throw error;
  }
}

// DELETE /api/movies/:id - Remover um filme
export async function removerFilmeAPI(id) {
  try {
    const response = await fetch(`/api/movies/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao remover filme');
    }

    return { sucesso: true };

  } catch (error) {
    console.error('Erro ao remover filme:', error);
    throw error;
  }
}
