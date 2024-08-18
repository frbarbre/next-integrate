export const hero = `{
  provider: "google",
  client_id: process.env.AUTH_GOOGLE_ID!,
  client_secret: process.env.AUTH_GOOGLE_SECRET!,
  integrations: [
    {
      name: "google_ads",
      options: {
        scope: "openid https://www.googleapis.com/auth/adwords",
        access_type: "offline",
        prompt: "consent",
      },
      callback: async (data) => {
        // do anything with the tokens
        cookies().set("session", JSON.stringify(data));
      },
    },
  ],
}`;
