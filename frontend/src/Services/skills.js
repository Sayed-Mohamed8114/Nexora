import api from "@/Api/axios";

export const getSkills = async () => {
  const response = await api.get("/api/Skills");
  return response;
};

export const addSkills = async () => {
  const response = await api.post("api/Skills");
  return response;
};

export const updateSkill = async (skillId) => {
  const response = await api.put(`/api/Skills/${skillId}`);
  return response;
};

export const deleteSkill = async (skillId) => {
  const response = await api.delete(`/api/Skills/${skillId}`);
  return response;
};
