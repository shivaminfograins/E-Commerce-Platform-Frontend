import api from "../api/axios";

const getNestedValue = (obj, keys) => {
  if (!obj) return null;

  for (const key of keys) {
    if (obj?.[key]) return obj[key];
  }

  return null;
};

export const normalizeAuthResponse = (
  data,
  fallbackEmail = "",
  fallbackName = "",
) => {
  const accessToken =
    getNestedValue(data, ["access", "access_token", "token", "accessToken"]) ||
    getNestedValue(data?.token, ["access", "accessToken"]);

  const refreshToken =
    getNestedValue(data, ["refresh", "refresh_token", "refreshToken"]) ||
    getNestedValue(data?.token, ["refresh", "refreshToken"]);

  const userPayload =
    data?.user ||
    data?.profile ||
    data?.data?.user ||
    data?.data?.profile ||
    {};
  const username =
    userPayload.username ||
    userPayload.name ||
    data?.username ||
    fallbackName ||
    fallbackEmail.split("@")[0];

  return {
    user: {
      id: userPayload.id ?? data?.user_id ?? data?.id ?? null,
      fullName:
        userPayload.full_name ||
        userPayload.fullName ||
        userPayload.name ||
        username ||
        fallbackName,
      email: userPayload.email || data?.email || fallbackEmail,
      username,
      accessToken,
      refreshToken,
      token: accessToken,
    },
    accessToken,
    refreshToken,
  };
};

const postWithFallback = async (candidates, data) => {
  let lastError;

  for (const endpoint of candidates) {
    try {
      const response = await api.post(endpoint, data);
      return response;
    } catch (error) {
      lastError = error;
      const isNotFound = error?.response?.status === 404;
      if (!isNotFound) {
        throw error;
      }
    }
  }

  throw lastError;
};

const authService = {
  login: async ({ email, password }) => {
    const response = await postWithFallback(
      ["/auth/login/", "/api/auth/login/"],
      {
        email,
        password,
      },
    );
    return response.data;
  },

  register: async ({ email, username, password }) => {
    const response = await postWithFallback(
      ["/auth/register/", "/api/auth/register/"],
      {
        email,
        username,
        password,
      },
    );
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await postWithFallback(
      ["/auth/token/refresh/", "/api/auth/token/refresh/"],
      {
        refresh: refreshToken,
      },
    );
    return response.data;
  },

  forgotPassword: async ({ email }) => {
    const response = await postWithFallback(
      ["/accounts/forgot-password/", "/auth/forgot-password/"],
      { email },
    );
    return response.data;
  },

  resetPassword: async ({ uid, token, password, confirm_password }) => {
    const response = await postWithFallback(
      ["/accounts/reset-password/", "/auth/reset-password/"],
      {
        uid,
        token,
        password,
        confirm_password,
      },
    );
    return response.data;
  },
};

export default authService;
