import { Tokens } from "../types";
import { qs } from "../utils/qs";

export async function getRedditAuthorizeUrl({
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
}): Promise<string> {
  return `https://www.reddit.com/api/v1/authorize?${qs({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: base_url + "/api/auth/integration/reddit",
    code_challenge_method: "S256",
    code_challenge,
    state: "hello-world",
    ...props,
  })}`;
}

export async function getRedditAccessToken({
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
  const { url, ...init } = getTokenReqConfig(
    {
      code,
      redirect_uri: base_url + "/api/auth/integration/reddit",
      grant_type: "authorization_code",
      client_secret: client_secret,
      client_id: client_id,
      code_verifier: code_verifier || "",
    },
    {
      client_id,
      client_secret,
    }
  );

  const res = await fetch(url, init);
  const tokens = await res.json();

  await callback({
    provider: "reddit",
    ...tokens,
  });

  return {
    provider: "reddit",
    ...tokens,
  };
}

function getTokenReqConfig(
  body: Record<string, string>,
  { client_id, client_secret }: { client_id: string; client_secret: string }
) {
  const BASIC = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  return {
    url: "https://www.reddit.com/api/v1/access_token",
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  };
}
