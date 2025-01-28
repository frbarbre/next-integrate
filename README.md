# Next Integrate

Next Integrate is a flexible and customizable npm library designed to simplify the process of setting up and managing OAuth providers in Next.js applications. Unlike conventional authentication libraries, Next Integrate focuses solely on OAuth, providing developers with maximum flexibility without built-in session management or other features.

## Links

- [Documentation](https://next-integrate.vercel.app/)
- [NPM Page](https://www.npmjs.com/package/next-integrate)
- [Github Repository](https://github.com/frbarbre/next-integrate)

## Features

- **Customizable:** Next Integrate offers developers the freedom to manage their OAuth integrations without imposing additional constraints.
- **Support for App and Pages Router:** Works with both the App and Pages Router in Next.js.
- **TypeScript Support:** Written in TypeScript, ensuring type safety and better developer experience.
- **Open Source:** Fully open-source library, allowing contributions and enhancements from the community.

## Supported Providers

- [Google](https://next-integrate.frederikbarbre.dk/docs/providers/google)
- [Facebook](https://next-integrate.frederikbarbre.dk/docs/providers/facebook)
- [Discord](https://next-integrate.frederikbarbre.dk/docs/providers/discord)
- [GitHub](https://next-integrate.frederikbarbre.dk/docs/providers/github)
- [Klaviyo](https://next-integrate.frederikbarbre.dk/docs/providers/klaviyo)
- [Notion](https://next-integrate.frederikbarbre.dk/docs/providers/notion)
- [Pinterest](https://next-integrate.frederikbarbre.dk/docs/providers/pinterest)
- [Slack](https://next-integrate.frederikbarbre.dk/docs/providers/slack)
- [Snapchat](https://next-integrate.frederikbarbre.dk/docs/providers/snapchat)
- [Spotify](https://next-integrate.frederikbarbre.dk/docs/providers/spotify)
- [TikTok](https://next-integrate.frederikbarbre.dk/docs/providers/tiktok)
- [LinkedIn](https://next-integrate.frederikbarbre.dk/docs/providers/linkedin)
- [ClickUp](https://next-integrate.frederikbarbre.dk/docs/providers/click-up)
- [Accuranker](https://next-integrate.frederikbarbre.dk/docs/providers/accuranker)
- [Trustpilot](https://next-integrate.frederikbarbre.dk/docs/providers/trustpilot)
- And more to come...

## Installation

You can install Next Integrate using your preferred package manager:

```bash
# npm
npm i next-integrate

# yarn
yarn add next-integrate

# pnpm
pnpm i next-integrate

# bun
bun i next-integrate
```

## Getting Started

### 1. Initialize a New Next.js Application

If you are starting a new project, begin by creating a Next.js application:

```bash
npx create-next-app@latest
```

### 2. Install Next Integrate

Install the Next Integrate library using your preferred package manager.

### 3. Create Environment Variables

Create a `.env.local` file in the root of your project and set the `BASE_URL` variable:

```env
BASE_URL=http://localhost:3000
```

> **Note:** Change the `BASE_URL` to your production URL when deploying your application.

### 4. Setup Route Handler

Create a route handler at `app/api/auth/[...integration]/route.ts`:

```ts
import { auth } from "@/auth";
import { clearCookies, exchange, handler } from "next-integrate";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// BASE_URL is the URL of the app, e.g. https://example.com, set in the .env file
const BASE_URL = process.env.BASE_URL;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ integration: string[] }> }
) {
  const cookieStore = cookies();

  // This function generates the auth URL
  const { auth_url, callback, error, options, redirect } = await handler({
    req,
    context,
    auth,
    cookieStore,
  });

  if (error) NextResponse.redirect(new URL(`?error${error}`, BASE_URL));

  const auth_error = req.nextUrl.searchParams.get("error");

  if (auth_error) {
    clearCookies({ cookieStore });

    return NextResponse.redirect(
      new URL(`${redirect}?error=${auth_error}`, BASE_URL)
    );
  }

  const code = req.nextUrl.searchParams.get("code");

  // If there is no code, redirect to the auth URL
  if (!code) return NextResponse.redirect(auth_url);

  // This function exchanges the code for the tokens,
  // You can handle the tokens in the callback function in the auth.ts file,
  // or here in the route handler like this:

  //const tokens = await exchange({ callback, code, options, cookieStore });

  await exchange({ callback, code, options, cookieStore });

  return NextResponse.redirect(new URL(redirect, BASE_URL));
}
```

### 5. Create Configuration File

Create an `auth.ts` file in the root of your project:

```ts
import { NextIntegrate } from "next-integrate";

export const { auth } = NextIntegrate({
  base_url: process.env.BASE_URL!,
  providers: [],
});
```

### 6. Create an Integration Component

Create an `Integrate` component in a new `components/integrate.tsx` file:

```tsx
import { integrate, Provider } from "next-integrate";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Integrate({
  provider,
  name,
  children,
  redirect,
  className,
  ...props
}) {
  const pathname = usePathname();

  const integration = integrate({
    name,
    provider,
    redirect: redirect || pathname,
  });

  return (
    <Link href={integration} className={className} {...props}>
      {children}
    </Link>
  );
}
```

## Making Your First Integration

After completing the setup, you can now create your first OAuth integration. In this example we'll use the Google provider.

### 1. Set Up Redirect URI, Client ID, and Client Secret

Create a new project in the [Google Developer Console](https://cloud.google.com/), and set the redirect URI to `http://localhost:3000/api/auth/integrations/google`. Once done, you'll receive a `Client ID` and `Client Secret`.

### 2. Add `.env` Variables

Add the `Client ID` and `Client Secret` to your `.env.local` file:

```env
AUTH_GOOGLE_ID=your-client-id
AUTH_GOOGLE_SECRET=your-client-secret
```

### 3. Configure Provider in `auth.ts`

Update the `auth.ts` file:

```ts
import { NextIntegrate } from "next-integrate";

export const { auth } = NextIntegrate({
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
          },
          callback: async (data) => {
            // Handle data (e.g., store in database or set cookies)
          },
        },
      ],
    },
  ],
});
```

### 4. Create an Integration Button

You can now create a button to trigger the OAuth flow using the `<Integrate />` component:

```tsx
import Integrate from "@/components/integrate";

export default function Home() {
  return (
    <main>
      <Integrate provider="google" name="user_info">
        Get Google User Info
      </Integrate>
    </main>
  );
}
```

### Boom! You're Done!

You should now have a fully functional Google OAuth integration.

## FAQ

### Is it open source?

Yes, the library is fully open source and free to use. Contributions are welcome!

### Can I request a provider?

Yes, you can request any OAuth 2.0 provider on the [GitHub repository](https://github.com/frbarbre/next-integrate).

### Are any data stored?

No, the library only handles redirects and API calls necessary for OAuth flows. You manage data storage yourself.

### Does it support both the App and Pages router?

Yes, it supports both the App and Pages Router in Next.js.

### Does it support TypeScript?

Yes, the library is written in TypeScript and supports it out of the box.

## Contributing

Feel free to open issues or submit pull requests to contribute to the development of Next Integrate.

## License

This project is licensed under the MIT License.
