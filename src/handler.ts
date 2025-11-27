import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { NextRequest } from "next/server";
import { generateAuthURL, generateTokens } from "./helpers";
import { Auth, Tokens } from "./types";

// Function to base64 URL encode a string
function base64URLEncode(str: Buffer): string {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Function to generate code verifier and code challenge
async function generateCodes(): Promise<{
  code_verifier: string;
  code_challenge: string;
}> {
  // Generate a random 32-byte buffer
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  const verifier = base64URLEncode(Buffer.from(array));

  // Hash the verifier using SHA-256
  async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await crypto.subtle.digest("SHA-256", data);
  }

  // Generate the code challenge from the verifier
  async function generateCodeChallenge(verifier: string): Promise<string> {
    const hashed = await sha256(verifier);
    return base64URLEncode(Buffer.from(hashed));
  }

  // Return both the code verifier and the code challenge
  return {
    code_verifier: verifier,
    code_challenge: await generateCodeChallenge(verifier),
  };
}

const placerholder = {
  auth_url: "/",
  redirect: "/",
  options: null,
  codeChallenge: "",
  callback: () => {},
};

export async function handler({
  context,
  req,
  auth,
  cookieStore,
  debug = false,
}: {
  context: {
    params: Promise<{
      integration: string[];
    }>;
  };
  req: NextRequest;
  auth: Auth;
  cookieStore: Promise<ReadonlyRequestCookies>;
  debug?: boolean;
}) {
  const { code_verifier, code_challenge } = await generateCodes();

  const params = (await context.params).integration;
  const code = req.nextUrl.searchParams.get("code");

  if (debug) {
    console.log("code_verifier", code_verifier);
    console.log("code_challenge", code_challenge);
  }

  const newName = req.nextUrl.searchParams.get("name");
  const newRedirect = req.nextUrl.searchParams.get("redirect");

  if (debug) {
    console.log("Name", newName);
    console.log("Redirect", newRedirect);
  }

  if (!code) {
    if (debug) {
      console.log("Setting cookies");
    }
    (await cookieStore).set("name", newName || "");
    (await cookieStore).set("redirect", newRedirect || "");
    (await cookieStore).set("code_verifier", code_verifier);
  }

  const name = (await cookieStore).get("name")?.value;
  const redirect = (await cookieStore).get("redirect")?.value;

  if (debug) {
    console.log("Getting newly set cookies");
    console.log("Name", name);
    console.log("Redirect", redirect);
  }

  if (!name) {
    if (debug) {
      console.log("Name is required");
    }
    return {
      ...placerholder,
      error: "Name is required",
    };
  }

  if (debug) {
    console.log("Getting providers");
  }

  const { providers, base_url } = auth;

  if (debug) {
    console.log("Providers", providers);
    console.log("Base URL", base_url);
  }

  const provider = providers.find((p) => p.provider === params[1]);

  if (debug) {
    console.log("Provider", provider);
  }
  const integration = provider?.integrations.find((i) => i.name === name);

  if (debug) {
    console.log("Integration", integration);
  }

  if (!provider || !name || !integration) {
    if (debug) {
      console.log("Invalid integration");
    }
    return {
      ...placerholder,
      error: "Invalid integration",
    };
  }

  const options = {
    ...integration.options,
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    code_challenge,
    base_url,
    params: params.join("/"),
  };

  if (debug) {
    console.log("Options", options);
  }

  const auth_url = await generateAuthURL(options);

  if (debug) {
    console.log("Auth URL", auth_url);
  }

  if (!auth_url) {
    if (debug) {
      console.log("Invalid redirect URL");
    }
    return {
      ...placerholder,
      error: "Invalid redirect URL",
    };
  }

  return {
    auth_url,
    redirect:
      redirect?.replaceAll("__HASH__", "#").replaceAll("__AND__", "&") || "/",
    options,
    callback: integration.callback,
    error: null,
  };
}

export async function exchange({
  options,
  callback,
  code,
  cookieStore,
  debug = false,
}: {
  options: {
    client_id: string;
    scope?: string;
    base_url: string;
    client_secret: string;
    params: string;
    [key: string]: string | undefined;
  } | null;
  callback: (tokens: Tokens) => void;
  code: string;
  cookieStore: Promise<ReadonlyRequestCookies>;
  debug?: boolean;
}): Promise<
  | {
      tokens: Tokens;
      clientCallbackQueryParams: string | null;
    }
  | undefined
> {
  if (!options) return;

  if (debug) {
    console.log("Options", options);
  }
  const code_verifier = (await cookieStore).get("code_verifier")?.value;

  if (debug) {
    console.log("Code verifier", code_verifier);
  }

  const tokens = await generateTokens({
    ...options,
    code_verifier,
    callback,
    code,
  });

  if (debug) {
    console.log("Tokens", tokens);
  }

  const name = (await cookieStore).get("name")?.value;

  (await cookieStore).delete("name");
  (await cookieStore).delete("redirect");
  (await cookieStore).delete("code_verifier");

  if (debug) {
    console.log("Cleared cookies");
  }

  const qp = `?name=${name}&provider=${options.params
    .split("/")
    .pop()}&status=success`;

  return {
    tokens,
    clientCallbackQueryParams: qp,
  };
}

export async function clearCookies({
  cookieStore,
}: {
  cookieStore: Promise<ReadonlyRequestCookies>;
}) {
  (await cookieStore).delete("name");
  (await cookieStore).delete("redirect");
  (await cookieStore).delete("code_verifier");
}
