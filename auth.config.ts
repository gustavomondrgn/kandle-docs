import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin/login";
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute && !isLoginPage && !isLoggedIn) return false;
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
  session: { strategy: "jwt" },
};
