import { Info, ProviderContext } from "../types";
import { decodeRef, encodeRef, getCover, getId, getTitle, request, unwrapObject } from "./api";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const ref = decodeRef<{ id: string }>(link);
  if (!ref.id) throw new Error("Melolo drama ID is missing.");
  const drama = unwrapObject(await request(providerContext, "detail/" + encodeURIComponent(ref.id), { lang: "id" }));
  const count = Number(drama.episodeCount ?? drama.chapterCount ?? drama.totalEpisodes ?? drama.totalEpisode ?? 0);
  return {
    title: getTitle(drama) || "Melolo title",
    image: getCover(drama),
    synopsis: String(drama.introduction ?? drama.description ?? drama.synopsis ?? drama.story ?? ""),
    imdbId: "",
    type: "series",
    tags: Array.isArray(drama.genres) ? drama.genres.map(String) : Array.isArray(drama.tags) ? drama.tags.map(String) : [],
    webUrl: typeof drama.url === "string" ? drama.url : undefined,
    linkList: [{ title: count > 0 ? "Episodes (" + count + ")" : "Episodes", episodesLink: encodeRef({ id: ref.id, count }) }],
  };
};
