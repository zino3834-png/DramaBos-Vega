import { Info, ProviderContext } from "../types";
import { decodeRef, encodeRef, request, unwrapObject } from "./api";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const ref = decodeRef<{ bookId: string }>(link);
  if (!ref.bookId) throw new Error("DramaBox book ID is missing.");
  const drama = unwrapObject(await request(providerContext, "detail", { bookId: ref.bookId, lang: "en" }));
  return {
    title: String(drama.bookName ?? drama.title ?? "DramaBox title"),
    image: String(drama.coverWap ?? drama.cover ?? drama.image ?? ""),
    synopsis: String(drama.introduction ?? drama.description ?? drama.synopsis ?? ""),
    imdbId: "", type: "series",
    tags: Array.isArray(drama.tags) ? drama.tags.map(String) : [],
    webUrl: typeof drama.url === "string" ? drama.url : undefined,
    linkList: [{ title: "Episodes", episodesLink: encodeRef({ bookId: ref.bookId }) }],
  };
};
