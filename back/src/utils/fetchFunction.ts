import fetch from "node-fetch";
export async function apiRequest<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return await (response.json() as Promise<T>);
}