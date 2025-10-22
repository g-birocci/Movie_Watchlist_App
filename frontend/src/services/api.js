// Define a URL base do backend usando a variável de ambiente (se disponível)
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
const API_BASE_PATH = `${BACKEND_URL}/api/movies`;

// ----------------------------------------------------------------------
// FUNÇÃO AUXILIAR: Gerencia a Requisição, Headers e Tratamento de Erro
// ----------------------------------------------------------------------
async function apiFetch(url, options = {}) {
  const defaultOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro de servidor desconhecido." }));
      throw new Error(
        errorData.erro ||
          errorData.message ||
          `Erro de rede: ${response.status}`
      );
    }

    return response.status === 204 ? {} : await response.json();
  } catch (error) {
    console.error("Erro na requisição API:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------
// FUNÇÕES DE EXPORTAÇÃO
// ----------------------------------------------------------------------

/**
 * 1. Carregar Filmes (GET)
 * @param {Object} filters - Filtros opcionais (ex: { watched: true })
 * @returns {Promise<Array>} Lista de filmes
 */
export async function carregarFilmesAPI(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const url = `${API_BASE_PATH}${query ? "?" + query : ""}`;
  return apiFetch(url, { method: "GET" });
}

/**
 * 2. Adicionar Filme (POST)
 * @param {Object} filme - Dados do filme
 * @returns {Promise<Object>} Filme criado
 */
export async function adicionarFilmeAPI(filme) {
  return apiFetch(API_BASE_PATH, {
    method: "POST",
    body: JSON.stringify(filme),
  });
}

/**
 * 3. Atualizar Filme Completo (PUT)
 * @param {string} movieId - ID do filme
 * @param {Object} movieData - Dados atualizados
 * @returns {Promise<Object>} Filme atualizado
 */
export async function atualizarFilmeAPI(movieId, movieData) {
  return apiFetch(`${API_BASE_PATH}/${movieId}`, {
    method: "PUT",
    body: JSON.stringify(movieData),
  });
}

/**
 * 4. Alternar Status Watched (PATCH)
 * @param {string} movieId - ID do filme
 * @param {boolean} watched - Novo status watched
 * @returns {Promise<Object>} Filme atualizado
 */
export async function alterarStatusWatchedAPI(movieId, watched) {
  return apiFetch(`${API_BASE_PATH}/${movieId}`, {
    method: "PATCH",
    body: JSON.stringify({ watched }),
  });
}

// ALIAS para compatibilidade com código existente
export const alternarWatchedAPI = alterarStatusWatchedAPI;

/**
 * 5. Remover Filme (DELETE)
 * @param {string} id - ID do filme
 * @returns {Promise<boolean>} Sucesso da operação
 */
export async function removerFilmeAPI(id) {
  await apiFetch(`${API_BASE_PATH}/${id}`, {
    method: "DELETE",
  });
  return true;
}

// ALIAS para compatibilidade
export const deletarFilmeAPI = removerFilmeAPI;