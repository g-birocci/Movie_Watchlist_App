// frontend/src/lib/api.js (ou services/api.js)

// Define a URL base do backend usando a variável de ambiente (se disponível)
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// --- Função para Carregar Filmes (GET) ---
export async function carregarFilmesAPI() {
  try {
    // GET: ${BACKEND_URL}/api/movies
    const response = await fetch(`${BACKEND_URL}/api/movies`);
    if (!response.ok) throw new Error("Erro ao carregar filmes");
    return await response.json();
  } catch (error) {
    console.error("Erro ao carregar filmes:", error); // Lançar o erro para ser capturado pelo hook ou componente
    throw error;
  }
}

// --- Função para Adicionar Filme (POST) ---
export async function adicionarFilmeAPI(filme) {
  try {
    // POST: ${BACKEND_URL}/api/movies
    const response = await fetch(`${BACKEND_URL}/api/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filme),
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ erro: "Erro de servidor desconhecido." })); // Lança a mensagem de erro detalhada do backend
      throw new Error(errorData.erro || "Erro ao adicionar filme");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao adicionar filme:", error);
    throw error;
  }
}

function buildUrlWithParams(baseUrl, params) {
    // Cria um objeto URL. window.location.origin assume que a API está na mesma origem.
    const url = new URL(baseUrl, window.location.origin); 
    
    // Adiciona cada chave/valor como um query parameter
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, value);
        }
    });
    return url.toString();
}

export async function listarFilmesAPI(filterParams = {}) {
    const baseUrl = '/api/movies'; 
    // Usa a função auxiliar para construir a URL, ex: /api/movies?watched=true
    const url = buildUrlWithParams(baseUrl, filterParams); 
    
    const response = await fetch(url);

    if (!response.ok) {
        // Assume que você tem um tratamento de erro consistente
        throw new Error('Falha ao listar filmes.');
    }
    return response.json();
}

// --- FUNÇÃO: Atualizar Filme (PUT - Edição Completa) ---
export const atualizarFilmeAPI = async (movieId, movieData) => {
  // PUT: ${BACKEND_URL}/api/movies/:id
  const response = await fetch(`${BACKEND_URL}/api/movies/${movieId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Falha ao conectar com a API." }));
    throw new Error(
      errorData.erro ||
        errorData.message ||
        `Erro ao atualizar o filme: ${response.status}`
    );
  } // Retorna o objeto atualizado do servidor

  return response.json();
};

// --- FUNÇÃO: Alternar Watched (PATCH - Atualização Parcial) ---
export const alternarWatchedAPI = async (movieId, newStatus) => {
  // PATCH: ${BACKEND_URL}/api/movies/:id
  const response = await fetch(`${BACKEND_URL}/api/movies/${movieId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ watched: newStatus }), // Envia APENAS o campo 'watched'
  });

  if (!response.ok) {
    // Tenta ler o erro do corpo da resposta, se possível
    const errorData = await response
      .json()
      .catch(() => ({ message: "Falha ao conectar com a API." }));
    throw new Error(
      errorData.erro ||
        errorData.message ||
        `Erro ao atualizar o filme: ${response.status}`
    );
  }

  return response.json();
};

// --- FUNÇÃO: Remover Filme (DELETE) ---
export async function removerFilmeAPI(id) {
  try {
    // DELETE: ${BACKEND_URL}/api/movies/:id
    const response = await fetch(`${BACKEND_URL}/api/movies/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ erro: "Erro de servidor desconhecido." }));
      throw new Error(
        errorData.erro || `Erro ao remover filme: ${response.status}`
      );
    } // O backend retorna `{ sucesso: true }` (ou um objeto vazio)

    return true;
  } catch (error) {
    console.error(`Erro ao remover filme com ID ${id}:`, error);
    throw new Error("Falha na comunicação ao remover filme");
  }
}
