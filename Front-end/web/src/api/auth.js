import axios from "axios";
import api from "./api";

export async function login({ emailOrUsername, password }) {
  const params = { emailOrUsername, password };
  const response = await api.post("/auth/login", params);
  return response.data;
}

export async function register({ username, email, password }) {
  const params = { username, email, password };
  const response = await api.post("/auth/signup", params);
  return response.data;
}

export async function forgotPassword({ email }) {
  const params = { email };
  const response = await api.post("/auth/forgot-password", params);
  return response.data;
}

export async function changePassword({ token, password }) {
  const params = { password };
  const response = await api.post(`/auth/forgot-password/${token}`, params);
  return response.data;
}

export async function editProfile({
  accessToken,
  username,
  email,
  calorieLimit,
  avatarUrl,
  gender,
  dob,
  height,
  weight,
}) {
  const params = {
    username,
    email,
    calorieLimit,
    avatarUrl,
    gender,
    dob,
    height,
    weight,
  };
  console.log(params);
  const response = await api.post(`/auth/profile`, params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function loginWithGoogle(credential) {
  const params = { credential };
  const response = await api.post("/auth/google-login", params);
  return response.data;
}

export async function logout({ accessToken, refreshToken }) {
  const params = { refreshToken };
  const response = await api.post("/auth/logout", params, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

export async function uploadToCloudinary({ accessToken, file }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_unsigned_preset"); // replace with your preset

  const response = await axios.post(
    "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
    {
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data.secure_url; // this is the image URL you save
}
