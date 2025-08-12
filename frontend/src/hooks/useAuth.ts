import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/authService";
import { useNavigate } from "@tanstack/react-router";

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      navigate({ to: "/dashboard" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => authService.register(name, email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      navigate({ to: "/dashboard" });
    },
  });

  const logout = () => {
    authService.logout();
    clearAuth();
    queryClient.clear();
    navigate({ to: "/login" });
  };

  if (token && isAuthenticated) {
    authService.setToken(token);
  }

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
