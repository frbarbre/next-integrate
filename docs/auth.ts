import { NextIntegrate } from "next-integrate";
import { cookies } from "next/headers";

export const { auth } = NextIntegrate({
  // The URL of the app, e.g. https://example.com, set in the .env file.
  // If you want to modify the redirect URL, to be prefixed with something else,
  // you can do it here like this:
  // base_url: process.env.BASE_URL! + "/some-prefix",
  // This will change the redirect URL to eg. https://example.com/some-prefix/api/auth/integrations/google
  base_url: process.env.BASE_URL!,
  providers: [
    {
      provider: "google",
      client_id: process.env.AUTH_GOOGLE_ID!,
      client_secret: process.env.AUTH_GOOGLE_SECRET!,
      integrations: [
        {
          name: "user_info",
          options: {
            scope: "openid https://www.googleapis.com/auth/userinfo.profile",
            access_type: "offline",
            prompt: "consent",
          },
          callback: async (data) => {
            cookies().set("google_user_info", JSON.stringify(data));
          },
        },
        {
          name: "search_console",
          options: {
            scope: "openid https://www.googleapis.com/auth/webmasters",
            access_type: "offline",
            prompt: "consent",
          },
          callback: async (data) => {
            cookies().set("google_search_console", JSON.stringify(data));
          },
        },
      ],
    },
  ],
});
