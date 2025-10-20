import { Tokens } from "../types";
import { qs } from "../utils/qs";

export function getAzureAuthorizeUrl({
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
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${qs({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: base_url + "/api/auth/integration/azure",
    ...props,
  })}`;
}

export async function getAzureAccessToken({
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
    redirect_uri: base_url + "/api/auth/integration/azure",
    grant_type: "authorization_code",
    client_secret: client_secret,
    client_id: client_id,
  });

  const res = await fetch(url, init);
  const tokens = await res.json();

  await callback({
    provider: "azure",
    ...tokens,
  });

  return {
    provider: "azure",
    ...tokens,
  };
}

function getTokenReqConfig(body: Record<string, string>) {
  return {
    url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  };
}
