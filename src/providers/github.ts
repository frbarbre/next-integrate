import { Tokens } from "../types";
import { qs } from "../utils/qs";

export function getGithubAuthorizeUrl({
  client_id,
  scope,
  base_url,
  client_secret,
  ...props
}: {
  client_id: string;
  scope?: string;
  base_url: string;
  client_secret?: string;
  [key: string]: string | undefined;
}): string {
  return `https://github.com/login/oauth/authorize?${qs({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: base_url + "/api/auth/integration/github",
    ...props,
  })}`;
}

export async function getGithubAccessToken({
  code,
  base_url,
  client_id,
  client_secret,
  callback,
}: {
  code: string;
  base_url: string;
  client_id: string;
  client_secret: string;
  callback: (tokens: Tokens) => Promise<void> | void;
}) {
  const { url, ...init } = getTokenReqConfig({
    code,
    redirect_uri: base_url + "/api/auth/integration/github",
    grant_type: "authorization_code",
    client_secret: client_secret,
    client_id: client_id,
  });

  const res = await fetch(url, init);
  const tokens = await res.json();

  await callback({
    provider: "github",
    ...tokens,
  });

  return {
    provider: "github",
    ...tokens,
  };
}

function getTokenReqConfig(body: Record<string, string>) {
  return {
    url: "https://github.com/login/oauth/access_token",
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: new URLSearchParams(body),
  };
}
