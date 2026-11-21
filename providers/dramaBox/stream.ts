import { ProviderContext, Stream } from "../types";
import { decodeRef } from "./api";
export const getStream = async function ({ link }: { link: string; type: string; signal?: AbortSignal; providerContext: ProviderContext; isDownload?: boolean }): Promise<Stream[]> {
  const ref = decodeRef<{ urls: Record<string, string>; locked?: boolean }>(link);
  if (ref.locked) return [];
  const streams: Stream[] = []; const seen = new Set<string>();
  for (const quality of ["1080", "720", "540", "auto"]) {
    const url = ref.urls?.[quality];
    if (!url || !/^https?:\/\//i.test(url) || seen.has(url)) continue;
    seen.add(url);
    streams.push({ server: quality === "auto" ? "DramaBox" : "DramaBox " + quality + "p", link: url,
      type: /\.m3u8(?:$|\?)/i.test(url) ? "m3u8" : "mp4", quality: quality === "auto" ? undefined : quality });
  }
  return streams;
};
