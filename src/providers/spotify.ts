import { Tokens } from "../types";
import { qs } from "../utils/qs";

export function getSpotifyAuthorizeUrl({
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
  return `https://accounts.spotify.com/authorize?${qs({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: base_url + "/api/auth/integration/spotify",
    ...props,
  })}`;
}

export async function getSpotifyAccessToken({
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
  const { url, ...init } = getTokenReqConfig(
    {
      code,
      redirect_uri: base_url + "/api/auth/integration/spotify",
      grant_type: "authorization_code",
      client_secret: client_secret,
      client_id: client_id,
    },
    {
      client_id,
      client_secret,
    }
  );

  const res = await fetch(url, init);
  const tokens = await res.json();

  await callback({
    provider: "spotify",
    ...tokens,
  });

  return {
    provider: "spofity",
    ...tokens,
  };
}

function getTokenReqConfig(
  body: Record<string, string>,
  { client_id, client_secret }: { client_id: string; client_secret: string }
) {
  const BASIC = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  return {
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  };
}
