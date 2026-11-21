import { Post, ProviderContext } from "../types";
import { encodeRef, findArray, request } from "./api";
function toPosts(payload: any): Post[] {
  return findArray(payload).filter((item: any) => item && (item.bookId || item.id) && (item.bookName || item.title))
    .map((item: any) => ({
      title: String(item.bookName ?? item.title), link: encodeRef({ bookId: String(item.bookId ?? item.id) }),
      image: String(item.coverWap ?? item.cover ?? item.image ?? item.poster ?? ""), provider: "dramaBox",
      cornerTag: item.chapterCount ? String(item.chapterCount) + " EP" : undefined,
    }));
}
export const getPosts = async function ({ filter, page, signal, providerContext }: {
  filter: string; page: number; providerValue: string; signal: AbortSignal; providerContext: ProviderContext;
}): Promise<Post[]> {
  const endpoint = ["latest", "trending", "foryou", "browse"].includes(filter) ? filter : "latest";
  return toPosts(await request(providerContext, endpoint, { lang: "en", page: Math.max(1, page || 1) }, signal));
};
export const getSearchPosts = async function ({ searchQuery, signal, providerContext }: {
  searchQuery: string; page: number; providerValue: string; signal: AbortSignal; providerContext: ProviderContext;
}): Promise<Post[]> {
  if (!searchQuery.trim()) return [];
  return toPosts(await request(providerContext, "search", { query: searchQuery.trim(), lang: "en" }, signal));
};
