export type SignInReturnType = {
  refreshToken: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
