import api from "../Api/axios";
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  try {
    // Get user profile
    const response = await api.get("/api/AcademicProfile", {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      data: error.response.data || error.message,
    };
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  try {
    const response = await api.put("/api/AcademicProfile", profileData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      data: error.response.data || error.message,
    };
  }
};