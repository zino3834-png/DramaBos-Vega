import { ProviderContext } from "../types";

const API_BASE = "https://apishort.com/v1/melolo/api";

export function encodeRef(value: Record<string, unknown>): string {
  return encodeURIComponent(JSON.stringify(value));
}
export function decodeRef<T>(value: string): T {
  try { return JSON.parse(decodeURIComponent(value)) as T; }
  catch { throw new Error("Invalid Melolo reference. Reopen the title and try again."); }
}
export async function request(providerContext: ProviderContext, endpoint: string, params: Record<string, string | number> = {}, signal?: AbortSignal): Promise<any> {
  const apiKey = await providerContext.kvStore.get<string>("apiKey");
  if (!apiKey || !apiKey.trim()) throw new Error("Set your APIShort key in Melolo provider settings first.");
  const response = await providerContext.axios.get(API_BASE + "/" + endpoint, {
    params, headers: { ...providerContext.commonHeaders, "X-API-Key": apiKey.trim() }, signal,
  });
  const body = response.data;
  if (body && typeof body === "object" && (body.success === false || body.status === false || body.error))
    throw new Error(String(body.message || body.error || "APIShort request failed"));
  return body;
}
export function unwrapObject(value: any): any {
  let current = value;
  for (let i = 0; i < 5 && current && !Array.isArray(current); i++) {
    if (current.id || current.bookId || current.dramaId || current.title || current.bookName) return current;
    const next = current.data ?? current.result ?? current.drama ?? current.detail;
    if (!next || next === current) break;
    current = Array.isArray(next) ? next[0] : next;
  }
  return current || {};
}
export function findArray(value: any, depth = 0): any[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object" || depth > 5) return [];
  for (const key of ["results", "list", "books", "bookList", "dramas", "items", "records", "data"]) {
    const found = findArray(value[key], depth + 1);
    if (found.length) return found;
  }
  return [];
}
export function getId(item: any): string {
  const value = item?.id ?? item?.bookId ?? item?.dramaId ?? item?.seriesId ?? item?.shortPlayId;
  return value === undefined || value === null ? "" : String(value);
}
export function getTitle(item: any): string {
  return String(item?.title ?? item?.bookName ?? item?.name ?? item?.dramaName ?? "");
}
export function getCover(item: any): string {
  return String(item?.cover ?? item?.coverUrl ?? item?.coverWap ?? item?.poster ?? item?.image ?? item?.thumbnail ?? "");
}
