import { Post, ProviderContext } from "../types";
import { encodeRef, findArray, getCover, getId, getTitle, request } from "./api";

function toPosts(payload: any): Post[] {
  return findArray(payload)
    .filter((item: any) => item && getId(item) && getTitle(item))
    .map((item: any) => ({
      title: getTitle(item),
      link: encodeRef({ id: getId(item) }),
      image: getCover(item),
      provider: "melolo",
      cornerTag: item.episodeCount || item.chapterCount ? String(item.episodeCount ?? item.chapterCount) + " EP" : undefined,
    }));
}
export const getPosts = async function ({ page, signal, providerContext }: {
  filter: string; page: number; providerValue: string; signal: AbortSignal; providerContext: ProviderContext;
}): Promise<Post[]> {
  const offset = Math.max(0, (Math.max(1, page || 1) - 1) * 20);
  return toPosts(await request(providerContext, "home", { lang: "id", offset }, signal));
};
export const getSearchPosts = async function ({ searchQuery, signal, providerContext }: {
  searchQuery: string; page: number; providerValue: string; signal: AbortSignal; providerContext: ProviderContext;
}): Promise<Post[]> {
  if (!searchQuery.trim()) return [];
  return toPosts(await request(providerContext, "search", { lang: "id", q: searchQuery.trim() }, signal));
};
