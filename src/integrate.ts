import { IntegrateOptions } from "./types";

export function integrate({
  name,
  provider,
  redirect,
  base_path,
  shop,
}: IntegrateOptions) {
  if (!name || !provider || !redirect) {
    throw new Error("Name, redirect and provider are required");
  }

  if (provider === "shopify" && !shop) {
    throw new Error("Shop is required for the shopify provider");
  }

  let redirectUrl = redirect
    .replaceAll("#", "__HASH__")
    .replaceAll("&", "__AND__");

  let url = `/api/auth/integration/${provider}?name=${name}&redirect=${redirectUrl}`;

  if (base_path) {
    url = `${base_path}/api/auth/integration/${provider}?name=${name}&redirect=${redirectUrl}`;
  }

  if (shop) {
    url = `${url}&shop=${encodeURIComponent(shop)}`;
  }

  return url;
}
