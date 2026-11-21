import { EpisodeLink, ProviderContext } from "../types";
import { decodeRef, encodeRef, findArray, request } from "./api";
export const getEpisodes = async function ({ url, providerContext }: { url: string; providerContext: ProviderContext }): Promise<EpisodeLink[]> {
  const ref = decodeRef<{ bookId: string }>(url);
  if (!ref.bookId) throw new Error("DramaBox book ID is missing.");
  const payload = await request(providerContext, "allepisode", { bookId: ref.bookId });
  return findArray(payload).filter((ep: any) => ep && (ep.chapterId || ep.chapterIndex !== undefined)).map((ep: any, index: number) => {
    const urls = { "1080": String(ep.videoUrl1080 ?? ""), "720": String(ep.videoUrl720 ?? ""), "540": String(ep.videoUrl540 ?? ""), auto: String(ep.videoUrl ?? "") };
    const locked = ep.isLocked === true || Number(ep.isCharge) === 1;
    return {
      title: String(ep.chapterName ?? ("Episode " + (Number(ep.chapterIndex ?? index) + 1))),
      link: encodeRef({ urls, locked, chapterId: String(ep.chapterId ?? "") }),
      description: locked ? "Locked episode" : undefined,
    };
  });
};
