export const getUsers = async () => {
  try {
    const response = await fetch("api/users");
    if (!response.ok) throw new Error("Erro ao buscar usuários");
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição getUsers", error);
    return [];
  }
};
