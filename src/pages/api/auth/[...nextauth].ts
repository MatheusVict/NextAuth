import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

type ICredentials = {
  email: string;
  password: string;
};

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async ({ email, password }: ICredentials) => {
      
          const response = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            body: new URLSearchParams({ email, password }),
          });

          if (response.status == 401) {
            const data = await response.json();
            console.log(data);
            throw new Error(data.error.message || "Credenciais inválidas")
          } else if(response.status == 500) {
            throw new Error('erro ao logar')
          }

          const data = await response.json();
          if(data) {
          console.log(JSON.stringify(data));
          return { ...data, token: data.token };
          }
          return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
