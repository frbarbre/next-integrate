import { Tokens } from "../types";
import { qs } from "../utils/qs";

function normalizeShop(shop: string): string {
  let normalized = shop.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!normalized.includes(".")) {
    normalized = `${normalized}.myshopify.com`;
  }
  return normalized;
}

export function getShopifyAuthorizeUrl({
  client_id,
  scope,
  base_url,
  shop,
  client_secret,
  ...props
}: {
  client_id: string;
  scope?: string;
  base_url: string;
  shop: string;
  client_secret?: string;
  [key: string]: string | undefined;
}): string {
  return `https://${normalizeShop(shop)}/admin/oauth/authorize?${qs({
    client_id: client_id,
    scope: scope,
    redirect_uri: base_url + "/api/auth/integration/shopify",
    ...props,
  })}`;
}

export async function getShopifyAccessToken({
  code,
  client_id,
  client_secret,
  shop,
  callback,
}: {
  code: string;
  client_id: string;
  client_secret: string;
  shop: string;
  callback: (tokens: Tokens) => Promise<void> | void;
}) {
  const normalizedShop = normalizeShop(shop);

  const res = await fetch(`https://${normalizedShop}/admin/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: client_id,
      client_secret: client_secret,
      code: code,
    }),
  });

  const tokens = await res.json();

  await callback({
    provider: "shopify",
    shop: normalizedShop,
    ...tokens,
  });

  return {
    provider: "shopify",
    shop: normalizedShop,
    ...tokens,
  };
}
