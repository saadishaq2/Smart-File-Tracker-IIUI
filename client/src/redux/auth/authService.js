import API from "../../services/api";

export const signup = async (formData) => {
  try {
    const res = await API.post("/auth/signup", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Signup failed";
  }
};

export const signin = async (formData) => {
  try {
    const res = await API.post("/auth/signin", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Signin failed";
  }
};
