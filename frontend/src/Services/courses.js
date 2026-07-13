import api from "@/Api/axios";

export const getCourses = async () => {
  const response = await api.get("/api/Courses");
  return response.data;
};

export const getCourse = async (codeModule, codePresentation) => {
  const response = await api.get(
    `/api/Courses/${codeModule}/${codePresentation}`,
  );
  return response.data;
};

export const createCourse = async (course) => {
  const response = await api.post("/api/Courses", course);
  return response.data;
};

export const updateCourse = async (codeModule, codePresentation, course) => {
  const response = await api.put(
    `/api/Courses/${codeModule}/${codePresentation}`,
    course,
  );
  return response.data;
};

export const deleteCourse = async (codeModule, codePresentation) => {
  const response = await api.delete(
    `/api/Courses/${codeModule}/${codePresentation}`,
  );
  return response.data;
};

export const enroll = async (codeModule, codePresentation) => {
  const response = await api.post(
    `/api/Courses/${codeModule}/${codePresentation}/enroll`,
  );
  return response.data;
};

export const unEnroll = async (codeModule, codePresentation) => {
  const response = await api.post(
    `/api/Courses/${codeModule}/${codePresentation}/unenroll`,
  );
  return response.data;
};
