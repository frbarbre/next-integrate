import { Tokens } from "../types";
import { qs } from "../utils/qs";

export function getTiktokAuthorizeUrl({
  client_id,
  scope,
  base_url,
  client_secret,
  code_challenge,
  ...props
}: {
  client_id: string;
  scope?: string;
  base_url: string;
  client_secret?: string;
  code_challenge: string | undefined;
  [key: string]: string | undefined;
}): string {
  return `https://www.tiktok.com/v2/auth/authorize?${qs({
    response_type: "code",
    client_key: client_id,
    scope: scope,
    redirect_uri: base_url + "/api/auth/integration/tiktok",
    code_challenge_method: "S256",
    code_challenge,
    ...props,
  })}`;
}

export async function getTiktokAccessToken({
  code,
  base_url,
  client_id,
  client_secret,
  callback,
  code_verifier,
}: {
  code: string;
  base_url: string;
  client_id: string;
  client_secret: string;
  callback: (tokens: Tokens) => Promise<void> | void;
  code_verifier: string | undefined;
}) {
  const { url, ...init } = getTokenReqConfig({
    code,
    redirect_uri: base_url + "/api/auth/integration/tiktok",
    grant_type: "authorization_code",
    client_secret: client_secret,
    client_key: client_id,
    code_verifier: code_verifier || "",
  });

  const res = await fetch(url, init);
  const tokens = await res.json();

  await callback({
    provider: "tiktok",
    ...tokens,
  });

  return {
    provider: "tiktok",
    ...tokens,
  };
}

function getTokenReqConfig(body: Record<string, string>) {
  return {
    url: "https://open.tiktokapis.com/v2/oauth/token/",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  };
}
