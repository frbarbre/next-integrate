import { Tokens } from "../types";
import { qs } from "../utils/qs";

export function getDiscordAuthorizeUrl({
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
  return `https://discord.com/oauth2/authorize?${qs({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: base_url + "/api/auth/integration/discord",
    ...props,
  })}`;
}

export async function getDiscordAccessToken({
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
    redirect_uri: base_url + "/api/auth/integration/discord",
    grant_type: "authorization_code",
    client_secret: client_secret,
    client_id: client_id,
  });

  const res = await fetch(url, init);
  const tokens = await res.json();

  await callback({
    provider: "discord",
    ...tokens,
  });

  return {
    provider: "discord",
    ...tokens,
  };
}

function getTokenReqConfig(body: Record<string, string>) {
  return {
    url: "https://discord.com/api/oauth2/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  };
}
