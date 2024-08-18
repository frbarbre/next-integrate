export function integrate({
  name,
  provider,
  redirect,
  base_path,
}: {
  name: string;
  provider: string;
  redirect: string;
  base_path?: string;
}) {
  if (!name || !provider || !redirect) {
    throw new Error("Name, redirect and provider are required");
  }

  let redirectUrl = redirect
    .replaceAll("#", "__HASH__")
    .replaceAll("&", "__AND__");

  let url = `/api/auth/integration/${provider}?name=${name}&redirect=${redirectUrl}`;

  if (base_path) {
    url = `${base_path}/api/auth/integration/${provider}?name=${name}&redirect=${redirectUrl}`;
  }

  return url;
}
