import api from "@/Api/axios";

export const getSkillTags = async () => {
  const response = await api.get("/api/CourseSkillTags");
  return response.data;
};

export const getSkillTagsBySkill = async (skill) => {
  const response = await api.get(`/api/CourseSkillTags/by-skill`, {
    params: {
      skill,
    },
  });
  return response.data;
};

export const createSkillTag = async (tag) => {
  const response =await api.post("api/CourseSkillTags", tag);
  return response.data;
};

export const deleteSkillTag = async (tagId) => {
  await api.delete(`/CourseSkillTags/${tagId}`);
};
