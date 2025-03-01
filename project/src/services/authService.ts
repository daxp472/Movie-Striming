import { authApi, authEndpoints } from '../config/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface VerifyEmailData {
  email: string;
  code: string;
}

interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

interface RequestPasswordResetData {
  email: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await authApi.post(authEndpoints.login, credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await authApi.post(authEndpoints.register, data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailData) => {
    const response = await authApi.post(authEndpoints.verify, data);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await authApi.post(authEndpoints.refreshToken, { refreshToken });
    return response.data;
  },

  requestPasswordReset: async (data: RequestPasswordResetData) => {
    const response = await authApi.post(authEndpoints.requestPasswordReset, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await authApi.post(authEndpoints.resetPassword, data);
    return response.data;
  },
};
