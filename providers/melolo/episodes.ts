import { EpisodeLink, ProviderContext } from "../types";
import { decodeRef, encodeRef, request, unwrapObject } from "./api";

export const getEpisodes = async function ({ url, providerContext }: { url: string; providerContext: ProviderContext }): Promise<EpisodeLink[]> {
  const ref = decodeRef<{ id: string; count?: number }>(url);
  if (!ref.id) throw new Error("Melolo drama ID is missing.");
  const detail = unwrapObject(await request(providerContext, "detail/" + encodeURIComponent(ref.id), { lang: "id" }));
  const embedded = detail.episodes ?? detail.episodeList ?? detail.chapterList ?? detail.videoList;
  if (Array.isArray(embedded) && embedded.length) {
    return embedded.map((ep: any, index: number) => ({
      title: String(ep.title ?? ep.name ?? ep.episodeName ?? ep.chapterName ?? ("Episode " + (index + 1))),
      link: encodeRef({ id: ref.id, ep: Number(ep.episode ?? ep.episodeNumber ?? ep.chapterIndex ?? index + 1) }),
      description: ep.isLocked === true || ep.isCharge === 1 ? "Locked episode" : undefined,
    }));
  }
  const count = Math.floor(Number(ref.count ?? detail.episodeCount ?? detail.chapterCount ?? detail.totalEpisodes ?? detail.totalEpisode ?? 0));
  if (!Number.isFinite(count) || count < 1) throw new Error("Melolo did not provide an episode count in its detail response.");
  if (count > 500) throw new Error("Melolo returned an invalid episode count.");
  return Array.from({ length: count }, (_, index) => ({
    title: "Episode " + (index + 1),
    link: encodeRef({ id: ref.id, ep: index + 1 }),
  }));
};
