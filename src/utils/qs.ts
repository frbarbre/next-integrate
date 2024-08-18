export function qs(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (Array.isArray(value)) {
      value.forEach((val) => params.append(key, val));
    } else {
      params.append(key, value);
    }
  });
  return params.toString();
}
